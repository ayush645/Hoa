// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const {
    createPropertyCommitiCtrl,
    getAllPropertyCommitiCtrl,
    deletePropertyCommitiCtrl,
    getPropertyCommitiCtrl,
    updatePropertyCommitiCtrl,
    getPropertyCommitiByIdCtrl
} = require('../controllers/PropertyCommitiCtrl');

router.post('/create', createPropertyCommitiCtrl);
router.get('/getAll/:id', getAllPropertyCommitiCtrl);
router.put('/update/:id', updatePropertyCommitiCtrl);
router.get('/get/:id', getPropertyCommitiByIdCtrl);
router.get('/getAll', getPropertyCommitiCtrl);
router.delete('/delete/:id', deletePropertyCommitiCtrl);
module.exports = router;
