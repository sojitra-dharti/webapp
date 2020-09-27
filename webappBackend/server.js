const express = require("express");
const models = require('./api/models');
const bodyParser = require("body-parser");
const cors = require("cors");
const port =3000;
const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// set port, listen for requests
const PORT = process.env.PORT || 8080;

app.use(cors());
var routes = require('./api/routes/Routes');
routes(app); //register the route

models.sequelize.sync().then(function() {
app.listen(port);
});
console.log('API server started on: ' + port);
