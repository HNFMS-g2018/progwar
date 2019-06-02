const MAP = require('../../modules/map.js');
const PLAYERS = require('../../modules/players.js');

var actions = ['move'];
// var actions = ['dig', 'build', 'move'];
// var actions = ['attack', 'magic', 'healing', 'dig', 'build', 'move'];

function select_commands(commands, type) {
  var res = [];
  for (var i = 0; i < commands.length; ++i) {
    if (commands[i].type == type) res[res.length] = commands[i];
  }
  return res;
}

function execute(commands) {
	// 所有 movement 都还是不完善的，都还需要进一步优化细节
	console.log(new Date() + ": <action> [Infor] execute action");
	var map = MAP.get_map();
	for (var i = 0; i < actions.length; ++i) {
    var selectedCommands = select_commands(commands, actions[i]);
		map = require('./' + actions[i] + '.js').execute(map, selectedCommands);

    console.log(new Date() + ": <action> [Success] Finish the movement \033[00;35m" + actions[i] + "\033[0m");
    console.log(new Date() + ": <action> [Infor] The unit in the map:");
    MAP.print_units(map);
	}
	MAP.update_map_to_players(map);
}

module.exports = {
	"execute": execute
};
