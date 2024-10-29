const express = require('express');
const router = express.Router();
const Gift = require('../models/Gift'); // Import the Gift model

// router.get('/gifts/:name', async (req, res) => {
//     try {
//       const giftData = await Gift.findOne({ name: req.params.name });
//       if (!giftData) {
//         return res.status(404).json({ message: 'Gift not found' });
//       }
//       res.json(giftData);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });

  
// router.delete('/gifts/:name/res/:id', async (req, res) => {
//     const { name, id } = req.params;
  
//     try {
//       // Step 1: Find the export document by name
//       const giftData = await Gift.findOne({ name });
  
//       // Step 2: Check if the export document exists
//       if (!giftData) {
//         return res.status(404).json({ message: 'Gift not found' });
//       }
  
//       console.log('exportdata.res[0]',giftData);
//       // Step 3: Check if the object with the given id exists in the res array
//       const resExists = giftData.res.some((item) => item.id === id);
  
//       if (!resExists) {
//         return res.status(404).json({ message: 'Item not found in res array' });
//       }
  
//       // Step 4: Use $pull to remove the object from the res array
//       const updatedExport = await Gift.findOneAndUpdate(
//         { name },
//         { $pull: { res: { id } } }, // This will remove the object with the matching id from the res array
//         { new: true } // Return the updated document
//       );
  
//       // Step 5: Return the updated export document or a success message
//       res.json(updatedExport);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });
  


module.exports = router;
