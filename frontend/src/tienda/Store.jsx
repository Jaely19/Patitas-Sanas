import React, { useState, useEffect, useContext } from 'react';
// ELIMINAMOS EL IMPORT DE SUPABASE
import ProductCard from './ProductCard'; 
import Cart from './Cart'; 
import { Link } from 'react-router-dom';
import { CartContext } from './CartContext';
import { productosEstaticos } from '../models/inventario'; // Importamos el modelo
import './Tienda.css';

const Store = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarTicket, setMostrarTicket] = useState(false);
  const { carrito } = useContext(CartContext);
  const totalArticulos = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  useEffect(() => {
    // Cargamos los productos estáticos y filtramos los que tengan stock > 0
    setTimeout(() => {
      const productosDisponibles = productosEstaticos.filter(prod => prod.stock > 0);
      setProductos(productosDisponibles);
      setLoading(false);
    }, 400);
  }, []);

  if (loading) return <p style={{textAlign: 'center', marginTop: '50px'}}>Cargando catálogo...</p>;

  // ... (El return se queda exactamente igual)
  return (
    <div className="tienda-container">
      <div className="navegacion-tienda flex-nav">
        <Link to="/" className="btn-volver">← Volver al Inicio</Link>
        <h1 className="tienda-titulo">
          {mostrarTicket ? "Finalizar Compra" : "Catálogo Patitas Sanas"}
        </h1>
        <button 
          className="btn-ver-carrito"
          onClick={() => setMostrarTicket(!mostrarTicket)}
        >
          {mostrarTicket ? "← Seguir Comprando" : `Finalizar Compra (${totalArticulos})`}
        </button>
      </div>
      {mostrarTicket ? (
        <div className="ticket-centrado">
          <Cart />
        </div>
      ) : (
        <div className="grid-productos">
          {productos.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Store;