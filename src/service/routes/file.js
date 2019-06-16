const lodash = require('../../../src/lodash');
const logger = require('../../../src/logger');

module.exports = function (app, path) {
  var file = lodash.getAllFilePath(path);
  logger.trace("Load file:" + file);
  for (var i in file) {
    app.get('/' + file[i], function(req, res) {
      res.sendfile('.' + req.url);
    });
  }
  return app;
}

