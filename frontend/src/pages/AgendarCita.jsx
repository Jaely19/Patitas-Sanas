import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import './AgendarCita.css';

function AgendarCita() {
  const navigate = useNavigate();
  
  // 1. Obtenemos la fecha real de la computadora
  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth(); // 0 = Enero, 1 = Febrero...
  const anioActual = fechaActual.getFullYear();
  const hoy = fechaActual.getDate();
  
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  // Estados para guardar lo que el cliente selecciona
  const [diaSeleccionado, setDiaSeleccionado] = useState(hoy);
  const [horaSeleccionada, setHoraSeleccionada] = useState('06:00 PM');
  
  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [mascota, setMascota] = useState('');
  const [servicio, setServicio] = useState('consulta');

  // Función para manejar el envío
  const guardarRegistroCita = (e) => {
    e.preventDefault();
    alert(`¡Reserva Confirmada!\n\nPaciente: ${mascota}\nFecha: ${diaSeleccionado} de ${meses[mesActual]} a las ${horaSeleccionada}\n\nTe esperamos en clínica.`);
    navigate('/');
  };

  // 2. Generador INTELIGENTE de días del calendario
  const renderDias = () => {
    const dias = [];
    
    // Averiguamos qué día de la semana cae el día 1 de este mes
    const primerDiaDelMes = new Date(anioActual, mesActual, 1).getDay();
    
    // Ajustamos para que la cuadrícula empiece en Lunes
    const espaciosVacios = primerDiaDelMes === 0 ? 6 : primerDiaDelMes - 1;
    
    // Averiguamos el total de días reales que tiene este mes (28, 30 o 31)
    const diasTotalesDelMes = new Date(anioActual, mesActual + 1, 0).getDate();

    // Dibujamos los espacios vacíos al inicio de la tabla
    for (let i = 0; i < espaciosVacios; i++) {
      dias.push(<div key={`empty-${i}`} className="day empty"></div>);
    }
    
    // Dibujamos los días reales
    for (let i = 1; i <= diasTotalesDelMes; i++) {
      const fechaIteracion = new Date(anioActual, mesActual, i);
      const diaSemana = fechaIteracion.getDay();
      
      // Regla de negocio: Bloquear fines de semana (0=Dom, 6=Sab) y días pasados
      const esFinDeSemana = diaSemana === 0 || diaSemana === 6;
      const esPasado = i < hoy; 
      
      const isDisabled = esFinDeSemana || esPasado;
      const isSelected = diaSeleccionado === i;
      
      dias.push(
        <div 
          key={i} 
          className={`day ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => !isDisabled && setDiaSeleccionado(i)}
          title={isDisabled ? "No disponible" : "Seleccionar este día"}
        >
          {i}
        </div>
      );
    }
    return dias;
  };

  const horarios = ['11:00 AM', '12:00 PM', '01:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];

  return (
    <div className="agendar-wrapper">
      <div className="container">
        <Link to="/" style={{ color: '#012b81', textDecoration: 'none', fontWeight: 'bold', marginBottom: '20px', display: 'inline-block' }}>
          ← Volver al inicio
        </Link>
        
        <div className="appointment-card">
          <div className="header-citas">
            <h1>Agenda tu Consulta Especializada</h1>
            <p>Selecciona una fecha y horario para la atención de tu mascota.</p>
          </div>

          <div className="booking-grid">
            {/* SECCIÓN DEL CALENDARIO DINÁMICO */}
            <div className="calendar-box">
              <h3>1. Selecciona el día ({meses[mesActual]} {anioActual})</h3>
              <div className="calendar">
                <div className="cal-header">
                  <span style={{cursor: 'pointer'}}>&lt;</span>
                  <span>{meses[mesActual]} {anioActual}</span>
                  <span style={{cursor: 'pointer'}}>&gt;</span>
                </div>
                <div className="cal-grid">
                  <div className="day-name">LU</div><div className="day-name">MA</div><div className="day-name">MI</div>
                  <div className="day-name">JU</div><div className="day-name">VI</div><div className="day-name">SA</div>
                  <div className="day-name">DO</div>
                  {renderDias()}
                </div>
              </div>
            </div>

            {/* SECCIÓN DE HORARIOS */}
            <div className="time-box">
              <h3>2. Horarios Disponibles</h3>
              <div className="time-slots">
                {horarios.map(hora => {
                  const isUnavailable = hora === '03:00 PM';
                  return (
                    <div 
                      key={hora}
                      className={`slot ${isUnavailable ? 'unavailable' : ''} ${horaSeleccionada === hora ? 'selected' : ''}`}
                      onClick={() => !isUnavailable && setHoraSeleccionada(hora)}
                    >
                      {hora}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FORMULARIO DE RESERVA */}
          <div className="form-section">
            <h3>3. Información de Registro</h3>
            <form className="form-grid" onSubmit={guardarRegistroCita}>
              <div className="input-group">
                <label>Nombre del Dueño</label>
                <input type="text" placeholder="Ej. Juan Pérez" value={nombre} onChange={e => setNombre(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Teléfono de Contacto</label>
                <input type="tel" placeholder="55 0000 0000" required />
              </div>
              <div className="input-group">
                <label>Dirección</label>
                <input type="text" placeholder="Calle, Número, Colonia" required />
              </div>
              <div className="input-group">
                <label>Nombre de la Mascota</label>
                <input type="text" placeholder="Ej. Toby" value={mascota} onChange={e => setMascota(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Especie de la Mascota</label>
                <select required defaultValue="">
                  <option value="" disabled>Selecciona una opción...</option>
                  <option value="canino">Perro (Canino)</option>
                  <option value="felino">Gato (Felino)</option>
                  <option value="ave">Ave</option>
                  <option value="roedor">Roedor</option>
                </select>
              </div>
              <div className="input-group">
                <label>Tipo de Servicio</label>
                <select value={servicio} onChange={e => setServicio(e.target.value)}>
                  <option value="oncologia">Oncología (Dr. Celis)</option>
                  <option value="consulta">Consulta General</option>
                  <option value="cirugia">Cirugía / Ortopedia</option>
                  <option value="interna">Medicina Interna</option>
                </select>
              </div>
              
              <button type="submit" className="btn-confirm">
                Confirmar Reservación
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgendarCita;