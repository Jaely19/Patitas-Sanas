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

      // CONSULTA: Verifica que 'nombre' y 'correo_electronico' 
      // existan en tu tabla 'clientes' de Supabase
      const { data: cliente, error } = await supabase
        .from('clientes')
        .select('nombre') 
        .eq('correo_electronico', session.user.email)
        .single();

      console.log("Respuesta de Supabase:", { cliente, error });

      if (error) throw error;
      
      if (cliente) {
        setUsuarioNombre(cliente.nombre);
      }
    } catch (error) {
      console.error("Error al obtener datos:", error.message);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) return <div>Cargando...</div>;

  return (
    <div className="portal-container">
      <h1>¡Hola, {usuarioNombre}! 🐾</h1>
      {/* ... resto de tu diseño */}
    </div>
  );
}

export default PortalCliente;