const db = require("../models");
const bcrypt = require('bcrypt');
const auth = require('basic-auth');
const saltRounds = 10;
const Category = db.category;
const Question = db.question;
const Answer = db.answer;
const UserCategory = db.usercategory;
const Catcontroller = require("./category-controller");
const Usercontroller = require("./user-controller");
const Anscontroller = require("./answer-controller");
const AWSFileUpload = require("./aws-file-upload-controller");
const question_category = db.question_category
const { v4: uuidv4 } = require('uuid');
const File = db.file;


exports.createQues = (question) => {
    return Question.create(question)
        .then((ques) => {
            console.log(">> Created Question: " + ques);
            return ques;
        })
        .catch((err) => {
            console.log(">> Error while creating Question: ", err);
        });
};


exports.create = async (req, res) => {

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
                console.log(">> Error while retrieving questions: ", err);
            });
        res.send(ques[0]);

    }
    else {
        res.status(401).send({
            Message: "user unauthorized"
        });
    }
};
exports.findAll = (req, res) => {
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
                as: "answers"
            },
            {
                model: File,
                as: "Questionfiles"
            }
        ],
    })
        .then((questions) => {
            res.send(questions);
        })
        .catch((err) => {
            console.log(">> Error while retrieving questions: ", err);
        });
};

exports.ifQuesExists = (id) => {
    return Question.count({ where: { id: id } })
        .then(count => {
            if (count == 0) {
                return false;
            }
            return true;
        });
}

exports.getQuestionById = (req, res) => {
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
            res.status(200).send(ques);
        }).catch(err => {
            res.status(404).send({
                Message: "Question not found"
            });
        });

}

exports.updateQuestion = async (req, res) => {

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
                    if (result == 0) {
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

    var questionId = req.params.questionId;

    const existUser = await Usercontroller.IsAuthenticated(req, res);
    if (existUser) {
        const existAnswer = await Anscontroller.getAnswerByQuesId(questionId);

        if (existAnswer.length <= 0) {

            await File.findOne({
                where:
                {
                    QuestionId: questionId
                }
            }).then((file) => {

                AWSFileUpload.deleteFileFromS3(file.id+file.file_name);
                File.destroy({
                    where: {
                        id: file.id,
                    }
                })
            })

            Question.destroy({
                where:
                {
                    id: questionId,
                    UserId: existUser[0].id
                }
            }).then((result) => {
                if (result == 0) {
                    res.status(404).send({
                        Message: "Question not found"
                    });
                }
                res.status(204).send({
                    Message: "Question deleted"
                });
            })
                .catch(err => { console.log(err) })
        }
        else {
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


