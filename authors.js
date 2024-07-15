const express = require("express");
const router = express.Router();
const { Author, Book } = require("../models");

router.get("/", async (req, res) => {
  try {
    const authors = await Author.findAll({ include: [Book] });
    res.status(200).json(authors);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch authors" });
  }
});

router.get("/:author_id", async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.author_id, {
      include: [Book],
    });
    if (!author) return res.status(404).json({ error: "Author not found" });
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch author" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, biography } = req.body;
    const newAuthor = await Author.create({ name, biography });
    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(500).json({ error: "Failed to create author" });
  }
});

router.put("/:author_id", async (req, res) => {
  try {
    const { name, biography } = req.body;
    const author = await Author.findByPk(req.params.author_id);
    if (!author) return res.status(404).json({ error: "Author not found" });

    author.name = name;
    author.biography = biography;
    await author.save();

    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ error: "Failed to update author" });
  }
});

router.delete("/:author_id", async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.author_id);
    if (!author) return res.status(404).json({ error: "Author not found" });

    await author.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete author" });
  }
});

module.exports = router;
