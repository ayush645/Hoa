// routes/categoryRoutes.js
const express = require('express');
const { createOwnerCtrl, getAllOwnerCtrl, deleteOwnerCtrl, getOwnerCtrl, updateOwnerCtrl } = require('../controllers/ownerCtrl');
const router = express.Router();

router.post('/create', createOwnerCtrl);
router.get('/getAll/:id', getAllOwnerCtrl);
router.put('/update/:id', updateOwnerCtrl);
router.get('/getAll', getOwnerCtrl);
router.delete('/delete/:id', deleteOwnerCtrl);
module.exports = router;
