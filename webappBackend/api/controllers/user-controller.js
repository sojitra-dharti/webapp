const db = require("../models");
const bcrypt = require('bcrypt');
const auth = require('basic-auth');
const saltRounds = 10;
const User = db.users;
const { v4: uuidv4 } = require('uuid');
const RegexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const RegexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{9,20}$/;
const UserMetrics = require('../../config/metrics-config');
const timeController = require('../controllers/time-controller');
var log4js = require('../../config/log4js');
const logger = log4js.getLogger('logs');


// Create and Save a new User
exports.create = (req, res) => {
 
  logger.info('Creating User');
  var apiStartTime = timeController.GetCurrentTime();
  console.log(apiStartTime);
  UserMetrics.increment('User.Create.ApiCount');

  var uuid = uuidv4();
  var dateval = new Date();
 
  dateval = dateval.toISOString();
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var email_address = req.body.email_address;
  var password = req.body.password;


  var isEmailValid = RegexForEmail.test(email_address);
  var isStrongPassword = RegexPassword.test(password);

  if (!first_name || !last_name || !password || !email_address) {
    res.status(400).send({
      Message: "please provide first_name, last_name, email_address, password"
    });
  }
  else if (!isStrongPassword) {
    res.status(400).send({
      Message: "Input Password should be 8 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter"
    });
  } else if (!isEmailValid) {
    res.status(400).send({
      Message: "Please enter a valid email_address address!"
    });

  } else {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        const user = {
          id: uuid,
          email_address: req.body.email_address,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          password: hash
        };
        var DBStartTime = timeController.GetCurrentTime();
        User.create(user)
          .then(data => {
            var user = {
              id: data.id,
              email_address: data.email_address,
              first_name: data.first_name,
              last_name: data.last_name,
              account_updated: data.account_updated,
              account_created: data.account_created
            }
            console.log(apiStartTime);
            console.log(timeController.GetTimeDifference(apiStartTime));
            UserMetrics.timing('User.Create.DbQueryTime', timeController.GetTimeDifference(DBStartTime));
            UserMetrics.timing('User.Create.ApiTime', timeController.GetTimeDifference(apiStartTime));
            res.status(201).send(user);
          })
          .catch(err => {
            logger.error('error in creating user ' + err);
            res.status(400).send({
              Message: "User with this email_address already exists, please try with different email_address."
            });
          });
      });
    });
  }
};

//update user profile
exports.update = (req, res) => {
  logger.info('Updating User');
  var apiStartTime = timeController.GetCurrentTime();
  UserMetrics.increment('User.Update.ApiCount');
  var userCredentials = auth(req);
  var id = req.body.id;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var password = req.body.password;
  var email_address = req.body.email_address;
  var account_created = req.body.account_created;
  var account_updated = req.body.account_updated;
  var currentDate = new Date();

  var isStrongPassword = RegexPassword.test(password);

  if (!userCredentials) {
    res.send({ Message: 'Access denied'})
  } else if (id || email_address || account_created || account_updated) {
    res.status(400).send({
      Message: "User can only update first_name,last_name and password"
    });
  } else if (!password && isStrongPassword) {
    res.status(400).send({
      Message: "Input Password should be 9 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter !"
    });
  } else {
    var username = userCredentials.name;
    var password = userCredentials.pass;

    User.findAll({
      where: {
        email_address: username
      }
    }).then(function (result) {
      if (result.length == 0) {
        res.status(401).send({Message:"Unauthorized"});
      }
      var valid = bcrypt.compareSync(password, result[0].password);

      if (valid) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(req.body.password, salt, function (err, hash) {
           var DBStartTime = timeController.GetCurrentTime();
            User.update({
              first_name: first_name,
              last_name: last_name,
              password: hash,
              account_updated: currentDate
            }, {
              where: { email_address: username }
            })
              .then(num => {
                if (num == 1) {
                  UserMetrics.timing('User.Update.DbQueryTime', timeController.GetTimeDifference(DBStartTime));
                  UserMetrics.timing('User.Update.ApiTime', timeController.GetTimeDifference(apiStartTime));
                  console.log("User updated successfully");
                  res.status(204).end();
                } else {
                  res.send({
                    message: `Cannot update user with id=${id}. User may not found or information might be empty!`
                  });
                }
              })
              .catch(err => {
                res.status(500).send({
                  message: "Error updating user with id=" + id
                });
              });
          });
        });
      } else {
        res.end({ Message: 'Access denied'})
      }
    }).catch(function (err) {
      logger.error('error in updating user ' + err);
    });
  }

}

