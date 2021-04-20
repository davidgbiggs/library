/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const createBook = require('../controllers/databaseController.js').createBook;
const getAllBooks = require('../controllers/databaseController.js').getAllBooks;
const getOneBook = require('../controllers/databaseController.js').getOneBook;
const addComment = require('../controllers/databaseController.js').addComment;
const deleteAllBooks = require('../controllers/databaseController.js').deleteAllBooks;
const deleteBookById = require('../controllers/databaseController.js').deleteBookById;


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res, next) {
      getAllBooks(function(error, books) {
        if (error) {
          return next(error);
        } else if (!books) {
          console.log("Missing done() argument");
          return next({ message: "Missing callback argument" });
        } else {
          // status codes break freecodecamp tests
          // res.status(200).send(books);
          res.send(books);
        }
      });
    })
    
    .post(function (req, res, next) {
      const title = req.body.title;

      if (!title) {
        // status codes break freecodecamp tests
        // res.status(400).send('missing required field title');
        res.send('missing required field title');
      } else {
        createBook(title, function(error, savedBook) {
          if (error) {
            return next(error);
          } else if (!savedBook) {
            console.log("Missing done() argument");
            return next({ message: "Missing callback argument" });
          } else {
            // status codes break freecodecamp tests
            // res.status(201).json(savedBook);
            res.json(savedBook);
          }
        });
      }
    })
    
    .delete(function(req, res, next) {
      deleteAllBooks(function (error) {
        if (error) {
          return next(error);
        } else {
          // status codes break freecodecamp tests
          // res.status(200).send('complete delete successful');
          res.send('complete delete successful');
        }
      })
    });

  app.route('/api/books/:id')
    .get(function (req, res, next) {
      const bookId = req.params.id;

      getOneBook(bookId, function(error, book, invalidId) {
        if (error) {
          return next(error);
        } else if (book === undefined) {
          console.log("Missing done() argument");
          return next({ message: "Missing callback argument" });
        } else if (book === null || invalidId) {
          // status codes break freecodecamp tests
          // res.status(404).send('no book exists');
          res.send('no book exists');
        } else {
          // status codes break freecodecamp tests
          // res.status(200).json(book);
          res.json(book);
        }
      })

    })
    
    .post(function(req, res, next) {
      let bookId = req.params.id;
      let comment = req.body.comment;
      
      if (!comment) {
        // status codes break freecodecamp tests
        // res.status(400).send('missing required field comment');
        res.send('missing required field comment');
      } else {
        addComment(bookId, comment, function(error, book, invalidId) {
          if (error) {
            return next(error);
          } else if (book === undefined) {
            console.log("Missing done() argument");
            return next({ message: "Missing callback argument" });
          } else if (book === null || invalidId) {
            // status codes break freecodecamp tests
            // res.status(404).send('no book exists');
            res.send('no book exists');
          } else {
            // status codes break freecodecamp tests
            // res.status(201).json(book);
            res.json(book);
          }
        });
      }
    })
    
    .delete(function(req, res, next){
      const bookId = req.params.id;

      deleteBookById(bookId, function(error, book, invalidId) {
        if (error) {
          return next(error);
        } else if (!book || invalidId) {
          // status codes break freecodecamp tests
          // res.status(404).send('no book exists');
          res.send('no book exists');
        } else {
          // status codes break freecodecamp tests
          // res.status(200).send('delete successful');
          res.send('delete successful');
        }
      });
    });
  
};
