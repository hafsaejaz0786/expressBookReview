const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register User
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

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Task 10: Get all books using Async-Await with Axios / Promise
public_users.get('/async-books', async function (req, res) {
  try {
    const getBooks = new Promise((resolve) => {
      resolve(books);
    });
    const bookList = await getBooks;
    res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching book list" });
  }
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/async-isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
  .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
  .catch((err) => res.status(404).json({ message: err }));
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let matchingBooks = [];
  for (let id in books) {
    if (books[id].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push({ isbn: id, ...books[id] });
    }
  }
  res.send({ booksbyauthor: matchingBooks });
});

// Task 12: Get book details based on Author using Promises
public_users.get('/async-author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve) => {
    let matchingBooks = [];
    for (let id in books) {
      if (books[id].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks.push({ isbn: id, ...books[id] });
      }
    }
    resolve(matchingBooks);
  })
  .then((booksList) => res.status(200).send(JSON.stringify({ booksbyauthor: booksList }, null, 4)));
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let matchingBooks = [];
  for (let id in books) {
    if (books[id].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks.push({ isbn: id, ...books[id] });
    }
  }
  res.send({ booksbytitle: matchingBooks });
});

// Task 13: Get book details based on Title using Promises
public_users.get('/async-title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve) => {
    let matchingBooks = [];
    for (let id in books) {
      if (books[id].title.toLowerCase() === title.toLowerCase()) {
        matchingBooks.push({ isbn: id, ...books[id] });
      }
    }
    resolve(matchingBooks);
  })
  .then((booksList) => res.status(200).send(JSON.stringify({ booksbytitle: booksList }, null, 4)));
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
