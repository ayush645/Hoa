// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const {
    createCategory,
    getAllCategories,

    deleteCategory,
    updateCategoryCtrl
} = require('../controllers/categoryCtrl');

router.post('/create', createCategory);
router.delete('/delete/:id', deleteCategory);
router.get('/getAll', getAllCategories);
router.put('/update/:id', updateCategoryCtrl);
module.exports = router;
