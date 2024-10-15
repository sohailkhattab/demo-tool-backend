const mongoose = require('mongoose');

// Image schema
const imageSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name or identifier for the image
  url: { type: String, required: true },  // URL of the image
  description: { type: String },          // Optional description
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema);
