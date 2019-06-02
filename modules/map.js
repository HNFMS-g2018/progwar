const FS = require("fs");
const PLAYERS = require("../modules/players.js");
const UNITS = require("../modules/units.js");

var mapDataPath = 'data/_map.json';

function get_new_map() {
  // 获取只有 type 的空地图
  var mapData = JSON.parse(FS.readFileSync(mapDataPath).toString());
  var res = [];
  res.height = mapData.size.height, res.width = mapData.size.width;
  for (var i = 0; i < res.height; ++i) {
    res[i] = [];
    for (var j = 0; j < res.width; ++j) {
      res[i][j] = {
        "type": mapData.type[i][j], 
        "units": [
        ]
      };
    }
  }
  return res;
}

// TODO 地形抽象化
function get_html_source() {
  var map = get_map();
	// Get map from source
  var bdColor = ['white', 'gray', 'blue', 'green', 'black', 'yellow'];
// Turn to html source
	var res = "<div id='map'><table cellspacing=4>";

  var colors = PLAYERS.get_colors();

	for (var i = 0; i < map.height; ++i) {
		res += "<tr>";
		for (var j = 0; j < map.width; ++j) {
      if (!map[i][j].units.length) 
        res += "<td class='" + bdColor[map[i][j].type] + "'></td>";
      else {
        var color = '#' + colors[map[i][j].units[0].states.owner];
        res += "<td class='" + bdColor[map[i][j].type] + "' style='background-color:" + color + "'></td>";
      }
		}
		res += "</tr>";
	}

	res += "</table></div>";
	return res;
}

function get_map() {
  // 实时读取地形图，方便实时修改地形
  console.log(new Date() + ": <map.js> [Infor] get map");
  var newMap = get_new_map();
  // 实时填充玩家，必须操作
  return fill_player(newMap);
}

function fill_player(map) {
  // 在地图上实时填充 unit
  var res = [];
  var units = UNITS.get_units();
  for (var i = 0; i < units.length; ++i) {
    var pos = units[i].position;
    map[pos.x][pos.y].units[pos.index] = units[i];
  }
  return map;
}

// TODO 地形抽象化
function check_block_stay(unit, map) {
  // 因为地型可能在生命周期中改变，map 不能实时获取
  // 检测地型能否停留
	if (unit.position.x < 0 || unit.position.x >= map.height ||
			unit.position.y < 0 || unit.position.y >= map.width) return false;
  var block = map[unit.position.x][unit.position.y];
  if (block.type == 1 || block.type == 4) return false;
	if (block.type == 2 && !unit.ability.swim) return false;

  return true;
}

// TODO 地形抽象化
function check_block_pass(unit, map) {
  // 因为地型可能在生命周期中改变，map 不能实时获取
  // 检测地型能否通过
	if (unit.position.x < 0 || unit.position.x >= map.height ||
			unit.position.y < 0 || unit.position.y >= map.width) return false;

  var block = map[unit.position.x][unit.position.y];
  if (block.type == 1 || block.type == 4) return false;
	if (block.type == 2 && !unit.ability.swim) return false;

  for (var i = 0; i < block.units.length; ++i) {
    var unitB = block.units[i];
		if (unitB.states.owner != unit.states.owner && unitB.states.occupy) return false;
  }
  return true;
}

function update_map_to_players(map) {
	var players = PLAYERS.get_players_json();
	for (var i = 0; i < players.length; ++i) players[i].units = [];
	for (var i = 0; i < map.height; ++i) {
		for (var j = 0; j < map.width; ++j) {
			var block = map[i][j];
			// console.log(block.units);
			for (var k = 0; k < block.units.length; ++k) {
				var unit = block.units[k];
				if (!unit) continue;
				players[unit.states.owner].units[unit.index] = unit;
			}
		}
	}
	for (var i = 0; i < players.length; ++i) {
		var player = players[i];
		for (var l = 0, r = 0; r < player.units.length; r++) {
			if (player.units[r].states.hp < 0) continue;
			player.units[l++] = player.units[r];
		}
		for (var j = l; j < player.length; ++j) player.units[j] = undefined;
		player.length = l;
	}
	var names = PLAYERS.get_names();
	for (var i = 0; i < players.length; ++i)
		PLAYERS.update_json_file(names[i], players[i]);
}

function print_units(map) {
  // 调试用，输出地图上的 unit
  for (var i = 0; i < map.height; ++i) {
    for (var j = 0; j < map.width; ++j) {
      for (var t = 0; t < map[i][j].units.length; ++t) {
        var unit = map[i][j].units[t];
        console.log(unit.position);
      }
    }
  }
}

module.exports = {
  "get_new_map": get_new_map,
  "get_map": get_map,
  "get_html_source": get_html_source,
  "check_block_pass": check_block_pass,
  "check_block_stay": check_block_stay,
	"update_map_to_players": update_map_to_players,
  "print_units": print_units
};
