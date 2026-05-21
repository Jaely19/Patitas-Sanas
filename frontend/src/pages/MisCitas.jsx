import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import './MisCitas.css';

function MisCitas() {
  const navigate = useNavigate();
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate('/login');

      // Obtener el cliente por correo
      const { data: cliente, error: errorCliente } = await supabase
        .from('clientes')
        .select('id, id_cliente')
        .eq('correo', session.user.email)
        .single();

      if (errorCliente) throw errorCliente;

      const idCliente = cliente.id || cliente.id_cliente;

      // Obtener mascotas del cliente
      const { data: mascotas, error: errorMascotas } = await supabase
        .from('mascotas')
        .select('id, id_mascota, nombre, especie')
        .eq('id_cliente', idCliente);

      if (errorMascotas) throw errorMascotas;

      if (!mascotas || mascotas.length === 0) {
        setCitas([]);
        setCargando(false);
        return;
      }

      const idsMascotas = mascotas.map(m => m.id || m.id_mascota);

      // Obtener citas de esas mascotas
      const { data: citasData, error: errorCitas } = await supabase
        .from('citas')
        .select('*, id_mascota, fecha_hora, motivo')
        .in('id_mascota', idsMascotas)
        .order('fecha_hora', { ascending: true });

      if (errorCitas) throw errorCitas;

      // Combinar citas con info de la mascota
      const citasConMascota = (citasData || []).map(cita => {
        const mascota = mascotas.find(m => (m.id || m.id_mascota) === cita.id_mascota);
        return { ...cita, mascota };
      });

      setCitas(citasConMascota);
    } catch (err) {
      console.error('Error cargando citas:', err.message);
      setError('No se pudieron cargar tus citas. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();
    let horas = fecha.getHours();
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const ampm = horas >= 12 ? 'PM' : 'AM';
    horas = horas % 12 || 12;
    return { fecha: `${dia} de ${mes}, ${anio}`, hora: `${horas}:${minutos} ${ampm}` };
  };

  const esFutura = (fechaISO) => new Date(fechaISO) >= new Date();

  if (cargando) return (
    <div className="mis-citas-wrapper">
      <div className="citas-loading">Cargando tus citas... 🐾</div>
    </div>
  );

  return (
    <div className="mis-citas-wrapper">
      <div className="citas-container">
        <Link to="/portal-cliente" className="citas-back-link">
          ← Volver al Portal
        </Link>

        <div className="citas-header">
          <h1>📅 Mis Citas</h1>
          <p>Historial y próximas visitas al veterinario</p>
        </div>

        {error && <div className="citas-error">{error}</div>}

        {!error && citas.length === 0 && (
          <div className="citas-empty">
            <span className="empty-icon">🐶</span>
            <p>Aún no tienes citas agendadas.</p>
            <Link to="/agendar-cita">
              <button className="btn-agendar">+ Agendar una Cita</button>
            </Link>
          </div>
        )}

        {citas.length > 0 && (
          <>
            <div className="citas-list">
              {citas.map((cita, index) => {
                const { fecha, hora } = formatearFecha(cita.fecha_hora);
                const futura = esFutura(cita.fecha_hora);
                return (
                  <div key={index} className={`cita-card ${futura ? 'futura' : 'pasada'}`}>
                    <div className="cita-status-badge">
                      {futura ? '✅ Próxima' : '✔ Realizada'}
                    </div>
                    <div className="cita-info">
                      <div className="cita-mascota">
                        <span className="cita-especie-icon">
                          {cita.mascota?.especie === 'Gato' ? '🐱' : cita.mascota?.especie === 'Ave' ? '🐦' : cita.mascota?.especie === 'Roedor' ? '🐹' : '🐶'}
                        </span>
                        <div>
                          <h3>{cita.mascota?.nombre || 'Mascota'}</h3>
                          <span className="cita-especie">{cita.mascota?.especie}</span>
                        </div>
                      </div>
                      <div className="cita-detalles">
                        <div className="cita-detalle-item">
                          <span className="detalle-label">📋 Servicio</span>
                          <span className="detalle-valor">{cita.motivo}</span>
                        </div>
                        <div className="cita-detalle-item">
                          <span className="detalle-label">📆 Fecha</span>
                          <span className="detalle-valor">{fecha}</span>
                        </div>
                        <div className="cita-detalle-item">
                          <span className="detalle-label">🕐 Hora</span>
                          <span className="detalle-valor">{hora}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="citas-footer-btn">
              <Link to="/agendar-cita">
                <button className="btn-agendar">+ Agendar Nueva Cita</button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MisCitas;
