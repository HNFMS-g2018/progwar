## 如何写代码？

你有读取文件夹 `data` 下所有文件的权限．

文件夹 `data` 的结构：

- `_player.json`: 包含了所有玩家的基本信息．
- `_map.json`: 包含了地图的基本信息和地形．
- `xxxx.json`: `xxxx` 是玩家的名字．包含了玩家所有的单位信息．

你可以读取这里任意的文件，这意味着你可以读取别人的 JSON 文件来知道他们的单位的情况，从而制定相应的策略．

你需要做的，是读取所有你需要用到的文件，然后将你的指令输出的 `command/xxxx.command`，`xxxx` 是你的名字．

你的程序只有 1000 毫秒的运行时间，如果超时了，我们将会向你的程序发送 SIGNAL KILL 来强行终止你的程序．所以记得控制好时间，最好不要等到最后再一次性输出结果．

## 数据格式

所有的数据格式都基于 JSON．

### `_map.json`

```
{
	"size": {
		"height": xxxx,
		"width": xxxx
	},
	"type": [[...],[...],[...], ... ]
}
```

`size` 记录了地图的高和宽，`type` 是一个二维数组，数组每一个元素是一个整数，记录了每个位置上的地形．

### `_player.json`

```
{
  "players": [
    {
      "id": xxxx,
      "name": "xxxx",
      "color": "xxxx"
    },
		...
  ]
}
```

`players` 是一个数组，数组每一个元素是一个对象，记录了玩家的信息．

### `xxxx.json`

```
{
	"units": [
		{
			"position": {
				"x": 20,
				"y": 4,
				"index": 0
			},
			"states": {
				"owner": 0,
				"hp": 10,
				"energy": 10,
				"occupy": true
			},
			"ability": {
				"dig": 0,
				"build": 1,
				"move": 1,
				"attack": 0,
				"magic": 0,
				"healing": 0,
				"carry": 1,
				"defense": 1,
				"swim": 0
			}
		},
		...
	]
}
```

`units` 是一个数组，数组每一个元素是一个对象，记录了单位的信息．

## 地形

### 0 空地

最普通的地形，可以通过和停留，可以使用任何能力，无任何特殊效果．

显示无边框颜色．

### 1 石块

无法通过和停留，可以被挖除，挖除后变为空地．

显示边框为灰色．

### 2 水

需要能力 `swim` 才能通过和停留，只能使用除了 `attack` 外的基础能力和能力 `magic`．

显示边框为蓝色．

### 3 沼泽

可以通过，停留在沼泽上将会降低能力 `move`，只能使用基础能力．

显示边框为绿色．

### 4 虚无

无法通过，停留将会直接死亡．

显示边框为黑色．

### 5 能源

可以通过和停留，可以使用任何能力．停留在能源上使用能力 `dig` 可以获取能量．

显示边框为黄色．

## 玩家

### `id` 

一个正整数，表示玩家的唯一标识符．

### `name` 

一个字符串，表示玩家的名字．只能包含 0-9,a-z,A-Z 和 `-=!@#$%^&*()_+[];',{}:<>?`．不能以下划线开头．

### `color` 

一个六位字符串，表示玩家的在网页上绘制出来的颜色的十六进制码．

## 单位

每个单位包含 `position` `states` `ability` 三个对象．

### `position`

表示单位在地图上的位置．

- `x` 表示单位在地图中位于第 `x` 行
- `y` 表示单位在地图中位于第 `y` 列．
- `index` 表示在位置上的相对顺序．

### `states`

表示单位的状态．

- `owner` 是单位的所有者的 `id`．
- `hp` 是单位当前的血量．
- `energy` 是单位当前携带的能量．
- `occupy` 表示单位是否 *占领* 所在格．

### `ability`

表示单位的能力．

其中能力 `attack`, `build` 具有 *顺序限制*

#### 基础能力

##### `attack`

类型：主动能力

效果：攻击临近的单位

参数：`direction`

数值大小表示攻击力的大小．

设数值大小为 `x`，一次攻击可以造成伤害 `y = 10 * x`．

##### `move`

类型：主动能力

效果：移动位置

参数：`direction`

数值大小表示一次可移动的距离．

