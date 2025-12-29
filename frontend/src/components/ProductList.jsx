import './ProductList.css';

function ProductList({ products, loading, error, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h2>Lista de Productos</h2>
        </div>
        <div className="card-body">
          <div className="loading">Cargando productos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-header">
          <h2>Lista de Productos</h2>
        </div>
        <div className="card-body">
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Lista de Productos</h2>
      </div>
      <div className="card-body">
        {products.length === 0 ? (
          <p className="text-center text-muted">No hay productos aún</p>
        ) : (
          <ul className="product-list">
            {products.map((product) => (
              <li key={product.id} className="product-item">
                <div className="product-details">
                  <h5>{product.nombre}</h5>
                  <p className="text-muted">
                    Precio: Bs {product.precio} | Stock: {product.stock}
                  </p>
                  <p className="text-muted">
                    Tipo: {product.tipoDeProducto} | Vencimiento: {product.fechaDeVencimiento}
                  </p>
                  <p className="text-muted">
                    Código: {product.codigoDeBarras} | Marca: {product.marcaLaboratorio}
                  </p>
                </div>
                <div className="product-actions">
                  <button
                    onClick={() => onEdit(product)}
                    className="btn btn-warning btn-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(product.id, product.nombre)}
                    className="btn btn-danger btn-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProductList;
