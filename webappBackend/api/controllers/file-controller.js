const db = require("../models");

const { v4: uuidv4 } = require('uuid');
const Usercontroller = require("./user-controller");
const AWSFileUpload = require("./aws-file-upload-controller");
const QuestionController = require("./question-controller");
const AnswerController = require("./answer-controller");
const File = db.file;

exports.createFile = async (req, res) => {

    var currentDate = new Date();
    var uuid = uuidv4();
    var questionId = req.params.questionId;
    var answerId = req.params.answerId;



    const existUser = await Usercontroller.IsAuthenticated(req, res);
    if (existUser) {

        if (questionId && !answerId) {
            const existQues = await QuestionController.getQuestionByIdAndUserId(questionId, existUser[0].id);
            if (!existQues || existQues.length == 0) {
                return res.status(404).send({
                    Message: "Question for this user is not found !"
                });
            }
        }
        else {
            const existAns = await AnswerController.getAnswerByIdAndUserId(answerId, existUser[0].id);
            if (!existAns || existAns.length == 0) {
                return res.status(404).send({
                    Message: "Answer for this user is not found !"
                });
            }
        }


        let file = req.files.file;


        if (!file) {
            res.status(400).send("File name invalid");
        }
        if (!file.name.match(/\.(jpg|jpeg|png)$/i)) {
            return res.status(400).send({
                Message:"User can upload only images !"
            })
        }

        var metadata = {
            size: file.size,
            encoding: file.encoding,
            mimetype: file.mimetype,
            md5: file.md5
        }

        var filedata;
        if (answerId) {
            filedata = {
                id: uuid,
                file_name: file.name,
                s3_object_name: uuid + "/" + questionId + "/" + file.name,
                metaData: metadata,
                created_date: currentDate,
                QuestionId: questionId,
                AnswerId: answerId
            };
        }
        else {
            filedata = {
                id: uuid,
                file_name: file.name,
                s3_object_name: uuid + "/" + questionId + "/" + file.name,
                metaData: metadata,
                created_date: currentDate,
                QuestionId: questionId
            };
        }

        const filecreated = await File.create(filedata).catch(err => {
            res.send(err);
        });
        const isFileUploaded = await AWSFileUpload.uploadFileToS3(file, uuid + file.name).catch(err => {
            res.send("error in uploading file to S3");
        });

        res.status(200).send({ Message: "File uploaded" });


    }
    else {
        res.status(401).send({
            Message: "unauthorized"
        });
    }
}

exports.deleteFile = async (req, res) => {

    var questionId = req.params.questionId;
    var answerId = req.params.answerId;
    var fileId = req.params.fileId;

    const existUser = await Usercontroller.IsAuthenticated(req, res);
    if (existUser) {
        try {
            if (questionId && !answerId) {
                const existQues = await QuestionController.getQuestionByIdAndUserId(questionId, existUser[0].id);
                if (!existQues || existQues.length == 0) {
                    return res.status(404).send({
                        Message: "Question for this user is not found !"
                    });
                }
            }
            else {
                const existAns = await AnswerController.getAnswerByIdAndUserId(answerId, existUser[0].id);
                if (!existAns || existAns.length == 0) {
                    return res.status(404).send({
                        Message: "Answer for this user is not found !"
                    });
                }
            }
            await File.findByPk(fileId).then((file) => {

                AWSFileUpload.deleteFileFromS3(fileId + file.file_name);
                File.destroy({
                    where: {
                        id: fileId,
                    }
                })
            })
            res.status(200).send({ Message: "File deleted!" });
        }

        catch (err) {
            res.send({ Message: "Error in deleting file" })
        }
    }

    else {
        res.status(401).send({
            Message: "unauthorized"
        });
    }

}
