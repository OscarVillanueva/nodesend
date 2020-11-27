const Links = require("../models/Link")
const shorid = require("shortid")
const bcrypt = require("bcrypt")
const { validationResult } = require("express-validator")

exports.newLink = async (req, res, next) => {
    
    // Mostrar mensajes de error de express validator
    const errors = validationResult(req)
    
    if ( !errors.isEmpty() ) return res.status(400).json({errors:  errors.array()})

    // Crear el objeto de enlace
    const { file_name, name } = req.body

    const link = new Links()
    link.url = shorid.generate()
    link.name = name
    link.file_name = file_name

    // si el usuario esta autenticado
    if ( req.user ) {

        const { password, downloads } = req.body

        // Asignar a enlace en número de descargas
        link.downloads = downloads ? downloads : 1;

        // Asignar un password
        if ( password ) {

            const salt = await bcrypt.genSalt(10)
            link.password = await bcrypt.hash( password, salt )

        }


        // Asignar el autor
        link.author = req.user.id
    }

    //  Almacenar en la base de datos
    try {
        
        await link.save()
        res.status(200).json({ msg: `${link.url}` })

    } catch (error) {
        
        console.log(error);
        res.status(500).json({ msg: "Hubo un error" })

    } finally {
        return next()
    }

}

// Obtener el enlace 
exports.getLink = async ( req, res, next ) => {

    const { url } = req.params

    // Verificar si existe el archivo
    const link = await Links.findOne({ url })
    const { downloads, name } = link

    if ( !link ) {
        res.status(400).json({ msg: "Ese enlace no existe" })
        return next()
    }

    // si el enlace existe
    res.status(200).json({ file: link.name })

    // Si las descargas === 1 - Borrar la entrada y el archivo
    if ( downloads === 1) {

        // Eliminar el archivo
        req.file = name
        
        // Eliminar la entrada de la base de datos
        await Links.findOneAndRemove(req.params.url)
        
        // Pasamos al siguiente controlador
        next() 

    }
    else {

        // Si las descargas > 1 - Restar 1
        link.downloads = link.downloads - 1
        await link.save()

    }
    
}