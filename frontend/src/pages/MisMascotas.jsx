import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import './PortalCliente.css';

function MisMascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    sexo: '',
    especie: '',
    raza: '',
    fecha_nacimiento: ''
  });

  useEffect(() => {
    cargarMascotas();
  }, []);

  const cargarMascotas = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from('mascota')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      if (data) setMascotas(data);
    } catch (err) {
      console.error("Error al cargar:", err.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registrarMascota = async (e) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Debes iniciar sesión");

      const { error } = await supabase
        .from('mascota')
        .insert([{ ...form, user_id: user.id }]);

      if (error) throw error;

      alert("¡Mascota registrada!");
      setForm({ nombre: '', sexo: '', especie: '', raza: '', fecha_nacimiento: '' });
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
            <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required style={input} />
            
            <select name="sexo" value={form.sexo} onChange={handleChange} required style={input}>
              <option value="">Sexo</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>

            <select name="especie" value={form.especie} onChange={handleChange} required style={input}>
              <option value="">Especie</option>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
              <option value="Conejo">Conejo</option>
              <option value="Ave">Ave</option>
              <option value="Otro">Otro</option>
            </select>

            <input type="text" name="raza" placeholder="Raza" value={form.raza} onChange={handleChange} style={input} />
            
            <label style={{ fontSize: '13px', color: '#666' }}>Fecha de nacimiento</label>
            <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} style={input} />

            <button type="submit" className="btn-secundario">Guardar Mascota</button>
          </form>
        </div>
      </div>

      <h3 style={{ marginTop: '30px', color: '#333' }}>Mis peluditos registrados:</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {mascotas.map(m => (
          <li key={m.id_mascota} className="card" style={{ margin: '10px auto', maxWidth: '400px', padding: '15px' }}>
            <strong>{m.nombre}</strong> — {m.especie} ({m.raza})<br/>
            <span>Sexo: {m.sexo} | Nacimiento: {m.fecha_nacimiento}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const input = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc'
};

export default MisMascotas;