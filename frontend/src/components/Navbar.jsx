import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Farmacia - Sistema de Inventario
        </Link>
        <ul className="navbar-nav">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/productos" 
              className={`nav-link ${location.pathname === '/productos' ? 'active' : ''}`}
            >
              Productos
            </Link>
          </li>
          <li>
            <Link 
              to="/ventas" 
              className={`nav-link ${location.pathname === '/ventas' ? 'active' : ''}`}
            >
              Ventas
            </Link>
          </li>
          <li>
            <Link 
              to="/historial" 
              className={`nav-link ${location.pathname === '/historial' ? 'active' : ''}`}
            >
              Historial
            </Link>
          </li>
          <li>
            <Link 
              to="/vencimientos" 
              className={`nav-link ${location.pathname === '/vencimientos' ? 'active' : ''}`}
            >
              Vencimientos
            </Link>
          </li>
          <li>
            <Link 
              to="/asistente" 
              className={`nav-link ${location.pathname === '/asistente' ? 'active' : ''}`}
            >
              🤖 Asistente
            </Link>
          </li>
          <li>
            <Link 
              to="/configuracion" 
              className={`nav-link ${location.pathname === '/configuracion' ? 'active' : ''}`}
            >
              Configuración
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
