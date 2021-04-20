require("dotenv").config();

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bookSchema = new mongoose.Schema({
  title: String,
  comments: [String],
});

const Book = mongoose.model("Book", bookSchema);

const createBook = function (title, done) {
  const newBook = new Book({title, comments: []});

  return newBook.save((error, savedBook) => {
    if (error) {
      return done(error);
    } else {
      return done(null, savedBook);
    }
  });
};

const getAllBooks = function(done) {
  Book.find({}).lean().exec(function(error, books) {
    if (error) {
      return done(error);
    } else {
      books.forEach((book, i) => {
        books[i].commentcount = book.comments.length;
        delete books[i].comments;
      });
      return done(null, books);
    }
  });
}

const getOneBook = function(bookId, done) {
  let idToUse;
  try {
    idToUse = mongoose.Types.ObjectId(bookId);
  } catch (error) {
    return done(null, {}, true);
  }

  Book.findById(idToUse, function(error, book) {
    if (error) {
      return done(error);
    } else {
      return done(null, book);
    }
  });
}

const addComment = function(bookId, comment, done) {
  let idToUse;
  try {
    idToUse = mongoose.Types.ObjectId(bookId);
  } catch (error) {
    return done(null, {}, true);
  }

  Book.findById(bookId, function(error, book) {
    if (error) {
      return done(error);
    } else if (!book) {
      return done(null, book, false);
    } else {

      book.comments.push(comment);
      return  book.save((error, newBook) => {
        if (error) {
          return done(error);
        } else {
          return done(null, newBook, false);
        }
      })
    }
  })
}

const deleteAllBooks = function(done) {
  Book.collection.drop(function (error) {
    if (error) {
      return done(error);
    } else {
      return done(null);
    }
  });
}

const deleteBookById = function(bookId, done) {
  let idToUse;
  try {
    idToUse = mongoose.Types.ObjectId(bookId);
  } catch (error) {
    return done(null, {}, true);
  }

  Book.findByIdAndRemove(bookId, function (error, book) {
    if (error) {
      return done(error);
    } else {
      return done(null, book, false);
    }
  });
}

exports.BookModel = Book;

exports.createBook = createBook;
exports.deleteAllBooks = deleteAllBooks;
exports.deleteBookById = deleteBookById;
exports.addComment = addComment;
exports.getAllBooks = getAllBooks;
exports.getOneBook = getOneBook;