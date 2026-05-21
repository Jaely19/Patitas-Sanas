import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import './PortalCliente.css'; // Asegúrate de que importe el CSS

function MisMascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [nombre, setNombre] = useState('');

  // ... (tu lógica de useEffect, cargarMascotas y registrarMascota se queda IGUAL)

  return (
    <div className="portal-container">
      <header className="portal-header">
        <h1>Mis Mascotas</h1>
      </header>

      {/* FORMULARIO dentro de una card */}
      <div className="dashboard-grid">
        <div className="card">
          <form onSubmit={registrarMascota}>
            <input 
              type="text" 
              placeholder="Nombre de la mascota" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)} 
              required
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button type="submit" className="btn-secundario">Guardar Mascota</button>
          </form>
        </div>
      </div>

      {/* LISTA */}
      <h3 style={{ marginTop: '30px' }}>Mis peluditos registrados:</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {mascotas.map(m => (
          <li key={m.id} className="card" style={{ margin: '10px auto', maxWidth: '300px' }}>
            {m.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MisMascotas;