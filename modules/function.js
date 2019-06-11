const OBJECT = require('lodash/fp/object');
const MAP = require('../modules/map.js');

function move_by_direction(posA, arg, map) {
	var posB = OBJECT.merge(posA, '');
	if (!arg) return posB;
	for (var i = 0; i < arg.length; ++i) {
		var posC = OBJECT.merge(posB, '');
		if (arg[i] == 'l') posB.y--;
		else if (arg[i] == 'u') posB.x--;
		else if (arg[i] == 'r') posB.y++;
		else if (arg[i] == 'd') posB.x++;
		else return posB;
		var unit = OBJECT.merge(map[posA.x][posA.y].units[posA.index], { "position" : posB });
		if (!MAP.check_block_pass(unit, map)) break;
	}
	return posB;
}

function rand(x) {
	return Math.round(Math.random() * x);
}

function rand_color() {
	var num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
	var color = "";
	for (var i = 1; i <= 6; ++i) color += num[rand(15)];
	return color;
}

module.exports = {
	"move_by_direction": move_by_direction,
	"rand_color": rand_color,
	"rand": rand
};
