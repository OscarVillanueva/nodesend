const express = require("express")
const router = express.Router()
const { check } = require("express-validator")
const auth = require("../middleware/auth")
const linkController = require("../controllers/linkController")

router.post("/",
    [
        check("name", "Sube un archivo").not().isEmpty(),
        check("file_name", "Sube un archivo").not().isEmpty(),
    ],
    auth,
    linkController.newLink
)

router.get("/",
    linkController.allLinks
)

router.get("/:url",
    linkController.hasPassword,
    linkController.getLink,
)

router.post("/:url",
    linkController.checkPassword,
    linkController.getLink,
)

module.exports = router