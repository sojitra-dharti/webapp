const db = require("../models");
const Category = db.category;
const Question = db.question;
const Answer = db.answer;
const Catcontroller = require("./category-controller");
const Usercontroller = require("./user-controller");
const Anscontroller = require("./answer-controller");
const s3Config = require("../../config/s3-config.js");
const question_category = db.question_category
const { v4: uuidv4 } = require('uuid');
const File = db.file;
require('dotenv').config()
const bucketName = s3Config.bucketName;
const AWS = require('../../config/aws-config.js');
const Metrics = require('../../config/metrics-config');
const timeController = require('../controllers/time-controller');
var log4js = require('../../config/log4js');
const logger = log4js.getLogger('logs');


exports.createQues = (question) => {
    logger.info('Creating question');
    var DBStartTime = timeController.GetCurrentTime();
    return Question.create(question)
        .then((ques) => {
            console.log(">> Created Question: " + ques);
            Metrics.timing('Question.Create.DbQueryTime', timeController.GetTimeDifference(DBStartTime));
            return ques;
        })
        .catch((err) => {
            console.log(">> Error while creating Question: ", err);
        });
};


exports.create = async (req, res) => {
    var apiStartTime = timeController.GetCurrentTime();
    Metrics.increment('Question.Create.ApiCount');
    logger.info('Creating question');

    var uuid = uuidv4();
    var currentDate = new Date();
    var question_text = req.body.question_text;
    var categories = req.body.categories;

    if (!question_text) {
        res.status(400).send({
            Message: "please provide a question_text !"
        });
    }

    const existUser = await Usercontroller.IsAuthenticated(req, res);
    if (existUser) {

        const quesdata = {
            id: uuid,
            UserId: existUser[0].id,
            question_text: req.body.question_text,
            created_timestamp: currentDate,
            updated_timestamp: currentDate
        };
        const ques1 = await this.createQues(quesdata);

        if (categories) {
            for (i = 0; i < categories.length; i++) {
                const existCat = await Catcontroller.findByName(categories[i]);
                await Catcontroller.addQuestion(existCat[0].id, ques1.id);
            }
        }
        const ques = await Question.findAll(
            {
                where: {
                    id: ques1.id
                },
                include: [
                    {
                        model: Category,
                        as: "categories",
                        through: {
                            attributes: [],
                        }
                    },
                ],
            }).catch((err) => {
                logger.error('Error while retrieving questions');
                console.log(">> Error while retrieving questions: ", err);
            });
    
        Metrics.timing('Question.Create.ApiTime', timeController.GetTimeDifference(apiStartTime)); 
        res.send(ques[0]);

    }
    else {
        logger.error('user unauthorized');
        res.status(401).send({
            Message: "user unauthorized"
        });
    }
};
exports.findAll = (req, res) => {

    var apiStartTime = timeController.GetCurrentTime();
    Metrics.increment('Question.View.ApiCount');
    logger.info('Get all questions');
    var DBStartTime = timeController.GetCurrentTime();

    return Question.findAll({
        include: [
            {
                model: Category,
                as: "categories",
                through: {
                    attributes: [],
                }
            },
            {
                model: Answer,
                as: "answers",
                include:[{
                    model: File,
                    as: "Answerfiles"
                }]
            },
            {
                model: File,
                as: "Questionfiles"
            }
        ],
    })
        .then((questions) => {
            Metrics.timing('Question.View.DbQueryTime', timeController.GetTimeDifference(DBStartTime));
            Metrics.timing('Question.View.ApiTime', timeController.GetTimeDifference(apiStartTime)); 
            res.send(questions);
        })
        .catch((err) => {
            console.log(">> Error while retrieving questions: ", err);
        });
};

exports.ifQuesExists = (id) => {
    logger.info('checking if question exists');
    return Question.count({ where: { id: id } })
        .then(count => {
            if (count == 0) {
                return false;
            }
            return true;
        });
}

exports.getQuestionById = (req, res) => {
    var apiStartTime = timeController.GetCurrentTime();
    Metrics.increment('Question.ViewById.ApiCount');
    logger.info('get question by Id');
    var DBStartTime = timeController.GetCurrentTime();

    return Question.findAll(
        {
            where:
            {
                id: req.params.questionId
            }
            , include: [
                {
                    model: Answer,
                    as: "answers"
                },
                {
                    model: Category,
                    as: "categories",
                    attributes: ['id', 'category'],
                    through: {
                        attributes: []
                    }
                }
            ],
        })
        .then(ques => {
            Metrics.timing('Question.ViewById.DbQueryTime', timeController.GetTimeDifference(DBStartTime));
            Metrics.timing('Question.ViewById.ApiTime', timeController.GetTimeDifference(apiStartTime));
            res.status(200).send(ques);
        }).catch(() => {
            logger.error('Question not found');
            res.status(404).send({
                Message: "Question not found"
            });
        });

}