设数值大小为 `x`，则一次最多可以移动的距离为 `x`．

##### `defense`

类型：被动能力

效果：低于攻击

数值大小表示防御力的大小．

设数值大小为 `x`，一次可抵御的伤害 `y = 10 * x`．

##### `carry`

类型：被动能力

效果：携带能量

设数值大小为 `x`，可携带的总能量 `y = 10 * x`．

##### `swim`

类型：被动能力

效果：在水中经过或者停留

数值大小表示在水中一次可移动的距离．

设数值大小为 `x`，则一次最多可以移动的距离为 `x`．

#### 特殊能力

##### `magic`

类型：主动能力

效果：远程攻击单位

参数：`x-y-index`

数值大小表示攻击的距离．

设数值大小为 `t`，则满足条件 `floor(sqrt(dist)) <= t` 的位置都可以被攻击到．其中 `dist` 表示欧拉距离．

设 `attack` 的数值大小为 `x`，一次攻击可以造成伤害 `y = 5 * x`．

##### `healing`

类型：主动能力

效果：治疗单位

参数：`x-y-index`

数值大小表示治疗量的大小．

设数值大小为 `x`，一次治疗可以恢复血量 `y = 5 * x`．

##### `dig`

类型：主动能力

效果：破坏石块或者获取能量

参数：`direction`

- 破坏石块：若数值不为 0，则可破坏石块．
- 获取能量：数值大小表示挖掘速度．设数值大小为 `x`，一次挖掘可以获取的能量 `y = x`．

##### `build`

类型：主动能力

效果：产生单位或者升级单位

参数：`direction` / `direction-ability`

- 产生单位: 若数值不为 0，则可产生单位．消耗 1 的能量．
- 升级单位: 数值大小表示可以升得的最大*等级*．设数值大小为 `x`，则被升级的单位升级后等级 `y <= x`．消耗 `y` 的能量．

## 指令

一个单位一回合只能被指令一次，多余的指令将会被忽略．

一个指令应该像这个样子：

```
unit_index ability argument
```

- `unit_index` 是单位在 `xxxx.json` 中的下标
- `ability` 是能力的名称
- `argument` 是能力需要的参数

### 样例

指令：

- 0 move ldd
- 1 build r
- 2 dig c
- 3 attack d
- 4 magic 1-1
- 5 healing 3
- 6 build l-defense

运行结果：

- units[0] 向左移动了一格，向下移动了两格
- units[1] 在其右边训练了一个新的单位出来
- units[2] 挖掘了当前位置，其位于能源地形上，则 `states.energy` 增加．
- units[3] 攻击了其下方的单位．
- units[4] 使用攻击了坐标为 `(1, 1)` 的单位．
- units[5] 治疗了 units[3]
- units[6] 升级了其左方的单位的能力 `defense`．

## 方向

- l: 左
- r: 右
- u: 上
- d: 下
- c: 当前

## 特别说明

### 等级

所有能力数值的总和．

### 占领

如果某单位开启了占领，则其他单位经过或者停留在同一位置，则会进入战争模式．

### 战争模式

使得某一个位置上只剩下一个玩家的单位．

对于两个单位，当 `unitA.hp * (unitA.attack - unitB.defense) > unitB.hp * (unitB.attack - unitA.defense)` 时（为了方便表述，没有使用标准的数据格式），`unitA` 最终会留下来，并且 `unitA.hp -= (unitB.attack - unitA.defense) * floor(unitB.hp / (unitA.attack - unitB.defense))`．

### 顺序限制

如果某个单位的坐标是 `(x1, y1)`, 且 `index = 3`, 那么该单位只能对坐标为 `(x2, y2)`，且 `index = 3` 的单位进行操作．

## FAQ

### 从空地移入水中，步数应该怎么算？

无法在移动的过程中进入水中，只能在移动的最后进入水中．

从从水中进入空地同理．

### 攻击伤害到底该怎么计算？

如果 `unitA` 攻击了 `unitB`，那么:

`unitB.hp -= 10 * unitA.attack - 10 * unitB.defense`

### 这里面有些什么特别的设计？

法师可以和奶妈硬抗

水军必须要上岸造，海战不能硬碰硬．

## 日志

2019 年 06 月 02 日：误删了大量代码