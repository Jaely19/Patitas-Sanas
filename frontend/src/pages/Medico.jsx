import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Medico.css';

function Medico() {
  const [completedCount, setCompletedCount] = useState(0);
  const [citasHoy, setCitasHoy] = useState([
    { id: 1, hora: '11:00 AM', tipo: 'consulta', mascota: 'Toby', dueño: 'Carlos Gómez', motivo: 'Revisión de orejas (posible otitis)', finalizada: false },
    { id: 2, hora: '12:00 PM', tipo: 'cirugia', mascota: 'Mika', dueño: 'Ana Soto', motivo: 'Limpieza dental profunda (Profilaxis)', finalizada: false },
    { id: 3, hora: '01:30 PM', tipo: 'consulta', mascota: 'Firulais', dueño: 'Roberto M.', motivo: 'Refuerzo de Sextuple y Rabia', finalizada: false },
    { id: 4, hora: '03:00 PM', tipo: 'consulta', mascota: 'Pelusa (Gato)', dueño: 'Elena P.', motivo: 'No ha querido comer en 2 días', finalizada: false },
    { id: 5, hora: '04:30 PM', tipo: 'estetica', mascota: 'Bruno', dueño: 'Laura V.', motivo: 'Baño medicado por dermatitis', finalizada: false },
    { id: 6, hora: '05:30 PM', tipo: 'consulta', mascota: 'Chiquis', dueño: 'Javier R.', motivo: 'Retiro de puntos de cirugía previa', finalizada: false }
  ]);

  // JALAR CITAS DE POSTGRESQL EN TIEMPO REAL
  useEffect(() => {
    fetch('http://localhost:4000/api/citas_detalladas')
      .then(res => res.json())
      .then(datos => {
        if (datos && datos.length > 0) {
          // Mapeamos las citas de la BD al formato del panel médico
          const deBaseDatos = datos.map(c => {
            const horaStr = new Date(c.fecha_hora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
            return {
              id: `db-${c.id_cita}`,
              hora: horaStr,
              tipo: c.motivo.toLowerCase().includes('cirug') ? 'cirugia' : 'consulta',
              mascota: c.nombre_mascota,
              dueño: c.nombre_dueño,
              motivo: c.motivo,
              finalizada: false
            };
          });
          // Unimos las citas precargadas de tu diseño con las de la base de datos
          setCitasHoy(prev => [...prev, ...deBaseDatos]);
        }
      })
      .catch(err => console.error('Error al sincronizar agenda médica:', err));
  }, []);

  const handleFinalizar = (id) => {
    setCitasHoy(prev =>
      prev.map(c => (c.id === id ? { ...c, finalizada: true } : c))
    );
    setCompletedCount(prev => prev + 1);
  };

  // Obtener la fecha actual formateada de forma elegante como tu HTML
  const fechaActual = new Date().toLocaleDateString('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="medico-wrapper">
      {/* BARRA LATERAL */}
      <aside className="sidebar-vet">
        <h2>Patitas<span>Sanas</span></h2>
        <ul className="nav-menu">
          <li><a href="#" className="active">📅 <span>Mi Agenda</span></a></li>
          <li><a href="#">🐕 <span>Pacientes</span></a></li>
          <li><a href="#">📝 <span>Historiales</span></a></li>
          <li><a href="#">💊 <span>Inventario</span></a></li>
        </ul>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content-vet">
        <div className="header-main">
          <div>
            <h1>Bienvenido, Dr. Alejandro</h1>
            <p>Panel de Control Veterinario</p>
          </div>
          <Link to="/login" className="btn-logout">Cerrar Sesión</Link>
        </div>

        {/* TARJETAS DE MÉTRICAS */}
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Citas de Hoy</h4>
            <div className="value">{citasHoy.length.toString().padStart(2, '0')}</div>
          </div>
          <div className="stat-card" style={{ borderBottom: '4px solid #FF9B1B' }}>
            <h4>Cirugías</h4>
            <div className="value">
              {citasHoy.filter(c => c.tipo === 'cirugia' && !c.finalizada).length.toString().padStart(2, '0')}
            </div>
          </div>
          <div className="stat-card">
            <h4>Completadas</h4>
            <div className="value">{completedCount.toString().padStart(2, '0')}</div>
          </div>
        </div>

        {/* AGENDA */}
        <section className="agenda-container">
          <h2>
            Cronograma del Día 
            <span className="date-label" style={{ textTransform: 'capitalize' }}>{fechaActual}</span>
          </h2>

          {citasHoy.map((cita) => (
            <div 
              key={cita.id} 
              className="schedule-row" 
              style={{ 
                opacity: cita.finalizada ? 0.4 : 1, 
                pointerEvents: cita.finalizada ? 'none' : 'auto' 
              }}
            >
              <div className="time-col">{cita.hora}</div>
              <div className="info-col">
                <span className={`badge badge-${cita.tipo}`}>
                  {cita.tipo === 'cirugia' ? 'Cirugía / Procedimiento' : cita.tipo === 'estetica' ? 'Estética Médica' : 'Consulta General'}
                </span>
                <h4>{cita.mascota}</h4>
                <p><strong>Dueño:</strong> {cita.dueño} | <strong>Motivo:</strong> {cita.motivo}</p>
              </div>
              <div className="action-col">
                <button 
                  className="btn-check" 
                  onClick={() => handleFinalizar(cita.id)}
                  style={{ backgroundColor: cita.finalizada ? '#bdc3c7' : '#27ae60' }}
                  disabled={cita.finalizada}
                >
                  {cita.finalizada ? '✓ Listo' : 'Finalizar'}
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Medico;