import React, { useContext } from 'react';
import { CartContext } from './CartContext';

const ProductCard = ({ producto }) => {
  const { carrito, agregarAlCarrito, decrementarCantidad } = useContext(CartContext);

  const itemEnCarrito = carrito.find(item => item.id === producto.id);
  const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
  
  const stockDisponible = producto.stock - cantidadEnCarrito;
  const sinStock = stockDisponible <= 0;

  return (
    <div className="producto-card">
      <div className="producto-imagen-container">
        <img 
          src={producto.imagen_url} 
          alt={producto.nombre} 
          className="producto-imagen"
          onError={(e) => { e.target.src = 'https://coffeebytes.dev/es/placeholder.png'; }} 
        />
        <span className={`producto-stock-badge ${sinStock ? 'agotado' : ''}`}>
          {sinStock ? 'Agotado' : `Stock: ${stockDisponible}`}
        </span>
      </div>
      <div className="producto-info">
        <h3>{producto.nombre}</h3>
        <p>{producto.descripcion}</p>
        <div className="producto-precio">${producto.precio}</div>
      </div>

      
      {cantidadEnCarrito > 0 ? (
        <div className="contador-contenedor">
          <button 
            onClick={() => decrementarCantidad(producto.id)} 
            className="btn-contador"
          >
            -
          </button>
          <span className="cantidad-contador">{cantidadEnCarrito}</span>
          <button 
            onClick={() => agregarAlCarrito(producto)} 
            className="btn-contador"
            disabled={sinStock}
          >
            +
          </button>
        </div>
      ) : (
        <button 
          onClick={() => agregarAlCarrito(producto)}
          className={`btn-agregar ${sinStock ? 'btn-disabled' : ''}`}
          disabled={sinStock}
        >
          {sinStock ? 'Sin stock suficiente' : 'Agregar al carrito'}
        </button>
      )}
    </div>
  );
};

export default ProductCard;