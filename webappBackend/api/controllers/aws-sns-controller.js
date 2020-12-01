const AWS = require('../../config/aws-config.js');
const dynamoClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const sns = new AWS.SNS({ apiVersion: '2010-03-31' });
var log4js = require('../../config/log4js');
const logger = log4js.getLogger('logs');
const timeController = require('../controllers/time-controller');

exports.publishSNS = async (message) => {
  let params = JSON.parse(message.Message);
  console.log(params);
    var searchParams = {
        TableName: "csye6225",
        Key: {
          id: params.Email+params.QuesId+params.AnsId
        }
      };
    
       await dynamoClient.get(searchParams, (err, data) => {
        if (err) {
          console.log("Ddynamo db access problem");
           logger.error("Ddynamo db access problem for " + params.QuesId);
           
        } else if (data.Item == null || data.Item == undefined) {
           
            logger.info("Sns notification sent for the question " + params.Question );
            console.log("Sns notification sent for the question");
            dynamoClient.put(searchParams ,function (err,data){
              if(err){
              console.log(err);
              }
              else{
              console.log(data);
              console.log("dynamo  put error");
              }
            });      

            var publishTextPromise = sns.publish(params).promise();
            logger.info("1");
            publishTextPromise.then(
              function (data) {
                logger.info("2");
              }).catch(
                  function (err) {
                    logger.info("3");
                     console.log("Error in publishing SNS");
                  });
        }
    });



}

