import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { citasEstaticas } from '../models/citas';
import { inventarioEstatico } from '../models/inventario';
import './DashRec.css';

export const Recepcion = () => {
  const navigate = useNavigate();

  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [agenda, setAgenda] = useState([]);
  const [ingresosTotales, setIngresosTotales] = useState(0);
  const [citasAtendidas, setCitasAtendidas] = useState(0);
  const [alertasStock, setAlertasStock] = useState(0); 
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchCitasPorFecha();
    fetchAlertasStock(); 
  }, [fechaSeleccionada]);

  const fetchAlertasStock = () => {
    const productosConAlerta = inventarioEstatico.filter(prod => prod.cantidad <= prod.stock_minimo);
    setAlertasStock(productosConAlerta.length);
  };

  const fetchCitasPorFecha = () => {
    setCargando(true);
    setTimeout(() => {
      const citasFormateadas = citasEstaticas.map(cita => ({
        id_cita: cita.id_cita,
        time: cita.fecha_hora.split('T')[1].substring(0,5), // Extrae "10:00"
        isAvailable: false, 
        isPaid: cita.estado === 'Completada', 
        isCancelled: cita.estado === 'Cancelada', 
        name: cita.mascota?.nombre || 'Mascota',
        type: cita.motivo,
        details: `Dr. Asignado | Status: ${cita.estado || 'Pendiente'}`,
        monto: cita.monto || null 
      }));
      setAgenda(citasFormateadas);
      calcularEstadisticas(citasFormateadas);
      setCargando(false);
    }, 400);
  };

  const calcularEstadisticas = (citas) => {
    let total = 0; let atendidas = 0;
    citas.forEach(cita => {
      if (cita.isPaid && cita.monto) { total += Number(cita.monto); atendidas += 1; }
    });
    setIngresosTotales(total); setCitasAtendidas(atendidas);
  };

  const handleCobrar = (id_cita, montoActual) => {
    let montoACobrar = montoActual;
    if (!montoACobrar) {
      const inputMonto = window.prompt("Ingresa el monto a cobrar (Ej. 350):");
      if (!inputMonto || isNaN(inputMonto) || Number(inputMonto) <= 0) return alert("Monto inválido.");
      montoACobrar = Number(inputMonto);
    }
    
    setAgenda(prev => prev.map(c => c.id_cita === id_cita ? { ...c, isPaid: true, monto: montoACobrar, details: `Dr. Asignado | Status: Completada` } : c));
    calcularEstadisticas([...agenda.filter(c => c.id_cita !== id_cita), { isPaid: true, monto: montoACobrar }]);
    alert(`Pago de $${montoACobrar} registrado (Modo Estático).`);
  };

  const handleCancelar = (id_cita) => {
    if (!window.confirm("¿Cancelar cita?")) return;
    setAgenda(prev => prev.map(c => c.id_cita === id_cita ? { ...c, isCancelled: true, details: `Dr. Asignado | Status: Cancelada` } : c));
  };

  const handleLogout = () => navigate('/login');

  // ... (A partir de aquí, el código desde "const opcionesFecha" y el return quedan igual)

  const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const fechaHoyStr = new Date().toLocaleDateString('es-MX', opcionesFecha);
  const esHoy = fechaSeleccionada === new Date().toISOString().split('T')[0];

  return (
    <div className="rec-wrapper">
      <aside className="rec-sidebar">
        <h2>Patitas<span>Sanas</span></h2>
        <ul className="rec-nav-menu">
          <li><a href="#" className="active">📅 Agenda y Caja</a></li>
          <li>
            <a 
              href="#" 
              onClick={(e) => { 
                e.preventDefault(); 
                navigate('/agendar-cita', { state: { origen: 'recepcion' } }); 
              }}
            >
              ➕ Nueva Cita
            </a>
          </li>
          <li>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/inventario');
              }}
            >
              📦 Inventario
            </a>
          </li>
        </ul>
      </aside>

      <main className="rec-main-content">
        <div className="rec-header-main">
          <div>
            <h1>Panel de Recepción</h1>
            <p style={{ textTransform: 'capitalize' }}>{fechaHoyStr} | Turno General</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
        </div>

        <div className="stats-grid">
          <div className="stat-card green">
            <h4>{esHoy ? 'INGRESOS DEL DÍA' : 'INGRESOS DE LA FECHA'}</h4>
            <div className="value">$ {ingresosTotales.toLocaleString('en-US')}.00</div>
          </div>
          <div className="stat-card">
            <h4>CITAS COBRADAS</h4>
            <div className="value">{citasAtendidas}</div>
          </div>
          <div className="stat-card orange">
            <h4>CITAS AGENDADAS</h4>
            <div className="value">{agenda.length}</div>
          </div>
          
          <div className="stat-card red" style={{ cursor: 'pointer' }} onClick={() => navigate('/inventario')}>
            <h4>ALERTAS DE STOCK</h4>
            <div className="value">{alertasStock}</div>
          </div>
        </div>

        <div className="panels-grid" style={{ gridTemplateColumns: '1fr' }}>
          <div className="panel">
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <h2>Gestión de Citas</h2>
                <input 
                  type="date" 
                  value={fechaSeleccionada}
                  onChange={(e) => setFechaSeleccionada(e.target.value)}
                  style={{ 
                    padding: '8px 12px', 
                    borderRadius: '5px', 
                    border: '1px solid #ccc', 
                    color: 'var(--primary)', 
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                />
              </div>
              <button className="btn-action btn-add" onClick={() => navigate('/agendar-cita', { state: { origen: 'recepcion' } })}>+ Agendar Turno</button>
            </div>

            <div className="agenda-list">
              {cargando ? (
                 <p style={{ color: 'gray', padding: '20px', textAlign: 'center' }}>Cargando agenda...</p>
              ) : agenda.length === 0 ? (
                <p style={{ color: 'gray', padding: '20px', textAlign: 'center' }}>No hay citas agendadas para esta fecha en la base de datos.</p>
              ) : (
                agenda.map((cita) => (
                  <div key={cita.id_cita} className="agenda-item">
                    <div className="time">{cita.time}</div>
                    
                    <div className="details" style={{ flex: 1, padding: '0 15px' }}>
                      <h4>{cita.name} <span style={{ fontWeight: 'normal', color: '#666', fontSize: '0.9rem' }}>({cita.type})</span></h4>
                      <p>{cita.details}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      {cita.isCancelled ? (
                        <button className="btn-action" disabled style={{ backgroundColor: '#e0e0e0', color: '#666', border: '1px solid #ccc', cursor: 'not-allowed' }}>
                          Cancelada
                        </button>
                      ) : cita.isPaid ? (
                        <button className="btn-action btn-paid" disabled>
                          Cobrado
                        </button>
                      ) : (
                        <>
                          <button 
                            className="btn-action btn-pay"
                            onClick={() => handleCobrar(cita.id_cita, cita.monto)}
                          >
                            Cobrar {cita.monto ? `$${cita.monto}` : ''}
                          </button>
                          
                          <button 
                            className="btn-action btn-cancel"
                            onClick={() => handleCancelar(cita.id_cita)}
                            style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Recepcion;