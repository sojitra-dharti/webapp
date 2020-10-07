module.exports = app => {
  let userController = require('../controllers/user-controller.js');
  let quesController = require('../controllers/question-controller.js');
  let ansController = require('../controllers/answer-controller.js');

  // Create a new User
  app.post('/v1/user', userController.create);
  //update user
  app.put('/v1/user/self', userController.update);
  //view user
  app.get('/v1/user/self', userController.view);

  //Get user information by Id
  app.get('/v1/user/:id',userController.viewById);

//*******************QUESTION APIS **********************

  //get all question
  app.get('/v1/questions',quesController.findAll);
  //get question by id
  app.get('/v1/question/:questionId',quesController.getQuestionById);
  //create question
  app.post('/v1/question',quesController.create);
  //update question
  app.put('/v1/question/:questionId',quesController.updateQuestion);
  app.put('/v1/question/:questionId/answer/:answerId',ansController.updateAnswer);

  app.delete('/v1/question/:questionId',quesController.deleteQuestion);

   //get questions answer
   app.get('/v1/question/:questionId/answer/:answerId',ansController.getAnswerById);//--URL not working
   //Answer question
   app.post('/v1/question/:questionId/answer',ansController.create);

   app.delete('/v1/question/:questionId/answer/:answerId',ansController.deleteAnswer);

};
