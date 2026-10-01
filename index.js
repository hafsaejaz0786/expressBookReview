const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const PORT = 5000;
const SECRET_KEY = 'my_secret_key';

// Dummy Database
const books = {
    "1": { title: "Things Fall Apart", author: "Chinua Achebe", reviews: {} },
    "2": { title: "Fairy Tales", author: "Hans Christian Andersen", reviews: {} }
};

const users = [];

// --- ROUTES ---

// 1. Get all books
app.get('/books', (req, res) => {
    res.status(200).json(books);
});

// 2. Get book by ISBN
app.get('/books/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.status(200).json(books[isbn]);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// 3. User Registration
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }
    users.push({ username, password });
    res.status(201).json({ message: "User registered successfully!" });
});

// 4. User Login (JWT Generation)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: "Logged in successfully", token });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});