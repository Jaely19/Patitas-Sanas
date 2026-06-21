import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { CartContext } from '../tienda/CartContext';
import './PortalCliente.css';

function PortalCliente() {
  const [usuarioNombre, setUsuarioNombre] = useState('');
  const [usuarioId, setUsuarioId] = useState(null); 
  const [cargando, setCargando] = useState(true);
  
  // Nuevos estados para los KPIs
  const [totalMascotas, setTotalMascotas] = useState(0);
  const [citasPendientes, setCitasPendientes] = useState(0);
  
  const { cart, clearCart } = useContext(CartContext);
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [errorPago, setErrorPago] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    obtenerSesion();
  }, []);

  const obtenerSesion = async () => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError || !session) return navigate('/login');

      setUsuarioId(session.user.id); 

      // 👇 Modificación: Agregamos id_cliente al select
      const { data: cliente, error } = await supabase
        .from('clientes')
        .select('id_cliente, nombre_completo') 
        .eq('correo', session.user.email)
        .single();

      if (error) throw error;
      if (cliente) {
        setUsuarioNombre(cliente.nombre_completo);
        
        // 👇 Le pasamos el ID numérico (ej. 1, 2, 3) en lugar del UUID de la sesión
        fetchEstadisticasCliente(cliente.id_cliente);
      }
    } catch (error) {
      console.error("Error al obtener sesión:", error.message);
    } finally {
      setCargando(false);
    }
  };

  // Función para obtener KPIs desde Supabase
  const fetchEstadisticasCliente = async (idClienteNum) => {
    try {
      // --- 1. Consulta de Mascotas ---
      // Usamos 'id_cliente' y traemos los IDs de las mascotas
      const { data: mascotasData, error: errMascotas } = await supabase
        .from('mascotas')
        .select('id_mascota') 
        .eq('id_cliente', idClienteNum); 

      if (errMascotas) {
        console.error("❌ Falla en tabla 'mascotas':", errMascotas);
        return; // Si esto falla, detenemos la ejecución
      }

      // Actualizamos el contador de tarjetas
      setTotalMascotas(mascotasData ? mascotasData.length : 0);

      // --- 2. Consulta de Citas ---
      // Si el cliente tiene mascotas registradas, buscamos sus citas
      if (mascotasData && mascotasData.length > 0) {
        
        // Extraemos solo los números de id_mascota en un arreglo (ej: [8, 9, 10])
        const idsMascotas = mascotasData.map(m => m.id_mascota);

        const { count: citasCount, error: errCitas } = await supabase
          .from('citas')
          .select('*', { count: 'exact', head: true })
          // 👇 Usamos '.in' para buscar citas que coincidan con CUALQUIERA de las mascotas del cliente
          .in('id_mascota', idsMascotas) 
          .neq('estado', 'Cancelada')
          .neq('estado', 'Completada');
          
        if (errCitas) {
          console.error("❌ Falla en tabla 'citas':", errCitas);
        } else if (citasCount !== null) {
          setCitasPendientes(citasCount);
        }
      } else {
        // Si no tiene mascotas, lógicamente tiene 0 citas pendientes
        setCitasPendientes(0);
      }

    } catch (error) {
      console.error("Error general en estadísticas:", error.message);
    }
  };

  const calcularTotal = () => {
    // Si cart es undefined o nulo, regresamos 0 automáticamente
    if (!cart) return 0; 
    
    return cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  };

  const handleConfirmarPago = async () => {
    if (cart.length === 0) return;
    
    setProcesandoPago(true);
    setErrorPago(null);

    try {
      const itemsPayload = cart.map(item => ({
        id: Number(item.id), 
        cantidad: item.cantidad,
        precio: item.precio
      }));

      const { error: rpcError } = await supabase.rpc('procesar_compra', {
        p_usuario_id: usuarioId,
        p_total: calcularTotal(),
        p_items: itemsPayload
      });

      if (rpcError) throw rpcError;

      clearCart();
      alert('¡Compra realizada con éxito! 🐾 Tu pedido ha sido registrado.');
      
    } catch (err) {
      console.error('Error al procesar la compra:', err);
      setErrorPago(err.message || 'Ocurrió un error al procesar el pago.');
    } finally {
      setProcesandoPago(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (cargando) return <p style={{ color: 'gray', padding: '20px', textAlign: 'center' }}>Cargando tu portal...</p>;

  return (
    <div className="portal-wrapper">
      {/* SIDEBAR */}
      <aside className="portal-sidebar">
        <h2>Patitas<span>Sanas</span></h2>
        <ul className="portal-nav-menu">
          <li><Link to="/portal-cliente" className="active">🏠 Inicio</Link></li>
          <li><Link to="/mis-mascotas">🐾 Mis Mascotas</Link></li>
          <li><Link to="/mis-citas">📅 Mis Citas</Link></li>
          <li><Link to="/mis-compras">🛍️ Mis Compras</Link></li>
          <li><Link to="/agendar-cita">➕ Agendar Cita</Link></li>
        </ul>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="portal-main-content">
        
        {/* HEADER */}
        <div className="portal-header-main">
          <div>
            <h1>¡Hola, {usuarioNombre}! 🐾</h1>
            <p>¿Qué haremos hoy por tus mejores amigos?</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
        </div>

        {/* MÉTRICAS / KPIs */}
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
            <div className="value">{cart ? cart.length : 0}</div>
          </div>
        </div>

        {/* RESUMEN DE COMPRA */}
        {cart && cart.length > 0 && (
          <section className="cart-summary">
            <h2>Resumen de tu Compra 🛒</h2>
            <ul className="cart-list">
              {cart.map((item) => (
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

        {/* ACCIONES RÁPIDAS (Tus tarjetas originales) */}
        <section className="dashboard-grid">
          <div className="card">
            <h3>Mis Mascotas</h3>
            <p>Gestiona el historial y datos de tus peluditos.</p>
            <Link to="/mis-mascotas"><button className="btn-secundario">Ver Mascotas</button></Link>
          </div>

          <div className="card">
            <h3>Mis Citas</h3>
            <p>Revisa tus próximas visitas al veterinario.</p>
            <Link to="/mis-citas"><button className="btn-secundario">Ver Citas</button></Link>
          </div>

          <div className="card">
            <h3>Mis Compras</h3>
            <p>Revisa el historial de tus pedidos y compras.</p>
            <Link to="/mis-compras"><button className="btn-secundario">Ver Compras</button></Link>
          </div>

          <div className="card">
            <h3>Agendar Nueva Cita</h3>
            <p>Reserva un espacio para revisión o vacuna.</p>
            <Link to="/agendar-cita"><button className="btn-primario">+ Agendar</button></Link>
          </div>
        </section>

      </main>
    </div>
  );
}

export default PortalCliente;