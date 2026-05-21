import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

function MisMascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [nombre, setNombre] = useState(''); // Estado para el input de nombre

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
      setNombre(''); // Limpiar el input
      cargarMascotas(); // Recargar la lista
    }
  };

  return (
    <div>
      <h1>Mis Mascotas</h1>
      
      {/* FORMULARIO DE ALTA */}
      <form onSubmit={registrarMascota}>
        <input 
          type="text" 
          placeholder="Nombre de la mascota" 
          value={nombre}
          onChange={(e) => setNombre(e.target.value)} 
          required
        />
        <button type="submit">Guardar Mascota</button>
      </form>

      {/* LISTA DE MASCOTAS */}
      <ul>
        {mascotas.map(m => (
          <li key={m.id}>{m.nombre}</li>
        ))}
      </ul>
    </div>
  );
}

export default MisMascotas;