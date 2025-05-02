// models/GalleryItem.js
const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    picture: { type: String, required: true },
    picture_description: { type: String }
});

const galleryItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    galleries: [gallerySchema]
}, { timestamps: true });

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
