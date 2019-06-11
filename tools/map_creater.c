#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <math.h>

int init_all(int argc, char **argv)
{
	/*
	 * 设置随机数种子。
	 */
	FILE *fp = fopen("/dev/urandom", "r");
	if (!fp)
		fp = fopen("/dev/random", "r");
	if (!fp) {
		srand(time(NULL));
	} else {
		unsigned long int seed;
		fread(&seed, 1, sizeof(seed), fp);
		srand(seed);
		fclose(fp);
	}
	return 0;
}

long int rand32(void)
{
	/*
	 * 返回 int 范围的整数随机数。
	 */
	return (((rand() & 0xffff) << 16) | (rand() & 0xffff)) & 0x3fffffff;
}

long int rand_in_range(long int l, long int r)
{
	/*
	 * 返回 [l, r) 区间内的整数。
	 */
	return rand32() % (r - l) + l;
}

int occur_randomly(long int probability)
{
	/*
	 * 1 / probability 的概率返回 true
	 */
	return !rand_in_range(0, probability);
}

struct terrain_field;

/*
 * 地形结构体定义。
 */
struct terrain {
	/*
	 * 在终端打印时，颜色的转义序列。
	 */
	const char *color;

	/*
	 * 在终端打印时，代表图形。
	 */
	const char *graph;

	/*
	 * 地形 id 。
	 */
	int id;

	/*
	 * 地形生成规则。为一个函数指针。返回 bool 。
	 * field 为已经生成的地形，(line, column) 为当前坐标。
	 */
	int (*can_occupy)(struct terrain_field *field, long int line, long int column);
};

/*
 * 对地形的二维数组的封装。
 */
struct terrain_field {
	struct terrain **buffer;
	/*
	 * line, column 为 buffer 的大小。
	 */
	long int line;
	long int column;

	/*
	 * access 操作访问二维数组 [line][column] ，返回指向目标的指针。
	 */
	struct terrain** (*access)(long int line, long int column, struct terrain_field *pthis);

	/*
	 * 打印二维数组。
	 */
	int (*print)(struct terrain_field *pthis);
};

int print_terrain_field(struct terrain_field *pthis)
{
	/*
	 * terrain_field 的打印操作。
	 * 打印地形。
	 */
	long long i, j;
	printf("%d %d\n", pthis->line, pthis->column);
	for (i = 0; i < pthis->line; ++i) {
		for (j = 0; j < pthis->column; ++j) printf("%d", pthis->access(i, j, pthis)[0]->id);
		printf("\n");
	}
	return 0;
}

struct terrain** access_terrain_field(long int line, long int column, struct terrain_field *pthis)
{
	/*
	 * terrain_field 的访问操作。
	 */
	if (line < 0 || column < 0 || 
			line >= pthis->line || column >= pthis->column)
		return NULL;
	return pthis->buffer + (pthis->column * line) + column;
}

struct terrain_field* new_terrain_field(long int line, long int column) {
	/*
	 * 返回一个长为 line ，宽为 column 的未初始化地形。
	 */
	struct terrain_field *ret;
	ret = (struct terrain_field*)malloc(sizeof(struct terrain_field));
	if (!ret)
		return NULL;

	ret->buffer = NULL;
	ret->line = 0;
	ret->column = 0;
	ret->access = NULL;
	ret->print = NULL;

	ret->buffer = (struct terrain**)malloc(sizeof(struct terrain*) *line*column);
	if (!ret->buffer) {
		free(ret);
		return NULL;
	}

	ret->line = line;
	ret->column = column;
	ret->access = access_terrain_field;
	ret->print = print_terrain_field;

	return ret;
}

int delete_terrain_field(struct terrain_field *pthis)
{
	/*
	 * 删除地形并释放内存。
	 */
	free(pthis->buffer);
	pthis->print = NULL;
	pthis->access = NULL;
	pthis->buffer = NULL;
	pthis->line = 0;
	pthis->column = 0;
	free(pthis);
	return 0;
}

	long int count_terrain_around
(struct terrain_field *field, long int line, long int column, int id)
{
	/*
	 * 统计 (line, column) 周围编号为 id 的地形数量。
	 */
	int cnt = 0;
	int i, j;
	for (i = -1; i <= 0; ++i)
		for (j = -1; j <= 0; ++j)
			if (
					field->access(line + i, column + j, field) != NULL &&
					field->access(line + i, column + j, field)[0]->id == id
			   )
				++cnt;
	return cnt;
}

int empty_can_occupy(struct terrain_field *field, long int line, long int column)
{
	/*
	 * 空地形随时都可以。
	 */
	return 1;
}

int water_can_occupy(struct terrain_field *field, long int line, long int column)
{
	int cnt = 20 * count_terrain_around(field, line, column, 2) + 1;
	/*
	 * 如果周围有相同地形，生成该地形的概率增加。
	 */
	return occur_randomly(100 / cnt);
}

