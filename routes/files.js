const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const filesController = require("../controllers/filesController")

router.post("/",
    auth,
    filesController.uploadFile
)

module.exports = router