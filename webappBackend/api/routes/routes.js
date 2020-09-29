module.exports = app => {
  let userController = require('../controllers/user-controller.js');

  // Create a new User
  app.post('/v1/user', userController.create);
  //update user
  app.put('/v1/user/self', userController.update);
  //view user
  app.get('/v1/user/self', userController.view);

};
