// 实时获取用户信息，方便注册后自动更新用户
const FS = require("fs");

var playersPath = 'data/_player.txt';

function get_players() {
  // console.log(new Date() + ": <players.js> [Infor] get players");
	if (!FS.existsSync(playersPath)) FS.writeFileSync(playersPath, '');
	var data = FS.readFileSync(playersPath).toString().split('\n');
	var res = [];
	for (var i = 0; i < data.length - 2; ++i) {
		var arg = data[i + 1].split(' ');
		res[i] = {
			"id": i,
			"name": arg[0],
			"color": arg[1]
		}
	}
  return res;
}

function update_players(players) {
  // 更新玩家列表
  // console.log(new Date() + ": <players.js> [Infor] update the players data file.");
	var res = "";
	res += players.length + '\n';
	for (var i = 0; i < players.length; ++i) {
		var player = players[i];
		res += player.name + ' ' + player.color + '\n';
	}
  FS.writeFileSync(playersPath, res);
}

function delete_players(player) {
	console.log(new Date() + ": <players.js> [Infor] Delete player '" + player.name + "'");
	FS.unlinkSync('data/' + player.name + '.txt');
	player.name = "_dead";
}

function get_all_names() {
	var players = get_players();
	var res = [];
	for (var i = 0; i < players.length; ++i) res[i] = players[i].name;
	return res;
}

module.exports = {
	"get_players": get_players,
	"update_players": update_players,
	"get_all_names": get_all_names,
	"delete_players": delete_players
};
