module.exports = app => {
  let userAccountController = require('../controllers/user-controller.js');
  var router = require("express").Router();

  // Create a new User
  router.post("/", userAccountController.create);
  router.put("/", userAccountController.update);
  router.get("/", userAccountController.view);

  app.use('/api/accounts', router);
};
