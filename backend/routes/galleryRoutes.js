// routes/galleryRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const GalleryItem = require('../models/GalleryItem');

const router = express.Router();

// Storage setup for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// POST: Create new gallery item
router.post('/', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'galleries', maxCount: 10 }
]), async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description || !req.files.image) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const image = req.files.image[0].path;

        let galleries = [];

        if (req.body.galleries && typeof req.body.galleries === 'string') {
            // If single object passed as stringified JSON
            galleries = JSON.parse(req.body.galleries);
        } else if (Array.isArray(req.body.galleries)) {
            galleries = req.body.galleries.map((g, i) => ({
                picture: req.files.galleries[i].path,
                picture_description: JSON.parse(g).picture_description
            }));
        }

        const newItem = new GalleryItem({
            name,
            description,
            image,
            galleries
        });

        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET: All gallery items
router.get('/', async (req, res) => {
    try {
        const items = await GalleryItem.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET: Specific gallery item
router.get('/:id', async (req, res) => {
    try {
        const item = await GalleryItem.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// PATCH: Add more pictures to galleries
router.patch('/:id/galleries', upload.single('picture'), async (req, res) => {
    try {
        const item = await GalleryItem.findById(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });

        const picture = req.file.path;
        const { picture_description } = req.body;

        item.galleries.push({ picture, picture_description });
        await item.save();

        res.json(item);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
