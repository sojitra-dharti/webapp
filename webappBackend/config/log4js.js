const log4js = require('log4js');
    log4js.configure({
        appenders: { logs: { type: 'file', filename: '/opt/webapp.log' }},
        categories: { default: { appenders: ['logs'], level: 'info' }}
    });

module.exports = log4js;