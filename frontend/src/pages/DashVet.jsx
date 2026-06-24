import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashVet.css'; 

const initialAppointments = [
  { id: 1, time: '11:00 AM', type: 'Consulta General', typeClass: 'badge-consulta', name: 'Toby', owner: 'Carlos Gómez', reason: 'Revisión de orejas (posible otitis)', isCompleted: false },
  { id: 2, time: '12:00 PM', type: 'Cirugía / Procedimiento', typeClass: 'badge-cirugia', name: 'Mika', owner: 'Ana Soto', reason: 'Limpieza dental profunda (Profilaxis)', isCompleted: false },
  { id: 3, time: '01:30 PM', type: 'Vacunación', typeClass: 'badge-consulta', name: 'Firulais', owner: 'Roberto M.', reason: 'Refuerzo de Sextuple y Rabia', isCompleted: false },
  { id: 4, time: '03:00 PM', type: 'Consulta General', typeClass: 'badge-consulta', name: 'Pelusa (Gato)', owner: 'Elena P.', reason: 'No ha querido comer en 2 días', isCompleted: false },
  { id: 5, time: '04:30 PM', type: 'Estética Médica', typeClass: 'badge-estetica', name: 'Bruno', owner: 'Laura V.', reason: 'Baño medicado por dermatitis', isCompleted: false },
  { id: 6, time: '05:30 PM', type: 'Revisión', typeClass: 'badge-consulta', name: 'Chiquis', owner: 'Javier R.', reason: 'Retiro de puntos de cirugía previa', isCompleted: false }
];

export const DashVet = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [completedCount, setCompletedCount] = useState(0);

  // 1. VALIDACIÓN DE SESIÓN ESTÁTICA
  useEffect(() => {
    const sesionActual = localStorage.getItem('currentUser');
    if (!sesionActual) {
      navigate('/login');
    }
  }, [navigate]);

  const handleFinishTask = (id) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, isCompleted: true } : app
    ));
    setCompletedCount(prev => prev + 1);
  };

  const handleLogout = () => {
    // 2. DESTRUCCIÓN DE LA SESIÓN AL SALIR
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div className="vet-wrapper">
      {/* BARRA LATERAL */}
      <aside className="vet-sidebar">
        <h2>Patitas<span>Sanas</span></h2>
        <ul className="nav-menu">
          <li><a href="#" className="active">📅 <span>Mi Agenda</span></a></li>
        </ul>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        <div className="header-main">
          <div>
            <h1>Bienvenido, Dr. Alejandro</h1>
            <p>Panel de Control Veterinario (Modo Demo)</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
        </div>

        {/* TARJETAS DE RESUMEN */}
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Citas de Hoy</h4>
            <div className="value">06</div>
          </div>
          <div className="stat-card" style={{ borderBottom: '4px solid var(--accent)' }}>
            <h4>Cirugías</h4>
            <div className="value">01</div>
          </div>
          <div className="stat-card">
            <h4>Completadas</h4>
            <div className="value">{completedCount.toString().padStart(2, '0')}</div>
          </div>
        </div>

        {/* CRONOGRAMA */}
        <section className="agenda-container">
          <h2>
            Cronograma del Día 
            <span className="date-label">Jueves, 16 de Abril, 2026</span>
          </h2>
          {appointments.map((app) => (
            <div 
              key={app.id} 
              className={`schedule-row ${app.isCompleted ? 'completed' : ''}`}
            >
              <div className="time-col">{app.time}</div>
              <div className="info-col">
                <span className={`badge ${app.typeClass}`}>{app.type}</span>
                <h4>{app.name}</h4>
                <p><strong>Dueño:</strong> {app.owner} | <strong>Motivo:</strong> {app.reason}</p>
              </div>
              <div className="action-col">
                <button 
                  className={`btn-check ${app.isCompleted ? 'completed' : ''}`}
                  onClick={() => handleFinishTask(app.id)}
                >
                  {app.isCompleted ? '✓ Listo' : 'Finalizar'}
                </button>
              </div>
            </div>
          ))}

        </section>
      </main>
    </div>
  );
};