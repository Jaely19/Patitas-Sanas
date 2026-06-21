import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Al iniciar, verificamos si hay un carrito guardado en el navegador
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('carritoPatitasSanas');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  // 2. Cada vez que 'carrito' cambie, actualizamos el almacenamiento local
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

  const eliminarDelCarrito = (id) => {
    setCarrito((prevCarrito) => prevCarrito.filter(item => item.id !== id));
  };

  // 3. Función para limpiar el carrito una vez que se paga en el portal
  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem('carritoPatitasSanas');
  };

  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito }}>
      {children}
    </CartContext.Provider>
  );
};