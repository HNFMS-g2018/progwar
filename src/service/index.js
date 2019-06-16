const express = require('express');

const routes = require('./routes');

module.exports.start = function () {
  var app = express();

  app = routes.init(app);
  
  app.set('port', process.env.PORT || 7141);

  app.listen(app.get('port'),function () {
    console.log("Express started on http://localhost:"+app.get('port')+'; press Ctrl-C to terminate.');
  });
}
