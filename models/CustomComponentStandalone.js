const mongoose = require('mongoose');

// Define schema for grid items
const gridItemSchema = new mongoose.Schema({
    component: {
      type: new mongoose.Schema({
        label: { type: String, default: "Section" },
        category: { type: String, default: "Component" },
        config_en: { type: mongoose.Schema.Types.Mixed, default: {} },
        isPlus: { type: Boolean, default: false }
      }),
      default: null
    },
    isPlus: { type: Boolean, required: true, default: true },
    row: { type: Number, required: true },
    column: { type: Number, required: true },
    span: { type: Number, required: true }
  });
  
  // Define configuration schema for each language (config_en, config_ar)
  const configSchema = new mongoose.Schema({
    gridItems: { type: [gridItemSchema], required: true },
    resizeRows: { type: Number, required: true },
    resizeColumns: { type: Number, required: true },
    bgColor: { type: String, default: "transparent" },
    addedClass: { type: String, default: "" }
  });

const customComponentStandaloneSchema = new mongoose.Schema({
    name: { type: String, required: true },
    config_en: { type: configSchema, required: true },
    config_ar: { type: configSchema, required: true }
});

const CustomComponentStandalone = mongoose.model('CustomComponentStandalone', customComponentStandaloneSchema);
module.exports = CustomComponentStandalone;
