const mongoose = require('mongoose');

// Component schema for export
const componentSchema = new mongoose.Schema({
  compType: { type: String, required: true }, // e.g., 'Accordion', 'Form', 'ButtonCard'
  config: { type: mongoose.Schema.Types.Mixed, required: true }, // Store component configuration
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
  components: [componentSchema], // Array of components
  res: [resSchema], // Array of 'res' objects
  background: [backgroundSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Export', exportSchema);
