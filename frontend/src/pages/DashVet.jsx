import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashVet.css'; // Importamos tu archivo de estilos

// 1. Datos de prueba (Mock Data) para la demo
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
  
  // 2. Estados (Variables que React vigila)
  const [appointments, setAppointments] = useState(initialAppointments);
  const [completedCount, setCompletedCount] = useState(0);

  // 3. Función para completar una cita
  const handleFinishTask = (id) => {
    // Actualizamos la cita específica cambiando su estado isCompleted a true
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, isCompleted: true } : app
    ));
    // Sumamos 1 al contador
    setCompletedCount(prev => prev + 1);
  };

  // Función para cerrar sesión y volver al login
  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="vet-wrapper">
      {/* BARRA LATERAL */}
      <aside className="vet-sidebar">
        <h2>Patitas<span>Sanas</span></h2>
        <ul className="nav-menu">
          <li><a href="#" className="active">📅 <span>Mi Agenda</span></a></li>
          <li><a href="#">🐕 <span>Pacientes</span></a></li>
          <li><a href="#">📝 <span>Historiales</span></a></li>
          <li><a href="#">💊 <span>Inventario</span></a></li>
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
            {/* padStart asegura que siempre se vean 2 dígitos (ej: 01, 02) */}
            <div className="value">{completedCount.toString().padStart(2, '0')}</div>
          </div>
        </div>

        {/* CRONOGRAMA */}
        <section className="agenda-container">
          <h2>
            Cronograma del Día 
            <span className="date-label">Jueves, 16 de Abril, 2026</span>
          </h2>

          {/* 4. Dibujamos las citas usando .map() */}
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