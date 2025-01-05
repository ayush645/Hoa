// routes/categoryRoutes.js
const express = require('express');
const { createOwnerCtrl, getAllOwnerCtrl, deleteOwnerCtrl, getOwnerCtrl } = require('../controllers/ownerCtrl');
const router = express.Router();

router.post('/create', createOwnerCtrl);
router.get('/getAll/:id', getAllOwnerCtrl);
router.get('/getAll', getOwnerCtrl);
router.delete('/delete/:id', deleteOwnerCtrl);
module.exports = router;
