import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import './DashRec.css'; 

export const Recepcion = () => {
  const navigate = useNavigate();

  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [agenda, setAgenda] = useState([]);
  const [ingresosTotales, setIngresosTotales] = useState(0);
  const [citasAtendidas, setCitasAtendidas] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchCitasPorFecha(fechaSeleccionada);
  }, [fechaSeleccionada]);

  const fetchCitasPorFecha = async (fecha) => {
    setCargando(true);
    try {
      const { data, error } = await supabase
        .from('citas')
        .select('*, mascotas(nombre), veterinarios(nombre_completo)')
        .gte('fecha_hora', `${fecha}T00:00:00`)
        .lte('fecha_hora', `${fecha}T23:59:59`)
        .order('fecha_hora', { ascending: true });

      if (error) throw error;

      if (data) {
        const citasFormateadas = data.map(cita => {
          const fechaObj = new Date(cita.fecha_hora);
          const horaFormateada = fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return {
            id_cita: cita.id_cita,
            time: horaFormateada,
            isAvailable: false, 
            isPaid: cita.estado === 'Completada', 
            isCancelled: cita.estado === 'Cancelada', // NUEVO: Identificamos si está cancelada
            name: cita.mascotas?.nombre || 'Mascota',
            type: cita.motivo,
            details: `${cita.veterinarios?.nombre_completo || 'Asignado'} | Status: ${cita.estado}`,
            monto: cita.monto || null 
          };
        });
        setAgenda(citasFormateadas);
        calcularEstadisticas(citasFormateadas);
      }
    } catch (error) {
      console.error('Error al cargar las citas:', error.message);
    } finally {
      setCargando(false);
    }
  };

  const calcularEstadisticas = (citas) => {
    let total = 0;
    let atendidas = 0;
    citas.forEach(cita => {
      if (cita.isPaid && cita.monto) {
        total += Number(cita.monto);
        atendidas += 1;
      }
    });
    setIngresosTotales(total);
    setCitasAtendidas(atendidas);
  };

  const handleCobrar = async (id_cita, montoActual) => {
    try {
      let montoACobrar = montoActual;
      if (!montoACobrar) {
        const inputMonto = window.prompt("Ingresa el monto a cobrar (Ej. 350):");
        if (!inputMonto || isNaN(inputMonto) || Number(inputMonto) <= 0) {
          alert("Debes ingresar un monto numérico mayor a 0.");
          return;
        }
        montoACobrar = Number(inputMonto);
      }
      const { error } = await supabase
        .from('citas')
        .update({ estado: 'Completada', monto: montoACobrar })
        .eq('id_cita', id_cita); 

      if (error) throw error;
      alert(`Pago de $${montoACobrar} registrado exitosamente en caja.`);
      fetchCitasPorFecha(fechaSeleccionada); 
    } catch (error) {
      alert(`Error al registrar el cobro: ${error.message}`);
    }
  };

  // NUEVO: Función para cancelar la cita
  const handleCancelar = async (id_cita) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas cancelar esta cita?");
    if (!confirmar) return;

    try {
      const { error } = await supabase
        .from('citas')
        .update({ estado: 'Cancelada' }) // Asume que 'Cancelada' es un estado válido en tu BD
        .eq('id_cita', id_cita);

      if (error) throw error;
      
      alert("Cita cancelada exitosamente.");
      fetchCitasPorFecha(fechaSeleccionada); // Refrescamos la lista
    } catch (error) {
      alert(`Error al cancelar la cita: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

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
          <li><a href="#">📦 Inventario</a></li>
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
          <div className="stat-card red">
            <h4>ALERTAS DE STOCK</h4>
            <div className="value">3</div>
          </div>
        </div>

        <div className="panels-grid">
          <div className="panel">
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <h2 style={{ margin: 0 }}>Gestión de Citas</h2>
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

                    {/* NUEVO: Lógica condicional para los botones */}
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

          <div className="panel">
            <h2>Faltantes y Material</h2>
            
            <h3>Medicamentos</h3>
            <div className="alert-item">
              <span>Vacuna Múltiple</span>
              <span className="stock-low">2 Dosis restantes</span>
            </div>
            <div className="alert-item">
              <span>Desparasitante</span>
              <span className="stock-ok">5 Tabletas</span>
            </div>
            <div className="alert-item">
              <span>Meloxicam</span>
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
            
            <button 
              style={{ width: '100%', marginTop: '25px', background: 'var(--primary)', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }} 
              onClick={() => window.alert('Esta función se conectará a la base de datos de inventario pronto.')}
            >
              Generar Pedido de Surtido
            </button>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Recepcion;