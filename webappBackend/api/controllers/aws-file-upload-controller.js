const AWS = require('../../config/aws-config.js');
const s3Config = require("../../config/s3-config.js");
require('dotenv').config()
const bucketName = s3Config.bucketName;
exports.uploadFileToS3 = async (file, filename) => {

    let s3bucket = new AWS.S3({
        Bucket: bucketName
    });

    const params = {
        Bucket: bucketName,
        Key: filename,
        Body: file.data
    }

    s3bucket.upload(params, function (err, data) {
        if (err) {
            return null;
        }
        else {
           return "success";
        }
    });
}

exports.deleteFileFromS3 = async (file) => {
    let s3bucket = new AWS.S3({
        // accessKeyId: s3Config.accessKeyId,
        // secretAccessKey: s3Config.secretAccessKey,
        Bucket: bucketName
    });

    const params = {
        Bucket: bucketName,
        Key: file
    }

    s3bucket.deleteObject(params, function (err, data) {
        if (err) {
            return null;
        }
        else {
           return "success";
        }
    });
}