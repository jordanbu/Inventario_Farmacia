import { useState, useEffect } from 'react';
import { productService } from '../services/api';
import { API_BASE_URL } from '../config/api';
import './ProductForm.css';

function ProductForm({ editingProduct, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: '',
    tipoDeProducto: '',
    fechaDeVencimiento: '',
    codigoDeBarras: '',
    marcaLaboratorio: ''
  });
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategorias();
    fetchMarcas();
  }, []);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        nombre: editingProduct.nombre || '',
        precio: editingProduct.precio || '',
        stock: editingProduct.stock || '',
        tipoDeProducto: editingProduct.tipoDeProducto || '',
        fechaDeVencimiento: editingProduct.fechaDeVencimiento || '',
        codigoDeBarras: editingProduct.codigoDeBarras || '',
        marcaLaboratorio: editingProduct.marcaLaboratorio || ''
      });
    } else {
      resetForm();
    }
  }, [editingProduct]);

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categorias`);
      if (response.ok) {
        const data = await response.json();
        setCategorias(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchMarcas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/marcas`);
      if (response.ok) {
        const data = await response.json();
        setMarcas(data);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      precio: '',
      stock: '',
      tipoDeProducto: '',
      fechaDeVencimiento: '',
      codigoDeBarras: '',
      marcaLaboratorio: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock, 10)
      };

      if (editingProduct) {
        await productService.update(editingProduct.id, dataToSend);
        alert('Producto actualizado exitosamente');
      } else {
        await productService.create(dataToSend);
        alert('Producto creado exitosamente');
      }

      resetForm();
      onSuccess();
    } catch (err) {
      alert('Error al guardar el producto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">Nombre del producto</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="form-control"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="precio" className="form-label">Precio del producto (Bs)</label>
            <input
              type="number"
              step="0.01"
              id="precio"
              name="precio"
              className="form-control"
              value={formData.precio}
              onChange={handleChange}
              placeholder="Precio en Bs..."
              min="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="stock" className="form-label">Stock del producto</label>
            <input
              type="number"
              id="stock"
              name="stock"
              className="form-control"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Stock..."
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tipoDeProducto" className="form-label">Categoría de Producto</label>
            <select
              id="tipoDeProducto"
              name="tipoDeProducto"
              className="form-select"
              value={formData.tipoDeProducto}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.nombre}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="fechaDeVencimiento" className="form-label">Fecha de Vencimiento</label>
            <input
              type="date"
              id="fechaDeVencimiento"
              name="fechaDeVencimiento"
              className="form-control"
              value={formData.fechaDeVencimiento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="codigoDeBarras" className="form-label">Código de Barras</label>
            <input
              type="text"
              id="codigoDeBarras"
              name="codigoDeBarras"
              className="form-control"
              value={formData.codigoDeBarras}
              onChange={handleChange}
              placeholder="Código de barras..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="marcaLaboratorio" className="form-label">Marca del Laboratorio</label>
            <select
              id="marcaLaboratorio"
              name="marcaLaboratorio"
              className="form-select"
              value={formData.marcaLaboratorio}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una marca</option>
              {marcas.map((marca) => (
                <option key={marca.id} value={marca.nombre}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Agregar')}
          </button>

          {editingProduct && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-danger w-full mt-3"
            >
              Cancelar
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
