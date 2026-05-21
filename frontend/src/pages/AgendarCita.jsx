import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import './AgendarCita.css';

function AgendarCita() {
  const navigate = useNavigate();

  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth();
  const anioActual = fechaActual.getFullYear();
  const hoy = fechaActual.getDate();
  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  const [diaSeleccionado, setDiaSeleccionado] = useState(hoy);
  const [horaSeleccionada, setHoraSeleccionada] = useState('06:00 PM');
  const [servicio, setServicio] = useState('Consulta General');
  const [guardando, setGuardando] = useState(false);

  // Datos del cliente logueado
  const [clienteId, setClienteId] = useState(null);
  const [misMascotas, setMisMascotas] = useState([]);
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState('');

  useEffect(() => {
    obtenerClienteLogueado();
  }, []);

  const obtenerClienteLogueado = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: cliente, error } = await supabase
        .from('clientes')
        .select('id_cliente')
        .eq('email', session.user.email)
        .single();

      if (error) throw error;

      setClienteId(cliente.id_cliente);

      // Cargar solo las mascotas de este cliente
      const { data: mascotas, error: errorMascotas } = await supabase
        .from('mascotas')
        .select('id_mascota, nombre, especie')
        .eq('id_cliente', cliente.id_cliente);

      if (errorMascotas) throw errorMascotas;
      setMisMascotas(mascotas || []);
      if (mascotas && mascotas.length > 0) {
        setMascotaSeleccionada(mascotas[0].id_mascota);
      }
    } catch (error) {
      console.error("Error al obtener cliente:", error.message);
    }
  };

  const guardarRegistroCita = async (e) => {
    e.preventDefault();
    if (!mascotaSeleccionada) {
      alert('Por favor selecciona una mascota.');
      return;
    }
    setGuardando(true);

    try {
      let [time, modifier] = horaSeleccionada.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') hours = '00';
      if (modifier === 'PM') hours = parseInt(hours, 10) + 12;

      const mesFormateado = String(mesActual + 1).padStart(2, '0');
      const diaFormateado = String(diaSeleccionado).padStart(2, '0');
      const timestampCita = `${anioActual}-${mesFormateado}-${diaFormateado}T${hours}:${minutes}:00-06:00`;

      const { error } = await supabase
        .from('citas')
        .insert([{
          fecha_hora: timestampCita,
          motivo: servicio,
          id_mascota: mascotaSeleccionada,
          id_veterinario: 1
        }]);

      if (error) throw error;

      alert(`¡Cita agendada con éxito!\nFecha: ${diaSeleccionado} de ${meses[mesActual]} a las ${horaSeleccionada}`);
      navigate('/portal-cliente');
    } catch (err) {
      alert('Error al guardar la cita: ' + err.message);
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
        <div key={i} className={`day ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => !isDisabled && setDiaSeleccionado(i)}>
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
            <h1>Agenda tu Consulta Especializada</h1>
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
                  <div key={hora} className={`slot ${horaSeleccionada === hora ? 'selected' : ''}`}
                    onClick={() => setHoraSeleccionada(hora)}>
                    {hora}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>3. Información de la Cita</h3>
            <form className="form-grid" onSubmit={guardarRegistroCita}>

              {/* Selector de mascota — solo las del cliente logueado */}
              <div className="input-group">
                <label>Selecciona tu Mascota</label>
                {misMascotas.length === 0 ? (
                  <p style={{ color: '#e74c3c' }}>No tienes mascotas registradas. <Link to="/portal-cliente">Agrégalas en tu portal.</Link></p>
                ) : (
                  <select value={mascotaSeleccionada} onChange={e => setMascotaSeleccionada(e.target.value)} required>
                    {misMascotas.map(m => (
                      <option key={m.id_mascota} value={m.id_mascota}>
                        {m.nombre} ({m.especie})
                      </option>
                    ))}
                  </select>
                )}
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

              <button type="submit" className="btn-confirm" disabled={guardando || misMascotas.length === 0}>
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
