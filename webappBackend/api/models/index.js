const dbConfig = require("../../config/db.config.js");

const Sequelize = require("sequelize");


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

module.exports = db;