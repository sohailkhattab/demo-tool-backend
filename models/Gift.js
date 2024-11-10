// models/giftModel.js

const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
    compType: { type: String, required: true }, // e.g., 'Accordion', 'Form', 'ButtonCard'
    config_en: { type: mongoose.Schema.Types.Mixed, required: true }, // Store component configuration
  });

const resSchema = new mongoose.Schema({
    id: { type: String, required: true },
    lifecycleStatus: { type: String, required: true },
    '@type': { type: String, required: true },
    category: { type: String, required: true },
    channel: { type: mongoose.Schema.Types.Mixed }, // Adjust based on actual data type
    characteristics: [{ type: mongoose.Schema.Types.Mixed }], // Array of mixed types
    pattern: [{ type: mongoose.Schema.Types.Mixed }], // Array of mixed types
  });
  
  // Export schema
  const giftSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name or identifier for the export
    res: [resSchema], // Array of 'res' objects
    createdAt: { type: Date, default: Date.now },
  });

module.exports = mongoose.model('Gift', giftSchema);
