import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import './PortalCliente.css';

function PortalCliente() {
  const [misCitas, setMisCitas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Al cargar la página, buscamos las citas en la nube
  useEffect(() => {
    cargarMisCitas();
  }, []);

  const cargarMisCitas = async () => {
    try {
      const { data, error } = await supabase
        .from('citas')
        .select(`
          id_cita,
          fecha_hora,
          motivo,
          mascotas (
            nombre,
            clientes ( nombre_completo, telefono )
          ),
          veterinarios ( nombre_completo )
        `)
        .order('fecha_hora', { ascending: false });

      if (error) throw error;
      setMisCitas(data || []);
    } catch (error) {
      console.error("Error al cargar citas:", error.message);
    } finally {
      setCargando(false);
    }
  };

  // FUNCIÓN PARA BORRAR LA CITA DE LA BASE DE DATOS
  const cancelarCita = async (idCita) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.");
    if (!confirmar) return;

    try {
      // Instrucción SQL a través de Supabase: DELETE FROM citas WHERE id_cita = X
      const { error } = await supabase
        .from('citas')
        .delete()
        .eq('id_cita', idCita);

      if (error) throw error;

      // Si se borró con éxito en la nube, la quitamos de la pantalla
      setMisCitas(prevCitas => prevCitas.filter(cita => cita.id_cita !== idCita));
      alert("La cita ha sido cancelada y borrada del sistema exitosamente.");
    } catch (error) {
      console.error("Error al cancelar:", error.message);
      alert("Hubo un error al intentar cancelar la cita.");
    }
  };

  return (
    <div className="portal-wrapper">
      <div className="portal-header">
        <h2>Mi Portal de Cliente</h2>
        <p>Bienvenido. Aquí puedes gestionar la salud de tus consentidos.</p>
        <Link to="/agendar-cita">
          <button className="btn-nueva-cita">+ Agendar Nueva Cita</button>
        </Link>
      </div>

      <div className="citas-container">
        <h3>Tus Próximas Reservaciones</h3>
        
        {cargando ? (
          <p>Cargando información desde la nube...</p>
        ) : misCitas.length === 0 ? (
          <div className="sin-citas">
            <p>No tienes citas programadas actualmente.</p>
          </div>
        ) : (
          <div className="grid-citas">
            {misCitas.map((cita) => {
              // Formateamos la fecha para que se vea bonita
              const fechaObj = new Date(cita.fecha_hora);
              const fecha = fechaObj.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
              const hora = fechaObj.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={cita.id_cita} className="cita-card">
                  <div className="cita-info">
                    <h4>Mascota: {cita.mascotas?.nombre}</h4>
                    <p><strong>Dueño:</strong> {cita.mascotas?.clientes?.nombre_completo}</p>
                    <p><strong>Fecha:</strong> {fecha}</p>
                    <p><strong>Hora:</strong> {hora}</p>
                    <p><strong>Motivo:</strong> {cita.motivo}</p>
                    <p><strong>Médico asignado:</strong> {cita.veterinarios?.nombre_completo}</p>
                  </div>
                  <div className="cita-actions">
                    <button 
                      className="btn-cancelar"
                      onClick={() => cancelarCita(cita.id_cita)}
                    >
                      Cancelar Cita
                    </button>
                  </div>
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