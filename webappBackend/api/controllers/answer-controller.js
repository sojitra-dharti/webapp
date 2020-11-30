const db = require("../models");
const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const Usercontroller = require("../controllers/user-controller");
const Quescontroller = require("./question-controller");
const Answer = db.answer;
const File = db.file;
const AWSFileUpload = require("./aws-file-upload-controller");
const s3Config = require("../../config/s3-config.js");
const Metrics = require('../../config/metrics-config');
const timeController = require('../controllers/time-controller');


require('dotenv').config()
const bucketName = s3Config.bucketName;
const AWS = require('../../config/aws-config.js');
var log4js = require('../../config/log4js');
const logger = log4js.getLogger('logs');
const sns = new AWS.SNS({apiVersion: '2010-03-31'});
exports.create = async (req, res) => {
    logger.info('Creating Answer');
    var apiStartTime = timeController.GetCurrentTime();
    Metrics.increment('Answer.Create.ApiCount');
    
    var answer_text = req.body.answer_text;
    var questionId = req.params.questionId;
    var uuid = uuidv4();

    if (!answer_text) {
        res.status(400).send({
            Message: "please provide answer_text !"
        });
    }
    const existUser = await Usercontroller.IsAuthenticated(req, res);
    if (existUser) {
        const ifQuesExists = await Quescontroller.ifQuesExists(questionId);
        if (!ifQuesExists) {
            res.status(400).send({
                Message: "Question not found !"
            });
        }

        const answer = {
            id: uuid,
            answer_text: req.body.answer_text,
            QuestionId: questionId,
            UserId: existUser[0].id
        }
        var DBStartTime = timeController.GetCurrentTime();
        Answer.create(answer).then(ans => {
            Metrics.timing('Answer.Create.DbQueryTime', timeController.GetTimeDifference(DBStartTime));
            Metrics.timing('Answer.Create.ApiTime', timeController.GetTimeDifference(apiStartTime)); 
            // Send SNS topic
            var params = {
                MessageStructure: 'json',
                Message: JSON.stringify({
                        "default": JSON.stringify({
                        "answer_id": ans.id,
                        "question_id": ans.QuestionId,
                        "created_timestamp": ans.created_timestamp,
                        "updated_timestamp": ans.updated_timestamp,
                        "user_id": ans.UserId,
                        "answer_text": ans.answer_text,
                        "email":existUser[0].id
                    }),
                }), /* required */
              TopicArn: 'arn:aws:sns:us-east-1:952934740739:email_request'
            };     
            console.log(params);
            // Create promise and SNS service object
            var publishTextPromise = sns.publish(params).promise();
            // Handle promise's fulfilled/rejected states
            publishTextPromise.then(
              function(data) {
                console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
                console.log("MessageID is " + data.MessageId);
                
              }).catch(
                function(err) {
                logger.error("Error in publishing SNS");
                logger.error(err);
                logger.error(err.stack);
             
          });
            
            res.status(201).send(ans);
        }).catch(err => {
            logger.info('Error in creating answer' + err);
            res.send({
                Message: "Error in creating answer"
            });
            console.log(err);
        });
    }
    else {
        logger.error('User is not authorized !');
       
        res.status(401).send({
            Message: "User is not authorized !"
        });
    }


}

exports.getAnswerById = (req, res) => {
    logger.info('Getting answer by Id');
    var apiStartTime = timeController.GetCurrentTime();
    Metrics.increment('Answer.ViewById.ApiCount');

    // validation for mandatory question and answerid else bad 404
    if (!req.params.questionId || !req.params.answerId) {
        res.status(404).send({
            Message: "questionid and answerid required !"
        })
    }
    var DBStartTime = timeController.GetCurrentTime();
    return Answer.findAll(
        {
            where:
            {
                id: req.params.answerId,
                QuestionId: req.params.questionId
            }
        })
        .then(ques => {
            Metrics.timing('Answer.ViewById.DbQueryTime', timeController.GetTimeDifference(DBStartTime));
            Metrics.timing('Answer.ViewById.ApiTime', timeController.GetTimeDifference(apiStartTime)); 
            res.status(200).send(ques);
        }).catch(err => {
            logger.error('Error in fetching answer by Id');
            res.status(404).send({
                Message: "Answer not found"
            });
        });
}

