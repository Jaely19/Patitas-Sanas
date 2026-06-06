import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

function Mascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [sexo, setSexo] = useState('');
  const [edad, setEdad] = useState('');
  const [idCliente, setIdCliente] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerClienteYMascotas();
  }, []);

  const obtenerClienteYMascotas = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return navigate('/login');

    const { data: cliente } = await supabase
      .from('clientes')
      .select('id_cliente')
      .eq('correo', session.user.email)
      .single();

    if (cliente) {
      setIdCliente(cliente.id_cliente);
      const { data: mascotasData } = await supabase
        .from('mascotas')
        .select('*')
        .eq('id_cliente', cliente.id_cliente);
      setMascotas(mascotasData || []);
    }
  };

  const guardarMascota = async () => {
    if (!nombre || !especie) return alert('Nombre y especie son obligatorios');
    const { error } = await supabase.from('mascotas').insert({
      id_cliente: idCliente,
      nombre,
      especie,
      sexo,
      edad: edad ? parseInt(edad) : null,
    });
    if (error) { console.error(error); return alert('Error al guardar'); }
    alert('¡Mascota guardada!');
    setNombre(''); setEspecie(''); setSexo(''); setEdad('');
    obtenerClienteYMascotas();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');

        .masc-wrap {
          font-family: 'Nunito', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px;
          min-height: 100vh;
          background: #f0f2f8;
        }

        .masc-modal {
          background: #fff;
          border-radius: 20px;
          padding: 40px 36px;
          width: 100%;
          max-width: 520px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }

        .masc-modal h2 {
          font-size: 1.7rem;
          font-weight: 800;
          color: #1a2a6c;
          text-align: center;
          margin-bottom: 24px;
        }

        .masc-form-box {
          border: 1px solid #e0e0e0;
          border-radius: 14px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 28px;
        }

        .masc-form-box input,
        .masc-form-box select {
          width: 100%;
          border: 1px solid #d0d0d0;
          border-radius: 8px;
          padding: 11px 14px;
          font-family: 'Nunito', sans-serif;
          font-size: 0.95rem;
          color: #333;
          outline: none;
          transition: border-color 0.15s;
          background: #fff;
        }
        .masc-form-box input:focus,
        .masc-form-box select:focus { border-color: #4a90d9; }
        .masc-form-box input::placeholder { color: #bbb; }

        .masc-btn-guardar {
          background: #4a90d9;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 12px;
          font-family: 'Nunito', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          width: 100%;
          transition: opacity 0.15s;
        }
        .masc-btn-guardar:hover { opacity: 0.88; }

        .masc-pets-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #1a2a6c;
          text-align: center;
          margin-bottom: 14px;
        }

        .masc-pet-item {
          border: 1px solid #e8e8e8;
          border-radius: 12px;
          padding: 14px 18px;
          margin-bottom: 10px;
          background: #fafafa;
        }
        .masc-pet-item strong {
          font-size: 0.97rem;
          color: #1a2a6c;
          display: block;
        }
        .masc-pet-item span {
          font-size: 0.87rem;
          color: #777;
          margin-top: 3px;
          display: block;
        }

        .masc-empty {
          text-align: center;
          color: #aaa;
          font-size: 0.9rem;
          padding: 10px 0;
        }

        .masc-volver {
          margin-top: 24px;
          background: none;
          border: none;
          color: #1a2a6c;
          font-family: 'Nunito', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
        }
        .masc-volver:hover { opacity: 0.7; }
      `}</style>

      <div className="masc-wrap">
        <div className="masc-modal">
          <h2>Mis Mascotas</h2>

          <div className="masc-form-box">
            <input
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <select value={sexo} onChange={(e) => setSexo(e.target.value)}>
              <option value="">Sexo</option>
              <option value="M">Macho</option>
              <option value="H">Hembra</option>
            </select>
            <select value={especie} onChange={(e) => setEspecie(e.target.value)}>
              <option value="">Especie</option>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
              <option value="Ave">Ave</option>
              <option value="Otro">Otro</option>
            </select>
            <input
              placeholder="Edad (años)"
              type="number"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
            />
            <button className="masc-btn-guardar" onClick={guardarMascota}>
              Guardar Mascota
            </button>
          </div>

          <p className="masc-pets-title">Mis peluditos registrados:</p>
          {mascotas.length === 0 ? (
            <p className="masc-empty">No hay mascotas registradas aún.</p>
          ) : (
            mascotas.map((m) => (
              <div key={m.id_mascota} className="masc-pet-item">
                <strong>{m.nombre} — {m.especie}</strong>
                <span>Sexo: {m.sexo === 'M' ? 'Macho' : m.sexo === 'H' ? 'Hembra' : 'N/A'} | Edad: {m.edad ? m.edad + ' años' : 'N/A'}</span>
              </div>
            ))
          )}
        </div>

        <button className="masc-volver" onClick={() => navigate('/portal-cliente')}>
          ← Volver al Portal
        </button>
      </div>
    </>
  );
}

export default Mascotas;
