import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { API_BASE_URL } from '../config/api';
import './SalesChart.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

function SalesChart() {
  const [salesData, setSalesData] = useState([]);
  const [productStats, setProductStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ventas`);
      if (!response.ok) throw new Error('Error al cargar ventas');
      const ventas = await response.json();
      
      processSalesData(ventas);
    } catch (error) {
      console.error('Error fetching sales:', error);
      alert('Error al cargar los datos de ventas');
    } finally {
      setLoading(false);
    }
  };

  const processSalesData = (ventas) => {
    // Estadísticas por producto
    const productMap = {};
    
    ventas.forEach(venta => {
      if (venta.productos && Array.isArray(venta.productos)) {
        venta.productos.forEach(prod => {
          if (!productMap[prod.nombre]) {
            productMap[prod.nombre] = {
              nombre: prod.nombre,
              cantidadVendida: 0,
              totalVentas: 0
            };
          }
          productMap[prod.nombre].cantidadVendida += prod.cantidad || 0;
          productMap[prod.nombre].totalVentas += prod.subtotal || 0;
        });
      }
    });

    const stats = Object.values(productMap)
      .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
      .slice(0, 10); // Top 10 productos

    setProductStats(stats);

    // Ventas por fecha (últimos 7 días)
    const salesByDate = {};
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      salesByDate[dateStr] = 0;
    }

    ventas.forEach(venta => {
      if (venta.fecha) {
        let dateStr;
        if (typeof venta.fecha === 'string') {
          // Formato: "29/12/2025, 10:30"
          dateStr = venta.fecha.split(',')[0];
        } else {
          dateStr = new Date(venta.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
        }
        
        if (salesByDate.hasOwnProperty(dateStr)) {
          salesByDate[dateStr] += venta.total || 0;
        }
      }
    });

    const dailySales = Object.entries(salesByDate).map(([fecha, total]) => ({
      fecha,
      total: parseFloat(total.toFixed(2))
    }));

    setSalesData(dailySales);
  };

  if (loading) {
    return <div className="loading">Cargando estadísticas...</div>;
  }

  return (
    <div className="sales-chart-container">
      <div className="chart-section">
        <h2>Ventas de los Últimos 7 Días</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip formatter={(value) => `Bs ${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" name="Total Ventas (Bs)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h2>Top 10 Productos Más Vendidos</h2>
        <div className="charts-grid">
          <div className="chart-item">
            <h3>Por Cantidad</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="nombre" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="cantidadVendida" fill="#82ca9d" name="Unidades Vendidas" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-item">
            <h3>Por Ingresos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nombre, percent }) => `${nombre}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="totalVentas"
                >
                  {productStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `Bs ${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="stats-summary">
        <h3>Resumen de Productos Vendidos</h3>
        <div className="stats-table">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Unidades Vendidas</th>
                <th>Total Ingresos (Bs)</th>
              </tr>
            </thead>
            <tbody>
              {productStats.map((prod, index) => (
                <tr key={index}>
                  <td>{prod.nombre}</td>
                  <td>{prod.cantidadVendida}</td>
                  <td>Bs {prod.totalVentas.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SalesChart;