exports.getAnswerByQuesId = (quesId) => {
    return Answer.findAll(
        {
            where:
            {
                QuestionId: quesId
            }
        })
        .then(ans => {
            return ans;
        }).catch(err => {
            console.log(err);
        });

}

exports.deleteAnswer = async (req, res) => {
    logger.info('Deleting Answer');
    var apiStartTime = timeController.GetCurrentTime();
    Metrics.increment('Answer.Delete.ApiCount');
    const existUser = await Usercontroller.IsAuthenticated(req, res);
    if (existUser) {
        await File.findAll({
            where:
            {
                QuestionId: req.params.questionId,
                AnswerId: req.params.answerId
            }
        }).then((file) => {
            if (file) {
                
                for (i = 0; i < file.length; i++) {
                    let s3bucket = new AWS.S3({
                       
                        Bucket: bucketName
                    });
                
                    const params = {
                        Bucket: bucketName,
                        Key: file[i].id+file[i].file_name
                    }
                    var S3StartTime = timeController.GetCurrentTime();
                    s3bucket.deleteObject(params, function (err, data) {
                        Metrics.timing('File.S3Bucket.DeleteFile.Time', timeController.GetTimeDifference(S3StartTime)); 
                        if (err) {
                            logger.error('Error in uploading file to s3' + err);
                            console.log(err);
                        }
                        else {
                            console.log("sucess");
                        }
                    });
                     File.destroy({
                        where: {
                            id: file[i].id,
                        }
                    })
                }
               
            }
        })
        var DBStartTime = timeController.GetCurrentTime();
        Answer.destroy({
            where:
            {
                id: req.params.answerId,
                QuestionId: req.params.questionId,
                UserId: existUser[0].id
            }
        }).then((result) => {
            logger.info('Answer Deleted');
            Metrics.timing('Answer.Delete.DbQueryTime', timeController.GetTimeDifference(DBStartTime));
            Metrics.timing('Answer.Delete.ApiTime', timeController.GetTimeDifference(apiStartTime)); 
            if (result == 0) {
                res.status(404).send({
                    Message: "Answer not found !"
                });
            }
            res.status(204).send();
        }).catch(err => { 
            logger.error('Error in deleting answer' + err);
            res.status(204).send() })
    } else {
        logger.error('User is unauthorized');
        res.status(401).send({
            Message: "user unauthorized"
        });
    }
}

exports.updateAnswer = async (req, res) => {
    var apiStartTime = timeController.GetCurrentTime();
    Metrics.increment('Answer.Update.ApiCount');
    logger.info('Updating Answer');
    var currentDate = new Date();
    var answertext = req.body.answer_text;
    var questionId = req.params.questionId;
    var answerId = req.params.answerId;


    if (!answertext) {
        res.status(400).send({
            Message: "please provide answer_text !"
        });
    }

    const existUser = await Usercontroller.IsAuthenticated(req, res);
    console.log(existUser[0].id);
    if (existUser) {
        var DBStartTime = timeController.GetCurrentTime();
        Answer.update({
            answer_text: answertext,
            updated_timestamp: currentDate,
        }, {
            where:
            {
                id: answerId,
                UserId: existUser[0].id,
                QuestionId: questionId
            }
        })
            .then((result) => {
                Metrics.timing('Answer.Update.DbQueryTime', timeController.GetTimeDifference(DBStartTime));
                Metrics.timing('Answer.Update.ApiTime', timeController.GetTimeDifference(apiStartTime)); 
                if (result == 0) {
                    res.status(404).send({
                        Message: "User can only update their own answers"
                    });
                }
                else {
                    logger.error('Error in Updating Answer');
                    res.send(204);
                    console.log({
                        Message: "Answer updated" + result
                    });
                }
            });
    }
    else {
        logger.error('User is unauthorized for updating answer');
        res.status(401).send({
            Message: "unauthorized"
        });
    }
}

exports.getAnswerByIdAndUserId = (answerId, userId) => {
    return Answer.findAll(
        {
            where:
            {
                id: answerId,
                UserId: userId
            }
        })
        .then(ans => {
            return ans;
        }).catch(err => {
            console.log(err);
        });
}

