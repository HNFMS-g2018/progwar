const fs = require('fs');

const dataPath = "file/data/map/"

// 格式化数据
function formatData(data) {
	data = data.split('\n');
  var res = [];
	res.height = data[0].split(' ')[0];
	res.width = data[0].split(' ')[1];
  for (var i = 0; i < res.height; ++i) {
    res[i] = [];
    for (var j = 0; j < res.width; ++j) res[i][j] = data[i + 1][j];
  }
  return res;
}

function getMap() {
  var map = [];
  var list = fs.readdirSync(dataPath);
  for (var i in list) {
    map[list[i]] = formatData(fs.readFileSync(dataPath + list[i]).toString());
  }
  return map;
}

module.exports.getMap = getMap;
