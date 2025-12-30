import { useState } from 'react';
import CategoryManager from '../components/CategoryManager';
import BrandManager from '../components/BrandManager';
import './SettingsPage.css';

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('categorias');

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Configuración del Sistema</h1>
        <p>Gestiona las categorías y marcas de productos</p>
      </div>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'categorias' ? 'active' : ''}`}
          onClick={() => setActiveTab('categorias')}
        >
          <span className="tab-icon">📁</span>
          Categorías
        </button>
        <button
          className={`tab-button ${activeTab === 'marcas' ? 'active' : ''}`}
          onClick={() => setActiveTab('marcas')}
        >
          <span className="tab-icon">🏢</span>
          Marcas / Laboratorios
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'categorias' && <CategoryManager />}
        {activeTab === 'marcas' && <BrandManager />}
      </div>
    </div>
  );
}

export default SettingsPage;
