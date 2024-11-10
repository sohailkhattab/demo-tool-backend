const express = require('express');
const router = express.Router();
const CustomComponentStandalone = require('../models/CustomComponentStandalone');

router.get('/customComponentStandalone/:name', async (req, res) => {
    try {
      const customComponentStandaloneData = await CustomComponentStandalone.findOne({ name: req.params.name });
      if (!customComponentStandaloneData) {
        return res.status(404).json({ message: 'CustomComponent not found' });
      }
      res.json(customComponentStandaloneData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

router.get('/customComponentStandalone', async (req, res) => {
  try {
    const customComponentStandalones = await CustomComponentStandalone.find();
    res.json(customComponentStandalones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/customComponentStandalone', async (req, res) => {
    const { name, config_en, config_ar } = req.body;

    console.log(req.body);

    if (!name) {
        return res.status(400).json({ message: "Name is required." });
    }  
  
    const newCustomComponentStandalone = new CustomComponentStandalone({
      name,
      config_en,
      config_ar
    });
    try {
      const savedCustomComponentStandalone = await newCustomComponentStandalone.save();
      res.json(savedCustomComponentStandalone);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  
module.exports = router;
