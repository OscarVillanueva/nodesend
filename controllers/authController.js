const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { validationResult } = require("express-validator")
require("dotenv").config({ path: "variables.env" })

exports.authenticateUser = async ( req, res, next ) => {
    
    // Revisar si hay errores
    // Mostrar mensajes de error de express validator
    const errors = validationResult(req)
        
    if ( !errors.isEmpty() ) return res.status(400).json({errors:  errors.array()})

    // Buscar el usuario para ver si esta registrado
    const { email, password } = req.body
    const user = await User.findOne({ email })
   
    // Si no existe el usuario
    if ( !user ) {
        res.status(401).json({ msg: "El usuario no existe" })

        // Para evitar que se siga ejecutando
        return next()
    }

    // Verificar el usuario y autenticar el usuario
    if ( bcrypt.compareSync( password, user.password ) ) {
        
        // Crear JWT
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email
        }, process.env.SECRET, {
            expiresIn: "8h"
        })

        res.status(200).json({ token })
        return next()

    }
    else {
        res.status(401).json({ msg: "Password Incorrecto" });
        return next()
    }

}

// Para verificar si el token es valido
exports.authenticatedUser = async ( req, res, next ) => {

    if ( req.user ) res.status(200).json({ user: req.user })
    else res.status(401).json({ msg: "No autorizado"})
    return next()

}