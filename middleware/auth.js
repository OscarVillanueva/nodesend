const jwt = require("jsonwebtoken")
require("dotenv").config({ path: "variables.env" })

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization")

    if( authHeader ) {
        
        // Obtener el token
        const token = authHeader.split(" ")[1]

        try {
            
            // Comprobar el token
            const user = jwt.verify( token, process.env.SECRET )

            // Asignamos el suario en el request
            req.user = user

        } catch (error) {

            // indicamos que el token no es valido
            req.user = null

        } finally {
            return next()
        }

    }
    else {
        
        req.user = null
        return next()
        
    }
}