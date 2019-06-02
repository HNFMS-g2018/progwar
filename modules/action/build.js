const MAP = require('../../modules/map.js');
const OBJECT = require('lodash/fp/object');
const FUNCTION = require('../../modules/function.js');
const UNIT = require('../../modules/unit.js');

function execute(map, commands) {
  var newMap = MAP.get_new_map();
	for (var i = 0; i < commands.length; ++i) {
		var command = commands[i];
		var posA = command.position, posB = FUNCTION.move_by_direction(posA, command.arg);
    var unitsA = map[posA.x][posA.y].units, unitsB = map[posB.x][posB.y].units;
    var unitA = unitsA[pos.index];

    // 当前 unit 肯定是会原封不动地移动复制到新地图上
    unitsA[posA.index] = undefined;
    newMap[posA.x][posA.y].unitsA[posA.index] = unitA;

    if (!unitA.states.energy) {
      console.log(new Date() + ": <build.js> [Infor] Unit don't have enought energy");
      continue;
    }
    unitA.states.energy--;
    if (command.arg.match(/-/)) {
      var unitB = unitsB[posB.index];
      if (unitB.states.owner != unitA.states.owner) continue;
      var need = command.arg.match(/-(.*)/)[1];
      unitB.ability[need]++;
      console.log(new Date() + ": <build.js> [Success] Unit upgrade the ability " + need + " to to " + unitB.ability[need]);
    } else {
      var ok = true;
      for (var j = 0; j < unitsB.length; ++j) {
        var unitB = unitsB[j];
        if (unitB.states.owner != unitA.states.owner) ok = false;
      }
      if (!ok) continue;
      unitsB[unitsB.length] = UNIT.new(posB, unitA.states.owner);
      console.log(new Date() + ": <build.js> [Success] Unit create a new unit");
    }
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
