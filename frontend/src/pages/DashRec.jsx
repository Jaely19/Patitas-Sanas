import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashRec.css'; 

// Datos de prueba interactivos
const initialAgenda = [
  { id: 1, time: '11:00 AM', isAvailable: false, isPaid: true, name: 'Toby', type: 'Consulta General', details: 'Dr. Alejandro | Status: Finalizada', price: 0 },
  { id: 2, time: '12:00 PM', isAvailable: false, isPaid: false, name: 'Mika', type: 'Limpieza Dental', details: 'Dr. Alejandro | Status: En recuperación', price: 850 },
  { id: 3, time: '01:00 PM', isAvailable: true, isPaid: false, name: '', type: '', details: 'El consultorio 1 está libre.', price: 350 },
  { id: 4, time: '01:30 PM', isAvailable: false, isPaid: false, name: 'Firulais', type: 'Vacunación', details: 'Dr. Alejandro | Status: En consultorio', price: 450 },
  { id: 5, time: '02:30 PM', isAvailable: true, isPaid: false, name: '', type: '', details: 'El consultorio 1 está libre.', price: 350 }
];

export const DashRec = () => {
  const navigate = useNavigate();

  // Estados interactivos de la Caja y Agenda
  const [ingresosTotales, setIngresosTotales] = useState(1250);
  const [citasAtendidas, setCitasAtendidas] = useState(2);
  const [agenda, setAgenda] = useState(initialAgenda);

  // Función de React para salir
  const handleLogout = () => {
    navigate('/login');
  };

  // Función para Cobrar
  const handleCobrar = (id, monto) => {
    // 1. Marcar la cita como pagada
    setAgenda(agenda.map(item => 
      item.id === id ? { ...item, isPaid: true } : item
    ));
    // 2. Sumar a la caja y al contador
    setIngresosTotales(prev => prev + monto);
    setCitasAtendidas(prev => prev + 1);
    // 3. Alerta de confirmación
    alert(`Pago de $${monto} registrado exitosamente en caja.`);
  };

  // Función para Agendar Rápido
  const handleAsignarCita = (id) => {
    const nombreMascota = window.prompt("Ingresa el nombre de la mascota:");
    const motivo = window.prompt("Ingresa el motivo (Ej. Consulta General):");

    if (nombreMascota && motivo) {
      // Reemplazamos la información del slot vacío por la nueva cita
      setAgenda(agenda.map(item => 
        item.id === id 
          ? { 
              ...item, 
              isAvailable: false, 
              name: nombreMascota, 
              type: motivo, 
              details: 'Agendado presencialmente | Status: En espera' 
            } 
          : item
      ));
    }
  };

  return (
    <div className="rec-wrapper">
      {/* BARRA LATERAL */}
      <aside className="rec-sidebar">
        <h2>Patitas<span>Sanas</span></h2>
        <ul className="rec-nav-menu">
          <li><a href="#" className="active">📅 Agenda y Caja</a></li>
          <li><a href="#">➕ Nueva Cita</a></li>
          <li><a href="#">🐕 Expedientes</a></li>
          <li><a href="#">📦 Inventario</a></li>
        </ul>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="rec-main-content">
        <div className="rec-header-main">
          <div>
            <h1>Panel de Recepción</h1>
            <p>Jueves, 16 de Abril de 2026 | Turno: 11:00 am - 6:00 pm</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
        </div>

        {/* TARJETAS SUPERIORES */}
        <div className="stats-grid">
          <div className="stat-card green">
            <h4>Ingresos del Día</h4>
            {/* toLocaleString pone las comitas de los miles automáticamente */}
            <div className="value">$ {ingresosTotales.toLocaleString('en-US')}.00</div>
          </div>
          <div className="stat-card">
            <h4>Citas Atendidas</h4>
            <div className="value">{citasAtendidas}</div>
          </div>
          <div className="stat-card orange">
            <h4>En Sala de Espera</h4>
            <div className="value">1</div>
          </div>
          <div className="stat-card red">
            <h4>Alertas de Stock</h4>
            <div className="value">3</div>
          </div>
        </div>

        {/* PANELES INFERIORES */}
        <div className="panels-grid">
          
          {/* PANEL DE AGENDA */}
          <div className="panel">
            <div className="panel-header">
              <h2>Gestión de Citas</h2>
              <button className="btn-action btn-add">+ Agendar Turno</button>
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

                  {/* Renderizado condicional de los botones basado en el estado */}
                  {cita.isAvailable ? (
                    <button 
                      className="btn-action btn-add" 
                      onClick={() => handleAsignarCita(cita.id)}
                    >
                      Asignar Lugar
                    </button>
                  ) : cita.isPaid ? (
                    <button className="btn-action btn-paid" disabled>
                      Cobrado
                    </button>
                  ) : (
                    <button 
                      className="btn-action btn-pay" 
                      onClick={() => handleCobrar(cita.id, cita.price)}
                    >
                      Cobrar ${cita.price}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* PANEL DE INVENTARIO */}
          <div className="panel">
            <div className="panel-header">
              <h2>Faltantes y Material</h2>
            </div>
            
            <h3>Medicamentos</h3>
            <div className="alert-item">
              <span>Vacuna Múltiple (Sextuple)</span>
              <span className="stock-low">2 Dosis restantes</span>
            </div>
            <div className="alert-item">
              <span>Desparasitante (Drontal)</span>
              <span className="stock-ok">5 Tabletas</span>
            </div>
            <div className="alert-item">
              <span>Meloxicam (Analgésico)</span>
              <span className="stock-low">Agotado</span>
            </div>

            <h3 style={{ marginTop: '20px' }}>Material de Curación</h3>
            <div className="alert-item">
              <span>Jeringas 3ml</span>
              <span className="stock-low">10 pzas</span>
            </div>
            <div className="alert-item">
              <span>Gasas Estériles</span>
              <span className="stock-ok">1 Paquete</span>
            </div>
            
            <button 
              className="btn-action" 
              style={{ width: '100%', marginTop: '20px', background: 'var(--primary)' }} 
              onClick={() => window.alert('Enviando solicitud de pedido al proveedor...')}
            >
              Generar Pedido
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};