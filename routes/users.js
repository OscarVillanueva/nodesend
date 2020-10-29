const userController = require("../controllers/userController")
const express = require("express")
const { check } = require("express-validator")
const router = express.Router()

router.post("/", 
    [
        // Revisar que el nombre no este vacio
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("email", "Agrega un email válido").isEmail(),
        check("password", "El password debe ser de almenos 6 caractares").isLength({min: 6}),
    ],
    userController.newUser
)

module.exports = router