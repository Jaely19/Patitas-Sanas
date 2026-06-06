import { useState, useEffect } from 'react';

function Mascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [raza, setRaza] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [sexo, setSexo] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/mascotas')
      .then((r) => r.json())
      .then((datos) => setMascotas(datos))
      .catch((e) => console.error('Error al cargar mascotas:', e));
  }, []);

  const guardarMascota = async (evento) => {
    evento.preventDefault();
    const nuevaMascota = { nombre, especie, raza, fecha_nacimiento: fechaNacimiento, sexo };
    try {
      const respuesta = await fetch('http://localhost:4000/api/mascotas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaMascota),
      });
      if (respuesta.ok) {
        alert('¡Mascota guardada con éxito!');
        setNombre(''); setEspecie(''); setRaza('');
        setFechaNacimiento(''); setSexo('');
        fetch('http://localhost:4000/api/mascotas')
          .then((r) => r.json())
          .then((datos) => setMascotas(datos));
      }
    } catch (e) { console.error('Error al guardar mascota:', e); }
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
          min-height: 100%;
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
        .masc-form-box input[type="date"] { color: #333; }

        .masc-date-label {
          font-size: 0.8rem;
          color: #999;
          margin-bottom: -6px;
          padding-left: 2px;
        }

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
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
            <select value={especie} onChange={(e) => setEspecie(e.target.value)}>
              <option value="">Especie</option>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
              <option value="Ave">Ave</option>
              <option value="Otro">Otro</option>
            </select>
            <input
              placeholder="Raza"
              value={raza}
              onChange={(e) => setRaza(e.target.value)}
            />
            <p className="masc-date-label">Fecha de nacimiento</p>
            <input
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
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
                <strong>{m.nombre} — {m.especie} ({m.raza})</strong>
                <span>Sexo: {m.sexo} | Nacimiento: {m.fecha_nacimiento}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Mascotas;