exports.updateQuestion = async (req, res) => {

    var apiStartTime = timeController.GetCurrentTime();
    Metrics.increment('Question.Update.ApiCount');
    logger.info('Updating question');
  

    var currentDate = new Date();
    var questiontext = req.body.question_text;
    var categories = req.body.categories;
    var questionId = req.params.questionId;

    if (!questiontext && !categories) {
        res.status(400).send({
            Message: "please provide question or categories !"
        });
    }


    const existUser = await Usercontroller.IsAuthenticated(req, res);
    if (existUser) {
        if (categories) {
            const existQues = await this.getQuestionByIdAndUserId(questionId, existUser[0].id);
            if (!existQues || existQues.length == 0) {
                res.status(404).send({
                    Message: "question not found !"
                });
            }
            question_category.destroy({
                where: {
                    ques_id: existQues[0].id
                }
            }).catch(err => { console.log(err) })

            for (i = 0; i < categories.length; i++) {
                const existCat = await Catcontroller.findByName(categories[i]);
                await Catcontroller.addQuestion(existCat[0].id, questionId);
            }

        }
        if (questiontext) {
            var DBStartTime = timeController.GetCurrentTime();
            await Question.update({
                question_text: questiontext,
                updated_timestamp: currentDate
            }, {
                where:
                {
                    id: questionId,
                    UserId: existUser[0].id
                }
            })
                .then(result => {
                    Metrics.timing('Question.Update.DbQueryTime', timeController.GetTimeDifference(DBStartTime));
                    Metrics.timing('Question.Update.ApiTime', timeController.GetTimeDifference(apiStartTime)); 
                    if (result == 0) {
                        logger.error('Question not found for this user');
                        res.status(404).send({
                            Message: "Question not found for this user !"
                        })
                    }
                    else {

                        res.status(204).send({
                            Message: "question rows updated" + result
                        });
                    }
                });

        }
        res.status(204).send();
    }
    else {
        logger.error('User is not for this question');
        res.status(401).send({
            Message: "unauthorized"
        });
    }
}


exports.getQuestionByIdAndUserId = (questionId, userId) => {
    return Question.findAll(
        {
            where:
            {
                id: questionId,
                UserId: userId
            }
            , include: [
                {
                    model: Category,
                    as: "categories"
                }
            ],
        })
        .then(ques => {
            return ques;
        }).catch(err => {
            console.log(err);
        });
}

exports.deleteQuestion = async (req, res) => {
    var apiStartTime = timeController.GetCurrentTime();
    Metrics.increment('Question.Delete.ApiCount');
    logger.info('Deleting question');
    var questionId = req.params.questionId;

    const existUser = await Usercontroller.IsAuthenticated(req, res);
    if (existUser) {
        const existAnswer = await Anscontroller.getAnswerByQuesId(questionId);

        if (existAnswer.length <= 0) {

            await File.findAll({
                where:
                {
                    QuestionId: questionId
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
                        s3bucket.deleteObject(params, function (err) {
                            Metrics.timing('File.S3Bucket.DeleteFile.Time', timeController.GetTimeDifference(S3StartTime)); 
                            if (err) {
                                logger.error('Error in file upload');
                            }
                            else {
                                logger.info('file uploaded');
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
            Question.destroy({
                where:
                {
                    id: questionId,
                    UserId: existUser[0].id
                }
            }).then((result) => {
                Metrics.timing('Question.Delete.DbQueryTime', timeController.GetTimeDifference(DBStartTime)); 
                Metrics.timing('Question.Delete.ApiTime', timeController.GetTimeDifference(apiStartTime)); 
                    
                if (result == 0) {
                    logger.error('Question not found');

                    res.status(404).send({
                        Message: "Question not found"
                    });
                }
                logger.info('Question deleted');
                res.status(204).send({
                    Message: "Question deleted"
                });
            })
                .catch(err => { console.log(err) })
        }
        else {
            logger.info('question with one or more answers can not be deleted !');
            res.status(400).send({
                Message: "question with one or more answers can not be deleted !"
            });
        }
    }
    else {
        res.status(401).send({
            Message: "unauthorized"
        });
    }
}


