const db = require("../models");
const bcrypt = require('bcrypt');
const auth = require('basic-auth');
const saltRounds = 10;
const User = db.users;
const { v4: uuidv4 } = require('uuid');
const RegexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const RegexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;

// Create and Save a new User
exports.create = (req, res) => {
  var uuid = uuidv4();
  var dateval = new Date();
  dateval = dateval.toISOString();
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var email_address = req.body.email_address;
  var password = req.body.password;

  var passwordlength = password.length;
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
          password: hash,
          createdat:dateval,
          updatedat:dateval,
        };
        User.create(user)
          .then(data => {
            res.status(201).send(data);
          })
          .catch(err => {
            res.status(400).send("User with this email_address already exists, please try with different email_address.");
          });
      });
    });
  }
};


exports.update = (req, res) => {

  var userCredentials = auth(req);
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var password = req.body.password;
  var email_address = req.body.email_address;
  var createdat = req.body.createdat;
  var updatedat = req.body.updatedat;
  var currentDate = new Date();
  currentDate = currentDate.toISOString();

  var isStrongPassword = RegexPassword.test(password);

  if (!userCredentials) {
    res.send('Access denied')
  } else if (email_address || createdat || updatedat) {
    res.status(400).send({
      Message: "User can only update first_name,last_name and password"
    });
  } else if (!password && isStrongPassword) {
    res.status(400).send({
      Message: "Input Password should be 8 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter !"
    });
  } else {
    var username = userCredentials.name;
    var password = userCredentials.pass;

    User.findAll({
      where: {
        email_address: username
      }
    }).then(function (result) {
      var valid = bcrypt.compareSync(password, result[0].password);

      if (valid) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(req.body.password, salt, function (err, hash) {
           
            User.update({
                    first_name: first_name,
                    last_name: last_name,
                    password: hash,
                    updatedat: currentDate
                  }, {
              where: { email_address: username }
            })
              .then(num => {
                if (num == 1) {
                  res.send({
                    message: "user was updated successfully."
                  });
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
        res.end('Access denied')
      }
    }).catch(function (err) {
      console.log(err);
    });
  }

}

//get user information
exports.view = (req, res) => {
    var userCredentials = auth(req);
    var username = userCredentials.name;
    var password = userCredentials.pass;

    User.findAll({
      where: {
        email_address: username
      }
    }).then(function (result) {
      var valid = bcrypt.compareSync(password, result[0].password);
      if (valid) {
            User.findAll({
              where: { email_address: username }
            
          }).then(function(result){
                var user = {
                  first_name : result[0].first_name,
                  last_name:result[0].last_name,
                  email_address:result[0].email_address,
                  createdat:result[0].createdat,
                  updatedat:result[0].updatedat

                }
                  res.send(user);
              })
              .catch(err => {
                res.status(500).send({
                  message: "Error fetching user =" + username
                });
              });
      } else {
        res.end('Access denied')
      }
    }).catch(function (err) {
      console.log(err);
    });
}