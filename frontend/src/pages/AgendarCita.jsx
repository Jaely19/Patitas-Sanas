import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import './AgendarCita.css';

function AgendarCita() {
  const navigate = useNavigate();
  
  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth(); 
  const anioActual = fechaActual.getFullYear();
  const hoy = fechaActual.getDate();
  
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const [diaSeleccionado, setDiaSeleccionado] = useState(hoy);
  const [horaSeleccionada, setHoraSeleccionada] = useState('06:00 PM');
  const [nombreDueño, setNombreDueño] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDirección] = useState('');
  const [nombreMascota, setNombreMascota] = useState('');
  const [especie, setEspecie] = useState('Perro');
  const [servicio, setServicio] = useState('Consulta General');
  const [guardando, setGuardando] = useState(false);

  const guardarRegistroCita = async (e) => {
    e.preventDefault();
    setGuardando(true);

    try {
      // Obtener correo del usuario logueado
      const { data: { session } } = await supabase.auth.getSession();
      const correoUsuario = session?.user?.email || null;

      // PASO 1: Guardar al Dueño CON el correo
      const { data: clienteInsertado, error: errorCliente } = await supabase
        .from('clientes')
        .insert([{ 
          nombre_completo: nombreDueño, 
          telefono: telefono, 
          direccion: direccion,
          correo: correoUsuario  // 👈 guardamos el correo
        }])
        .select()
        .single();

      if (errorCliente) throw errorCliente;

      const idCliente = clienteInsertado.id || clienteInsertado.id_cliente;

      // PASO 2: Guardar Mascota
      const { data: mascotaInsertada, error: errorMascota } = await supabase
        .from('mascotas')
        .insert([{ 
          nombre: nombreMascota, 
          especie: especie, 
          id_cliente: idCliente 
        }])
        .select()
        .single();

      if (errorMascota) throw errorMascota;

      // Convertir hora
      let [time, modifier] = horaSeleccionada.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') hours = '00';
      if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
      
      const mesFormateado = String(mesActual + 1).padStart(2, '0');
      const diaFormateado = String(diaSeleccionado).padStart(2, '0');
      const timestampCita = `${anioActual}-${mesFormateado}-${diaFormateado}T${hours}:${minutes}:00-06:00`;

      const idMascota = mascotaInsertada.id || mascotaInsertada.id_mascota;

      // PASO 3: Guardar Cita
      const { error: errorCita } = await supabase
        .from('citas')
        .insert([{
          fecha_hora: timestampCita,
          motivo: servicio,
          id_mascota: idMascota,
          id_veterinario: 1
        }]);

      if (errorCita) throw errorCita;

      alert(`¡Cita Agendada y Guardada en la Nube!\n\nPaciente: ${nombreMascota}\nFecha: ${diaSeleccionado} de ${meses[mesActual]} a las ${horaSeleccionada}`);
      navigate('/mis-citas'); // 👈 redirige a Mis Citas

    } catch (err) {
      alert('Hubo un error al guardar la reservación. Revisa la consola.');
      console.error('Detalle del error:', err.message);
    } finally {
      setGuardando(false);
    }
  };

  const renderDias = () => {
    const dias = [];
    const primerDiaDelMes = new Date(anioActual, mesActual, 1).getDay();
    const espaciosVacios = primerDiaDelMes === 0 ? 6 : primerDiaDelMes - 1;
    const diasTotalesDelMes = new Date(anioActual, mesActual + 1, 0).getDate();

    for (let i = 0; i < espaciosVacios; i++) {
      dias.push(<div key={`empty-${i}`} className="day empty"></div>);
    }
    
    for (let i = 1; i <= diasTotalesDelMes; i++) {
      const fechaIteracion = new Date(anioActual, mesActual, i);
      const diaSemana = fechaIteracion.getDay();
      const esFinDeSemana = diaSemana === 0 || diaSemana === 6;
      const esPasado = i < hoy; 
      const isDisabled = esFinDeSemana || esPasado;
      const isSelected = diaSeleccionado === i;
      
      dias.push(
        <div 
          key={i} 
          className={`day ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => !isDisabled && setDiaSeleccionado(i)}
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
        <Link to="/portal-cliente" style={{ color: '#012b81', textDecoration: 'none', fontWeight: 'bold', marginBottom: '20px', display: 'inline-block' }}>
          ← Cancelar y volver al Portal
        </Link>
        
        <div className="appointment-card">
          <div className="header-citas">
            <h1>Agenda tu Consulta Specialized</h1>
            <p>Selecciona una fecha y horario para la atención de tu mascota.</p>
          </div>

          <div className="booking-grid">
            <div className="calendar-box">
              <h3>1. Selecciona el día ({meses[mesActual]} {anioActual})</h3>
              <div className="calendar">
                <div className="cal-header">
                  <span>&lt;</span>
                  <span>{meses[mesActual]} {anioActual}</span>
                  <span>&gt;</span>
                </div>
                <div className="cal-grid">
                  <div className="day-name">LU</div><div className="day-name">MA</div><div className="day-name">MI</div>
                  <div className="day-name">JU</div><div className="day-name">VI</div><div className="day-name">SA</div>
                  <div className="day-name">DO</div>
                  {renderDias()}
                </div>
              </div>
            </div>

            <div className="time-box">
              <h3>2. Horarios Disponibles</h3>
              <div className="time-slots">
                {horarios.map(hora => (
                  <div 
                    key={hora}
                    className={`slot ${horaSeleccionada === hora ? 'selected' : ''}`}
                    onClick={() => setHoraSeleccionada(hora)}
                  >
                    {hora}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>3. Información de Registro</h3>
            <form className="form-grid" onSubmit={guardarRegistroCita}>
              <div className="input-group">
                <label>Nombre del Dueño</label>
                <input type="text" placeholder="Ej. Juan Pérez" value={nombreDueño} onChange={e => setNombreDueño(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Teléfono de Contacto</label>
                <input type="tel" placeholder="55 0000 0000" value={telefono} onChange={e => setTelefono(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Dirección</label>
                <input type="text" placeholder="Calle, Número, Colonia" value={direccion} onChange={e => setDirección(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Nombre de la Mascota</label>
                <input type="text" placeholder="Ej. Toby" value={nombreMascota} onChange={e => setNombreMascota(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Especie de la Mascota</label>
                <select value={especie} onChange={e => setEspecie(e.target.value)} required>
                  <option value="Perro">Perro (Canino)</option>
                  <option value="Gato">Gato (Felino)</option>
                  <option value="Ave">Ave</option>
                  <option value="Roedor">Roedor</option>
                </select>
              </div>
              <div className="input-group">
                <label>Tipo de Servicio</label>
                <select value={servicio} onChange={e => setServicio(e.target.value)}>
                  <option value="Consulta General">Consulta General</option>
                  <option value="Oncología">Oncología (Dr. Celis)</option>
                  <option value="Cirugía / Ortopedia">Cirugía / Ortopedia</option>
                  <option value="Medicina Interna">Medicina Interna</option>
                </select>
              </div>
              
              <button type="submit" className="btn-confirm" disabled={guardando}>
                {guardando ? 'Guardando en la Nube...' : 'Confirmar Reservación'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgendarCita;
