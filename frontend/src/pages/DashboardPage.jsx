import SalesChart from '../components/SalesChart';
import './DashboardPage.css';

function DashboardPage() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>📊 Panel de Estadísticas</h1>
        <p>Análisis de ventas y productos</p>
      </div>
      <SalesChart />
    </div>
  );
}

export default DashboardPage;
