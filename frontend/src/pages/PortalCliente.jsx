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
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate('/login');

      console.log("Email de sesión activa:", session.user.email);

      // Consulta blindada
      const { data: cliente, error } = await supabase
        .from('clientes')
        .select('nombre') 
        .eq('correo_electronico', session.user.email) // Asegúrate que sea EXACTAMENTE este nombre de columna
        .single();

      if (error) {
        console.error("Error específico de Supabase:", error);
        throw error;
      }

      console.log("Datos obtenidos de la tabla clientes:", cliente);
      
      if (cliente && cliente.nombre) {
        setUsuarioNombre(cliente.nombre);
      } else {
        console.warn("La consulta fue exitosa pero no se encontró el nombre en la columna 'nombre'");
      }
      
    } catch (error) {
      console.error("Error general en obtenerSesion:", error.message);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return <div className="cargando">Cargando tu espacio... 🐾</div>;

  return (
    <div className="portal-container">
      <header className="portal-header">
        <h1>¡Hola, {usuarioNombre}! 🐾</h1>
        <p>¿Qué haremos hoy por tus mejores amigos?</p>
      </header>

      <section className="dashboard-grid">
        <div className="card">
          <h3>Mis Mascotas</h3>
          <button className="btn-secundario">Ver Mascotas</button>
        </div>
        <div className="card">
          <h3>Mis Citas</h3>
          <button className="btn-secundario">Ver Citas</button>
        </div>
        <div className="card">
          <h3>Agendar Nueva Cita</h3>
          <Link to="/agendar-cita"><button className="btn-primario">+ Agendar</button></Link>
        </div>
      </section>

      <footer className="portal-footer">
        <button onClick={() => supabase.auth.signOut().then(() => navigate('/'))} className="btn-text">
          Cerrar Sesión
        </button>
      </footer>
    </div>
  );
}

export default PortalCliente;