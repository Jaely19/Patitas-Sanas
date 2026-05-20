import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Recepcion.css';

function Recepcion() {
  const [ingresos, setIngresos] = useState(1250);
  const [atendidas, setAtendidas] = useState(2);
  const [citas, setCitas] = useState([
    { id: 1, hora: '11:00 AM', mascota: 'Toby', motivo: 'Consulta General', doctor: 'Dr. Alejandro', status: 'Finalizada', cobrado: true, precio: 0 },
    { id: 2, hora: '12:00 PM', mascota: 'Mika', motivo: 'Limpieza Dental', doctor: 'Dr. Alejandro', status: 'En recuperación', cobrado: false, precio: 850 },
    { id: 3, hora: '01:00 PM', disponible: true, horaTexto: '01:00 PM' },
    { id: 4, hora: '01:30 PM', mascota: 'Firulais', motivo: 'Vacunación', doctor: 'Dr. Alejandro', status: 'En consultorio', cobrado: false, precio: 450 },
    { id: 5, hora: '02:30 PM', disponible: true, horaTexto: '02:30 PM' }
  ]);

  // CARGAR CITAS REALES DESDE POSTGRESQL (NUESTRO JOIN)
  useEffect(() => {
    fetch('http://localhost:4000/api/citas_detalladas')
      .then(res => res.json())
      .then(datos => {
        if (datos && datos.length > 0) {
          const citasFormateadas = datos.map(c => {
            const horaStr = new Date(c.fecha_hora).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
            return {
              id: `db-${c.id_cita}`,
              hora: horaStr,
              mascota: c.nombre_mascota,
              motivo: c.motivo,
              doctor: `Dr. ${c.nombre_veterinario}`,
              status: 'Agendada en Web',
              cobrado: false,
              precio: 350
            };
          });
          setCitas(prev => [...prev, ...citasFormateadas]);
        }
      })
      .catch(err => console.error('Error al unificar con base de datos:', err));
  }, []);

  const handleCobrar = (id, monto) => {
    setIngresos(prev => prev + monto);
    setAtendidas(prev => prev + 1);
    setCitas(prev => prev.map(c => c.id === id ? { ...c, cobrado: true } : c));
    alert(`¡Cobro exitoso! Se añadieron $${monto} a la caja de hoy.`);
  };

  const handleAsignarRapido = (id) => {
    const nombreMascota = prompt("Ingresa el nombre de la mascota:");
    const motivoCita = prompt("Ingresa el motivo (Ej. Urgencia leve):");

    if (nombreMascota && motivoCita) {
      setCitas(prev => prev.map(c => c.id === id ? {
        ...c,
        disponible: false,
        mascota: nombreMascota,
        motivo: motivoCita,
        doctor: 'Por asignar médico',
        status: 'En Sala de Espera',
        cobrado: false,
        precio: 350
      } : c));
    }
  };

  return (
    <div className="recepcion-wrapper">
      <div className="header-main">
        <div>
          <h1>Panel Operativo de Recepción</h1>
          <p>Control de Caja, Turnos y Almacén de Suministros</p>
        </div>
      </div>

      {/* MÉTRICAS EN TIEMPO REAL */}
      <div className="stats-grid">
        <div className="stat-card green">
          <h4>Ingresos del Día</h4>
          <div className="value">$ {ingresos.toLocaleString('en-US')}.00</div>
        </div>
        <div className="stat-card">
          <h4>Citas Atendidas</h4>
          <div className="value">{atendidas}</div>
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

      <div className="panels-grid">
        {/* COLUMNA GESTIÓN DE CITAS */}
        <div className="panel">
          <div className="panel-header">
            <h2>Monitoreo de Consultorios</h2>
            <Link to="/citas">
              <button className="btn-action btn-add">+ Agendar Turno</button>
            </Link>
          </div>

          <div className="agenda-list">
            {citas.map((cita) => {
              if (cita.disponible) {
                return (
                  <div key={cita.id} className="agenda-item available">
                    <div className="time">{cita.horaTexto}</div>
                    <div className="details">
                      <h4 style={{ color: '#27ae60' }}>¡Espacio Libre!</h4>
                      <p>Disponible para ingreso directo presencial.</p>
                    </div>
                    <button className="btn-action btn-add" onClick={() => handleAsignarRapido(cita.id)}>Asignar Lugar</button>
                  </div>
                );
              }

              return (
                <div key={cita.id} className="agenda-item">
                  <div className="time">{cita.hora}</div>
                  <div className="details">
                    <h4>{cita.mascota} ({cita.motivo})</h4>
                    <p>{cita.doctor} | Estatus: <strong>{cita.status}</strong></p>
                  </div>
                  {cita.cobrado ? (
                    <button className="btn-action btn-paid" disabled>✓ Cobrado</button>
                  ) : (
                    <button className="btn-action btn-pay" onClick={() => handleCobrar(cita.id, cita.precio)}>
                      Cobrar ${cita.precio}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMNA MATERIALES */}
        <div className="panel">
          <div className="panel-header">
            <h2>Inventario & Faltantes</h2>
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

          <h3 style={{ marginTop: '25px' }}>Material de Curación</h3>
          <div className="alert-item">
            <span>Jeringas 3ml</span>
            <span className="stock-low">10 pzas</span>
          </div>
          <div className="alert-item">
            <span>Gasas Estériles</span>
            <span className="stock-ok">1 Paquete</span>
          </div>
          
          <button className="btn-action" style={{ width: '100%', marginTop: '25px', backgroundColor: '#012b81' }} onClick={() => alert('Generando orden de reabastecimiento en formato digital...')}>
            Generar Pedido Suministros
          </button>
        </div>
      </div>
    </div>
  );
}

export default Recepcion;