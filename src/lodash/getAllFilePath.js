const fs = require('fs');

function getAllFilePath(path) {
	var list = fs.readdirSync(path);
	var res = [];
	for (var i in list) {
		var new_path = path + list[i];
		if (fs.statSync(new_path).isDirectory())
			res = [...res, ...getAllFilePath(new_path + '/')];
		else
			res[res.length] = new_path;
	}
	return res;
}

module.exports = getAllFilePath;
