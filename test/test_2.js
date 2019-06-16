const fs = require('fs');

function read_current_dir(path) {
	var list = fs.readdirSync(path);
	var res = [];
	for (var i in list) {
		var new_path = path + list[i];
		if (fs.statSync(new_path).isDirectory())
			res = [...res, ...read_current_dir(new_path + '/')];
		else
			res[res.length] = new_path;
	}
	return res;
}

var res = read_current_dir('file/');
console.log(res);
