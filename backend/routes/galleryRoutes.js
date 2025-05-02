// routes/galleryRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const GalleryItem = require("../models/GalleryItem");

const router = express.Router();

// Storage setup for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST: Create new gallery item
router.post("/", async (req, res) => {
  const { name, description, image, galleries } = req.body;

  if (!name || !description || !image) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newItem = new GalleryItem({
    name,
    description,
    image, // image is just a string path, e.g., '/cow.jpg'
    galleries: [],
  });

  await newItem.save();
  res.status(201).json(newItem);
});

// GET: All gallery items
router.get("/", async (req, res) => {
  try {
    const items = await GalleryItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET: Specific gallery item
router.get("/:id", async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH: Add more pictures to galleries
router.patch("/:id/galleries", upload.single("picture"), async (req, res) => {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    const picture = req.file.path;
    const { picture_description } = req.body;

    item.galleries.push({ picture, picture_description });
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
