const FS = require('fs');
const PLAYERS = require('../modules/players.js');

function get_level(unit) {
	var sum = 0;
	for (var i in unit.ability) sum += unit.ability[i];
	return sum;
}

function new_unit(pos, owner) {
	var unit = {
		"position": pos,
		"states": {
			"owner": owner,
			"hp": 0,
			"energy": 0,
			"occupy": 1
		},
		"ability": {
			"dig": 0,
			"build": 0,
			"move": 0,
			"attack": 0,
			"magic": 0,
			"healing": 0,
			"carry": 0,
			"defense": 0,
			"swim": 0
		}
	};
	return unit;
}

function get_all_units() {
  // console.log(new Date() + ": <units.js> [Infor] Get all units" );
	var res = [];
	var players = PLAYERS.get_players();
	for (var i = 0; i < players.length; ++i) {
		var player = players[i];
		res = [...res, ...get_units(player.name)];
	}
	return res;
}

function get_units(name) {
  // 通过 name 获取玩家的单位信息
  // console.log(new Date() + ": <units.js> [Infor] get \033[00;31m" + name + "\033[0m's units" );
	var path = 'data/' + name + '.txt';
	var data = FS.readFileSync(path).toString().split('\n');
	var res = [];
	for (var i = 0; i < data[0]; ++i) {
		var arg = data[i + 1].split(' ');
		for (var j = 0; j < arg.length; ++j) arg[j] = parseInt(arg[j]);
		res[i] = {
      "position": {
        "x": arg[0],
        "y": arg[1],
        "index": arg[2]
      },
      "states": {
        "owner": arg[3],
        "hp": arg[4],
        "energy": arg[5],
        "occupy": arg[6]
      },
      "ability": {
        "dig": arg[7],
        "build": arg[8],
        "move": arg[9],
        "attack": arg[10],
        "magic": arg[11],
        "healing": arg[12],
        "carry": arg[13],
        "defense": arg[14],
        "swim": arg[15]
      }
		}
	}
	return res;
}

function update_units(name, units) {
  // 通过 name 来更新 json 文件
  // console.log(new Date() + ": <units.js> [Infor] update \033[00;31m" + name + "\033[0m's units");
	path = 'data/' + name + '.txt';
	var res = units.length + '\n';
	for (var i = 0; i < units.length; ++i) {
		var unit = units[i];
		res += 
			unit.position.x + ' ' + 
			unit.position.y + ' ' +
			unit.position.index + ' ' +
			unit.states.owner + ' ' + 
			unit.states.hp + ' ' + 
			unit.states.energy + ' ' + 
			unit.states.occupy + ' ' +
			unit.ability.dig + ' ' +
			unit.ability.build + ' ' +
			unit.ability.move + ' ' + 
			unit.ability.attack + ' ' + 
			unit.ability.magic + ' ' +
			unit.ability.healing + ' ' +
			unit.ability.carry + ' ' +
			unit.ability.defense + ' ' +
			unit.ability.swim + '\n';
	}
	FS.writeFileSync(path, res);
}

module.exports = {
  "get_units": get_units,
	"update_units": update_units,
	"get_all_units": get_all_units,
	"new_unit": new_unit,
	"get_level": get_level
};
