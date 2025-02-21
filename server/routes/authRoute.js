const express = require("express")
const { registerCtrl, loginCtrl, updateUserCtrl } = require("../controllers/authCtrl")
const { auth } = require("../middlewares/auth")
const router = express.Router()


router.post("/login", loginCtrl)
router.post("/register", registerCtrl)
router.post("/update",auth, updateUserCtrl)





module.exports = router