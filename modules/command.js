const FS = require("fs");
const PLAYERS = require("../modules/players.js");
const ACTION = require("../modules/action");

function get() {
  // 获取所有的指令
  console.log(new Date() + ": <command.js> [Success] Get command");
  var names = PLAYERS.get_names();
  console.log(names);

  var commands = [];
  for (var i = 0; i < names.length; ++i)
		commands = [...commands, ...get_user_commands(names[i])];

  console.log(new Date() + ": <command.js> [Success] Get all the commands:");
  console.log(commands);
	return commands;
}

function translate_command(name, commands) {
	// 将指令从 'unit_index.movement.arg' 转换为 'pos.index.movement.arg'
  console.log(new Date() + ": <command.js> [Infor] Translate \033[00;31m" + name + "\033[0m's commands");
	var res = [];
	var units = PLAYERS.get_json(name).units;
  if (!units || !units[0]) {
    console.log(new Date() + ": <command.js> [\033[00;32mError\033[0m] " + name + " has no unit!");
    return [];
  }
	for (var i = 0; i < commands.length; ++i) {
		var command = commands[i];
		var unit = units[command.index];
		res[res.length] = {
			"position": unit.position,
			"type": command.type,
			"arg": command.arg
		}
	}
	return res;
}

function get_user_commands(name) {
  // 通过 name 获取玩家指令
  var commands = [];
  var path = 'command/' + name + '.command';

  if (!FS.existsSync(path)) {
    console.log(new Date() + ": <command.js> [Infor] Can't find \033[00;31m" + name + "\033[0m's commands");
    return commands;
  }
  console.log(new Date() + ": <command.js> [Infor] get \033[00;31m" + name + "\033[0m's commands");

  // 读取数据，去掉换行，按照分号分离指令
  var data = FS.readFileSync(path).toString().replace(/\n/g, '').split(';');
  for (var i = 0; i < data.length - 1; ++i) {
    // 去掉分号，按照空格分离参数
    var t = data[i].replace(/;/g, '').split(' ');
    commands[i] = {
      "index": t[0],
      "type": t[1],
      "arg": t[2],
    };
  }
  return translate_command(name, commands);
}

function clean() {
  // 清除所有指令
  var names = PLAYERS.get_names();
  for (var i = 0; i < names.length; ++i) {
		var path = 'command/' + names[i] + '.command';
		if (!FS.existsSync(path)) continue;
		FS.unlinkSync(path);
	}
}

module.exports = {
	"get": get,
	"clean": clean
};
