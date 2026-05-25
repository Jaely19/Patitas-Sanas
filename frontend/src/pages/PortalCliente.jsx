import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import './PortalCliente.css';

function PortalCliente() {
  const [usuarioNombre, setUsuarioNombre] = useState('');
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerSesion();
  }, []);

  const obtenerSesion = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate('/login');

      // Usamos .maybeSingle() para que no marque error si el cliente es nuevo y aún no tiene citas/registros
      const { data: cliente, error } = await supabase
        .from('clientes')
        .select('nombre_completo')
        .eq('correo', session.user.email)
        .maybeSingle(); 

      if (error) throw error;

      if (cliente && cliente.nombre_completo) {
        setUsuarioNombre(cliente.nombre_completo);
      } else {
        // TRUCO: Si aún no tiene nombre registrado, sacamos el nombre de su correo
        // Ejemplo: "kevin@gmail.com" -> "Kevin"
        const nombreDelCorreo = session.user.email.split('@')[0];
        const nombreCapitalizado = nombreDelCorreo.charAt(0).toUpperCase() + nombreDelCorreo.slice(1);
        setUsuarioNombre(nombreCapitalizado);
      }
    } catch (error) {
      console.error("Error al obtener datos:", error.message);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return <p>Cargando...</p>;

  return (
    <div className="portal-container">
      <header className="portal-header">
        <h1>¡Hola, {usuarioNombre}! 🐾</h1>
        <p>¿Qué haremos hoy por tus mejores amigos?</p>
      </header>

      <section className="dashboard-grid">
        <div className="card">
          <h3>Mis Mascotas</h3>
          <p>Gestiona el historial y datos de tus peluditos.</p>
          <Link to="/mis-mascotas">
            <button className="btn-secundario">Ver Mascotas</button>
          </Link>
        </div>

        <div className="card">
          <h3>Mis Citas</h3>
          <p>Revisa tus próximas visitas al veterinario.</p>
          {/* 👈 CONECTADO: ahora lleva a /mis-citas */}
          <Link to="/mis-citas">
            <button className="btn-secundario">Ver Citas</button>
          </Link>
        </div>

        <div className="card">
          <h3>Agendar Nueva Cita</h3>
          <p>Reserva un espacio para revisión o vacuna.</p>
          <Link to="/agendar-cita">
            <button className="btn-primario">+ Agendar</button>
          </Link>
        </div>
      </section>

      <footer className="portal-footer">
        <button onClick={() => supabase.auth.signOut().then(() => navigate('/'))} className="btn-text">
          ← Cerrar Sesión
        </button>
      </footer>
    </div>
  );
}

export default PortalCliente;
