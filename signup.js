const FS = require("fs");
const PLAYER = require("./modules/players.js");
const MAP = require("./modules/map.js");

var data = PLAYER.get_data();

function rand(x) {
	return Math.round(Math.random() * x);
}

function check_infor(name) {
  var names = PLAYER.get_names();
  for (var i = 0; i < names.length; ++i) {
		if (names[i] == name) return false;
  }
  return true;
}

function signup_account(name, color) {
	var id = data.players.length;
	data.players[data.players.length] = {
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
	};
	do {
    unit.position.x = rand(map.height), unit.position.y = rand(map.width);
	} while (!MAP.check_block_pass(unit, map));

	var player = {
		"id": id,
		"name": name,
		"color": color, 
		"units": [ unit ]
	};

	FS.writeFileSync('data/' + name + '.json', JSON.stringify(player, undefined, 2));
}

function main() {
  var argv = process.argv.splice(2);
  var name = argv[0];
  var color = argv[1];
	if (name[0] == '_') {
    console.log("Wrongful name, please do not start your name with '_'");
		return 0;
	}
	if (color.length != 6) {
    console.log("Wrongful length of color");
		return 0;
	}
  if (!check_infor(name)) {
    console.log("Already have this name");
    return 0;
  }
  var id = signup_account(name, color);
  create_player(id, name, color);
  PLAYER.update_data(data);
}

main();

