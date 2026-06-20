import React, { useContext } from 'react';
import { CartContext } from './CartContext';

const ProductCard = ({ producto }) => {
  const { agregarAlCarrito } = useContext(CartContext);

  return (
    <div className="producto-card">
      {}
      <img 
        src={producto.imagen_url} 
        alt={producto.nombre} 
        className="producto-imagen"
        onError={(e) => { e.target.src = 'https://coffeebytes.dev/es/placeholder.png'; }} 
      />
      <div className="producto-info">
        <h3>{producto.nombre}</h3>
        <p>{producto.descripcion}</p>
        <div className="producto-precio">${producto.precio}</div>
      </div>
      <button 
        onClick={() => agregarAlCarrito(producto)}
        className="btn-agregar"
      >
        Agregar al carrito
      </button>
    </div>
  );
};

export default ProductCard;