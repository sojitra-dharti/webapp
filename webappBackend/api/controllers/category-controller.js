
const db = require("../models");

const Question = db.question;
const Cat = db.category;
const question_category = db.question_category
const { v4: uuidv4 } = require('uuid');


exports.create = (cat) => {
  return Cat.create({
    category: cat,
  })
    .then((cat) => {
      return cat;
    })
    .catch((err) => {
      console.log(">> Error while creating category: ", err);
    });
};



exports.addQuestion = (catId, questionId) => {
  return Cat.findByPk(catId)
    .then((cat) => {
      if (!cat) {
        console.log("cat not found!");
        return null;
      }
      return Question.findByPk(questionId).then((question) => {
        if (!question) {
          console.log("Question not found!");
          return null;
        }
        const quescat =
          { ques_id: questionId, category_id: catId }

        question_category.create(quescat).then(data => {
          console.log(`>> added Question id=${question.id} to cat id=${cat.id}`);
          return cat;
        }).catch(err => { })

      });
    })
    .catch((err) => {
      console.log(">> Error while adding Question to cat: ", err);
    });
};

exports.findByName = (cat) => {
  var uuid = uuidv4();
  return Cat.findOrCreate({
    where: {
      id:uuid,
      category: cat
    },
    defaults: {
      category: cat
    }
  }).catch(function (err) {
    console.log(err);
  }).then(function (category) {
    return category;
  });



}