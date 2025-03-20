// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const { createbudget, deletebudget, getAllbudgets, updateBudgetCtrl } = require('../controllers/budgetCtrl');

router.post('/create', createbudget);
router.delete('/delete/:id', deletebudget);
router.get('/getAll/:id', getAllbudgets);
router.put('/update/:id', updateBudgetCtrl);
module.exports = router;
