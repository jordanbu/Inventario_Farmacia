import { useState, useEffect } from 'react';
import { salesService } from '../services/api';
import './SalesHistoryPage.css';

function SalesHistoryPage() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('SalesHistoryPage mounted');
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      console.log('Fetching sales...');
      const data = await salesService.getAll();
      console.log('Sales data received:', data);
      setSales(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching sales:', err);
      setError('Error al cargar el historial de ventas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (sales.length === 0) {
      alert('No hay ventas para imprimir.');
      return;
    }
    window.print();
  };

  console.log('Render - Loading:', loading, 'Error:', error, 'Sales count:', sales.length);

  if (loading) {
    return (
      <div className="card" style={{ minHeight: '400px' }}>
        <div className="card-header">
          <h2>Historial de Ventas</h2>
        </div>
        <div className="card-body">
          <div className="loading" style={{ fontSize: '18px', padding: '40px', textAlign: 'center' }}>
            Cargando historial...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ minHeight: '400px' }}>
        <div className="card-header">
          <h2>Historial de Ventas</h2>
        </div>
        <div className="card-body">
          <div className="error" style={{ color: 'red', padding: '20px', fontSize: '16px', backgroundColor: '#fee', borderRadius: '8px' }}>
            {error}
          </div>
          <button onClick={fetchSales} className="btn btn-primary mt-3">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sales-history-page" style={{ minHeight: '400px' }}>
      <div className="card">
        <div className="card-header">
          <h2>Historial de Ventas</h2>
        </div>
        <div className="card-body">
          {sales.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', fontSize: '18px', color: '#666' }}>
              No hay ventas registradas.
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="sales-table">
                  <thead>
                    <tr>
                      <th>ID Venta</th>
                      <th>Fecha</th>
                      <th>Productos</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map(sale => (
                      <tr key={sale.id}>
                        <td>{sale.id || 'N/A'}</td>
                        <td>{sale.fecha || 'Fecha no disponible'}</td>
                        <td>
                          <ul className="product-details-list">
                            {sale.productos && sale.productos.length > 0 ? (
                              sale.productos.map((p, idx) => (
                                <li key={idx}>
                                  <strong>{p.nombre || 'Producto Desconocido'}</strong> (x{p.cantidad || 0})
                                - Bs {(p.precioUnitario || 0).toFixed(2)} c/u
                                  <br />
                                  <small>
                                    Tipo: {p.tipoDeProducto || 'N/A'} | Venc: {p.fechaDeVencimiento || 'N/A'}
                                  </small>
                                  <br />
                                  <small>
                                    Cód: {p.codigoDeBarras || 'N/A'} | Lab: {p.marcaLaboratorio || 'N/A'}
                                  </small>
                                </li>
                              ))
                            ) : (
                              <li>No hay detalles de productos</li>
                            )}
                          </ul>
                        </td>
                        <td>
                          <strong className="total-amount">
                            Bs {(sale.total || 0).toFixed(2)}
                          </strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button onClick={handlePrint} className="btn btn-primary w-full mt-3">
                Imprimir Historial de Ventas
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SalesHistoryPage;
