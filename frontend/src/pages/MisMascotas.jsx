import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

function MisMascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    cargarMascotas();
  }, []);

  const cargarMascotas = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('mascotas')
      .select('*')
      .eq('user_id', user.id);

    if (data) setMascotas(data);
  };

  const registrarMascota = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('mascotas')
      .insert([{ nombre: nombre, user_id: user.id }]);

    if (error) {
      alert("Error al registrar: " + error.message);
    } else {
      alert("Mascota registrada");
      setNombre('');
      cargarMascotas();
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', color: '#333' }}>
      <h1 style={{ color: '#012b81' }}>Mis Mascotas</h1>
      
      {/* FORMULARIO */}
      <form onSubmit={registrarMascota} style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="Nombre de la mascota" 
          value={nombre}
          onChange={(e) => setNombre(e.target.value)} 
          required
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#012b81', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Guardar
        </button>
      </form>

      {/* LISTA */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {mascotas.map(m => (
          <li key={m.id} style={{ padding: '15px', backgroundColor: '#f4f4f4', marginBottom: '10px', borderRadius: '5px', borderLeft: '5px solid #012b81' }}>
            {m.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MisMascotas;