// src/index.js
require('dotenv').config(); // Asegúrate de que esto esté al principio si usas .env para otras variables locales
const app = require('./app');

// Render asignará un puerto a través de process.env.PORT
// Para desarrollo local, si process.env.PORT no está definido, usará 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server corriendo en el puerto ${PORT}`);
});