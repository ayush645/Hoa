// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const { createUnitsCtrl, getAllUnitsCtrl, deleteUnitsCtrl } = require('../controllers/unitsCtrl');

router.post('/create', createUnitsCtrl);
router.get('/getAll/:id', getAllUnitsCtrl);
router.delete('/delete/:id', deleteUnitsCtrl);
module.exports = router;
