import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('carritoPatitasSanas');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  useEffect(() => {
    localStorage.setItem('carritoPatitasSanas', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    setCarrito((prevCarrito) => {
      const itemExistente = prevCarrito.find(item => item.id === producto.id);
      if (itemExistente) {
        return prevCarrito.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prevCarrito, { ...producto, cantidad: 1 }];
    });
  };
  const decrementarCantidad = (id) => {
    setCarrito((prevCarrito) => {
      const itemExistente = prevCarrito.find(item => item.id === id);
      if (itemExistente) {
        if (itemExistente.cantidad > 1) {
          return prevCarrito.map(item =>
            item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
          );
        } else {
          return prevCarrito.filter(item => item.id !== id); 
        }
      }
      return prevCarrito;
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prevCarrito) => prevCarrito.filter(item => item.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem('carritoPatitasSanas');
  };

  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito, decrementarCantidad, eliminarDelCarrito, vaciarCarrito }}>
      {children}
    </CartContext.Provider>
  );
};