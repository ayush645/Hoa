// routes/categoryRoutes.js
const express = require('express');
const { createbudgetOutComeCtrl, getAllBudgetOutcomeCtrl, deletebudOutcomeCtrl, getBudgetOutcomeCtrl, updateBudgetOutcomeCtrl, getBudgetOutcomeDocument } = require('../controllers/budgetoutcomeCtrl');
const router = express.Router();

router.post('/create', createbudgetOutComeCtrl);
router.get('/getAll/:id', getAllBudgetOutcomeCtrl);
router.put('/update/:id', updateBudgetOutcomeCtrl);
router.get('/getAll', getBudgetOutcomeCtrl);
router.get('/document/:categoryId', getBudgetOutcomeDocument);
router.delete('/delete/:id', deletebudOutcomeCtrl);
module.exports = router;
