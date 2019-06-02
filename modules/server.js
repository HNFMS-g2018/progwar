const SCHEDUEL = require('node-schedule');
const EXPRESS = require("express");
const FS = require("fs");
const MAP = require("../modules/map.js");

var app = EXPRESS();

function get_html() {
	// TODO 通过 HTML 的方法每隔一秒自动刷新，需要改进
	var header = '<html><head><meta http-equiv="refresh" content="1"> <title>ProgWar | The War of Programer</title> <link rel="stylesheet" type="text/css" href="css/map.css"/></head><body>';
	// var header = '<html><head><title>ProgWar | The War of Programer</title> <link rel="stylesheet" type="text/css" href="css/basic.css"/></head><body>';
	var footer = '</body></html>';
	return header + MAP.get_html_source() + footer;
}

function start() {
	app.get('/css/common.css', function (req, res) { res.send(FS.readFileSync('css/common.css')); });
	app.get('/css/map.css', function (req, res) { res.send(FS.readFileSync('css/map.css')); });
	app.get('/', function (req, res) { 
			res.send(get_html()); 
		});
	// 在 2363 端口开启服务
	var server = app.listen(2363);
	console.log(new Date() + ": <server.js> [Success] Start server in port 2363");
}

module.exports = {
	"start": start
};
