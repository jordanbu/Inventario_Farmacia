# Frontend React - Sistema de Inventario de Farmacia

Aplicación web moderna construida con React + Vite para la gestión de inventario de farmacia.

## 🚀 Tecnologías

- **React 18** - Librería de UI
- **Vite** - Build tool y dev server
- **React Router** - Navegación entre páginas
- **Axios** - Cliente HTTP para comunicación con API
- **CSS Modules** - Estilos componentes

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
copy .env.example .env

# Configurar la URL del backend en .env
VITE_API_URL=http://localhost:3001
```

## 🏃 Ejecución

```bash
# Modo desarrollo (http://localhost:3000)
npm run dev

# Build para producción
npm run build

# Preview del build de producción
npm run preview
```

## 📁 Estructura del Proyecto

```
frontend-react/
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── Navbar.jsx
│   │   ├── ProductList.jsx
│   │   └── ProductForm.jsx
│   ├── pages/            # Páginas principales
│   │   ├── ProductsPage.jsx
│   │   ├── SalesPage.jsx
│   │   └── SalesHistoryPage.jsx
│   ├── services/         # Servicios API
│   │   └── api.js
│   ├── config/           # Configuración
│   │   └── api.js
│   ├── App.jsx           # Componente principal
│   ├── main.jsx          # Punto de entrada
│   └── index.css         # Estilos globales
├── index.html
├── vite.config.js
└── package.json
```

## 🎨 Características

### Gestión de Productos
- ✅ Listar productos
- ✅ Crear nuevos productos
- ✅ Editar productos existentes
- ✅ Eliminar productos
- ✅ Validación de formularios

### Sistema de Ventas
- ✅ Buscar productos
- ✅ Carrito de compras
- ✅ Gestión de cantidades
- ✅ Validación de stock
- ✅ Procesamiento de ventas

### Historial
- ✅ Ver todas las ventas
- ✅ Detalles completos por venta
- ✅ Función de impresión
- ✅ Diseño responsive

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3001
```

### Rutas de la Aplicación

- `/` - Gestión de productos
- `/ventas` - Punto de venta
- `/historial` - Historial de ventas

## 🌐 Comunicación con el Backend

La aplicación se comunica con el backend a través de:

- **Axios** para peticiones HTTP
- **Servicios API** centralizados en `src/services/api.js`
- **Configuración** en `src/config/api.js`

### Endpoints utilizados:

```javascript
GET    /api/productos      // Listar productos
POST   /api/productos      // Crear producto
PUT    /api/productos/:id  // Actualizar producto
DELETE /api/productos/:id  // Eliminar producto
POST   /api/ventas         // Procesar venta
GET    /api/ventas         // Historial de ventas
```

## 🎯 Componentes Principales

### Navbar
Barra de navegación con enlaces a todas las secciones.

### ProductList
Muestra la lista de productos con opciones de edición y eliminación.

### ProductForm
Formulario para crear y editar productos con validación.

### SalesPage
Interfaz de punto de venta con carrito de compras.

### SalesHistoryPage
Tabla de historial de ventas con opción de impresión.

## 📱 Responsive Design

La aplicación está optimizada para:
- 📱 Móviles (320px+)
- 💻 Tablets (768px+)
- 🖥️ Desktop (1024px+)

## 🔐 Consideraciones de Seguridad

- No se almacenan credenciales en el frontend
- Todas las validaciones importantes se hacen en el backend
- CORS configurado en el servidor backend

## 🐛 Solución de Problemas

### Error de conexión con el backend
- Verifica que el backend esté corriendo en el puerto 3001
- Revisa la URL en el archivo `.env`
- Abre la consola del navegador (F12) para ver errores

### Productos no se cargan
- Verifica que el backend tenga Firebase configurado
- Revisa la consola del navegador para errores
- Comprueba que CORS esté habilitado en el backend

### Build falla
```bash
# Limpia node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

## 📝 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
```

## 🚀 Deploy

### Netlify / Vercel
1. Conecta tu repositorio
2. Configura build command: `npm run build`
3. Configura publish directory: `dist`
4. Agrega variable de entorno: `VITE_API_URL`

### Build manual
```bash
npm run build
# Los archivos estarán en la carpeta dist/
```

## 📄 Licencia

ISC

---

**Desarrollado con ⚛️ React + Vite**
