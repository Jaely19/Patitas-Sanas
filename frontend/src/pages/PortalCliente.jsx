import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import './PortalCliente.css';

function PortalCliente() {
  const [usuarioNombre, setUsuarioNombre] = useState('Cliente');
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerSesion();
  }, []);

  const obtenerSesion = async () => {
    setCargando(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      // Consultamos el nombre del usuario basado en su email
      const { data: cliente, error } = await supabase
        .from('clientes')
        .select('nombre')
        .eq('correo_electronico', session.user.email)
        .maybeSingle(); // Usamos maybeSingle para evitar errores si no encuentra la fila

      if (error) {
        console.error("Error al obtener perfil:", error.message);
      } else if (cliente) {
        setUsuarioNombre(cliente.nombre);
      }
    } catch (err) {
      console.error("Error inesperado:", err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="portal-container">
      <header className="portal-header">
        <h1>¡Hola, {cargando ? "cargando..." : usuarioNombre}! 🐾</h1>
        <p>¿Qué haremos hoy por tus mejores amigos?</p>
      </header>

      <section className="dashboard-grid">
        <div className="card">
          <h3>Mis Mascotas</h3>
          <p>Gestiona el historial y datos de tus peluditos.</p>
          <button className="btn-secundario">Ver Mascotas</button>
        </div>

        <div className="card">
          <h3>Mis Citas</h3>
          <p>Revisa tus próximas visitas al veterinario.</p>
          <button className="btn-secundario">Ver Citas</button>
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
        <button 
          onClick={async () => {
            await supabase.auth.signOut();
            navigate('/');
          }} 
          className="btn-text"
        >
          ← Cerrar Sesión
        </button>
      </footer>
    </div>
  );
}

export default PortalCliente;