// Configuración de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  PRODUCTOS: `${API_URL}/api/productos`,
  VENTAS: `${API_URL}/api/ventas`
};

export default API_URL;
