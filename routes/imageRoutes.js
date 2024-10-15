// routes/imageRoutes.js
const express = require('express');
const router = express.Router();
const Image = require('../models/Image'); // Adjust the path to your models file

// Route to add an image URL
router.post('/images', async (req, res) => {
  const { name, url, description } = req.body;

  try {
    const newImage = new Image({ name, url, description });
    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get all images
router.get('/images', async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to get an image by its name
router.get('/images/:name', async (req, res) => {
  const name = req.params.name;
  console.log(name);
  try {
    const image = await Image.findOne({ name });

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
