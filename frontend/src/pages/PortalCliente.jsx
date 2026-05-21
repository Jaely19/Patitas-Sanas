import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import './PortalCliente.css';

function PortalCliente() {
  const [misCitas, setMisCitas] = useState([]);
  const [misMascotas, setMisMascotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [usuarioNombre, setUsuarioNombre] = useState('Cliente'); 
  const [clienteId, setClienteId] = useState(null);
  const [mostrarFormMascota, setMostrarFormMascota] = useState(false);
  const [nuevaMascota, setNuevaMascota] = useState({
    nombre: '', especie: '', raza: '', sexo: '', color: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    obtenerSesion();
  }, []);

  const obtenerSesion = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setCargando(false);
        return;
      }

      // Consulta a la base de datos con los nombres de columna correctos
      const { data: cliente, error } = await supabase
        .from('clientes')
        .select('id_cliente, nombre') 
        .eq('correo_electronico', session.user.email)
        .single();

      if (error) throw error;

      setUsuarioNombre(cliente.nombre);
      setClienteId(cliente.id_cliente);
      
    } catch (error) {
      console.error("Error al obtener sesión:", error.message);
    } finally {
      setCargando(false); // Asegura que el estado de carga termine
    }
  };

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="portal-wrapper">
      <div className="portal-header">
        {/* Aquí se muestra el nombre real cargado desde Supabase */}
        <h2>Bienvenido/a, {usuarioNombre} 🐾</h2> 
        <p>Aquí puedes gestionar la salud de tus consentidos.</p>
        <Link to="/agendar-cita">
          <button className="btn-nueva-cita">+ Agendar Nueva Cita</button>
        </Link>
      </div>

      {/* Aquí iría el resto de tu contenido de mascotas/citas */}

      <div className="portal-footer">
        <button onClick={handleCerrarSesion} className="btn-link">← Cerrar Sesión</button>
      </div>
    </div>
  );
}

export default PortalCliente;