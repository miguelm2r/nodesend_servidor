const express = require('express');
const conectarDB = require('./config/db');
const cors = require("cors")

// Crear el servidor
const app = express();

// Habilitar CORS
const opcionesCors = {
    origin: process.env.FRONTENDURL
}
app.use( cors( opcionesCors ))

// Conectar a la base de datos
conectarDB();

console.log('Comenzando Node Send')

// Puerto de la app
const port = process.env.PORT || 4000;

// Habilitar leer los valores de body
app.use(express.json())

// Habilitar carpeta publica
app.use(express.static('uploads'))

// Rutas de la app
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/enlaces', require('./routes/enlaces'))
app.use('/api/archivos', require('./routes/archivos'))

// Arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
})