import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import './CategoryManager.css';

function CategoryManager() {
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categorias`);
      if (!response.ok) throw new Error('Error al cargar categorías');
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Error al cargar las categorías');
    }
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
      const response = await fetch(`${API_BASE_URL}/api/categorias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al crear la categoría');
      
      alert('Categoría creada exitosamente');
      setFormData({ nombre: '', descripcion: '' });
      fetchCategorias();
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Error al crear la categoría: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category-manager">
      <div className="card">
        <div className="card-header">
          <h3>Gestión de Categorías</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">Nombre de la Categoría</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="form-control"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Analgésicos, Antibióticos..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion" className="form-label">Descripción (opcional)</label>
              <textarea
                id="descripcion"
                name="descripcion"
                className="form-control"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción de la categoría..."
                rows="3"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Agregar Categoría'}
            </button>
          </form>

          <div className="category-list mt-4">
            <h4>Categorías Existentes ({categorias.length})</h4>
            {categorias.length === 0 ? (
              <p className="text-muted">No hay categorías creadas aún</p>
            ) : (
              <div className="categories-grid">
                {categorias.map((categoria) => (
                  <div key={categoria.id} className="category-item">
                    <h5>{categoria.nombre}</h5>
                    {categoria.descripcion && (
                      <p className="category-description">{categoria.descripcion}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryManager;
