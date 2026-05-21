import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import './PortalCliente.css';

function PortalCliente() {
  const [misCitas, setMisCitas] = useState([]);
  const [misMascotas, setMisMascotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [usuarioNombre, setUsuarioNombre] = useState('Cliente'); // Valor inicial por defecto
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
      setCargando(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login'); // Si no hay sesión, mandamos al login
        return;
      }

      // Consulta directa a la tabla clientes filtrando por el email de la sesión
      const { data: cliente, error } = await supabase
        .from('clientes')
        .select('id_cliente, nombre_completo')
        .eq('email', session.user.email)
        .single();

      if (error) throw error;

      if (cliente) {
        setUsuarioNombre(cliente.nombre_completo); // Aquí se actualiza el nombre real
        setClienteId(cliente.id_cliente);
        await cargarMisCitas(cliente.id_cliente);
        await cargarMisMascotas(cliente.id_cliente);
      }
    } catch (error) {
      console.error("Error al obtener sesión:", error.message);
    } finally {
      setCargando(false);
    }
  };

  // ... (tus funciones cargarMisCitas, cargarMisMascotas, etc., se quedan igual)

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

      {/* ... (resto de tu JSX para mascotas y citas) */}

      <div className="portal-footer">
        <button onClick={handleCerrarSesion} className="btn-link">← Cerrar Sesión</button>
      </div>
    </div>
  );
}

export default PortalCliente;