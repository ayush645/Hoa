// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const {
    createPropertyCommitiCtrl,
    getAllPropertyCommitiCtrl,
    deletePropertyCommitiCtrl,
    getPropertyCommitiCtrl
} = require('../controllers/PropertyCommitiCtrl');

router.post('/create', createPropertyCommitiCtrl);
router.get('/getAll/:id', getAllPropertyCommitiCtrl);
router.get('/getAll', getPropertyCommitiCtrl);
router.delete('/delete/:id', deletePropertyCommitiCtrl);
module.exports = router;
