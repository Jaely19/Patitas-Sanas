import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import './Tienda.css'; 

const Cart = () => {
  const { carrito, eliminarDelCarrito } = useContext(CartContext);

  // Calculamos el total
  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    <div className="ticket-container">
      <h2>Ticket de Compra </h2>
      
      {carrito.length === 0 ? (
        <p className="carrito-vacio">El ticket está vacío. Agrega productos para comenzar.</p>
      ) : (
        <>
          <ul className="lista-ticket">
            {carrito.map((item) => (
              <li key={item.id} className="item-ticket">
                <div className="item-info">
                  <span className="item-nombre">{item.nombre}</span>
                  <span className="item-cantidad">Cant: {item.cantidad} x ${item.precio}</span>
                </div>
                <div className="item-acciones">
                  <span className="item-subtotal">${(item.precio * item.cantidad).toFixed(2)}</span>
                  <button onClick={() => eliminarDelCarrito(item.id)} className="btn-quitar">❌</button>
                </div>
              </li>
            ))}
          </ul>
          
          <div className="ticket-total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <button className="btn-pagar">Cobrar / Pagar</button>
        </>
      )}
    </div>
  );
};

export default Cart;