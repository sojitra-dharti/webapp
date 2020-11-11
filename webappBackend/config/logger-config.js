const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');
 
const logger = winston.createLogger({
    level: 'info',
    transports: [
      new winston.transports.File({ filename: '/opt/csye6225.log' })
    ]
  });

  const cloudwatchConfig = {
    logGroupName: 'csye6225',
    logStreamName: 'webapp',
    awsAccessKeyId: '${{ secrets.AWS_ACCESS_KEY_ID }}',
    awsSecretKey: '${{ secrets.AWS_SECRET_ACCESS_KEY }}'
}
logger.add(new WinstonCloudWatch(cloudwatchConfig))


module.exports = logger;
