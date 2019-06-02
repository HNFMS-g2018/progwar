## What is 'Progwar'?

Progwar is a game that play by code, not by hand.

What you need to do is write a code for this game.

The goal is destroy other players in the map and get control of the map.

So that simple.

But with code, there will be lot of interesting happen.

## Introduction

Progwar is a game that run in service 7-24 hours.

We will run your code to get the command to control the units that owned by you and show the result in the webpage in the same time.

You can change your code after observing your units movement to improve its intelligence

It is a war not only between code but also between algorithm.

It is programers' war -- the 'Progwar'.

## How to write code?

You have authority to read all the file in the folder `data`.

The structure of the folder 'data':

- `_player.json`
- `_map.json`
- `xxxx.json`

The `_map.json` is the map file. It just include the type of the map.

The `xxxx.json` is the player data file, you can read it to know the information about the units. You can not only read yourself's but also others'. It is lawful. You can do it to know where others units is and judge what you should do.

> You can also read others code if you can read it. (Some players may encrypt their code)

What you should do is print your commands to `command/xxxx.command`, `xxxx` is your name.

Be careful, you have just 1000 ms to calculate. If you running out of time, we will send a SIGNAL to kill your program. So remember finished in 1000 ms or do not print all the command in the end by one time.

## Data format

All the data format is basic on JSON.

### Map 

```
{"map": [[...],[...],[...], ... ]}
```

A 2D array.

### Player

```
{
  "id": 0,
  "name": "samcompu",
  "color": "ffcc66",
  "units": [
		...
  ]
}
```

There will be lots of units in `units`.

### Unit

```
{
	"index": 0,
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
}
```

## Direction

- l: left
- r: right
- u: up
- d: down
- c: current

## Unit

A unit have `index`, `position`, `states` and `ability`.

### index

The index of the unit in its owner's units array.

### position

The position the unit in the map.

`x` and `y` is the coordinate and `index` is the index of the unit in the block `(x, y)`'s units array.

### states

- `owner`: The id of its owner.
- `hp`: The current hp. `hp = ability.defense * 10`
- `energy`: The current energy carried in. `energy = ability.energy * 10`
- `occupy`: Whether the unit occupy the block or not. 

### ability

#### Active ability (movement)

Active ability will be executed in the following order.

- attack: attack the unit. The value of it means how much harm the unit can cause in one time.
- magic: attack the unit by magic. The value of it means the range.
- healing: increase the hp, you can only healing your own unit. The value of it means how much can it healing in one time.
- dig: get energy, enlarge the water/swamp or break the stone. The value of it means the speed of digging.
- build: create new unit or upgrade unit. The value of it means the upper limit of the level it can create.
- move: change position. The value of it means the speed of unit.

**attack**

If `unitA` attack `unitB`, then:

`unitB.hp -= unitA.attack - unitB.defense`

If a unit is in `(x1, y1)` and its index is `3`, then it can just attack `(x2, y2)`'s unit whose index is also `3`.

> You can understand as they are in different floors.

It able to kill your own unit.

**move**

This three kind of situations is allow to move:
- There is not water(if the unit can't swim), stone or dark.
- None of the unit there or the units there will move away this turn.
- The unit there has the same owner.

#### Passive ability

- carry: the upper limit of the energy that can carry.
- defense: the upper limit of the hp.
- swim: the move speed in the water. (`swim = 0` means unable to enter in the water)

## Map

The `id`, `type` and the `border-color`.

- 0: empty -> none
- 1: stone -> gray
- 2: water -> blue
- 3: swamp -> green
- 4: dark -> black
- 5: energy -> yellow

## Command

One unit can only be operated once in one time.

The surplus operate will be ignore.

Format:

```
unit_index movement argument
```

`unit_index` is the index of the unit you want to operate.

`movement` is one of the active ability's name.

`argument` is the argument of the ability.

### argument

Most ability only support the direction.

Build support a pair like `direction-ability`, `direction` means the direction of the aim and `ability` is the name of the ability you want to improve.

Build also support a single direction.

Magic support a coordinate like `x-y`, means the position aim.

Healing support a index, means the index of the aim.

### Example

- 0 move l
- 1 build r
- 2 dig c
- 3 attack d
- 4 magic 1-1
- 5 healing 3
- 6 build l-defense

That means:

- units[0] move to the left
- units[1] train a new unit in its right
- units[2] dig the block which it current in. (If units[2] is in the energy, then its `states.energy` increasing)
- units[3] attack the unit that under it. (If there is nothing, then it is useless)
- units[4] use magic to attack the block `(1, 1)`. (If it is out of range, then it is useless)
- units[5] healing units[3]
- units[6] upgrade the ability `defense` of the unit in its left.