//get user information
exports.view = (req, res) => {
  logger.info('Fetching all users');
  var apiStartTime = timeController.GetCurrentTime();
  UserMetrics.increment('User.View.ApiCount');

  var userCredentials = auth(req);
  var username = userCredentials.name;
  var password = userCredentials.pass;

  var DBStartTime = timeController.GetCurrentTime();
  User.findAll({
    where: {
      email_address: username
    }
  }).then(function (result) {
    if (result.length == 0) {
      res.send({
        Message: "No data found !"
      })
    }
    var valid = bcrypt.compareSync(password, result[0].password);
    if (valid) {
      User.findAll({
        where: { email_address: username },
        attributes: ['id', 'first_name', 'last_name', 'email_address', 'account_created', 'account_updated'],

      }).then(function (result) {
        UserMetrics.timing('User.View.DbQueryTime', timeController.GetTimeDifference(DBStartTime));
        UserMetrics.timing('User.View.ApiTime', timeController.GetTimeDifference(apiStartTime));
        res.send(result);
      })
        .catch(err => {
          res.status(500).send({
            message: "Error fetching user =" + username
          });
        });
    } else {
      res.status(401).end('Access denied')
    }
  }).catch(function (err) {
    logger.error('error in fetching user ' + err);
  });
}

exports.findByName = (username) => {
  logger.info('Get user by username');
  return User.findAll({
    where: {
      email_address: username
    }
  }).then(function (result) {
    if (result.length == 0) {
      return null;
    }
    return result;
  }).catch(err => {
    console.log(err);
  });
}

// checks if user is authorized
exports.IsValid = (username, password) => {

  return User.findAll({
    where: {
      email_address: username
    }
  }).then(function (result) {
    if (result.length == 0) {
      return false;
    }
    if (result) {
      var valid = bcrypt.compareSync(password, result[0].password);
      if (valid) {
        return result;
      }
      else {
        return null;
      }
    }

  }).catch(err => {
    console.log(err);
  });
}

exports.viewById = (req, res) => {
  logger.info('Get user by user id');
  var apiStartTime = timeController.GetCurrentTime();
  UserMetrics.increment('User.ViewById.ApiCount');

  var DBStartTime = timeController.GetCurrentTime();


  User.findAll(
    {
      where: {
        id: req.params.id
      }
    }).then(function (result) {
      if (result.length == 0) {
        res.status(400).send({
          Message: "not found!"
        })
      }
      UserMetrics.timing('User.ViewById.DbQueryTime', timeController.GetTimeDifference(DBStartTime));
      UserMetrics.timing('User.ViewById.ApiTime', timeController.GetTimeDifference(apiStartTime));
      res.send(result);
    }).catch(err => {
      console.log(err);
    })
}

exports.IsAuthenticated = async (req, res) => {
  var userCredentials = auth(req);

  if (userCredentials) {
    var username = userCredentials.name;
    var password = userCredentials.pass;

    const existUser = await this.findByName(username);
    if (existUser && bcrypt.compareSync(password, existUser[0].password)) {
      return existUser;
    }
    else {
      res.status(401).send({ Message: "user unauthorized !" })
    }
  }
  else {
    res.status(400).send({ Message: "Please provide user credentials" })
  }
}