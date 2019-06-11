const SCHEDUEL = require('node-schedule');
const EXPRESS = require("express");
const FS = require("fs");
const MUTIPART = require('connect-multiparty');
const MAP = require("../modules/map.js");
const FUNCTION = require("../modules/function.js");

var mutipartMiddeware = MUTIPART();
var app = EXPRESS();

function get_map_html() {
	// TODO 通过 HTML 的方法每隔一秒自动刷新，需要改进
	var header = '<html><head><meta http-equiv="refresh" content="1"> <title>ProgWar | The War of Programer</title> <link rel="stylesheet" type="text/css" href="css/map.css"/></head><body>';
	// var header = '<html><head><title>ProgWar | The War of Programer</title> <link rel="stylesheet" type="text/css" href="css/map.css"/></head><body>';
	var footer = '</body></html>';
	return header + MAP.get_html_source() + footer;
}

function load_resources(resourcesPath) {
	var path = {
		'css': resourcesPath + 'css',
		'font': resourcesPath + 'font'
	};
	for (var type in path) {
		var list = FS.readdirSync(path[type]);
		for (var i in list) {
			app.get('/' + type + '/' + list[i], function(req, res) { 
				res.sendfile(resourcesPath + req.url);
			});
		}
	}
}

function start() {
	var resourcesPath = 'docs/';
	load_resources(resourcesPath);
	app.get('/', function (req, res) { 
		res.sendfile(resourcesPath + 'index.html');
	});
	app.get('/map', function (req, res) { 
		res.send(get_map_html()); 
	});
	app.get('/log', function (req, res) {
		var data = FS.readFileSync('log').toString().split('\n');
		var log = "";
		for (var i = data.length - 1; i >= 0; --i) {
			var t = i; 
			while (!data[t].match("Time")) t--;
			for (var j = t; j <= i; ++j) log += "<p>" + data[j] + "</p>";
			i = t;
		}
		res.send(log); 
	});
	app.get('/message', function (req, res) { 
    res.send('<meta http-equiv="refresh" content="0;url=https://www.luogu.org/discuss/show/118177">');
	});

	// 设立接受文件夹
	app.use(MUTIPART({uploadDir:'./source'}));

	// 设立端口
	app.set('port',process.env.PORT || 2363);

	// 在端口开启服务
	app.listen(app.get('port'),function () {
		console.log("Express started on http://localhost:"+app.get('port')+'; press Ctrl-C to terminate.');
	});

	// 接受上传代码
	app.post('/upload', mutipartMiddeware, function (req,res) {
		var name = req.files.source.originalFilename;
		var oldPath = req.files.source.path;
		var newPath = 'source/' + name;
		if (!FS.existsSync(newPath)) {
			console.log(name);
			console.log(FUNCTION.rand_color());
			require("../tools/signup.js").signup_players(name, FUNCTION.rand_color());
		}
		FS.renameSync(oldPath, newPath);
		FS.chmodSync(newPath, 0o755);
    res.send('<script>alert("Upload successed.");</script><meta http-equiv="refresh" content="0;url=/">');
	});
	console.log(new Date() + ": <server.js> [Success] Start server in port 2363");
}

module.exports = {
	"start": start
};
