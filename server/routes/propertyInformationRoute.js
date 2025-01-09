// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const {
    createPropertyInformationCtrl,
    getAllPropertyInformationCtrl,
    deletePropertyCtrl,
    getPropertyInformationCtrl,
    updatePropertyInformationCtrl,
    getPropertyById,

} = require('../controllers/PropertyInformationsCtrl');

router.post('/create', createPropertyInformationCtrl);
router.get('/getAll/:id', getAllPropertyInformationCtrl);
router.get('/get/:id', getPropertyById);

router.put('/update/:propertyId', updatePropertyInformationCtrl);
router.get('/getAll', getPropertyInformationCtrl);
router.delete('/delete/:id', deletePropertyCtrl);
module.exports = router;
