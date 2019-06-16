const fs = require('fs');
const logger = require("../../../src/logger");
const file = require("./file");
const data = require("./data");
const upload = require("./upload");

function init(app) {
  logger.debug("Routes init");
  app = file(app, 'file/');
  app = file(app, 'docs/');
  app = data(app);
  app = upload(app);
  return app;
}

module.exports.init = init;
