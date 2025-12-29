import { useState, useEffect } from 'react';
import { productService, salesService } from '../services/api';
import './SalesPage.css';

function SalesPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      alert('Error al cargar productos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product.id);

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
        alert(`Se añadió una unidad más de "${product.nombre}" al carrito.`);
      } else {
        alert(`No hay suficiente stock de "${product.nombre}". Stock disponible: ${product.stock}`);
      }
    } else {
      if (product.stock > 0) {
        setCart([...cart, {
          productId: product.id,
          name: product.nombre,
          price: product.precio,
          quantity: 1,
          maxStock: product.stock
        }]);
        alert(`"${product.nombre}" añadido al carrito.`);
      } else {
        alert(`"${product.nombre}" no tiene stock disponible.`);
      }
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      setCart([]);
      alert('Carrito vaciado.');
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const processSale = async () => {
    if (cart.length === 0) {
      alert('El carrito está vacío. Añade productos para procesar la venta.');
      return;
    }

    if (!window.confirm('¿Estás seguro de procesar esta venta?')) {
      return;
    }

    setProcessing(true);
    const itemsToSell = cart.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    try {
      const result = await salesService.create(itemsToSell);
      alert(`Venta procesada exitosamente! ID: ${result.ventaId}, Total: Bs ${result.total.toFixed(2)}`);
      setCart([]);
      await fetchProducts();
    } catch (err) {
      alert('Error al procesar la venta: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="sales-page">
      <div className="grid grid-cols-2">
        {/* Lista de productos */}
        <div className="card">
          <div className="card-header">
            <h2>Productos para Venta</h2>
          </div>
          <div className="card-body">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {loading ? (
              <div className="loading">Cargando productos...</div>
            ) : (
              <ul className="product-sale-list">
                {filteredProducts.length === 0 ? (
                  <li className="text-center text-muted">No se encontraron productos.</li>
                ) : (
                  filteredProducts.map(product => (
                    <li key={product.id} className="product-sale-item">
                      <div>
                        <h5>{product.nombre}</h5>
                        <p className="text-muted">Precio: Bs {product.precio}</p>
                        <p className="text-muted">Stock: {product.stock}</p>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="btn btn-success btn-sm"
                      >
                        Añadir
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Carrito */}
        <div className="card">
          <div className="card-header">
            <h2>Carrito de Ventas</h2>
          </div>
          <div className="card-body">
            {cart.length === 0 ? (
              <p className="text-center text-muted">El carrito está vacío.</p>
            ) : (
              <ul className="cart-list">
                {cart.map(item => (
                  <li key={item.productId} className="cart-item">
                    <div>
                      {item.name} (x{item.quantity})
                    </div>
                    <div className="cart-item-actions">
                      <span>Bs {(item.price * item.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="btn btn-danger btn-sm"
                      >
                        Quitar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <hr className="my-3" />
            <div className="cart-total">
              <strong>Total:</strong>
              <span>Bs {calculateTotal().toFixed(2)}</span>
            </div>

            <button
              onClick={processSale}
              className="btn btn-primary w-full"
              disabled={cart.length === 0 || processing}
            >
              {processing ? 'Procesando...' : 'Procesar Venta'}
            </button>

            <button
              onClick={clearCart}
              className="btn btn-danger w-full mt-3"
              disabled={cart.length === 0}
            >
              Vaciar Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesPage;
