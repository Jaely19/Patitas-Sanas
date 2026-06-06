import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import './MisMascotas.css';

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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const correo = session.user.email;

      const { data: clientes } = await supabase
        .from('clientes')
        .select('id_cliente')
        .eq('correo', correo);

      if (!clientes || clientes.length === 0) return;

      const idsClientes = clientes.map(c => c.id_cliente);

      const { data, error } = await supabase
        .from('mascotas')
        .select('*')
        .in('id_cliente', idsClientes);

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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Debes iniciar sesión");

      const correo = session.user.email;

      const { data: clientes } = await supabase
        .from('clientes')
        .select('id_cliente')
        .eq('correo', correo)
        .maybeSingle();

      if (!clientes) throw new Error("No se encontró tu perfil de cliente.");

      const { error } = await supabase
        .from('mascotas')
        .insert([{ ...form, id_cliente: clientes.id_cliente }]);

      if (error) throw error;

      alert("¡Mascota registrada!");
      setForm({ nombre: '', sexo: '', especie: '', raza: '', fecha_nacimiento: '' });
      cargarMascotas();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="mascotas-wrapper">
      <div className="mascotas-container">
        <Link to="/portal-cliente" className="mascotas-back-link">
          ← Volver al Portal
        </Link>

        <div className="mascotas-header">
          <h1>🐾 Mis Mascotas</h1>
          <p>Gestiona el historial y datos de tus peluditos</p>
        </div>

        <div className="mascotas-form-card">
          <h3>Nueva mascota</h3>
          <form onSubmit={registrarMascota} className="mascotas-form">
            <input type="text" name="nombre" placeholder="Nombre *" value={form.nombre} onChange={handleChange} required />
            <input type="text" name="especie" placeholder="Especie (Perro, Gato...) *" value={form.especie} onChange={handleChange} required />
            <input type="text" name="raza" placeholder="Raza (opcional)" value={form.raza} onChange={handleChange} />
            <select name="sexo" value={form.sexo} onChange={handleChange}>
              <option value="">Sexo (opcional)</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
            <label>Fecha de nacimiento</label>
            <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} />
            <button type="submit" className="btn-guardar">Guardar Mascota</button>
          </form>
        </div>

        <h3 className="mascotas-subtitle">Mis peluditos registrados:</h3>
        <div className="mascotas-list">
          {mascotas.length === 0 && <p className="mascotas-empty">Aún no tienes mascotas registradas.</p>}
          {mascotas.map(m => (
            <div key={m.id_mascota} className="mascota-card">
              <span className="mascota-icon">{m.especie === 'Gato' ? '🐱' : m.especie === 'Ave' ? '🐦' : m.especie === 'Roedor' ? '🐹' : '🐶'}</span>
              <div>
                <strong>{m.nombre}</strong> — {m.especie} {m.raza ? `(${m.raza})` : ''}<br/>
                <span>Sexo: {m.sexo || 'N/A'} | Nacimiento: {m.fecha_nacimiento || 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MisMascotas;
