import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { comprasEstaticas } from '../models/compras';
import './MisCompras.css';

export const MisCompras = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nombreCliente] = useState('Cliente Demo'); // Nombre estático, sin setNombreCliente porque no cambia
  const navigate = useNavigate();

  useEffect(() => {
    // Simulamos la carga del historial con un pequeño retardo
    setTimeout(() => {
      setCompras(comprasEstaticas);
      setLoading(false);
    }, 400);
  }, []);

  /* Generador de Tickets */
  const descargarTicket = (pedido) => {
    const doc = new jsPDF();

    doc.setFont("helvetica");

    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Patitas Sanas", 20, 25);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("VENTA DE PRODUCTOS Y SERVICIOS", 20, 32);
    doc.text("VETERINARIOS", 20, 37);
    doc.text("Los reyes la paz, Estado de México", 20, 42);

    doc.setLineWidth(0.5);
    doc.roundedRect(130, 15, 60, 25, 3, 3); 
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("RFC: PATS-260621-XYZ", 160, 21, { align: "center" });
    
    doc.setFillColor(0, 0, 0);
    doc.rect(130, 24, 60, 7, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("TICKET DE COMPRA", 160, 29, { align: "center" });
    
    doc.setTextColor(0, 0, 0);
    doc.text(`Nro. ${pedido.id.slice(0, 8).toUpperCase()}`, 160, 37, { align: "center" });

    const fechaFormat = new Date(pedido.fecha).toLocaleDateString('es-MX', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`FECHA: ${fechaFormat}`, 160, 45, { align: "center" });

    // Datos del cliente 
    doc.roundedRect(20, 50, 170, 15, 3, 3);
    
    doc.setFont("helvetica", "bold");
    doc.text("CLIENTE:", 25, 59);
    doc.setFont("helvetica", "normal");
    doc.text(nombreCliente.toUpperCase(), 45, 59); 
    doc.setFont("helvetica", "bold");
    doc.text("FORMA DE PAGO:", 115, 59);
    doc.setFont("helvetica", "normal");
    
    // Establecemos el pago en efectivo
    doc.text("Efectivo (En Sucursal)", 148, 59);
    let startY = 75;
    doc.setLineWidth(0.5);
    doc.rect(20, startY, 170, 8); 
    doc.setFont("helvetica", "bold");
    doc.text("CANT.", 35, startY + 5.5, { align: "center" });
    doc.text("DESCRIPCIÓN", 55, startY + 5.5);
    doc.text("P. UNIT", 140, startY + 5.5);
    doc.text("IMPORTE", 165, startY + 5.5);

    doc.setFont("helvetica", "normal");
    let currentY = startY + 14;
    
    if (pedido.detalles_pedido && pedido.detalles_pedido.length > 0) {
      pedido.detalles_pedido.forEach((detalle) => {
        const nombreProducto = detalle.productos?.nombre || 'Producto no disponible';
        const importe = detalle.precio_unitario * detalle.cantidad;
        
        doc.text(`${detalle.cantidad}`, 35, currentY, { align: "center" });
        doc.text(`${nombreProducto}`, 55, currentY);
        doc.text(`$${detalle.precio_unitario.toFixed(2)}`, 140, currentY);
        doc.text(`$${importe.toFixed(2)}`, 165, currentY);
        
        currentY += 8; 
      });
    } else {
      doc.text("Detalles no disponibles", 55, currentY);
      currentY += 8;
    }

    doc.rect(20, startY + 8, 170, currentY - (startY + 8));
    
    doc.line(50, startY, 50, currentY);   
    doc.line(135, startY, 135, currentY); 
    doc.line(160, startY, 160, currentY); 
    const total = pedido.total;
    const subtotal = total / 1.16;
    const iva = total - subtotal;

    const footerY = currentY + 5;
    
    doc.rect(135, footerY, 55, 24);
    
    doc.line(135, footerY + 8, 190, footerY + 8);
    doc.line(135, footerY + 16, 190, footerY + 16);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("SUBTOTAL", 138, footerY + 5.5);
    doc.text("IVA (16%)", 138, footerY + 13.5);

    doc.setFont("helvetica", "normal");
    doc.text(`$${subtotal.toFixed(2)}`, 185, footerY + 5.5, { align: "right" });
    doc.text(`$${iva.toFixed(2)}`, 185, footerY + 13.5, { align: "right" });
    
    doc.setFillColor(0, 0, 0);
    doc.rect(135, footerY + 16, 55, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL", 138, footerY + 21.5);
    doc.text(`$${total.toFixed(2)}`, 185, footerY + 21.5, { align: "right" });
    
    doc.setTextColor(0, 0, 0); 
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Representación impresa de un comprobante de compra electrónico.", 20, footerY + 10);
    doc.text("Para la entrega, presenta este comprobante impreso o digital en mostrador.", 20, footerY + 14);
    doc.text("¡Gracias por confiar en Patitas Sanas para el cuidado de tu mascota!", 20, footerY + 18);

    doc.save(`Ticket_PatitasSanas_${pedido.id.slice(0, 8)}.pdf`);
  };

  if (loading) return <div className="mc-loading">Cargando tus compras... 🐾</div>;
  
  // ¡Se eliminó el if (error) que estaba rompiendo la aplicación!

  return (
    <div className="mc-container">
      <div className="mc-header-actions">
        <button onClick={() => navigate('/portal-cliente')} className="mc-btn-back">
          ← Volver al Portal
        </button>
      </div>

      <h2 className="mc-title">Mi Historial de Compras</h2>
      
      {compras.length === 0 ? (
        <div className="mc-empty-state">
          <h3>Aún no tienes compras</h3>
          <p>¡Explora nuestro catálogo y consiente a tu mascota!</p>
        </div>
      ) : (
        <div className="mc-grid">
          {compras.map((pedido) => (
            <article key={pedido.id} className="mc-card">
              <header className="mc-card-header">
                <div className="mc-order-info">
                  <span className="mc-order-label">Pedido</span>
                  <span className="mc-order-id">#{pedido.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="mc-order-date">
                  {new Date(pedido.fecha).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </header>

              <div className="mc-card-body">
                <h4 className="mc-items-title">Artículos:</h4>
                <ul className="mc-items-list">
                  {pedido.detalles_pedido && pedido.detalles_pedido.map((detalle) => (
                    <li key={detalle.id} className="mc-item">
                      <span className="mc-item-name">
                        {detalle.productos?.nombre || 'Producto'} 
                        <span className="mc-item-qty"> x{detalle.cantidad}</span>
                      </span>
                      <span className="mc-item-price">
                        ${(detalle.precio_unitario * detalle.cantidad).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <footer className="mc-card-footer">
                <div className="mc-total-container">
                  <span className="mc-total-label">Total pagado:</span>
                  <span className="mc-total-amount">${pedido.total.toFixed(2)}</span>
                </div>
                <button onClick={() => descargarTicket(pedido)} className="mc-btn-ticket">
                  📄 Descargar Ticket
                </button>
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};