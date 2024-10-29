const mongoose = require('mongoose');

// Component schema for export
// const componentsSchema = new mongoose.Schema({
//   compType: { type: String }, // e.g., 'Accordion', 'Form', 'ButtonCard'
//   config_en: { type: mongoose.Schema.Types.Mixed }, // Store component configuration
//   config_ar: { type: mongoose.Schema.Types.Mixed },
// });
const componentSchema = new mongoose.Schema({
  compType: { type: String }, // e.g., 'Accordion', 'Form', 'ButtonCard'
  config_en: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }, // Configuration for English
  config_ar: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }, // Configuration for Arabic
});

const backgroundSchema = new mongoose.Schema({
  backgroundImage: { type: String},
  backgroundColor: { type: String},
  backgroundSize: { type: String},
  backgroundPosition: { type: String},
  backgroundRepeat: { type: String},
});

// Schema for 'res' objects
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
const exportSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name or identifier for the export
  components: { type: Map, of: componentSchema, required: true }, // Object of components
  // res: [resSchema], // Array of 'res' objects
  background: { type: backgroundSchema, required: true }, // object of background
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Export', exportSchema);
