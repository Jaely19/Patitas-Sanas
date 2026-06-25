import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../tienda/CartContext';
import { mascotasEstaticas } from '../models/mascotas';
import { citasEstaticas } from '../models/citas';
import './PortalCliente.css';

function PortalCliente() {
  const [usuarioNombre, setUsuarioNombre] = useState('');
  const [cargando, setCargando] = useState(true);
  const [totalMascotas, setTotalMascotas] = useState(0);
  const [citasPendientes, setCitasPendientes] = useState(0);
  const { carrito, vaciarCarrito } = useContext(CartContext);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [errorPago, setErrorPago] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarDatosSimulados();
  }, []);

  const cargarDatosSimulados = () => {
    // Simulamos al cliente "logueado" directamente en el estado,
    // sin pedir nada a una base de datos.
    setUsuarioNombre('Usuario Demo');

    // --- Estadísticas a partir de los modelos estáticos ---
    // Mascotas: simplemente contamos cuántas hay en el arreglo
    setTotalMascotas(mascotasEstaticas.length);

    // Citas pendientes: contamos las que no estén Canceladas ni Completadas
    const pendientes = citasEstaticas.filter(
      (cita) => cita.estado !== 'Cancelada' && cita.estado !== 'Completada'
    );
    setCitasPendientes(pendientes.length);

    setCargando(false);
  };

  const calcularTotal = () => {
    if (!carrito) return 0;
    return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  };

  const handleConfirmarPago = () => {
    if (carrito.length === 0) return;

    setProcesandoPago(true);
    setErrorPago(null);

    // Simulamos el procesamiento del pago "en memoria",
    // sin llamar a ningún backend ni RPC.
    setTimeout(() => {
      vaciarCarrito();
      setProcesandoPago(false);
      alert('¡Compra realizada con éxito! 🐾 Tu pedido ha sido registrado.');
    }, 600); // pequeño delay simulado, opcional
  };

  const handleLogout = () => {
    // Ya no hay sesión real que cerrar, solo regresamos al inicio.
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
            <div className="tip-card">
              <span className="tip-icon">👀</span>
              <p><strong>Supervísalos siempre.</strong> De forma permanente, no los dejes solos.</p>
            </div>

            <div className="tip-card">
              <span className="tip-icon">🤝</span>
              <p><strong>Enséñales el respeto mutuo.</strong></p>
            </div>

            <div className="tip-card">
              <span className="tip-icon">🧼</span>
              <p><strong>Higiene ante todo.</strong> Evita que los niños besen a las mascotas o ingieran alimentos después de tocarlas sin lavarse las manos.</p>
            </div>

            <div className="tip-card">
              <span className="tip-icon">✂️</span>
              <p><strong>Cuidados necesarios.</strong> Bríndale a tu mascota los cuidados que requiere para mantenerse sana; así también proteges a los niños.</p>
            </div>

            <div className="tip-card">
              <span className="tip-icon">🐿️</span>
              <p><strong>No tengas animales silvestres.</strong> Está prohibido y es un gran riesgo tanto para los niños como para las mascotas.</p>
            </div>

            <div className="tip-card">
              <span className="tip-icon">🚧</span>
              <p><strong>Pon límites.</strong> Cada uno debe tener su espacio establecido para dormir, comer, etc.</p>
            </div>

            <div className="tip-card">
              <span className="tip-icon">❤️</span>
              <p><strong>No son juguetes.</strong> Muéstrales a los niños que las mascotas sienten y merecen respeto.</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default PortalCliente;
