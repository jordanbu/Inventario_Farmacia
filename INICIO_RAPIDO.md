# 🚀 Inicio Rápido - Sistema de Inventario Farmacia

## Pasos para ejecutar el proyecto:

### 1️⃣ Configurar Backend

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Configurar Firebase
# 1. Descarga tu archivo de credenciales de Firebase
# 2. Colócalo en la carpeta backend/
# 3. Crea un archivo .env con:
PORT=3001
GOOGLE_APPLICATION_CREDENTIALS=./tu-archivo-firebase.json

# Iniciar el servidor
npm run dev
```

✅ El backend estará corriendo en: http://localhost:3001

---

### 2️⃣ Configurar Frontend

```bash
# Navegar a la carpeta frontend (en otra terminal)
cd frontend

# Verificar la configuración en js/config.js
# Debe apuntar a: http://localhost:3001

# Abrir en el navegador
# Opción 1: Doble clic en index.html
# Opción 2: Usar Live Server en VS Code
# Opción 3: Python server
python -m http.server 8000
```

   El frontend estará en: http://localhost:3000

---

## 📝 Credenciales de Firebase

**IMPORTANTE:** Necesitas configurar Firebase antes de usar la aplicación.

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Ve a Configuración del proyecto > Cuentas de servicio
4. Genera una nueva clave privada (archivo JSON)
5. Guarda el archivo en `backend/` y actualiza `.env`

---

## ✅ Verificar que funciona

1. Abre http://localhost:3001 en tu navegador
   - Deberías ver: `{"message": "API de Farmacia funcionando correctamente"}`

2. Abre el frontend (index.html)
   - Deberías ver la interfaz de gestión de productos

3. Prueba agregar un producto

---

## 🆘 Problemas Comunes

**Backend no inicia:**
- Verifica que Node.js esté instalado: `node --version`
- Verifica que las dependencias estén instaladas
- Revisa el archivo `.env`

**Frontend no carga datos:**
- Abre la consola del navegador (F12)
- Verifica que el backend esté corriendo
- Verifica la URL en `frontend/js/config.js`

**Error de Firebase:**
- Verifica que el archivo de credenciales exista
- Verifica la ruta en `.env`
- Verifica que el proyecto de Firebase esté activo

---

## 📁 Estructura del Proyecto

```
Inventario_Farmacia/
│
├── backend/              ← Servidor Node.js + Express
│   ├── server.js
│   ├── routes.js
│   ├── firebase.js
│   └── package.json
│
├── frontend/             ← Aplicación web
│   ├── index.html
│   ├── ventas.html
│   ├── historial-ventas.html
│   ├── css/
│   └── js/
│
└── README.md            ← Documentación completa
```

---

**¿Necesitas ayuda?** Revisa el README.md principal para más detalles.
