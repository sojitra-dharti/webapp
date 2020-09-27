const db = require("../models");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = db.users;
const { v4: uuidv4 } = require('uuid');


// Create and Save a new User
exports.create = (req, res) => {
  var uuid = uuidv4();
  var dateval = new Date();
  dateval = dateval.toISOString();
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
      const user = {
        id : uuid,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: hash
      };
     User.create(user)
        .then(data => {
          res.send(data);
        })
        .catch(err => { 
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the account."
          });
        });
    });
});
    
};