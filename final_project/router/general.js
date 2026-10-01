const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register User
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });    
    }
  } 
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 1: Get all books
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Task 10: Get all books using Async/Await Axios
public_users.get('/async-books', async function (req, res) {
  try {
    const fetchBooks = await Promise.resolve(books);
    return res.status(200).send(JSON.stringify(fetchBooks, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books list" });
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
  Promise.resolve(books[isbn])
    .then((book) => {
      if (book) {
        return res.status(200).send(JSON.stringify(book, null, 4));
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    })
    .catch((err) => res.status(500).json({ message: err.message }));
});

// Task 3: Get book details based on Author
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

// Task 12: Get book details based on Author using Promises/Async
public_users.get('/async-author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    let matchingBooks = [];
    for (let id in books) {
      if (books[id].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks.push({ isbn: id, ...books[id] });
      }
    }
    return res.status(200).send(JSON.stringify({ booksbyauthor: matchingBooks }, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching author details" });
  }
});

// Task 4: Get all books based on Title
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

// Task 13: Get book details based on Title using Promises/Async
public_users.get('/async-title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    let matchingBooks = [];
    for (let id in books) {
      if (books[id].title.toLowerCase() === title.toLowerCase()) {
        matchingBooks.push({ isbn: id, ...books[id] });
      }
    }
    return res.status(200).send(JSON.stringify({ booksbytitle: matchingBooks }, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error fetching title details" });
  }
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
