import { useState, useEffect } from 'react';

function Clientes() {
  // 1. Estado para almacenar la lista de clientes que viene de la base de datos
  const [clientes, setClientes] = useState([]);

  // 2. Estados individuales para controlar cada caja de texto del formulario
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');

  // 3. Función centralizada para ir a buscar los clientes al Backend
  const obtenerClientes = () => {
    fetch('http://localhost:4000/api/clientes')
      .then((respuesta) => respuesta.json())
      .then((datos) => setClientes(datos))
      .catch((error) => console.error('Error al cargar clientes:', error));
  };

  // Se ejecuta automáticamente al abrir la página
  useEffect(() => {
    obtenerClientes();
  }, []);

  // 4. Función que se dispara al presionar el botón "Guardar"
  const guardarCliente = async (evento) => {
    evento.preventDefault(); // Evita que el navegador recargue la página

    // Empaquetamos los datos en el formato exacto que espera Node.js
    const nuevoCliente = {
      nombre_completo: nombre,
      telefono: telefono,
      email: email,
      direccion: direccion
    };

    try {
      const respuesta = await fetch('http://localhost:4000/api/clientes', {
        method: 'POST', // Indicamos que vamos a insertar datos
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoCliente),
      });

      if (respuesta.ok) {
        // Si el Backend responde con éxito (Status 200), limpiamos las cajas de texto
        setNombre('');
        setTelefono('');
        setEmail('');
        setDireccion('');
        
        // Volvemos a pedir la lista de clientes para que la tabla se actualice al instante
        obtenerClientes();
        alert('¡Cliente registrado con éxito en la clínica!');
      }
    } catch (error) {
      console.error('Error al guardar el cliente:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ color: '#4CAF50', textAlign: 'center' }}>🐾 Clínica Veterinaria Patitas Sanas</h1>

      {/* --- CAJA DEL FORMULARIO --- */}
      <div style={{ backgroundColor: '#242424', padding: '25px', borderRadius: '10px', marginBottom: '40px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
        <h2 style={{ marginTop: '0' }}>Registrar Nuevo Dueño</h2>
        
        <form onSubmit={guardarCliente} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="text"
            placeholder="Nombre Completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }}
          />
          <input
            type="tel"
            placeholder="Teléfono (Ej. 5512345678)"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }}
          />
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }}
          />
          <input
            type="text"
            placeholder="Dirección Completa"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#1a1a1a', color: 'white' }}
          />
          <button 
            type="submit" 
            style={{ padding: '12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}
          >
            Guardar Cliente
          </button>
        </form>
      </div>

      {/* --- CAJA DE LA TABLA --- */}
      <div style={{ backgroundColor: '#242424', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
        <h2 style={{ marginTop: '0' }}>Directorio de Clientes</h2>
        
        {clientes.length === 0 ? (
          <p style={{ color: '#aaa' }}>Cargando información o no hay clientes registrados...</p>
        ) : (
          <table style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #4CAF50' }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>Nombre</th>
                <th style={{ padding: '12px' }}>Teléfono</th>
                <th style={{ padding: '12px' }}>Email</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id_cliente} style={{ borderBottom: '1px solid #444' }}>
                  <td style={{ padding: '12px' }}>{cliente.id_cliente}</td>
                  <td style={{ padding: '12px' }}>{cliente.nombre_completo}</td>
                  <td style={{ padding: '12px' }}>{cliente.telefono}</td>
                  <td style={{ padding: '12px' }}>{cliente.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Clientes;

