require('dotenv').config()
module.exports = {
    accessKeyId: process.env.DevAccessKey,
    secretAccessKey: process.env.DevSecretKey,
    bucketName:process.env.s3bucketname
  };
