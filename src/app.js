// src/app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require("express-handlebars");

const app = express();

// Configuración de Handlebars
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    // Definición de un helper personalizado para Handlebars.
    // Este helper 'ifeq' compara dos valores y renderiza el contenido
    // si son iguales, útil para asignar clases condicionalmente en el HTML.
    helpers: {
        ifeq: function (a, b, options) {
            if (a === b) {
                return options.fn(this); // Renderiza el bloque si 'a' es igual a 'b'
            }
            return options.inverse(this); // Renderiza el bloque 'else' si 'a' no es igual a 'b'
        }
    }
});

// Registrar el motor de Handlebars con la configuración que incluye el helper
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views')); // Establece la ubicación de las vistas

// Middleware para pasar el objeto 'request' a las vistas.
// Esto permite que las vistas accedan a propiedades del request, como req.path,
// para usar en helpers como 'ifeq' para resaltar enlaces de navegación activos.
app.use((req, res, next) => {
    res.locals.request = req;
    next();
});

// Middlewares
app.use(morgan('dev')); // Para logging de peticiones HTTP en consola
app.use(express.json()); // Para parsear cuerpos de petición JSON (esencial para /new-sale)
app.use(express.urlencoded({ extended: false })); // Para parsear cuerpos de petición de formularios URL-encoded

// Rutas
// Importa y usa las rutas definidas en 'routes/index.js'.
// Todas las peticiones serán manejadas por el router importado.
app.use(require('./routes/index'));

// Archivos estáticos (CSS, JS del cliente, imágenes, etc.)
// Sirve los archivos estáticos desde la carpeta 'public'.
// Por ejemplo, 'main.css' estará disponible en '/main.css'.
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app; // Exporta la instancia de la aplicación Express
