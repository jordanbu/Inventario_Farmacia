import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import './ExpirationPage.css';

function ExpirationPage() {
  const [productos, setProductos] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState({
    critical: [],    // < 1 mes (rojo)
    warning: [],     // 1-3 meses (amarillo)
    good: []         // > 3 meses (verde)
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, critical, warning, good

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/productos`);
      if (!response.ok) throw new Error('Error al cargar productos');
      const data = await response.json();
      
      categorizeProducts(data);
      setProductos(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const categorizeProducts = (products) => {
    const today = new Date();
    const oneMonthLater = new Date(today);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    
    const threeMonthsLater = new Date(today);
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

    const critical = [];
    const warning = [];
    const good = [];

    products.forEach(product => {
      if (product.fechaDeVencimiento) {
        const expirationDate = new Date(product.fechaDeVencimiento);
        const daysUntilExpiration = Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24));

        const productWithDays = {
          ...product,
          daysUntilExpiration
        };

        if (expirationDate <= oneMonthLater) {
          critical.push(productWithDays);
        } else if (expirationDate <= threeMonthsLater) {
          warning.push(productWithDays);
        } else {
          good.push(productWithDays);
        }
      }
    });

    // Ordenar por días hasta vencimiento
    critical.sort((a, b) => a.daysUntilExpiration - b.daysUntilExpiration);
    warning.sort((a, b) => a.daysUntilExpiration - b.daysUntilExpiration);
    good.sort((a, b) => a.daysUntilExpiration - b.daysUntilExpiration);

    setFilteredProducts({ critical, warning, good });
  };

  const getDisplayedProducts = () => {
    switch (filter) {
      case 'critical':
        return filteredProducts.critical;
      case 'warning':
        return filteredProducts.warning;
      case 'good':
        return filteredProducts.good;
      default:
        return [...filteredProducts.critical, ...filteredProducts.warning, ...filteredProducts.good];
    }
  };

  const getStatusClass = (daysUntilExpiration) => {
    const today = new Date();
    const oneMonth = 30;
    const threeMonths = 90;

    if (daysUntilExpiration <= oneMonth) {
      return 'critical';
    } else if (daysUntilExpiration <= threeMonths) {
      return 'warning';
    } else {
      return 'good';
    }
  };

  const getStatusText = (daysUntilExpiration) => {
    if (daysUntilExpiration < 0) {
      return `Vencido hace ${Math.abs(daysUntilExpiration)} días`;
    } else if (daysUntilExpiration === 0) {
      return 'Vence hoy';
    } else if (daysUntilExpiration === 1) {
      return 'Vence mañana';
    } else if (daysUntilExpiration <= 30) {
      return `${daysUntilExpiration} días`;
    } else {
      const months = Math.floor(daysUntilExpiration / 30);
      const days = daysUntilExpiration % 30;
      return days > 0 ? `${months} meses y ${days} días` : `${months} meses`;
    }
  };

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  const displayedProducts = getDisplayedProducts();

  return (
    <div className="expiration-page">
      <div className="expiration-header">
        <h1>Control de Vencimientos</h1>
        <p>Monitorea los productos próximos a vencer</p>
      </div>

      <div className="stats-cards">
        <div className="stat-card critical-card" onClick={() => setFilter('critical')}>
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <h3>{filteredProducts.critical.length}</h3>
            <p>Crítico (&lt; 1 mes)</p>
          </div>
        </div>
        <div className="stat-card warning-card" onClick={() => setFilter('warning')}>
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{filteredProducts.warning.length}</h3>
            <p>Advertencia (1-3 meses)</p>
          </div>
        </div>
        <div className="stat-card good-card" onClick={() => setFilter('good')}>
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{filteredProducts.good.length}</h3>
            <p>Bien (&gt; 3 meses)</p>
          </div>
        </div>
      </div>

      <div className="filter-buttons">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todos ({filteredProducts.critical.length + filteredProducts.warning.length + filteredProducts.good.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'critical' ? 'active' : ''}`}
          onClick={() => setFilter('critical')}
        >
          Crítico ({filteredProducts.critical.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'warning' ? 'active' : ''}`}
          onClick={() => setFilter('warning')}
        >
          Advertencia ({filteredProducts.warning.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'good' ? 'active' : ''}`}
          onClick={() => setFilter('good')}
        >
          Bien ({filteredProducts.good.length})
        </button>
      </div>

      <div className="products-table-container">
        {displayedProducts.length === 0 ? (
          <p className="no-products">No hay productos en esta categoría</p>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Código de Barras</th>
                <th>Stock</th>
                <th>Fecha de Vencimiento</th>
                <th>Tiempo Restante</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {displayedProducts.map((product) => (
                <tr key={product.id} className={`row-${getStatusClass(product.daysUntilExpiration)}`}>
                  <td>
                    <div className="product-name">{product.nombre}</div>
                    <div className="product-meta">{product.tipoDeProducto} - {product.marcaLaboratorio}</div>
                  </td>
                  <td>{product.codigoDeBarras}</td>
                  <td>
                    <span className={`stock-badge ${product.stock < 10 ? 'low-stock' : ''}`}>
                      {product.stock} unidades
                    </span>
                  </td>
                  <td>{new Date(product.fechaDeVencimiento).toLocaleDateString('es-ES')}</td>
                  <td>{getStatusText(product.daysUntilExpiration)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(product.daysUntilExpiration)}`}>
                      {getStatusClass(product.daysUntilExpiration) === 'critical' && '🚨 Crítico'}
                      {getStatusClass(product.daysUntilExpiration) === 'warning' && '⚠️ Advertencia'}
                      {getStatusClass(product.daysUntilExpiration) === 'good' && '✅ Bien'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ExpirationPage;
