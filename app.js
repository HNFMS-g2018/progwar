const SCHEDUEL = require('node-schedule');
const COMMAND = require('./modules/command.js');
const SERVER = require('./modules/server.js');
const ACTION = require('./modules/action');
const SOURCE = require('./modules/source.js');

function schedule() {
  // 设立任务，奇数秒运行程序，偶数秒更新地图
  SCHEDUEL.scheduleJob('* * * * * *', function() {
    // 获取所有命令
    var commands = COMMAND.get();
    // 执行获取到的命令
    ACTION.execute(commands);
    // 清除运行完了的命令
    COMMAND.clean();
    // console.log(new Date() + ": <main.js> [Success] Clean command");
    SOURCE.run();
  }); 
}

// 开启服务
SERVER.start();
schedule();
