const FS = require('fs');
const PLAYER = require('../modules/players.js');
const MAP = require('../modules/map.js');
const UNITS = require('../modules/units.js');

var players = PLAYER.get_players();

function rand(x) {
	return Math.round(Math.random() * x);
}

function check_infor(name) {
  var names = PLAYER.get_all_names();
  for (var i = 0; i < names.length; ++i) {
		if (names[i] == name) return false;
  }
  return true;
}

function signup_account(name, color) {
	var id = players.length;
	players[players.length] = {
		"id" : id,
		"name": name, 
		"color": color
	};
  return id;
}

function create_player(id, name, color) {

  var map = MAP.get_map();

	var unit = {
		"index": 0,
		"position": {
			"x": 0,
			"y": 0,
			"index": 0
		},
		"states": {
			"owner": id,
			"hp": 10,
			"energy": 10,
			"occupy": 1
		},
		"ability": {
			"dig": 1,
			"build": 3,
			"move": 1,
			"attack": 1,
			"magic": 1,
			"healing": 1,
			"carry": 1,
			"defense": 1,
			"swim": 1
		}
	};
	do {
    unit.position.x = rand(map.height), unit.position.y = rand(map.width);
	} while (!MAP.check_block_pass(unit, map));

	UNITS.update_units(name, [ unit ]);
}

function signup_players(name, color) {
	if (name[0] == '_') return "Wrongful name, please do not start your name with '_'";
	if (name.length > 20) return "Wrongful name, it is too long.";
	if (color.length != 6) return "Wrongful length of color";
  if (!check_infor(name)) return "Already have this name";
  var id = signup_account(name, color);
  create_player(id, name, color);
  PLAYER.update_players(players);
	return "";
}

module.exports = {
	"signup_players": signup_players
};
