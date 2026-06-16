const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {

    if (!isValid(username)) {
      users.push({
        username: username,
        password: password
      });

      return res.status(200).json({
        message: "User successfully registered. Now you can login"
      });
    }

    return res.status(404).json({
      message: "User already exists!"
    });
  }

  return res.status(404).json({
    message: "Unable to register user."
  });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {

    const book = books[isbn];

    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }

  })
  .then((book) => {
    return res.status(200).json(book);
  })
  .catch((err) => {
    return res.status(404).json({
      message: err
    });
  });

});
  
// Get book details based on author using Async/Await + Axios
public_users.get('/author/:author', async function (req, res) {

  const author = req.params.author;

  try {

    const response = await axios.get('http://localhost:5000/');
    const allBooks = response.data;

    const result = {};

    Object.keys(allBooks).forEach(key => {
      if (allBooks[key].author === author) {
        result[key] = allBooks[key];
      }
    });

    if (Object.keys(result).length === 0) {
      return res.status(404).json({
        message: "Author not found"
      });
    }

    return res.status(200).json(result);

  } catch (error) {

    return res.status(500).json({
      message: "Error retrieving books"
    });

  }

});

// Get all books based on title using Async/Await + Axios
public_users.get('/title/:title', async function (req, res) {

  const title = req.params.title;

  try {

    const response = await axios.get('http://localhost:5000/');
    const allBooks = response.data;

    const result = {};

    Object.keys(allBooks).forEach(key => {
      if (allBooks[key].title === title) {
        result[key] = allBooks[key];
      }
    });

    if (Object.keys(result).length === 0) {
      return res.status(404).json({
        message: "Title not found"
      });
    }

    return res.status(200).json(result);

  } catch (error) {

    return res.status(500).json({
      message: "Error retrieving books"
    });

  }

});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;