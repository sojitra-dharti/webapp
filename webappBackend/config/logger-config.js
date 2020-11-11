'use strict';

const log4js = require('log4js');
let level =log4js.levels.INFO.levelStr;
   
log4js.configure({
    appenders: { 'file': { type: 'file', filename: '/opt/csye6225.log' } },
    categories: { default: { appenders: ['file'], level } }
  });


module.exports = log4js.getLogger('file');