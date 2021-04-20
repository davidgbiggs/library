const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({title: 'test'})
          .end(function(error, res) {
            // status codes break freecodecamp tests
            // assert.strictEqual(res.status, 201, 'response should indicate resource was created');
            assert.isObject(res.body, 'response should be an object');
            assert.property(res.body, '_id', 'The returned book should have an _id property');
            assert.property(res.body, 'title', 'The returned book should have a title property');
            assert.strictEqual(res.body.title, 'test', 'title should be the title from the requiest');
            done();
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .set('content-type', 'application/x-www-form-urlencoded')
          .send({})
          .end(function(error, res) {
            // status codes break freecodecamp tests
            // assert.strictEqual(res.status, 400, 'response should indicate request was invalid');
            assert.strictEqual(res.text, 'missing required field title', 'response should send proper feedback about bad request');
            done();
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function (error, res) {
            // status codes break freecodecamp tests
            // assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function() {
      
      test('Test GET /api/books/[id] with id not in db',  function(done) {
        chai.request(server)
          .get('/api/books/invalid')
          .end(function(error, res) {
            // status codes break freecodecamp tests
            // assert.strictEqual(res.status, 404, 'response should indicate that no book could be found');
            assert.strictEqual(res.text, 'no book exists', 'response should give feedback on invalid request');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done) {
        chai.request(server)
          .get('/api/books')
          .end(function (error, res) {
            const testId = res.body[0]._id;

            chai.request(server)
              .get(`/api/books/${testId}`)
              .end(function (error, res) {
                // status codes break freecodecamp tests
                // assert.strictEqual(res.status, 200);
                assert.property(res.body, 'title', 'response should contain a title property');
                assert.property(res.body, '_id', 'response should contain an _id property');
                assert.property(res.body, 'comments', 'response should contain a comments property');
                assert.isArray(res.body.comments, 'comments property of response should be an array');
                done();
              });
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .get('/api/books')
          .end(function (error, res) {
            const testId = res.body[0]._id;

            chai.request(server)
              .post(`/api/books/${testId}`)
              .set('content-type', 'application/x-www-form-urlencoded')
              .send({comment: 'test comment'})
              .end(function (error, res) {
                // status codes break freecodecamp tests
                // assert.strictEqual(res.status, 201, 'response should indicate a resource was created');
                assert.property(res.body, 'title', 'response should contain a title property');
                assert.property(res.body, '_id', 'response should contain an _id property');
                assert.property(res.body, 'comments', 'response should contain a comments property');
                assert.isArray(res.body.comments, 'comments property of response should be an array');
                done();
              });
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done) {
        chai.request(server)
          .get('/api/books')
          .end(function (error, res) {
            const testId = res.body[0]._id;

            chai.request(server)
              .post(`/api/books/${testId}`)
              .set('content-type', 'application/x-www-form-urlencoded')
              .send({})
              .end(function (error, res) {
                // status codes break freecodecamp tests
                // assert.strictEqual(res.status, 400, 'response should indicate this was a bad request');
                assert.strictEqual(res.text, 'missing required field comment');
                done();
              });
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done) {
        chai.request(server)
              .post(`/api/books/invalid`)
              .set('content-type', 'application/x-www-form-urlencoded')
              .send({comment: 'test comment'})
              .end(function (error, res) {
                // status codes break freecodecamp tests
                // assert.strictEqual(res.status, 404, 'response should indicate the resource was not found');
                assert.strictEqual(res.text, 'no book exists', 'response should give feedback on the issue');
                done();
              });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .get('/api/books')
          .end(function (error, res) {
            const testId = res.body[0]._id;

            chai.request(server)
              .delete(`/api/books/${testId}`)
              .end(function (error, res) {
                // status codes break freecodecamp tests
                // assert.strictEqual(res.status, 200);
                assert.strictEqual(res.text, 'delete successful', 'response should send feedback on the operation');
                done();
              });
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .delete(`/api/books/invalidId`)
          .end(function (error, res) {
            // status codes break freecodecamp tests
            // assert.strictEqual(res.status, 404, 'response should indicate the resource was not found');
            assert.strictEqual(res.text, 'no book exists', 'response should send feedback about the issue to the client');
            done();
        });
      });

    });

  });

});
