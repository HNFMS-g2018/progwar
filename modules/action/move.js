const OBJECT = require('lodash/fp/object');
const MAP = require('../../modules/map.js');
const FUNCTION = require('../../modules/function.js');

function combat_mode(unitA, units) {
  for (var j = units.length - 1; j >= 0; --j) {
    var unitB = units[j];
    if (unitB.states.owner != unitA.states.owner) {
      var unitC = combat(unitA, unitB);
      // 如果 unitC == 0 说明两者同归于尽
      if (unitC == 0) {
        units[j] = undefined;
        units.length--;
        unitA.hp = -1;
        break;
      }
      if (unitC.states.owner == unitA.states.owner) {
        unitA = unitC;
        // 如果新图该位置上的 unit 无法保留，就将其删去
        units[j] = undefined;
        units.length--;
      } else {
        unitA.states.hp = -1;
        unitB = unitC;
        break;
      }
    }
  }
  if (unitA.states.hp >= 0) units[units.length] = unitA;
}

function combat(unitA, unitB) {
  console.log(new Date() + ": <move.js> [Infor] Enter in combat");
  var valueA = unitA.states.hp * (unitA.ability.attack - unitB.ability.defense);
  var valueB = unitB.states.hp * (unitB.ability.attack - unitA.ability.defense);
  if (valueA == valueB) {
    console.log(new Date() + ": <move.js> [Infor] Combat result: Nobody win");
    return 0;
  }
  if (valueA >= valueB) {
    unitA.states.hp -= Math.floor(unitB.states.hp / (unitA.ability.attack - unitB.ability.defense)) * (unitB.ability.attack - unitA.ability.defense);
    console.log(new Date() + ": <move.js> [Infor] Combat result: unitA win");
    return unitA;
  }
  else {
    unitB.states.hp -= Math.floor(unitA.states.hp / (unitB.ability.attack - unitA.ability.defense)) * (unitA.ability.attack - unitB.ability.defense);
    console.log(new Date() + ": <move.js> [Infor] Combat result: unitB win");
    return unitB;
  }
}

function execute(map, commands) {
  var newMap = MAP.get_new_map();
	for (var i = 0; i < commands.length; ++i) {
		var command = commands[i];
		var posA = command.position, posB = FUNCTION.move_by_direction(posA, command.arg);
    var unitsA = map[posA.x][posA.y].units;
		var unitA = unitsA[posA.index], unitB = OBJECT.merge(unitA, { "position": posB });
    if (!unitA) continue;

    // 如果 unit 存在，那么不管结果如何，都应该在原图上清除
    unitsA[posA.index] = undefined;

    // 如果不合法，不能跳过，也要把原地图上的 unit 移到新地图的原位置，以防止重复操作
    if (unitA.ability.move < command.arg.length || !MAP.check_block_passable(unitB, map)) combat_mode(unitA, newMap[posA.x][posA.y].units);
    else combat_mode(unitB, newMap[posB.x][posB.y].units)
	}

  // 原图上所有没有到新图上来的 unit 都移动到原位置
  for (var i = 0; i < map.height; ++i) {
    for (var j = 0; j < map.width; ++j) {
      var units = map[i][j].units;
      for (var k = 0; k < units.length; ++k) {
        if (!units[k]) continue;
        combat_mode(units[k], newMap[i][j].units);
      }
    }
  }

	return newMap;
}

module.exports = {
	"execute": execute
};
