const User = require("../models/User")
const bcrypt = require("bcrypt")
const { validationResult } = require("express-validator")

exports.newUser = async ( req, res ) => {

    // Mostrar mensajes de error de express validator
    const errors = validationResult(req)
    
    if ( !errors.isEmpty() ) return res.status(400).json({errors:  errors.array()})

    // Verificar si el usuario ya esta registrado
    const { email, password } = req.body

    let user = await User.findOne({ email })

    if ( user ) return res.status(400).json({ msg: "El usuario ya esta registrado" })

    try {
        
        // Crear un nuevo usuario
        user = new User(req.body)

        // Hasheamos el password
        const salt = await bcrypt.genSalt(10)

        // Cambiamos la contraseña por la nueva hasheada
        user.password = await bcrypt.hash(password, salt)

        // Guardamos el usuario
        await user.save()
    
        // Respondemos al usuario
        res.json({ msg: "Usuario creado correctamente" })

    } catch (error) {
        
        console.log(error);

        res.status(400).json({ msg: "Hubo un error" })

    }

    
}