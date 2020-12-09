const dbConfig = require("../../config/db.config.js");

const Sequelize = require("sequelize");

const { QueryTypes } = require('sequelize');
var log4js = require('../../config/log4js');
const logger = log4js.getLogger('logs');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};


db.Sequelize = Sequelize;
db.sequelize = sequelize;
const Op = db.Sequelize.Op;

db.users = require("./User.js")(sequelize, Sequelize);
db.question = require("./Question.js")(sequelize, Sequelize);
db.category = require("./Category.js")(sequelize, Sequelize);
db.answer = require("./Answer.js")(sequelize, Sequelize);
db.question_category = require("./question_category.js")(sequelize, Sequelize);
db.file = require("./File.js")(sequelize, Sequelize);

//user has many questions.
db.users.hasMany(db.question, { as: "questions" });
db.question.belongsTo(db.users, {
  foreignKey: "UserId",
  as: "users",
});

//question has many answers
db.question.hasMany(db.answer, { as: "answers" });
db.answer.belongsTo(db.question, {
  foreignKey: "QuestionId",
  as: "questions",
});

//user has many answers
db.users.hasMany(db.answer, { as: "answers" });
db.answer.belongsTo(db.users, {
  foreignKey: "UserId",
  as: "useranswers",
});




db.question.belongsToMany(db.category ,{
  onDelete: 'cascade',
  through: "question_category",
  as: "categories",
  foreignKey: "ques_id",
});

db.category.belongsToMany(db.question ,{
  through: "question_category",
  as: "categories",
  foreignKey: "category_id",
});


//question has many files.
db.question.hasMany(db.file, { as: "Questionfiles" });
db.file.belongsTo(db.question, {
  foreignKey: "QuestionId",
  as: "questions",
});
//answer has many files.
db.answer.hasMany(db.file, { as: "Answerfiles" });
db.file.belongsTo(db.answer, {
  foreignKey: "AnswerId",
  as: "answers",
});

  // db.questions.belongsToMany(db.category, {
  //     foreignKey:{
  //     name: 'questionId',
  //     allowNull: false
  //     },
  //     through: 'UserCategory',
  //     as:'categories',
  //     sourceKey:'id'
  // });


  // db.category.belongsToMany(db.questions,{
  //       foreignKey:{
  //       name: 'categoryId',
  //       allowNull: false
  //       },
  //       through: 'UserCategory',
  //       as:'questions',
  //       sourceKey:'id'
  //   });
  






// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });
db.sequelize.query("SHOW STATUS LIKE 'Ssl_%'", {
  type: QueryTypes.SELECT
}).then((result) => {
  // console.log(result[0].Value);
  if(result == undefined || result == null || result.length == 0){
      logger.info(`RDS DB SSL Cipher check info: SSL data not available`, {tags: 'http', additionalInfo: {result: JSON.parse(JSON.stringify(result))}});
  } else {     
    var parsed = JSON.parse(result);
      logger.info(`RDS DB SSL Cipher check info query: SHOW STATUS LIKE 'Ssl_%'; Result0: `, {tags: 'http', additionalInfo: {result: JSON.stringify(result)}});
      logger.info(`RDS DB SSL Cipher check info query: SHOW STATUS LIKE 'Ssl_%'; Result1: `, {tags: 'http', additionalInfo: {result: parsed[0]}});
      logger.info(`RDS DB SSL Cipher check info query: SHOW STATUS LIKE 'Ssl_%'; Result2: `, {additionalInfo: {result: result}});
     }
}).catch(err => {
  logger.error(`Error in RDS DB SSL Cipher check: `, {tags: 'http', additionalInfo: {error: err}});
});

module.exports = db;