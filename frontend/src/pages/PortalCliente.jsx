import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../tienda/CartContext';
import './PortalCliente.css';

function PortalCliente() {
  const [usuarioNombre, setUsuarioNombre] = useState('');
  const [usuarioId, setUsuarioId] = useState(null); 
  const [cargando, setCargando] = useState(true);
  const [totalMascotas, setTotalMascotas] = useState(0);
  const [citasPendientes, setCitasPendientes] = useState(0);
  const { carrito, vaciarCarrito } = useContext(CartContext);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [errorPago, setErrorPago] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerSesion();
  }, []);

  const obtenerSesion = () => {
    try {
      const sesionActual = localStorage.getItem('currentUser');
      if (!sesionActual) {
        return navigate('/login');
      }

      const cliente = JSON.parse(sesionActual);
      setUsuarioId(cliente.email); 
      setUsuarioNombre(cliente.nombreCompleto || 'Cliente');
      
      fetchEstadisticasCliente(cliente.email);
    } catch (error) {
      console.error("Error al obtener sesión estática:", error.message);
    } finally {
      setCargando(false);
    }
  };

  const fetchEstadisticasCliente = (emailCliente) => {
    try {
      const todasLasMascotas = JSON.parse(localStorage.getItem('patitas_mascotas') || '[]');
      const mascotasDelCliente = todasLasMascotas.filter(m => m.id_cliente === emailCliente);
      setTotalMascotas(mascotasDelCliente.length);

      const todasLasCitas = JSON.parse(localStorage.getItem('patitas_citas') || '[]');
      const citasActivas = todasLasCitas.filter(cita => 
        cita.id_cliente === emailCliente && 
        cita.estado !== 'Cancelada' && 
        cita.estado !== 'Completada'
      );
      setCitasPendientes(citasActivas.length);
    } catch (error) {
      console.error("Error general en estadísticas:", error.message);
    }
  };

  const calcularTotal = () => {
    if (!carrito) return 0; 
    return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  };

  // --- Función añadida para evitar error en el botón de pago ---
  const handleConfirmarPago = () => {
    setProcesandoPago(true);
    setErrorPago(null);
    
    // Simulamos un retraso de pago para la versión estática
    setTimeout(() => {
      setProcesandoPago(false);
      alert("¡Pago simulado exitosamente!");
      if(vaciarCarrito) vaciarCarrito();
    }, 1500);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser'); 
    navigate('/');
  };

  if (cargando) return <p style={{ color: 'gray', padding: '20px', textAlign: 'center' }}>Cargando tu portal...</p>;

  return (
    <div className="portal-wrapper">
      <aside className="portal-sidebar">
        <h2>Patitas<span>Sanas</span></h2>
        <ul className="portal-nav-menu">
          <li><Link to="/portal-cliente" className="active"> Inicio</Link></li>
          <li><Link to="/mis-mascotas"> Mis Mascotas</Link></li>
          <li><Link to="/mis-citas"> Mis Citas</Link></li>
          <li><Link to="/mis-compras"> Mis Compras</Link></li>
          <li><Link to="/agendar-cita"> Agendar Cita</Link></li>
        </ul>
      </aside>

      <main className="portal-main-content">
        
        <div className="portal-header-main">
          <div>
            <h1>¡Hola, {usuarioNombre}! </h1>
            <p>¿Qué haremos hoy por tus mejores amigos?</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
        </div>

        <div className="portal-stats-grid">
          <div className="stat-card blue">
            <h4>MIS MASCOTAS</h4>
            <div className="value">{totalMascotas}</div>
          </div>
          <div className="stat-card orange">
            <h4>CITAS PENDIENTES</h4>
            <div className="value">{citasPendientes}</div>
          </div>
          <div className="stat-card green">
            <h4>TOTAL EN CARRITO</h4>
            <div className="value">${calcularTotal().toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <h4>ARTÍCULOS</h4>
            <div className="value">{carrito ? carrito.length : 0}</div>
          </div>
        </div>

        {carrito && carrito.length > 0 && (
          <section className="cart-summary">
            <h2>Resumen de tu Compra 🛒</h2>
            <ul className="cart-list">
              {carrito.map((item) => (
                <li key={item.id}>
                  <span>{item.nombre} <small>(x{item.cantidad})</small></span>
                  <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              <span>Total a pagar:</span>
              <span>${calcularTotal().toFixed(2)}</span>
            </div>

            {errorPago && <div className="error-box">Error: {errorPago}</div>}

            <button 
              className="btn-primario btn-full" 
              onClick={handleConfirmarPago}
              disabled={procesandoPago}
            >
              {procesandoPago ? 'Procesando pago...' : 'Confirmar y Pagar'}
            </button>
          </section>
        )}

        <section className="pet-care-tips">
          <h2>Cuidados que debes tener con las mascotas y los niños </h2>
          <div className="tips-grid">
            <div className="tip-card"><span className="tip-icon">👀</span><p><strong>Supervísalos siempre.</strong> De forma permanente, no los dejes solos.</p></div>
            <div className="tip-card"><span className="tip-icon">🤝</span><p><strong>Enséñales el respeto mutuo.</strong></p></div>
            <div className="tip-card"><span className="tip-icon">🧼</span><p><strong>Higiene ante todo.</strong> Evita que los niños besen a las mascotas o ingieran alimentos después de tocarlas sin lavarse las manos.</p></div>
            <div className="tip-card"><span className="tip-icon">✂️</span><p><strong>Cuidados necesarios.</strong> Bríndale a tu mascota los cuidados que requiere para mantenerse sana; así también proteges a los niños.</p></div>
            <div className="tip-card"><span className="tip-icon">🐿️</span><p><strong>No tengas animales silvestres.</strong> Está prohibido y es un gran riesgo tanto para los niños como para las mascotas.</p></div>
            <div className="tip-card"><span className="tip-icon">🚧</span><p><strong>Pon límites.</strong> Cada uno debe tener su espacio establecido para dormir, comer, etc.</p></div>
            <div className="tip-card"><span className="tip-icon">❤️</span><p><strong>No son juguetes.</strong> Muéstrales a los niños que las mascotas sienten y merecen respeto.</p></div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default PortalCliente;