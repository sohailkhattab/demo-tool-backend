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
  // return res.status(200).json(
  //   {"_id":{"$oid":"671f7f7b9a7ec4dc69d5ea84"},"name":"demoP",
  //   "components":{"Banner":{"config_en":{"imageUrl":"assets/images/flexEdited.jpg","addedClass":""},"config_ar":{"imageUrl":"assets/images/flexEdited.jpg","addedClass":""},"_id":{"$oid":"67038c3ef05e0597ee56ca58"}},
  //   "ButtonCard":{"config_en":{"cards":[{"imageUrl":"assets/images/Plus-Logo.png","header":"Renew or Subscribe","path":"https://www.google.com","width":"","height":""}],"marginTop":{"$numberInt":"-5"},"marginBottom":"20px","addedClass":""},"config_ar":{"cards":[{"imageUrl":"assets/images/Plus-Logo.png","header":"Renew or Subscribe","path":"https://www.google.com","width":"","height":""}],"marginTop":{"$numberInt":"-5"},"marginBottom":"20px","addedClass":""},"_id":{"$oid":"67038c3ef05e0597ee56ca59"}},
  //   "AtomLabel":{"config_en":{"text":"Your Gifts","color":"#000000","position":"start","size":{"$numberInt":"18"},"addedClass":""},"config_ar":{"text":"اهلا","color":"#000000","position":"start","size":{"$numberInt":"18"},"addedClass":""},"_id":{"$oid":"67038c3ef05e0597ee56ca5a"}},
  //   "GiftsCard":{"config_en":{"context":"jawwy11","connect":"","connectionType":"Default selection","giftSelectedLayout":"Horizontal","responseKeys":["_id","id","lifecycleStatus","@type","category","channel.id","characteristics.amount","characteristics.OfferValidity","characteristics.OfferValidityUnit","characteristics.bundleOriginalQuota","characteristics.platformId","characteristics.bundleOriginalFees","pattern.trigger","pattern.priority","pattern.validFor.endDateTime","pattern.action.actionType","pattern.action.actionValue","pattern.action.id","pattern.price.value","pattern.price.unit"],"addedClass":"","stepsCardSuccess":{"iconId":"#icon-success","title":"Success","description":"Gift redeemed successfully","btnText":"Ok"},"stepsCardFailure":{"iconId":"#icon-error","title":"Sorry","description":"Something went wrong","btnText":"Ok"},"isStepsModalOpen":false,"confirmationTitle":"Confirm Redemption","confirmationDesc":"Are you sure you want to redeem this gift","confirmationBtnText":"Confirm","cancellationBtnText":"Cancel","DisplayConfirmationModal":"","showDefault":false},"config_ar":{"context":"jawwy11","connect":"","connectionType":"Default selection","giftSelectedLayout":"Horizontal","responseKeys":["_id","id","lifecycleStatus","@type","category","channel.id","characteristics.amount","characteristics.OfferValidity","characteristics.OfferValidityUnit","characteristics.bundleOriginalQuota","characteristics.platformId","characteristics.bundleOriginalFees","pattern.trigger","pattern.priority","pattern.validFor.endDateTime","pattern.action.actionType","pattern.action.actionValue","pattern.action.id","pattern.price.value","pattern.price.unit"],"addedClass":"","stepsCardSuccess":{"iconId":"#icon-success","title":"Success","description":"Gift redeemed successfully","btnText":"Ok"},"stepsCardFailure":{"iconId":"#icon-error","title":"Sorry","description":"Something went wrong","btnText":"Ok"},"isStepsModalOpen":false,"confirmationTitle":"Confirm Redemption","confirmationDesc":"Are you sure you want to redeem this gift","confirmationBtnText":"Confirm","cancellationBtnText":"Cancel","DisplayConfirmationModal":"","showDefault":false},"_id":{"$oid":"67038c3ef05e0597ee56ca5b"}},
  //   "Section":{"config_en":{"header":"How To Win","text":"Everytime you renew the bundle or your flex or plus bundles, you will win up to double megabytes.","imageUrl":"../../../../assets/images/voda-logo-sm.png","displayHeader":true,"displayImage":false,"displayText":true,"position":"start","addedClass":""},"config_ar":{"header":"بهققق","text":"اهستبهاقبختبهقبخ اس هصتبهخقتبختق خصغصس","imageUrl":"../../../../assets/images/voda-logo-sm.png","displayHeader":true,"displayImage":false,"displayText":true,"position":"start","addedClass":""},"_id":{"$oid":"67038c3ef05e0597ee56ca5c"}}},"background":{"backgroundImage":"","backgroundColor":"#ffffff","backgroundSize":"","backgroundRepeat":"","_id":{"$oid":"67038c3ef05e0597ee56ca5d"}},"res":[],"createdAt":{"$date":{"$numberLong":"1728285758739"}},"__v":{"$numberInt":"0"}}
  //   // {"_id":{"$oid":"671f81c69a7ec4dc69d5ea85"},"name":"localTest10","components":{"Banner":{"config_en":{"imageUrl":"assets/images/flexEdited.jpg","addedClass":""},"config_ar":{"imageUrl":"assets/images/flexEdited.jpg","addedClass":""},"_id":{"$oid":"671f6a729f39ab25a8f05be3"}},"Section":{"config_en":{"header":"Header1","text":"Some Text","imageUrl":"../../../../assets/images/voda-logo-sm.png","displayHeader":true,"displayImage":true,"displayText":true,"position":"center","addedClass":""},"config_ar":{"header":"اثشيثق","text":"فثءف سةث","imageUrl":"../../../../assets/images/voda-logo-sm.png","displayHeader":true,"displayImage":true,"displayText":true,"position":"center","addedClass":""},"_id":{"$oid":"671f6a729f39ab25a8f05be4"}}},"background":{"backgroundImage":"","backgroundColor":"transparent","backgroundSize":"","backgroundPosition":"","backgroundRepeat":"","_id":{"$oid":"671f6a729f39ab25a8f05be5"}},"createdAt":{"$date":{"$numberLong":"1730112114033"}},"__v":{"$numberInt":"0"}}
  // )
});

router.put('/export/:name', async (req, res) => {
  const { components } = req.body;
  console.log("REQUEST.BODY:  ", req.body);
  console.log("REQUEST.NAME:  ", req.params.name);
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
