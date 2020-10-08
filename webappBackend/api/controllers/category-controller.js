
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



exports.addQuestion = async (catId, questionId) => {
  await Cat.findByPk(catId)
    .then((cat) => {
      if (!cat) {
        console.log("cat not found!");
        return null;
      } })
      .catch((err) => {
        console.log(">> Error while adding Question to cat: ", err);
      });

       await Question.findByPk(questionId)
        .then((question) => {
          if (!question) {
            console.log("Question not found!");
           // return null;
          } }).catch((err) => {
            console.log(err);
          });
          const quescat ={ ques_id: questionId, category_id: catId }

           await question_category.create(quescat)
            .then(data => {
              console.log(`>> added Question id=${question.id} to cat id=${cat.id}`);
              //return cat;
            }).catch(err => { console.log(err) })

       
   
};

exports.findByName = async (cat) => {
  var uuid = uuidv4();
  const cate = await Cat.findOrCreate({
    where: {

      category: cat
    },
    defaults: {
      id: uuid,
      category: cat
    }
  }).catch(function (err) {
    console.log(err);
    return null;
  }).then(function (category) {
    return category;
  });
  return cate;


}