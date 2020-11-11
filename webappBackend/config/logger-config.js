const winston = require('winston');
 
const logger = winston.createLogger({
    level: 'info',
    transports: [
      new winston.transports.File({ filename: 'csye6225.log' })
    ]
  });
module.exports = logger;
