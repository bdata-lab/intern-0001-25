const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = 6666;

app.use(express.json());
app.use(cors());

let books = [];

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/books", (req, res) => {
  res.json(books);
});

app.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

app.post("/books", (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author || !year) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const newBook = { id: uuidv4(), title, author, year };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put("/books/:id", (req, res) => {
  const { title, author, year } = req.body;
  const book = books.find((b) => b.id === req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });

  if (title) book.title = title;
  if (author) book.author = author;
  if (year) book.year = year;

  res.json(book);
});

app.delete("/books/:id", (req, res) => {
  books = books.filter((b) => b.id !== req.params.id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
