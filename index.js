const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

// Crear el servidor
const app = express()

// Connectar a la base de datos
connectDB()

// Habilitar cors
const corsOptions = {
    // Solo se aceptan peticiones de esta url
    origin: process.env.FRONTEND_URL
}
app.use( cors( corsOptions ) )

// Puerto de la app
const port = process.env.PORT || 4000

// Habilitar leer los valores de un body
app.use( express.json() )

// Rutas de la app
app.use("/api/users", require("./routes/users"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/links", require("./routes/links"))
app.use("/api/files", require("./routes/files"))

// Arrancar la app
app.listen(port, "0.0.0.0", () => {
    console.log("El servidor esta funcionando en el puerto", port);
})