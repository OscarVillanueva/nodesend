const authController = require("../controllers/authController")
const express = require("express")
const { check } = require("express-validator")
const auth = require("../middleware/auth")
const router = express.Router()

router.post("/", 
    [
        check("email", "Agrega un email válido").isEmail(),
        check("password", "El password no puede ir vacío").not().isEmpty()
    ],
    authController.authenticateUser
)

router.get("/",
    auth,
    authController.authenticatedUser
)

module.exports = router