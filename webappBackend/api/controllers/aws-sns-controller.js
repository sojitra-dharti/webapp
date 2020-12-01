const AWS = require('../../config/aws-config.js');
const dynamoClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });
var log4js = require('../../config/log4js');
const logger = log4js.getLogger('logs');

exports.publishSNS = (params) => {
    var searchParams = {
        TableName: "csye6225",
        Key: {
          id: params.email
        }
      };
    
      dynamoClient.get(searchParams, (err, data) => {
        if (err) {
            console.log(err);
            logger.error("Ddynamo db access problem for " + params.QuesId);
           
        } else if (data.Item == null || data.Item == undefined) {
            logger.info("5");
            logger.info("Sns notification has already been sent for the question " + params.Question );
            
            var publishTextPromise = sns.publish(params).promise();
            logger.info("1");
            publishTextPromise.then(
              function (data) {
                logger.info("2");
                  // logger.info(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
                  // logger.info(`Message ${params.Message.email}`);
              }).catch(
                  function (err) {
                    logger.info("3");
                     // logger.error("Error in publishing SNS");
                  });
        }
    });

   

}

