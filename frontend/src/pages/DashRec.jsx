import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashRec.css'; 

// Datos de prueba interactivos (DEMO)
const initialAgenda = [
  { id: 1, time: '11:00 AM', isAvailable: false, isPaid: true, name: 'Toby', type: 'Consulta General', details: 'Dr. Alejandro | Status: Finalizada', price: 0 },
  { id: 2, time: '12:00 PM', isAvailable: false, isPaid: false, name: 'Mika', type: 'Limpieza Dental', details: 'Dr. Alejandro | Status: En recuperación', price: 850 },
  { id: 3, time: '01:00 PM', isAvailable: true, isPaid: false, name: '', type: '', details: 'El consultorio 1 está libre.', price: 350 },
  { id: 4, time: '01:30 PM', isAvailable: false, isPaid: false, name: 'Firulais', type: 'Vacunación', details: 'Dr. Alejandro | Status: En consultorio', price: 450 },
  { id: 5, time: '02:30 PM', isAvailable: true, isPaid: false, name: '', type: '', details: 'El consultorio 1 está libre.', price: 350 }
];

export const DashRec = () => {
  const navigate = useNavigate();

  const [ingresosTotales, setIngresosTotales] = useState(1250);
  const [citasAtendidas, setCitasAtendidas] = useState(2);
  const [agenda, setAgenda] = useState(initialAgenda);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleCobrar = (id, monto) => {
    setAgenda(agenda.map(item => item.id === id ? { ...item, isPaid: true } : item));
    setIngresosTotales(prev => prev + monto);
    setCitasAtendidas(prev => prev + 1);
    alert(`Pago de $${monto} registrado exitosamente en caja (Modo Demo).`);
  };

  const handleAsignarCita = (id) => {
    const nombreMascota = window.prompt("Ingresa el nombre de la mascota:");
    const motivo = window.prompt("Ingresa el motivo (Ej. Consulta General):");
    if (nombreMascota && motivo) {
      setAgenda(agenda.map(item => item.id === id ? { ...item, isAvailable: false, name: nombreMascota, type: motivo, details: 'Agendado presencialmente | Status: En espera' } : item));
    }
  };

  return (
    <div className="rec-wrapper">
      <main className="rec-main-content" style={{ width: '100%', marginLeft: 0 }}>
        <div className="rec-header-main">
          <div>
            <h1>Panel de Recepción (MODO DEMO)</h1>
            <p>Jueves, 16 de Abril de 2026 | Turno General</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
        </div>

        <div className="stats-grid">
          <div className="stat-card green">
            <h4>Ingresos del Día</h4>
            <div className="value">$ {ingresosTotales.toLocaleString('en-US')}.00</div>
          </div>
          <div className="stat-card">
            <h4>Citas Atendidas</h4>
            <div className="value">{citasAtendidas}</div>
          </div>
        </div>

        <div className="panels-grid">
          <div className="panel">
            <div className="panel-header">
              <h2>Gestión de Citas</h2>
            </div>
            <div className="agenda-list">
              {agenda.map((cita) => (
                <div key={cita.id} className={`agenda-item ${cita.isAvailable ? 'available' : ''}`}>
                  <div className="time">{cita.time}</div>
                  <div className="details">
                    {cita.isAvailable ? (
                       <h4 style={{ color: 'var(--success)' }}>¡Horario Disponible!</h4>
                    ) : (
                       <h4>{cita.name} ({cita.type})</h4>
                    )}
                    <p>{cita.details}</p>
                  </div>
                  {cita.isAvailable ? (
                    <button className="btn-action btn-add" onClick={() => handleAsignarCita(cita.id)}>Asignar Lugar</button>
                  ) : cita.isPaid ? (
                    <button className="btn-action btn-paid" disabled>Cobrado</button>
                  ) : (
                    <button className="btn-action btn-pay" onClick={() => handleCobrar(cita.id, cita.price)}>Cobrar ${cita.price}</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};