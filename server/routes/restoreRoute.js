const express = require("express")
const { restore, upload } = require("../controllers/restore")
const router = express.Router()



router.post("/restore", upload.single("backupFile"), restore);







module.exports = router