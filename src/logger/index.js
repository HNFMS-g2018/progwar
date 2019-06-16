const log4js = require('log4js');

log4js.configure({
  appenders: {
		log: { type: 'stdout',
      layout: {
        type: 'pattern', pattern: '%d %p %c %f:%l %m%n'
      }
		},
		all: { type: 'file', filename: 'logs/all',
      layout: {
        type: 'pattern', pattern: '%d %p %c %f:%l %m%n'
      }
		},
		info: { type: 'file', filename: 'logs/info',
      layout: {
        type: 'pattern', pattern: '%d %p %c %f:%l %m%n'
      }
		},
		warn: { type: 'file', filename: 'logs/warn',
      layout: {
        type: 'pattern', pattern: '%d %p %c %f:%l %m%n'
      }
		},
		error: { type: 'file', filename: 'logs/error',
      layout: {
        type: 'pattern', pattern: '%d %p %c %f:%l %m%n'
      }
		},
		fatal: { type: 'file', filename: 'logs/fatal',
      layout: {
        type: 'pattern', pattern: '%d %p %c %f:%l %m%n'
      }
		},
		mark: { type: 'file', filename: 'logs/mark',
      layout: {
        type: 'pattern', pattern: '%d %p %c %f:%l %m%n'
      }
		},
    'just-info': { type: 'logLevelFilter', appender: 'info', level: 'info' },
    'just-warn': { type: 'logLevelFilter', appender: 'warn', level: 'warn' },
    'just-error': { type: 'logLevelFilter', appender: 'error', level: 'error' },
    'just-fatal': { type: 'logLevelFilter', appender: 'fatal', level: 'fatal' },
    'just-mark': { type: 'logLevelFilter', appender: 'mark', level: 'mark' }
  },
  categories: {
    default: { appenders: ['log', 'all', 'just-info', 'just-warn', 'just-error', 'just-fatal', 'just-mark'], level: 'all', enableCallStack: true }
  },
	pm2: true
});

module.exports = log4js.getLogger();
