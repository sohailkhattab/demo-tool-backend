const express = require('express');
const router = express.Router();
const Export = require('../models/Export');

router.post('/export', async (req, res) => {
  const { name, components, background } = req.body;

  const newExport = new Export({
    name,
    components,
    background
  });

  try {
    const savedExport = await newExport.save();
    res.json(savedExport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/exports', async (req, res) => {
  try {
    const exports = await Export.find();
    res.json(exports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/export/:name', async (req, res) => {
    try {
      const exportData = await Export.findOne({ name: req.params.name });
      if (!exportData) {
        return res.status(404).json({ message: 'Export not found' });
      }
      res.json(exportData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.put('/export/:name', async (req, res) => {
  const components = req.body;

  try {
    const updatedExport = await Export.findOneAndUpdate(
      { name: req.params.name },
      { $set: { components } },
      { new: true, runValidators: true }
    );
    if (!updatedExport) {
      return res.status(404).json({ message: 'Export not found' });
    }
    res.json(updatedExport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/export/:name', async (req, res) => {
  try {
    const deletedExport = await Export.findOneAndDelete({ name: req.params.name });
    if (!deletedExport) {
      return res.status(404).json({ message: 'Export not found' });
    }
    res.json({ message: 'Export deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/ap/doNotOpen', async (req, res) => {
  try {
    const exportData = await Export.findOne({ name: 'doNotOpen' });
    if (!exportData) {
      return res.status(404).json({ message: 'Export not found' });
    }
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/ap/doNotOpen/:name', async (req, res) => {
  try {
    const exportData = await Export.findOne({ name: req.params.name });
    if (!exportData) {
      return res.status(404).json({ message: 'Export not found' });
    }
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// // Updated backend route if using componentId instead of _id
// router.delete('/ap/:name/component/:componentId', async (req, res) => {
//   const { name, componentId } = req.params;
//   console.log(name, componentId);

//   const exportData = await Export.findOne({ name });
//   console.log('EXPORTDATA', exportData);
//   const temp = exportData.res;
//   console.log('TEMP', temp);
//   try {
//     const updatedExport = await Export.findOneAndUpdate(
//       { name },
//       { $pull: { temp: { componentId } } }, // Use componentId if _id is not available
//       { new: true }
//     );

//     if (!updatedExport) {
//       return res.status(404).json({ message: 'Export or component not found' });
//     }

//     res.json(updatedExport);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.delete('/ap/:name/component/:id', async (req, res) => {
//   const name = req.params.name;
//   const id = req.params.id;
//   console.log('id', id);

//   try {
//     // Step 1: Find the export document by name
//     const exportData = await Export.findOne({ name });
//     console.log('exportData', exportData);
//     if (!exportData) {
//       return res.status(404).json({ message: 'Export not found' });
//     }

//     // Step 2: Check if the component with the given _id exists inside the components array
//     const componentExists = exportData.res.some((com) => com.id.toString() === id);
//     console.log('HIHIHIHIHI export Data:', exportData);
//     if (!componentExists) {
//       console.log('Component with ID not found:', id); // Log if the component is not found
//       return res.status(404).json({ message: 'Component not found' });
//     } else {
//       console.log('Component found, proceeding to update...'); // Log if the component is found
//     }

//     // Step 3: Attempt to remove the component with the given _id
//     const updatedExport = await Export.findOneAndUpdate(
//       { name },
//       { $pull: { res: { id: id } } }, // Adjust this if your identifier is different
//       { new: true } // Return the updated document
//     );

//     // Step 4: Check if the update was successful
//     if (!updatedExport) {
//       console.log('Update failed. Could not remove component:', id); // Log if the update fails
//       return res.status(500).json({ message: 'Update failed' });
//     }

//     console.log('Update successful:', updatedExport); // Log the updated export document
//     res.json(updatedExport);
//   } catch (error) {
//     console.error('Error during update:', error.message); // Log any errors that occur
//     res.status(500).json({ message: error.message });
//   }
// });

// router.put('/export/:name/component/:id', async (req, res) => {
//   const { name, id } = req.params;

//   try {
//     // Step 1: Find the export document by name
//     const exportData = await Export.findOne({ name });

//     // Check if the export document exists
//     if (!exportData) {
//       return res.status(404).json({ message: 'Export not found' });
//     }

//     // Step 2: Check if the component with the given id exists inside the components array
//     const componentExists = exportData.components.some((component) => component.id === id);

//     if (!componentExists) {
//       console.log('Component with ID not found:', id); // Log if the component is not found
//       return res.status(404).json({ message: 'Component not found' });
//     } else {
//       console.log('Component found, proceeding to update...'); // Log if the component is found
//     }

//     // Step 3: Attempt to remove the component with the given id using $pull
//     const updatedExport = await Export.findOneAndUpdate(
//       { name },
//       { $pull: { components: { id } } }, // Use $pull to remove the component by id
//       { new: true } // Return the updated document
//     );

//     // Step 4: Check if the update was successful
//     if (!updatedExport) {
//       console.log('Update failed. Could not remove component:', id); // Log if the update fails
//       return res.status(500).json({ message: 'Update failed' });
//     }

//     console.log('Update successful:', updatedExport); // Log the updated export document
//     res.json(updatedExport);
//   } catch (error) {
//     console.error('Error during update:', error.message); // Log any errors that occur
//     res.status(500).json({ message: error.message });
//   }
// });


router.delete('/export/:name/res/:id', async (req, res) => {
  const { name, id } = req.params;

  try {
    // Step 1: Find the export document by name
    const exportData = await Export.findOne({ name });

    // Step 2: Check if the export document exists
    if (!exportData) {
      return res.status(404).json({ message: 'Export not found' });
    }

    console.log('exportdata.res[0]',exportData);
    // Step 3: Check if the object with the given id exists in the res array
    const resExists = exportData.res.some((item) => item.id === id);

    if (!resExists) {
      return res.status(404).json({ message: 'Item not found in res array' });
    }

    // Step 4: Use $pull to remove the object from the res array
    const updatedExport = await Export.findOneAndUpdate(
      { name },
      { $pull: { res: { id } } }, // This will remove the object with the matching id from the res array
      { new: true } // Return the updated document
    );

    // Step 5: Return the updated export document or a success message
    res.json(updatedExport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
