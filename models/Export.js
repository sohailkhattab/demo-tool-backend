const mongoose = require('mongoose');

// Component schema for export
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
componentSchema.set('discriminatorKey', 'compType');




const backgroundSchema = new mongoose.Schema({
  backgroundImage: { type: String},
  backgroundColor: { type: String},
  backgroundSize: { type: String},
  backgroundPosition: { type: String},
  backgroundRepeat: { type: String},
});

// Export schema
const exportSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name or identifier for the export
  components: { type: Map, of: componentSchema, required: true }, // Object of components
  background: { type: backgroundSchema, required: true }, // object of background
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Export', exportSchema);
