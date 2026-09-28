const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// تسجيل مستخدم جديد (Task 6)
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get all books using Async/Await (Axios)
public_users.get('/', async function (req, res) {
  try {
    // هنا بنستدعي الكتب (كمحاكاة لـ Async/Await API call)
    return res.status(200).send(JSON.stringify(books, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// Task 10: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
      if (books[isbn]) {
          resolve(books[isbn]);
      } else {
          reject({status: 404, message: "Book not found"});
      }
  }).then((book) => {
      return res.status(200).json(book);
  }).catch((error) => {
      return res.status(error.status).json({message: error.message});
  });
});
  
// Task 10: Get book details based on author using Async/Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
      let booksByAuthor = [];
      for (let key in books) {
          if (books[key].author === author) {
              booksByAuthor.push(books[key]);
          }
      }
      if(booksByAuthor.length > 0) {
          return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
      } else {
          return res.status(404).json({message: "Author not found"});
      }
  } catch (error) {
      return res.status(500).json({message: "Error filtering by author"});
  }
});

// Task 10: Get all books based on title using Async/Await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
      let booksByTitle = [];
      for (let key in books) {
          if (books[key].title === title) {
              booksByTitle.push(books[key]);
          }
      }
      if(booksByTitle.length > 0) {
          return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
      } else {
          return res.status(404).json({message: "Title not found"});
      }
  } catch (error) {
      return res.status(500).json({message: "Error filtering by title"});
  }
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;