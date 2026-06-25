import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { citasEstaticas } from "../models/citas";
import { historialEstatico } from "../models/historial";
import "./Medico.css";

export default function Medico() {
  const navigate = useNavigate();
  const [veterinario, setVeterinario] = useState(null);
  const [citas, setCitas] = useState([]);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [historialMascota, setHistorialMascota] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [formulario, setFormulario] = useState({
    nombre_cliente: "", peso_kg: "", temperatura_c: "", costo_consulta: "",
    sintomas: "", diagnostico: "", tratamiento: "", notas_adicionales: "",
  });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    setVeterinario({ id_veterinario: 1, email: "vetalejandro@gmail.com", nombre_completo: "Dr. Alejandro", especialidad: "General" });
  }, []);

  useEffect(() => {
    if (veterinario) cargarCitas();
  }, [veterinario, fechaSeleccionada]);

  const cargarCitas = () => {
    // Usamos las citas estáticas y aseguramos que tengan la estructura necesaria
    const citasFormateadas = citasEstaticas.map(c => ({
      ...c, estado: c.estado || "Pendiente", mascotas: c.mascota, clientes: { nombre_completo: "Dueño Simulado" }
    }));
    setCitas(citasFormateadas);
  };

  useEffect(() => {
    if (!citaSeleccionada) {
      setHistorialMascota([]);
      return;
    }
    // Filtramos el historial estático
    setHistorialMascota(historialEstatico.filter(h => h.id_mascota === citaSeleccionada.mascota?.id_mascota || 1));
    setFormulario({ nombre_cliente: "", peso_kg: "", temperatura_c: "", costo_consulta: "", sintomas: "", diagnostico: "", tratamiento: "", notas_adicionales: "" });
  }, [citaSeleccionada]);

  const handleLogout = () => navigate("/login");

  const handleFechaChange = (e) => {
    if (e.target.value) setFechaSeleccionada(new Date(e.target.value + 'T00:00:00'));
  };

  const cancelarCita = (id_cita) => {
    if (!window.confirm("¿Cancelar cita?")) return;
    setCitas(prev => prev.map(c => c.id_cita === id_cita ? { ...c, estado: "Cancelada" } : c));
  };

  // ... (Conserva intacta la función generarRecetaPDF) ...

  const guardarConsulta = () => {
    if (!formulario.diagnostico) { setMensaje("⚠️ El diagnóstico es obligatorio."); return; }
    
    // Actualiza localmente el historial
    const nuevoRegistro = {
      created_at: new Date().toISOString(),
      diagnostico: formulario.diagnostico,
      veterinarios: { nombre_completo: veterinario.nombre_completo }
    };
    setHistorialMascota([nuevoRegistro, ...historialMascota]);
    
    // Actualiza la cita a completada
    setCitas(prev => prev.map(c => c.id_cita === citaSeleccionada.id_cita ? { ...c, estado: "Completada" } : c));
    setMensaje("✅ Consulta guardada correctamente (Modo Estático).");
  };

  const cerrarEvaluacion = () => {
    setCitaSeleccionada(null); setMensaje("");
    setFormulario({ nombre_cliente: "", peso_kg: "", temperatura_c: "", costo_consulta: "", sintomas: "", diagnostico: "", tratamiento: "", notas_adicionales: "" });
  };

  // ... (A partir de aquí, el código desde "const citasHoy" y el return quedan igual)

  const citasHoy = citas.length;
  const completadas = citas.filter(c => c.estado === "Completada").length;
  const cirugias = citas.filter(c => c.motivo.toLowerCase().includes("cirugía")).length;

  return (
    <div className="vet-wrapper">
      <aside className="vet-sidebar">
        <h2>Patitas<span>Sanas</span></h2>
        <ul className="nav-menu">
          <li><a href="#" className="active">📅 <span>Mi Agenda</span></a></li>
        </ul>
      </aside>

      <main className="main-content">
        <div className="header-main">
          <div>
            <h1>Bienvenido, {veterinario?.nombre_completo}</h1>
            <p>Panel de Control Veterinario</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h4>CITAS PROGRAMADAS</h4>
            <div className="value">{citasHoy.toString().padStart(2, '0')}</div>
          </div>
          <div className="stat-card" style={{ borderBottom: '4px solid var(--accent)' }}>
            <h4>CIRUGÍAS</h4>
            <div className="value">{cirugias.toString().padStart(2, '0')}</div>
          </div>
          <div className="stat-card">
            <h4>COMPLETADAS</h4>
            <div className="value">{completadas.toString().padStart(2, '0')}</div>
          </div>
        </div>

        {!citaSeleccionada ? (
          <section className="agenda-container">
            <div className="agenda-header">
              <h2>Cronograma Diario</h2>
              <div className="agenda-header-controls">
                <input 
                  type="date" 
                  className="calendar-input"
                  value={fechaSeleccionada.toISOString().split('T')[0]} 
                  onChange={handleFechaChange}
                />
                <span className="date-label">
                  {fechaSeleccionada.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="agenda-list">
              {citas.length === 0 ? (
                <p style={{padding: '20px', color: '#888'}}>No hay citas registradas para este día.</p>
              ) : (
                citas.map((cita) => (
                  <div key={cita.id_cita} className={`schedule-row ${cita.estado === "Completada" ? 'completed' : ''}`}>
                    <div className="time-col">
                      {new Date(cita.fecha_hora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div className="info-col">
                      <span className={`badge 
                        ${cita.estado === "Cancelada" ? 'badge-cancelada' : 
                          cita.motivo.toLowerCase().includes('cirugía') ? 'badge-cirugia' : 'badge-consulta'}`}>
                        {cita.estado === "Completada" ? "COMPLETADA" : cita.estado === "Cancelada" ? "CANCELADA" : "CONSULTA GENERAL"}
                      </span>
                      <h4>{cita.mascotas?.nombre}</h4>
                      <p>Dueño: {cita.clientes?.nombre_completo || cita.mascotas?.clientes?.nombre_completo || "Pendiente"} | <strong>Motivo:</strong> {cita.motivo}</p>
                    </div>
                    
                    <div className="action-col">
                      <button 
                        className={`btn-atender ${cita.estado === "Completada" ? "btn-editar" : ""}`}
                        onClick={() => setCitaSeleccionada(cita)}
                        disabled={cita.estado === "Cancelada"}
                        style={{ pointerEvents: 'auto', opacity: cita.estado === "Cancelada" ? 0.5 : 1 }}
                      >
                        {cita.estado === "Completada" ? "Ver/Editar" : "Atender"}
                      </button>

                      <button 
                        className="btn-cancelar"
                        onClick={() => cancelarCita(cita.id_cita)}
                        disabled={cita.estado === "Completada" || cita.estado === "Cancelada"}
                        style={{ pointerEvents: 'auto' }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        ) : (
          <section className="evaluacion-container">
            <div className="evaluacion-header">
              <h2>🩺 Evaluación Médica: {citaSeleccionada.mascotas?.nombre}</h2>
              <button className="btn-volver" onClick={cerrarEvaluacion}>← Volver a la Agenda</button>
            </div>

            <div className="evaluacion-split">
              <div className="vet-historial-box">
                <h3>📖 Historial Previo</h3>
                <div className="historial-lista">
                  {historialMascota.length === 0 ? (
                    <p>No hay registros médicos anteriores para esta mascota.</p>
                  ) : (
                    historialMascota.map((reg, idx) => (
                      <div key={idx} className="historial-item">
                        <strong>{new Date(reg.created_at).toLocaleDateString()} - Dr. {reg.veterinarios?.nombre_completo}</strong>
                        <p>{reg.diagnostico}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="vet-form-box">
                <h3> Redactar Consulta Actual</h3>
                
                <input 
                  type="text" 
                  placeholder="Nombre del Dueño / Cliente" 
                  value={formulario.nombre_cliente} 
                  onChange={(e) => setFormulario({ ...formulario, nombre_cliente: e.target.value })} 
                />

                <div className="form-grid">
                  <input type="number" placeholder="Peso (kg)" value={formulario.peso_kg} onChange={(e) => setFormulario({ ...formulario, peso_kg: e.target.value })} />
                  <input type="number" placeholder="Temp (°C)" value={formulario.temperatura_c} onChange={(e) => setFormulario({ ...formulario, temperatura_c: e.target.value })} />
                </div>
                
                <textarea placeholder="Síntomas..." value={formulario.sintomas} onChange={(e) => setFormulario({ ...formulario, sintomas: e.target.value })} />
                <textarea placeholder="Diagnóstico *" value={formulario.diagnostico} onChange={(e) => setFormulario({ ...formulario, diagnostico: e.target.value })} />
                <textarea placeholder="Tratamiento / Receta..." value={formulario.tratamiento} onChange={(e) => setFormulario({ ...formulario, tratamiento: e.target.value })} />
                
                <div style={{ marginTop: '15px', marginBottom: '5px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'var(--primary)', fontSize: '14px' }}>
                    💵 Costo Total de la Consulta:
                  </label>
                  <input 
                    type="number" 
                    placeholder="Ej. 450.00" 
                    value={formulario.costo_consulta} 
                    onChange={(e) => setFormulario({ ...formulario, costo_consulta: e.target.value })} 
                    style={{ fontSize: '16px', fontWeight: '600', borderColor: 'var(--accent)' }}
                  />
                </div>
                
                <div className="form-actions">
                  <button className="btn-save" onClick={guardarConsulta}>Guardar Consulta</button>
                  <button className="btn-pdf" onClick={generarRecetaPDF}>Descargar Receta y Pago (PDF)</button>
                </div>
                {mensaje && <p className="form-msg">{mensaje}</p>}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}