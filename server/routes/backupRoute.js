const express = require("express")
const { backup } = require("../controllers/backup")
const router = express.Router()


router.post("/backup" , backup);






module.exports = router