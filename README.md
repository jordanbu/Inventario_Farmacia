# 🏥 Sistema de Inventario de Farmacia

Sistema completo de gestión de inventario para farmacias, separado en Backend (API REST) y Frontend (interfaz web).

## 📁 Estructura del Proyecto

```
Inventario_Farmacia/
├── backend/                 # Servidor Node.js + Express + Firebase
│   ├── server.js           # Servidor principal
│   ├── routes.js           # Rutas de la API
│   ├── firebase.js         # Configuración de Firebase
│   ├── package.json        # Dependencias del backend
│   ├── .env.example        # Ejemplo de variables de entorno
│   └── .gitignore
│
└── frontend/               # Aplicación web con React + Vite
    ├── src/
    │   ├── components/     # Componentes reutilizables
    │   ├── pages/          # Páginas principales
    │   ├── services/       # Servicios API
    │   ├── config/         # Configuración
    │   ├── App.jsx         # Componente principal
    │   └── main.jsx        # Punto de entrada
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🚀 Instalación y Configuración

### Backend

1. **Navegar a la carpeta backend:**
   ```bash
   cd backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar Firebase:**
   - Descarga tu archivo de credenciales de Firebase (service account key JSON)
   - Colócalo en la carpeta `backend/`
   - Crea un archivo `.env` basado en `.env.example`:
   ```bash
   PORT=3001
   GOOGLE_APPLICATION_CREDENTIALS=./tu-archivo-firebase-key.json
   ```

4. **Iniciar el servidor:**
   ```bash
   # Modo desarrollo (con nodemon)
   npm run dev

   # Modo producción
   npm start
   ```

   El servidor estará disponible en: `http://localhost:3001`

### Frontend

1. **Navegar a la carpeta frontend:**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   copy .env.example .env
   ```
   Edita `.env` y configura:
   ```
   VITE_API_URL=http://localhost:3001
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en: `http://localhost:3000`

## 📡 API Endpoints

### Productos

- **GET** `/api/productos` - Obtener todos los productos
- **GET** `/api/productos/:id` - Obtener un producto específico
- **POST** `/api/productos` - Crear un nuevo producto
- **PUT** `/api/productos/:id` - Actualizar un producto
- **DELETE** `/api/productos/:id` - Eliminar un producto

### Ventas

- **POST** `/api/ventas` - Procesar una nueva venta
- **GET** `/api/ventas` - Obtener historial de ventas

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **Firebase Admin SDK** - Base de datos Firestore
- **CORS** - Manejo de peticiones cross-origin
- **Morgan** - Logger de peticiones HTTP
- **Dotenv** - Gestión de variables de entorno

### Frontend
- **React 18** - Librería de UI
- **Vite** - Build tool ultra-rápido
- **React Router** - Navegación SPA
- **Axios** - Cliente HTTP
- **CSS Modules** - Estilos por componente

## 📋 Funcionalidades

### Gestión de Productos
✅ Agregar nuevos productos con todos sus detalles
✅ Editar productos existentes
✅ Eliminar productos
✅ Visualizar lista completa de productos
✅ Campos: nombre, precio, stock, tipo, fecha de vencimiento, código de barras, laboratorio

### Sistema de Ventas
✅ Buscar productos disponibles
✅ Agregar productos al carrito
✅ Gestionar cantidades
✅ Calcular total automáticamente
✅ Procesar venta (actualiza stock automáticamente)
✅ Validación de stock disponible

### Historial de Ventas
✅ Ver todas las ventas realizadas
✅ Detalles completos de cada venta
✅ Exportar a PDF (función de impresión)
✅ Información de productos vendidos

## 🔧 Configuración para Producción

### Backend
1. Configura las variables de entorno en tu servidor
2. Usa un gestor de procesos como PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name farmacia-backend
   ```
3. Configura CORS para permitir solo tu dominio frontend:
   ```javascript
   app.use(cors({
       origin: 'https://tu-dominio-frontend.com'
   }));
   ```

### Frontend
1. Actualiza `js/config.js` con la URL de producción de tu backend
2. Despliega en servicios como:
   - Netlify
   - Vercel
   - GitHub Pages
   - Firebase Hosting

## 🔐 Seguridad

- ⚠️ **Nunca** subas tu archivo de credenciales de Firebase a Git
- ⚠️ Agrega el archivo `.env` y las credenciales JSON a `.gitignore`
- ⚠️ En producción, restringe CORS a tu dominio específico
- ⚠️ Considera agregar autenticación para proteger la API

## 📝 Notas Importantes

- El backend debe estar ejecutándose antes de usar el frontend
- Asegúrate de que las reglas de Firestore permitan lectura/escritura
- Para desarrollo local, ambos (backend y frontend) pueden correr en diferentes puertos

## 🐛 Solución de Problemas

### Error de CORS
- Verifica que CORS esté habilitado en el backend
- Asegúrate de que la URL en `config.js` sea correcta

### Error de Firebase
- Verifica que `GOOGLE_APPLICATION_CREDENTIALS` apunte al archivo correcto
- Comprueba que tu proyecto de Firebase esté activo

### Productos no se cargan
- Abre la consola del navegador (F12) para ver errores
- Verifica que el backend esté corriendo
- Comprueba la URL de la API en `config.js`

## 👨‍💻 Desarrollo

Para seguir desarrollando:

1. Backend: Modifica `routes.js` para agregar nuevas rutas
2. Frontend: Crea nuevos archivos HTML y JS según necesites
3. Estilos: Modifica `css/styles.css` para personalizar la UI

## 📄 Licencia

ISC

---

**Desarrollado para la gestión eficiente de inventario de farmacia** 💊
