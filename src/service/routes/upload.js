const multipart = require('connect-multiparty');

var mutipartMiddeware = multipart();

module.exports = function (app) {
	// 设立接受文件夹
	app.use(multipart({uploadDir:'./file/source'}));
	app.post('/upload', mutipartMiddeware, function (req,res) {
		var name = req.files.source.originalFilename;
		var oldPath = req.files.source.path;
		var newPath = './file/source/' + name;
		if (!FS.existsSync(newPath)) {
			console.log(name);
			console.log(FUNCTION.rand_color());
			// require("../tools/signup.js").signup_players(name, FUNCTION.rand_color());
		}
		FS.renameSync(oldPath, newPath);
		FS.chmodSync(newPath, 0o755);
    res.send('<script>alert("Upload successed.");</script><meta http-equiv="refresh" content="0;url=/">');
	});
  return app;
}
