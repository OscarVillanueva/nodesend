const multer = require("multer")
const shortID = require("shortid")
const fs = require("fs")
const Links = require("../models/Link")

exports.uploadFile = async (req, res, next) => {

    const multerConfig = {
        limits: { fileSize: req.user ? 1024 * 1024 * 10 : 1024 * 1024 }, 
        storage: fileStorage = multer.diskStorage({
    
            destination: (req, file, cb) => {
                cb(null, __dirname + "/../uploads" )
            },
    
            filename: (req, file, cb) => {

                const extension = file.originalname.substring( 
                    file.originalname.lastIndexOf("."), 
                    file.originalname.length )

                cb(null, `${shortID.generate()}${extension}`)
            },
    
            // Filtar archivos
            // fileFilter: (req, file, cb) => {
            //     // No aceptar pdf
            //     if ( file.mimetype === "application/pdf" ) return cb( null, true ) 
            // }
        })
    }
    
    const upload = multer( multerConfig ).single("file")
    
    upload( req, res, async (error) =>{

        if( !error ) res.status(200).json({ file: req.file.filename })

        else res.status(500).json({ error })
        
        return next()
    })


}

exports.downloadFile = async ( req, res, next) => {

    // Obtiene el enlace
    const { file } = req.params
    const link = await Links.findOne({ name: file })


    // Le indicamos la ubicación del archivo
    const download = __dirname + "/../uploads/" + file    

    // Le decimos a express que lo descargue
    res.download( download )

    // Eliminar el archivo y la entrada de la base de datos
    // Si las descargas === 1 - Borrar la entrada y el archivo
    if ( link.downloads === 1) {

        // Eliminar el archivo
        req.file = link.name
        
        // Eliminar la entrada de la base de datos
        await Links.findOneAndRemove(link.id)
        
        // Pasamos al siguiente controlador
        next() 

    }
    else {

        // Si las descargas > 1 - Restar 1
        link.downloads = link.downloads - 1
        await link.save()

    }

}

exports.deleteFile = async (req, res, next) => {
    
    try {
        
        // Eliminar un archivo
        fs.unlinkSync(__dirname + `/../uploads/${req.file}`)

    } catch (error) {
        console.log(error);
    }
    
}