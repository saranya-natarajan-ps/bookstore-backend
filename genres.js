const express = require("express");
const router = express.Router();
const { Genre, Book } = require("../models");

router.get("/", async (req, res) => {
  try {
    const genres = await Genre.findAll({ include: [Book] });
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch genres" });
  }
});

router.get("/:genre_id", async (req, res) => {
  try {
    const genre = await Genre.findByPk(req.params.genre_id, {
      include: [Book],
    });
    if (!genre) return res.status(404).json({ error: "Genre not found" });
    res.status(200).json(genre);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch genre" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { genre_name } = req.body;
    const newGenre = await Genre.create({ genre_name });
    res.status(201).json(newGenre);
  } catch (error) {
    res.status(500).json({ error: "Failed to create genre" });
  }
});

module.exports = router;
