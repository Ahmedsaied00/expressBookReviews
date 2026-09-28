const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

// تسجيل الدخول (Task 7)
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// إضافة أو تعديل تقييم (Task 8)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
      let review = req.body.review;
      let reviewer = req.session.authorization['username'];
      if(review) {
          book.reviews[reviewer] = review;
          books[isbn] = book;
      }
      return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
  }
  else{
      return res.status(404).json({message: "Book not found!"});
  }
});

// مسح تقييم (Task 9)
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let reviewer = req.session.authorization['username'];
  let filtered_review = books[isbn].reviews;
  if (filtered_review[reviewer]){
      delete filtered_review[reviewer];
      return res.status(200).send(`Reviews for the ISBN ${isbn} posted by the user ${reviewer} deleted.`);
  } else {
      return res.status(404).json({message: "Review not found or you are not authorized to delete it."});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;