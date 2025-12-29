// backend/server.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Configuración de CORS para permitir peticiones desde el frontend
app.use(cors({
    origin: '*', // En producción, especifica el dominio exacto del frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(morgan('dev')); // Para logging de peticiones HTTP en consola
app.use(express.json()); // Para parsear cuerpos de petición JSON
app.use(express.urlencoded({ extended: false })); // Para parsear cuerpos de petición de formularios URL-encoded

// Rutas API
app.use(routes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API de Farmacia funcionando correctamente' });
});

// Render asignará un puerto a través de process.env.PORT
// Para desarrollo local, si process.env.PORT no está definido, usará 3001
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Servidor Backend corriendo en el puerto ${PORT}`);
    console.log(`📡 API disponible en http://localhost:${PORT}`);
});

module.exports = app;
