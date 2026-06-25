import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { citasEstaticas } from '../models/citas'; // 1. Importar el modelo
import './Citas.css';

function Citas() {
  const navigate = useNavigate();
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [borrando, setBorrando] = useState(null);

  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  // 2. Carga rápida de citas estáticas
  useEffect(() => {
    // Simulamos un pequeño tiempo de carga visual
    setTimeout(() => {
      setCitas(citasEstaticas);
      setCargando(false);
    }, 500);
  }, []);

  // 3. Simular el borrado (solo se oculta visualmente)
  const borrarCita = (idCita) => {
    const confirmar = window.confirm('¿Seguro que quieres cancelar esta cita?');
    if (!confirmar) return;

    setBorrando(idCita);
    
    setTimeout(() => {
      // Filtramos el arreglo para quitar la cita eliminada
      setCitas(prev => prev.filter(c => (c.id_cita || c.id) !== idCita));
      setBorrando(null);
    }, 400); // Simulamos retraso de red
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

  // ... (Conserva todo el código a partir del `if (cargando) return (...)` hasta el final)

  if (cargando) return (
    <div className="citas-wrapper">
      <div className="citas-loading">Cargando tus citas... 🐾</div>
    </div>
  );

  return (
    <div className="citas-wrapper">
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
                const idCita = cita.id_cita || cita.id;
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
                      <button
                        className="btn-borrar"
                        onClick={() => borrarCita(idCita)}
                        disabled={borrando === idCita}
                      >
                        {borrando === idCita ? 'Cancelando...' : '🗑 Cancelar Cita'}
                      </button>
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

export default Citas;
