## logger

log4js.getLogger 的封装，将不同等级的信息分散到不同文件中。

```
const logger = require('./src/logger').logger;

logger.debug("hello");
```

