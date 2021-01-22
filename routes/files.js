const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const filesController = require("../controllers/filesController")

router.post("/",
    auth,
    filesController.uploadFile
)

router.get("/:file",
    filesController.downloadFile,
    filesController.deleteFile
)

module.exports = router