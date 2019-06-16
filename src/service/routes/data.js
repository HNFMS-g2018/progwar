const fs = require('fs');
const logger = require("../../../src/logger");

const mapPath = 'file/data/map/'
const playerPath = 'file/data/player.txt'
const unitPath = 'file/data/unit/'

module.exports = function(app) {
  app.get('/data', function(req, res) {

    res.set('Access-Control-Allow-Origin', '*');
    logger.debug("Data require");

    setTimeout(function() {
      var map = [];
      var mapList = fs.readdirSync(mapPath);
      for (var i in mapList) map[i] = fs.readFileSync(mapPath + mapList[i]).toString();

      var player = [];
      if (fs.existsSync(playerPath)) fs.readFileSync(playerPath).toString().split('\n');

      var unit = [];
      /*
    var unitList = fs.readdirSync(unitPath);
    for (var i in unitList) {
      var units = fs.readFileSync(unitPath + unitList[i]).toString().split('\n');
      for (var j in units) {
        unit[unit.length] = 
      }
    }
    */

      res.json({
        "map": map,
        "player": player,
        "unit": unit
      });
    }, 500);
  });
  return app;
}
