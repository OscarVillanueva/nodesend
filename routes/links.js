const express = require("express")
const router = express.Router()
const { check } = require("express-validator")
const auth = require("../middleware/auth")
const linkController = require("../controllers/linkController")
const filesController = require("../controllers/filesController")

router.post("/",
    [
        check("name", "Sube un archivo").not().isEmpty(),
        check("file_name", "Sube un archivo").not().isEmpty(),
    ],
    auth,
    linkController.newLink
)

router.get("/:url",
    linkController.getLink,
    filesController.deleteFile
)

module.exports = router