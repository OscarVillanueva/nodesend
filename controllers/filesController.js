const multer = require("multer")
const shortID = require("shortid")
const fs = require("fs")

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

exports.deleteFile = async (req, res, next) => {
    
    try {
        
        // Eliminar un archivo
        fs.unlinkSync(__dirname + `/../uploads/${req.file}`)

    } catch (error) {
        console.log(error);
    }
    
}