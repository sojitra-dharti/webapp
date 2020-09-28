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
 var firstname = req.body.firstname;
 var lastname = req.body.lastname;
 var email = req.body.email;
 var password = req.body.password;

 var RegexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
 var RegexPassword =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
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
}
};