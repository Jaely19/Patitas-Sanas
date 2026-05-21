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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // CAMBIO: ahora buscamos en la columna 'correo_electronico'
      const { data: cliente, error } = await supabase
        .from('clientes')
        .select('id_cliente, nombre') // CAMBIO: tu columna se llama 'nombre', no 'nombre_completo'
        .eq('correo_electronico', session.user.email) // CAMBIO: tu columna se llama 'correo_electronico'
        .single();

      if (error) throw error;

      setUsuarioNombre(cliente.nombre); // CAMBIO: usamos 'nombre'
      setClienteId(cliente.id_cliente);
      // ... resto de tu código
    } catch (error) {
      console.error("Error al obtener sesión:", error.message);
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