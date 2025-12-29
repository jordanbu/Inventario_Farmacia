# Backend - Sistema de Inventario de Farmacia

API REST para la gestión de productos y ventas de farmacia.

## Instalación

```bash
npm install
```

## Configuración

1. Crea un archivo `.env` basado en `.env.example`
2. Configura tus credenciales de Firebase
3. Asegúrate de que `GOOGLE_APPLICATION_CREDENTIALS` apunte a tu archivo de credenciales

## Ejecución

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Endpoints

### Productos
- `GET /api/productos` - Listar todos
- `GET /api/productos/:id` - Obtener uno
- `POST /api/productos` - Crear nuevo
- `PUT /api/productos/:id` - Actualizar
- `DELETE /api/productos/:id` - Eliminar

### Ventas
- `POST /api/ventas` - Procesar venta
- `GET /api/ventas` - Historial de ventas

## Variables de Entorno

```
PORT=3001
GOOGLE_APPLICATION_CREDENTIALS=./ruta/a/credenciales.json
```
