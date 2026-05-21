import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import './PortalCliente.css'; // Asegúrate de tener este CSS importado

function MisMascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    cargarMascotas();
  }, []);

  const cargarMascotas = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn("No hay usuario autenticado.");
        return;
      }

      const { data, error } = await supabase
        .from('mascotas')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      if (data) setMascotas(data);
    } catch (err) {
      console.error("Error al cargar mascotas:", err.message);
    }
  };

  const registrarMascota = async (e) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Debes iniciar sesión");

      const { error } = await supabase
        .from('mascotas')
        .insert([{ nombre: nombre, user_id: user.id }]);

      if (error) throw error;

      alert("¡Mascota registrada con éxito!");
      setNombre('');
      cargarMascotas();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="portal-container">
      <header className="portal-header">
        <h1>Mis Mascotas</h1>
      </header>

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

      <h3 style={{ marginTop: '30px', color: '#333' }}>Mis peluditos registrados:</h3>
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