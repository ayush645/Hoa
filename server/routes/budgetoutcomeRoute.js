// routes/categoryRoutes.js
const express = require('express');
const { createbudgetOutComeCtrl, getAllBudgetOutcomeCtrl, deletebudOutcomeCtrl, getBudgetOutcomeCtrl } = require('../controllers/budgetoutcomeCtrl');
const router = express.Router();

router.post('/create', createbudgetOutComeCtrl);
router.get('/getAll/:id', getAllBudgetOutcomeCtrl);
router.get('/getAll', getBudgetOutcomeCtrl);
router.delete('/delete/:id', deletebudOutcomeCtrl);
module.exports = router;
