## service/routes

路由文件，遍历文件夹下的所有文件，添加上对应的路由。

### init(app)

初始化页面路由。

返回值：express 实例

### file(app, path)

需求：
- lodash
- logger

为 express 的实例 app 添加上 path 目录下所有文件的路由。

返回值：express 实例

### data(app)

需求：
- fs
- logger

为 `/data` 加上 json 数据路由

返回值：express 实例

## upload(app) 

添加提交文件路由
