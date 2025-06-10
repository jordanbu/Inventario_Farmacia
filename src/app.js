// src/app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require("express-handlebars");

const app = express();

// Configuración de Handlebars
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs'
}).engine);
app.set('view engine', '.hbs');

// Middlewares
app.use(morgan('dev')); // Para logging de peticiones en consola
app.use(express.json()); // Para parsear cuerpos de petición JSON
app.use(express.urlencoded({ extended: false })); // Para parsear cuerpos de petición de formularios URL-encoded

// Rutas
app.use(require('./routes/index')); // Tus rutas definidas en routes/index.js

// Archivos estáticos (CSS, JS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
