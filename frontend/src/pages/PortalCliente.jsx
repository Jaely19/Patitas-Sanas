import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import './PortalCliente.css';

function PortalCliente() {
  const [misCitas, setMisCitas] = useState([]);
  const [misMascotas, setMisMascotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [usuarioNombre, setUsuarioNombre] = useState('');
  const [clienteId, setClienteId] = useState(null);
  const [mostrarFormMascota, setMostrarFormMascota] = useState(false);
  const [nuevaMascota, setNuevaMascota] = useState({
    nombre: '', especie: '', raza: '', sexo: '', color: ''
  });

  useEffect(() => {
    obtenerSesion();
  }, []);

  const obtenerSesion = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: cliente, error } = await supabase
        .from('clientes')
        .select('id_cliente, nombre_completo')
        .eq('email', session.user.email)
        .single();

      if (error) throw error;

      setUsuarioNombre(cliente.nombre_completo);
      setClienteId(cliente.id_cliente);
      await cargarMisCitas(cliente.id_cliente);
      await cargarMisMascotas(cliente.id_cliente);
    } catch (error) {
      console.error("Error al obtener sesión:", error.message);
    } finally {
      setCargando(false);
    }
  };

  const cargarMisCitas = async (idCliente) => {
    try {
      const { data, error } = await supabase
        .from('citas')
        .select(`
          id_cita, fecha_hora, motivo,
          mascotas ( id_cliente, nombre, clientes ( nombre_completo, telefono ) ),
          veterinarios ( nombre_completo )
        `)
        .order('fecha_hora', { ascending: false });

      if (error) throw error;
      const filtradas = (data || []).filter(c => c.mascotas?.id_cliente === idCliente);
      setMisCitas(filtradas);
    } catch (error) {
      console.error("Error al cargar citas:", error.message);
    }
  };

  const cargarMisMascotas = async (idCliente) => {
    try {
      const { data, error } = await supabase
        .from('mascotas')
        .select('id_mascota, nombre, especie, raza, sexo, color')
        .eq('id_cliente', idCliente);

      if (error) throw error;
      setMisMascotas(data || []);
    } catch (error) {
      console.error("Error al cargar mascotas:", error.message);
    }
  };

  const cancelarCita = async (idCita) => {
    const confirmar = window.confirm("¿Seguro que deseas cancelar esta cita?");
    if (!confirmar) return;
    try {
      const { error } = await supabase.from('citas').delete().eq('id_cita', idCita);
      if (error) throw error;
      setMisCitas(prev => prev.filter(c => c.id_cita !== idCita));
      alert("Cita cancelada exitosamente.");
    } catch (error) {
      alert("Error al cancelar: " + error.message);
    }
  };

  const agregarMascota = async () => {
    if (!nuevaMascota.nombre || !nuevaMascota.especie) {
      alert("Por favor ingresa nombre y especie.");
      return;
    }
    try {
      const { data, error } = await supabase
        .from('mascotas')
        .insert([{ ...nuevaMascota, id_cliente: clienteId }])
        .select().single();

      if (error) throw error;
      setMisMascotas(prev => [...prev, data]);
      setNuevaMascota({ nombre: '', especie: '', raza: '', sexo: '', color: '' });
      setMostrarFormMascota(false);
      alert(`¡${data.nombre} registrado/a con éxito!`);
    } catch (error) {
      alert("Error al agregar mascota: " + error.message);
    }
  };

  return (
    <div className="portal-wrapper">
      <div className="portal-header">
        <h2>Bienvenido/a, {usuarioNombre || 'Cliente'} 🐾</h2>
        <p>Aquí puedes gestionar la salud de tus consentidos.</p>
        <Link to="/agendar-cita">
          <button className="btn-nueva-cita">+ Agendar Nueva Cita</button>
        </Link>
      </div>

      {/* MIS MASCOTAS */}
      <div className="mascotas-container">
        <h3>Mis Mascotas</h3>
        {cargando ? <p>Cargando...</p> : (
          <>
            <div className="grid-mascotas">
              {misMascotas.map((m) => (
                <div key={m.id_mascota} className="mascota-card">
                  <h4>🐾 {m.nombre}</h4>
                  <p><strong>Especie:</strong> {m.especie}</p>
                  {m.raza && <p><strong>Raza:</strong> {m.raza}</p>}
                  {m.sexo && <p><strong>Sexo:</strong> {m.sexo}</p>}
                  {m.color && <p><strong>Color:</strong> {m.color}</p>}
                </div>
              ))}
            </div>

            <button className="btn-nueva-cita" style={{ marginTop: '15px' }}
              onClick={() => setMostrarFormMascota(!mostrarFormMascota)}>
              {mostrarFormMascota ? 'Cancelar' : '+ Agregar Mascota'}
            </button>

            {mostrarFormMascota && (
              <div className="form-mascota">
                <h4>Nueva mascota</h4>
                <input placeholder="Nombre *" value={nuevaMascota.nombre}
                  onChange={(e) => setNuevaMascota({ ...nuevaMascota, nombre: e.target.value })} />
                <input placeholder="Especie (Perro, Gato...) *" value={nuevaMascota.especie}
                  onChange={(e) => setNuevaMascota({ ...nuevaMascota, especie: e.target.value })} />
                <input placeholder="Raza (opcional)" value={nuevaMascota.raza}
                  onChange={(e) => setNuevaMascota({ ...nuevaMascota, raza: e.target.value })} />
                <select value={nuevaMascota.sexo}
                  onChange={(e) => setNuevaMascota({ ...nuevaMascota, sexo: e.target.value })}>
                  <option value="">Sexo (opcional)</option>
                  <option value="Macho">Macho</option>
                  <option value="Hembra">Hembra</option>
                </select>
                <input placeholder="Color (opcional)" value={nuevaMascota.color}
                  onChange={(e) => setNuevaMascota({ ...nuevaMascota, color: e.target.value })} />
                <button className="btn-nueva-cita" onClick={agregarMascota}>Guardar Mascota</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* MIS CITAS */}
      <div className="citas-container">
        <h3>Tus Próximas Reservaciones</h3>
        {cargando ? <p>Cargando...</p> : misCitas.length === 0 ? (
          <p>No tienes citas programadas actualmente.</p>
        ) : (
          <div className="grid-citas">
            {misCitas.map((cita) => {
              const fechaObj = new Date(cita.fecha_hora);
              const fecha = fechaObj.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
              const hora = fechaObj.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
              return (
                <div key={cita.id_cita} className="cita-card">
                  <div className="cita-info">
                    <h4>Mascota: {cita.mascotas?.nombre}</h4>
                    <p><strong>Fecha:</strong> {fecha}</p>
                    <p><strong>Hora:</strong> {hora}</p>
                    <p><strong>Motivo:</strong> {cita.motivo}</p>
                    <p><strong>Médico:</strong> {cita.veterinarios?.nombre_completo}</p>
                  </div>
                  <button className="btn-cancelar" onClick={() => cancelarCita(cita.id_cita)}>
                    Cancelar Cita
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="portal-footer">
        <Link to="/">← Cerrar Sesión y Volver</Link>
      </div>
    </div>
  );
}

export default PortalCliente;
