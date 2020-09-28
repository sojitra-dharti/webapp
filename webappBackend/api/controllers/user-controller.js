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
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var password = req.body.password;

  var passwordlength = password.length;
  var isEmailValid = RegexForEmail.test(email);
  var isStrongPassword = RegexPassword.test(password);

  if (!firstname || !lastname || !password || !email) {
    res.status(400).send({
      Message: "please provide firstname, lastname, email, password"
    });
  }
  else if (!isStrongPassword) {
    res.status(400).send({
      Message: "Input Password should be 8 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter"
    });
  } else if (!isEmailValid) {
    res.status(400).send({
      Message: "Please enter a valid email address!"
    });

  } else {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        const user = {
          id: uuid,
          email: req.body.email,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          password: hash,
          createdat:dateval,
          updatedat:dateval,
        };
        User.create(user)
          .then(data => {
            res.status(201).send(data);
          })
          .catch(err => {
            res.status(400).send("User with this email already exists, please try with different email.");
          });
      });
    });
  }
};


exports.update = (req, res) => {

  var userCredentials = auth(req);
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var password = req.body.password;
  var email = req.body.email;
  var createdat = req.body.createdat;
  var updatedat = req.body.updatedat;
  var currentDate = new Date();
  currentDate = currentDate.toISOString();

  var isStrongPassword = RegexPassword.test(password);

  if (!userCredentials) {
    res.send('Access denied')
  } else if (email || createdat || updatedat) {
    res.status(400).send({
      Message: "User can only update firstname,lastname and password"
    });
  } else if (!isStrongPassword) {
    res.status(400).send({
      Message: "Input Password should be 8 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter !"
    });
  } else {
    var username = userCredentials.name;
    var password = userCredentials.pass;

    User.findAll({
      where: {
        email: username
      }
    }).then(function (result) {
      var valid = bcrypt.compareSync(password, result[0].password);

      if (valid) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(req.body.password, salt, function (err, hash) {
           
            User.update({
                    firstname: firstname,
                    lastname: lastname,
                    password: hash,
                    updatedat: currentDate
                  }, {
              where: { email: username }
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
        email: username
      }
    }).then(function (result) {
      var valid = bcrypt.compareSync(password, result[0].password);
      if (valid) {
            User.findAll({
              where: { email: username }
            
          }).then(function(result){
                var user = {
                  firstname : result[0].firstname,
                  lastname:result[0].lastname,
                  email:result[0].email,
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