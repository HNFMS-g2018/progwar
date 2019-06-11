const MAP = require('../../modules/map.js');

function execute(map, commands) {
  var newMap = MAP.get_new_map();
	for (var i = 0; i < commands.length; ++i) {
		var command = commands[i];
		var posA = command.position;
		var unitsA = map[posA.x][posA.y].units;
		var unitA = unitsA[posA.index];

		unitA.states.energy += unitA.ability.dig;

		// console.log("Unit's dig ability " + unitA.ability.dig);
		// console.log("Unit's carry ability " + unitA.ability.carry);

		if (unitA.states.energy > unitA.ability.carry * 10)
			unitA.states.energy = unitA.ability.carry * 10;

		console.log(new Date() + ": <dig.js> [Infor] Unit is digging and its energy is \033[00;32m" + unitA.states.energy + "\033[0m");

    unitsA[posA.index] = undefined;
    newMap[posA.x][posA.y].units[posA.index] = unitA;
	}

  // 原图上所有没有到新图上来的 unit 都移动到原位置
  for (var i = 0; i < map.height; ++i) {
    for (var j = 0; j < map.width; ++j) {
      var units = map[i][j].units;
      for (var k = 0; k < units.length; ++k) {
        if (!units[k]) continue;
        newMap[i][j].units[k] = units[k];
      }
    }
  }
	return newMap;
}

module.exports = {
	"execute": execute
};
