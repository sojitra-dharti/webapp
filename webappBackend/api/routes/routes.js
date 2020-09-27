module.exports = app => {
  let userAccountController = require('../controllers/UserController.js');
  var router = require("express").Router();

  // Create a new User
  router.post("/", userAccountController.create);

  app.use('/api/accounts', router);
};
