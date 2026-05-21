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

      // VAMOS A DEBUGEAR ESTO:
      const { data: cliente, error } = await supabase
        .from('clientes')
        .select('nombre') 
        .eq('correo_electronico', session.user.email)
        .single();

      console.log("Respuesta de Supabase:", { cliente, error }); // <--- ESTO NOS DIRÁ LA VERDAD

      if (error) throw error;
      
      if (cliente && cliente.nombre) {
        setUsuarioNombre(cliente.nombre);
      }
    } catch (error) {
      console.error("Error al obtener nombre:", error.message);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return <div className="cargando">Cargando...</div>;

  return (
    <div className="portal-container">
      <header className="portal-header">
        <h1>¡Hola, {usuarioNombre}! 🐾</h1>
        <p>¿Qué haremos hoy por tus mejores amigos?</p>
      </header>
      {/* ... resto de tu diseño */}
    </div>
  );
}