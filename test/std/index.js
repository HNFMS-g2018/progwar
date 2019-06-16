var roleHarvester = require('role.harvester');

module.exports.loop = function () {
    if (Game.spawns['Spawn1'].energy >= 200) {
        Game.spawns['Spawn1'].spawnCreep( [WORK, CARRY, MOVE], 'Harvester' + Game.creeps.length + 1);
    }
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        roleHarvester.run(creep);
    }
}
