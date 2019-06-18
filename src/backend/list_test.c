#include <assert.h>
#include "list.h"

#define NODE_NUM (15)

int main(void)
{
	struct list_node head;
	int cnt = 0;
	int i;
	struct list_node *j;

	list_init(&head);

	/*
	 * 试着向列表里丢 NODE_NUM 个节点。
	 */
	for (i = 0; i < NODE_NUM; ++i) {
		struct list_node *n = list_node_new();
		list_insert(&head, n, head.next);
	}

	/*
	 * 数数。
	 */
	list_foreach(j, &head, struct list_node)
		++cnt;

	/*
	 * 十分自信地认为自己数的是对的。
	 */
	assert(cnt == NODE_NUM);

	/*
	 * 清空列表。
	 */
	for (i = 0; i < NODE_NUM; ++i)
		list_node_delete(list_delete(head.next));

	i = list_empty(&head);

	/*
	 * 列表肯定是空的！
	 */
	assert(i);

	return 0;
}
