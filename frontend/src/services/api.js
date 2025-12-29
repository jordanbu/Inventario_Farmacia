import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Servicio para productos
export const productService = {
  // Obtener todos los productos
  getAll: async () => {
    const response = await axios.get(API_ENDPOINTS.PRODUCTOS);
    return response.data;
  },

  // Obtener un producto por ID
  getById: async (id) => {
    const response = await axios.get(`${API_ENDPOINTS.PRODUCTOS}/${id}`);
    return response.data;
  },

  // Crear un nuevo producto
  create: async (productData) => {
    const response = await axios.post(API_ENDPOINTS.PRODUCTOS, productData);
    return response.data;
  },

  // Actualizar un producto
  update: async (id, productData) => {
    const response = await axios.put(`${API_ENDPOINTS.PRODUCTOS}/${id}`, productData);
    return response.data;
  },

  // Eliminar un producto
  delete: async (id) => {
    const response = await axios.delete(`${API_ENDPOINTS.PRODUCTOS}/${id}`);
    return response.data;
  }
};

// Servicio para ventas
export const salesService = {
  // Procesar una nueva venta
  create: async (items) => {
    const response = await axios.post(API_ENDPOINTS.VENTAS, { items });
    return response.data;
  },

  // Obtener historial de ventas
  getAll: async () => {
    const response = await axios.get(API_ENDPOINTS.VENTAS);
    return response.data;
  }
};
