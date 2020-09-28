
let chai = require('chai');
let chaiHttp = require('chai-http');
const should = require('should');

chai.use(chaiHttp);

describe('/GET /api/accounts', () => {
    it('it should GET all the users', (done) => {
      chai.request("http://localhost:3000/")
          .get('api/accounts')
          .end((err, res) => {
               console.log(res.body);
            
            done();
          });
    });
});
// const request = require('supertest');
// const express = require('express');
// var bodyParser = require('body-parser');

// const app = express();
// app.use(bodyParser.json())
// require('../api/routes/routes')(app);

// describe('Post /api/accounts', function(req,res) {
//     it('responds with json', function(done) {
//       request(app)
//         .post('/api/accounts')
//         .send({
//             "firstname": "",
//             "lastname": "1",
//             "password": "Parker@649",
//             "email": "1@a.com"})
//         .set('Accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(400)
//         .end(function(err, res) {
//             if (err) return done(err);
//             done();
//           });
//     });
//   });