int swamp_can_occupy(struct terrain_field *field, long int line, long int column)
{
	int cnt = 10 * count_terrain_around(field, line, column, 3) + 1;

	/*
	 * 如果周围有相同地形，生成该地形的概率增加。
	 * 为了更好玩，将分子设为 7 ，以便生成大片沼泽。
	 */
	return occur_randomly(50 / cnt);
}

int obstacle_can_occupy(struct terrain_field *field, long int line, long int column)
{
	int cnt = 2 * count_terrain_around(field, line, column, 4) + 1;
	cnt = cnt * cnt;
	if (cnt > 50) return 0;
	/*
	 * 如果周围有相同地形，生成该地形的概率增加。
	 */
	return occur_randomly(50 / cnt);
}

int energy_can_occupy(struct terrain_field *field, long int line, long int column)
{
	int cnt = count_terrain_around(field, line, column, 5);
	/*
	 * 如果周围有能量，则该格不允许生成能量。
	 */
	if (cnt) return 0;

	/*
	 * 小概率生成能量。
	 */
	return occur_randomly(256);
}

/*
 * 地形表。
 */
struct terrain EMPTY_BASE    = { "\e[47m", "  ", 0, empty_can_occupy };
struct terrain *EMPTY = &EMPTY_BASE;
struct terrain WATER_BASE    = { "\e[44m", "~~", 2, water_can_occupy };
struct terrain *WATER = &WATER_BASE;
struct terrain SWAMP_BASE    = { "\e[42m", "SS", 3, swamp_can_occupy };
struct terrain *SWAMP = &SWAMP_BASE;
struct terrain OBSTACLE_BASE = { "\e[40m", "XX", 4, obstacle_can_occupy };
struct terrain *OBSTACLE = &OBSTACLE_BASE;
struct terrain ENERGY_BASE   = { "\e[43m", "EE", 5, energy_can_occupy };
struct terrain *ENERGY = &ENERGY_BASE;

int blank_field(struct terrain_field *field)
{
	long int i, j;
	for (i = 0; i < field->line; ++i)
		for (j = 0; j < field->column; ++j)
			field->access(i, j, field)[0] = EMPTY;
	return 0;

}

int tianyi_field(struct terrain_field *field)
{
	char *lty[] = {
		"####### #################",
		"#                       #",
		"# #     ####### #     # #",
		"  #        #     #   #   ",
		"# #        #      # #   #",
		"# #        #       #    #",
		"  #        #       #     ",
		"# #        #       #    #",
		"# ######   #       #    #",
		"#                       #",
		"########### #############",
		"                         "
	};
	long int i, j;
	long int li, lj;
	long int len = strlen(lty[0]);
	if (!field)
		return 1;

	if (
			field->line < sizeof(lty) / sizeof(lty[0]) ||
			field->column < len
	   )
		return 1;

	blank_field(field);
	for (i = 0; i < field->line; i += sizeof(lty) / sizeof(lty[0]))
		for (j = 0; j < field->column; j += len)
			for (li = 0; li < sizeof(lty) / sizeof(lty[0]); ++li)
				for (lj = 0; lj < len; ++lj)
					if (field->access(i + li, j + lj, field)) {
						if (lty[li][lj] == '#')
							field->access(i + li, j + lj, field)[0] = WATER;
						else
							field->access(i + li, j + lj, field)[0] = SWAMP;
					}
	return 0;
}

int random_field(struct terrain_field *field)
{
	long int i, j;

	blank_field(field);
	for (i = 0; i < field->line; ++i)
		for (j = 0; j < field->column; ++j) {
			if (ENERGY->can_occupy(field, i, j))
				field->access(i, j, field)[0] = ENERGY;
			else if (OBSTACLE->can_occupy(field, i, j))
				field->access(i, j, field)[0] = OBSTACLE;
			else if (WATER->can_occupy(field, i, j))
				field->access(i, j, field)[0] = WATER;
			else if (SWAMP->can_occupy(field, i, j))
				field->access(i, j, field)[0] = SWAMP;
		}
	return 0;
}

struct terrain_field* generate_map(long int line, long int column)
{
	struct terrain_field *field = new_terrain_field(line, column);
	if (!field)
		return NULL;

	random_field(field);
	/*
	 * 1 / 5 的机率生成一个洛天依地图。
	 */
	if (occur_randomly(5))
		tianyi_field(field);

	return field;
}

int main(int argc, char *argv[])
{
	long int line;
	long int column;
	struct terrain_field *map;

	init_all(argc, argv);

	if (!argv[1] || !argv[2]) {
		fprintf(stderr, "Usage: %s <line> <column>\n", argv[0]);
		return 1;
	}
	line = atoi(argv[1]);
	column = atoi(argv[2]);

	map = generate_map(line, column);
	if (!map) {
		fprintf(stderr, "Error");
		return 1;
	}
	map->print(map);
	delete_terrain_field(map);
	return 0;
}
