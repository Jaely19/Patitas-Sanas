import React, { useContext } from 'react';
import { CartContext } from './CartContext';
import { useNavigate } from 'react-router-dom'; 
import { jsPDF } from "jspdf"; // 1. Importamos la librería para el PDF
import './Tienda.css';

const Cart = () => {
  // Asegúrate de extraer vaciarCarrito de tu contexto si lo tienes, para limpiar tras la compra
  const { carrito, eliminarDelCarrito } = useContext(CartContext);
  const navigate = useNavigate(); 

  const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  // 2. Función dedicada a construir y descargar el PDF
  const generarTicket = () => {
    const doc = new jsPDF();
    
    // Encabezado del ticket
    doc.setFontSize(20);
    doc.text("Ticket de Compra", 105, 20, { align: "center" });
    
    doc.setFontSize(14);
    doc.text("Patitas Sanas", 105, 30, { align: "center" });
    
    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Cabeceras de la tabla de productos
    doc.setFontSize(12);
    doc.text("Cant.", 20, 45);
    doc.text("Artículo", 40, 45);
    doc.text("Subtotal", 160, 45);
    
    let y = 55; // Posición vertical inicial para la lista
    
    // 3. Iteramos sobre tu estado 'carrito' para pintar cada producto
    carrito.forEach((item) => {
      doc.text(`${item.cantidad}`, 20, y);
      doc.text(`${item.nombre}`, 40, y);
      doc.text(`$${(item.precio * item.cantidad).toFixed(2)}`, 160, y);
      y += 10; // Bajamos 10 unidades por cada producto
    });

    // Línea separadora final
    doc.line(20, y, 190, y);
    y += 10;

    // Imprimir Total
    doc.setFontSize(14);
    doc.text(`Total Pagado: $${total.toFixed(2)}`, 160, y, { align: "right" });

    // Imprimir Fecha
    const fecha = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(`Fecha de emisión: ${fecha}`, 20, y + 20);

    // Guardar el documento
    doc.save("ticket_patitas_sanas.pdf");
  };

  // 4. Nueva función para procesar la acción del botón
  const procesarPago = () => {
    // Aquí puedes agregar la lógica para revisar si el usuario está autenticado.
    // Por ejemplo, si tienes un estado 'usuarioLogueado':
    // if (!usuarioLogueado) { navigate('/login'); return; }

    // Si ya validaste que puede comprar:
    generarTicket();
    alert("¡Pago procesado con éxito! Se descargará tu ticket.");
    
    // Opcional: vaciarCarrito(); si tienes la función en tu CartContext
  };

  return (
    <div className="ticket-container">
      <h2>Ticket de Compra 🛒</h2>
      
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
          
          {/* 5. Actualizamos el botón para que ejecute la lógica del ticket */}
          <button className="btn-pagar" onClick={procesarPago}>
            Pagar y Generar Ticket
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;