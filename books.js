const express = require("express");
const router = express.Router();
const { Book, Author, Genre } = require("../models");

router.get("/", async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [
        { model: Author, attributes: ["name"] },
        { model: Genre, attributes: ["genre_name"] },
      ],
    });
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

router.get("/:book_id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.book_id, {
      include: [{ model: Author }, { model: Genre }],
    });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, author_id, genre_id, price, publication_date, image_url } =
      req.body;
    const newBook = await Book.create({
      title,
      author_id,
      genre_id,
      price,
      publication_date,
      image_url,
    });
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Failed to create book" });
  }
});

router.put("/:book_id", async (req, res) => {
  try {
    const { title, author_id, genre_id, price, publication_date, image_url } =
      req.body;
    const book = await Book.findByPk(req.params.book_id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    book.title = title;
    book.author_id = author_id;
    book.genre_id = genre_id;
    book.price = price;
    book.publication_date = publication_date;
    book.image_url = image_url;
    await book.save();

    res.status(200).json(book);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Failed to update book" });
  }
});

router.delete("/:book_id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.book_id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    await book.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
});

module.exports = router;
