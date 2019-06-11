const FS = require('fs');
const PROCESS = require('child_process');
const PLAYERS = require('../modules/players.js');

function run() {
  // console.log(new Date() + ": <source.js> [Infor] run all the source");
	var names = PLAYERS.get_all_names();
	for (var i = 0; i < names.length; ++i) {
		var path = './source/' + names[i];
		if (!FS.existsSync(path)) continue;

		PROCESS.exec(path, { 'timeout': 1000 }, function() {});
	}
}

module.exports = {
	"run": run
}
