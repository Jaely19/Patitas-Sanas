import { useState, useEffect } from 'react';

function Citas() {
  const [veterinarios, setVeterinarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [mascotasDelCliente, setMascotasDelCliente] = useState([]);
  
  // NUEVO: Estado para guardar la agenda completa
  const [listaCitas, setListaCitas] = useState([]); 

  const [idClienteTemporal, setIdClienteTemporal] = useState('');
  const [idMascota, setIdMascota] = useState('');
  const [idVeterinario, setIdVeterinario] = useState('');
  const [fechaHora, setFechaHora] = useState('');
  const [motivo, setMotivo] = useState('');

  // Función para pedir la agenda completa al backend
  const cargarAgenda = () => {
    fetch('http://localhost:4000/api/citas_detalladas')
      .then(res => res.json())
      .then(datos => setListaCitas(datos))
      .catch(err => console.error('Error al cargar agenda:', err));
  };

  useEffect(() => {
    fetch('http://localhost:4000/api/veterinarios')
      .then(res => res.json())
      .then(datos => setVeterinarios(datos));

    fetch('http://localhost:4000/api/clientes')
      .then(res => res.json())
      .then(datos => setClientes(datos));

    // Pedimos la agenda apenas cargue la página
    cargarAgenda();
  }, []);

  useEffect(() => {
    if (!idClienteTemporal) {
      setMascotasDelCliente([]);
      return;
    }
    fetch(`http://localhost:4000/api/mascotas/cliente/${idClienteTemporal}`)
      .then(res => res.json())
      .then(datos => setMascotasDelCliente(datos));
  }, [idClienteTemporal]);

  const agendarCita = async (evento) => {
    evento.preventDefault();
    const nuevaCita = { id_mascota: idMascota, id_veterinario: idVeterinario, fecha_hora: fechaHora, motivo: motivo };

    try {
      const respuesta = await fetch('http://localhost:4000/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaCita),
      });

      if (respuesta.ok) {
        alert('📅 ¡Cita agendada exitosamente!');
        setIdMascota('');
        setIdVeterinario('');
        setFechaHora('');
        setMotivo('');
        
        // Refrescamos la tabla automáticamente
        cargarAgenda(); 
      }
    } catch (error) {
      console.error('Error al agendar cita:', error);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto', color: 'white' }}>
      <h2 style={{ color: '#4CAF50', borderBottom: '2px solid #4CAF50', paddingBottom: '10px' }}>
        📅 Gestión de Agenda
      </h2>

      {/* Formulario Superior */}
      <div style={{ backgroundColor: '#242424', padding: '25px', borderRadius: '10px', marginTop: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
        <form onSubmit={agendarCita} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <label style={{ fontWeight: 'bold' }}>Médico Veterinario:</label>
          <select value={idVeterinario} onChange={(e) => setIdVeterinario(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }}>
            <option value="">-- Selecciona un doctor --</option>
            {veterinarios.map(vet => (
              <option key={vet.id_veterinario} value={vet.id_veterinario}>Dr(a). {vet.nombre_completo}</option>
            ))}
          </select>

          <label style={{ fontWeight: 'bold' }}>Buscar Dueño:</label>
          <select value={idClienteTemporal} onChange={(e) => setIdClienteTemporal(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }}>
            <option value="">-- Selecciona el dueño --</option>
            {clientes.map(cliente => (
              <option key={cliente.id_cliente} value={cliente.id_cliente}>{cliente.nombre_completo}</option>
            ))}
          </select>

          {idClienteTemporal && (
            <>
              <label style={{ fontWeight: 'bold', color: '#4CAF50' }}>Paciente a consultar:</label>
              <select value={idMascota} onChange={(e) => setIdMascota(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '2px solid #4CAF50', backgroundColor: '#1a1a1a', color: 'white' }}>
                <option value="">-- Selecciona a la mascota --</option>
                {mascotasDelCliente.map(mascota => (
                  <option key={mascota.id_mascota} value={mascota.id_mascota}>{mascota.nombre} ({mascota.especie})</option>
                ))}
              </select>
            </>
          )}

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Fecha y Hora:</label>
              <input type="datetime-local" value={fechaHora} onChange={(e) => setFechaHora(e.target.value)} required style={{ width: '95%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white', colorScheme: 'dark' }} />
            </div>
            <div style={{ flex: 2 }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Motivo:</label>
              <input type="text" value={motivo} onChange={(e) => setMotivo(e.target.value)} required style={{ width: '95%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }} />
            </div>
          </div>

          <button type="submit" style={{ padding: '12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
            + Confirmar Cita
          </button>
        </form>
      </div>

      {/* NUEVO: Tabla de la Agenda Inferior */}
      <div style={{ backgroundColor: '#242424', padding: '25px', borderRadius: '10px', marginTop: '30px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
        <h3 style={{ marginTop: '0', color: '#4CAF50' }}>📋 Próximas Consultas</h3>
        
        {listaCitas.length === 0 ? (
          <p style={{ color: '#aaa' }}>No hay citas agendadas por el momento.</p>
        ) : (
          <table style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left', fontSize: '15px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #4CAF50' }}>
                <th style={{ padding: '12px' }}>Fecha y Hora</th>
                <th style={{ padding: '12px' }}>Paciente</th>
                <th style={{ padding: '12px' }}>Dueño</th>
                <th style={{ padding: '12px' }}>Veterinario</th>
                <th style={{ padding: '12px' }}>Motivo</th>
              </tr>
            </thead>
            <tbody>
              {listaCitas.map((cita) => {
                // Formateamos la fecha para que se vea más bonita
                const fechaFormateada = new Date(cita.fecha_hora).toLocaleString('es-MX', { 
                  dateStyle: 'medium', timeStyle: 'short' 
                });

                return (
                  <tr key={cita.id_cita} style={{ borderBottom: '1px solid #444' }}>
                    <td style={{ padding: '12px', color: '#8bc34a', fontWeight: 'bold' }}>{fechaFormateada}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{cita.nombre_mascota}</td>
                    <td style={{ padding: '12px' }}>{cita.nombre_dueño}</td>
                    <td style={{ padding: '12px' }}>Dr. {cita.nombre_veterinario}</td>
                    <td style={{ padding: '12px', fontStyle: 'italic', color: '#bbb' }}>{cita.motivo}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Citas;