import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import './BrandManager.css';

function BrandManager() {
  const [marcas, setMarcas] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMarcas();
  }, []);

  const fetchMarcas = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/marcas`);
      if (!response.ok) throw new Error('Error al cargar marcas');
      const data = await response.json();
      setMarcas(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
      alert('Error al cargar las marcas');
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
      const response = await fetch(`${API_BASE_URL}/api/marcas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al crear la marca');
      
      alert('Marca creada exitosamente');
      setFormData({ nombre: '', descripcion: '' });
      fetchMarcas();
    } catch (error) {
      console.error('Error creating brand:', error);
      alert('Error al crear la marca: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brand-manager">
      <div className="card">
        <div className="card-header">
          <h3>Gestión de Marcas / Laboratorios</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="brand-form">
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">Nombre de la Marca</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                className="form-control"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Bayer, Pfizer, Roche..."
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
                placeholder="Información adicional del laboratorio..."
                rows="3"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Guardando...' : 'Agregar Marca'}
            </button>
          </form>

          <div className="brand-list mt-4">
            <h4>Marcas Existentes ({marcas.length})</h4>
            {marcas.length === 0 ? (
              <p className="text-muted">No hay marcas creadas aún</p>
            ) : (
              <div className="brands-grid">
                {marcas.map((marca) => (
                  <div key={marca.id} className="brand-item">
                    <h5>{marca.nombre}</h5>
                    {marca.descripcion && (
                      <p className="brand-description">{marca.descripcion}</p>
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

export default BrandManager;
