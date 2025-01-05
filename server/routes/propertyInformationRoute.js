// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const {
    createPropertyInformationCtrl,
    getAllPropertyInformationCtrl,
    deletePropertyCtrl,
    getPropertyInformationCtrl,

} = require('../controllers/PropertyInformationsCtrl');

router.post('/create', createPropertyInformationCtrl);
router.get('/getAll/:id', getAllPropertyInformationCtrl);
router.get('/getAll', getPropertyInformationCtrl);
router.delete('/delete/:id', deletePropertyCtrl);
module.exports = router;
