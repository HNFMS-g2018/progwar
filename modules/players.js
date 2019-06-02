// 实时获取用户信息，方便注册后自动更新用户
const FS = require("fs");

var playersDataPath = 'data/_player.json';

function get_data() {
  console.log(new Date() + ": <players.js> [Infor] get data");
	console.log(playersDataPath);
	var data = FS.readFileSync(playersDataPath).toString();
	data = JSON.parse(data);
  return data;
}

function get_colors() {
  console.log(new Date() + ": <players.js> [Infor] get colors");
  var playersData = get_data();
  var colors = [];
  for (var i = 0; i < playersData.players.length; ++i) colors[i] = playersData.players[i].color;
  return colors;
}

function get_names() {
  console.log(new Date() + ": <players.js> [Infor] get names");
  var playersData = get_data();
  var names = [];
  for (var i = 0; i < playersData.players.length; ++i) names[i] = playersData.players[i].name;
  return names;
}

function get_players_json() {
  console.log(new Date() + ": <players.js> [Infor] get players json");
  var playersData = get_data();
  var players = [];
  for (var i = 0; i < playersData.players.length; ++i) {
    var path = 'data/' + playersData.players[i].name + '.json';
    players[i] = JSON.parse(FS.readFileSync(path).toString());
  }
  return players;
}

function get_json(name) {
  // 通过 name 获取玩家的 JSON 文件
  console.log(new Date() + ": <players.js> [Infor] get \033[00;31m" + name + "\033[0m's json" );
	var path = 'data/' + name + '.json';
  var res = JSON.parse(FS.readFileSync(path).toString());
	return res;
}

function update_data(data) {
  // 注册用，更新用户列表
  console.log(new Date() + ": <players.js> [Infor] update the players data file.");
	data = JSON.stringify(data, undefined, 2)
  FS.writeFileSync(playersDataPath, data);
}

function update_json_file(name, data) {
  // 通过 name 来更新 json 文件
  console.log(new Date() + ": <players.js> [Infor] update \033[00;31m" + name + "\033[0m's json file");
	path = 'data/' + name + '.json';
	data = JSON.stringify(data, undefined, 2)
	FS.writeFileSync(path, data);
}

module.exports = {
  "get_data": get_data,
  "get_colors": get_colors,
  "get_names": get_names,
  "get_players_json": get_players_json,
	"get_json": get_json,
  "update_data": update_data,
	"update_json_file": update_json_file
};
