const log4js = require('log4js');
    log4js.configure({
        appenders: { logs: { type: 'file', filename: './webappBackend/logs/csye6225.log' }},
        categories: { default: { appenders: ['logs'], level: 'info' }}
    });

module.exports = log4js;