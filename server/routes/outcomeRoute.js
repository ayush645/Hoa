// routes/categoryRoutes.js
const express = require('express');
const { createOutComeCtrl, getAllOutcomeCtrl, deleteOutcomeCtrl, getOutcomeCtrl, updateMonthsOutcome, getDocumentsByCategory } = require('../controllers/outcomeCtrl');
const router = express.Router();

router.post('/create', createOutComeCtrl);
router.get('/getAll/:id', getAllOutcomeCtrl);
router.get('/getAll', getOutcomeCtrl);
router.delete('/delete/:id', deleteOutcomeCtrl);
router.put('/update/:id', updateMonthsOutcome);

router.get('/document/:categoryId', getDocumentsByCategory);

module.exports = router;
