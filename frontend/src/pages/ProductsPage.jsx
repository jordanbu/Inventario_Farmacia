import { useState, useEffect } from 'react';
import { productService } from '../services/api';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import './ProductsPage.css';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los productos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${nombre}"?`)) {
      return;
    }

    try {
      await productService.delete(id);
      await fetchProducts();
      alert('Producto eliminado exitosamente');
    } catch (err) {
      alert('Error al eliminar el producto: ' + err.message);
    }
  };

  const handleFormSuccess = () => {
    setEditingProduct(null);
    fetchProducts();
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  return (
    <div className="products-page">
      <div className="grid grid-cols-2">
        <div>
          <ProductList
            products={products}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        <div>
          <ProductForm
            editingProduct={editingProduct}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelEdit}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
