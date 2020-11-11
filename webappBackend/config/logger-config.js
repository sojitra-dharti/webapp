const winston = require('winston');
 
const logger = winston.createLogger({
    level: 'info',
    transports: [
      new winston.transports.File({ filename: '/opt/csye6225.log' })
    ]
  });
module.exports = logger;
