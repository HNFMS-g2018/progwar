const PLAYERS = require('../modules/players.js');

function get_units() {
  var res = [];
  var players = PLAYERS.get_players_json();
  for (var i = 0; i < players.length; ++i) {
    var player = players[i];
    for (var j = 0; j < player.units.length; ++j) res[res.length] = player.units[j];
  }
  return res;
}


module.exports = {
  "get_units": get_units
};
