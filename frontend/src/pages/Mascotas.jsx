import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mascotasEstaticas } from '../models/mascotas'; // 1. Importamos modelo
import './Mascotas.css'; 

function Mascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [sexo, setSexo] = useState('');
  const [edad, setEdad] = useState('');
  const [caracteristicas, setCaracteristicas] = useState('');
  const [foto, setFoto] = useState(null); 
  const [cargando, setCargando] = useState(false); 
  
  const [idMascotaEditando, setIdMascotaEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  const navigate = useNavigate();

  // 2. Cargamos los datos estáticos al iniciar
  useEffect(() => {
    setMascotas(mascotasEstaticas);
  }, []);

  const editarMascota = (mascota) => {
    setNombre(mascota.nombre);
    setEspecie(mascota.especie);
    setSexo(mascota.sexo);
    setEdad(mascota.edad || '');
    setCaracteristicas(mascota.caracteristicas || ''); 
    setIdMascotaEditando(mascota.id_mascota);
    setMostrarFormulario(true); 
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const cancelarEdicion = () => {
    setNombre(''); setEspecie(''); setSexo(''); setEdad(''); setCaracteristicas(''); 
    setFoto(null);
    document.getElementById('foto-input').value = '';
    setIdMascotaEditando(null);
    setMostrarFormulario(false); 
  };

  // 3. Simulamos guardar localmente sin base de datos
  const guardarMascota = () => {
    if (!nombre || !especie) return alert('Nombre y especie son obligatorios');
    setCargando(true);

    let fotoUrlLocal = null;
    // Usamos URL temporal para simular que se subió una foto en entorno estático
    if (foto) {
      fotoUrlLocal = URL.createObjectURL(foto); 
    }

    const datosNuevos = {
      id_mascota: idMascotaEditando || Date.now(), // Generamos ID aleatorio para las nuevas
      nombre, especie, sexo, edad: edad ? parseInt(edad) : null, caracteristicas
    };

    if (idMascotaEditando) {
      // Editar existente en el arreglo
      setMascotas(mascotas.map(m => m.id_mascota === idMascotaEditando ? 
        { ...m, ...datosNuevos, foto_url: fotoUrlLocal || m.foto_url } : m
      ));
      alert('¡Datos de la mascota actualizados!');
    } else {
      // Agregar nueva al arreglo
      datosNuevos.foto_url = fotoUrlLocal;
      setMascotas([...mascotas, datosNuevos]);
      alert('¡Mascota guardada con éxito!');
    }
    
    cancelarEdicion(); 
    setCargando(false);
  };

  // ... (Conserva todo el código del `return (...)` exactamente igual que como lo tienes)
  // ... Solo asegúrate de copiar desde el return hasta el final del archivo.

  return (
    <div className="masc-wrap">
      <div className="masc-modal">
        <h2>Mis Mascotas</h2>
        {mascotas.length === 0 ? (
          <p className="masc-empty">No hay mascotas registradas aún. ¡Registra a tu primer peludito!</p>
        ) : (
          <div className="credenciales-grid">
            {mascotas.map((m) => (
              <div key={m.id_mascota} className="credencial-card">
                
                <div className="credencial-header">
                  <div className="credencial-logo">🐾</div>
                  <div className="credencial-titles">
                    <p>INSTITUTO NACIONAL DE MASCOTAS</p>
                    <p>REGISTRO DE ANGELITOS PELUDOS</p>
                    <p>CREDENCIAL PARA LADRAR</p>
                  </div>
                </div>

                <div className="credencial-body">
                  <div className="credencial-left">
                    <div className="credencial-photo-box">
                      {m.foto_url ? (
                        <img src={m.foto_url} alt={`Foto de ${m.nombre}`} />
                      ) : (
                        <span className="credencial-photo-placeholder">🐶</span>
                      )}
                    </div>
                    <div className="credencial-barcode" title="Código de Mascota"></div>
                  </div>

                  <div className="credencial-right">
                    <div className="credencial-field">
                      <label>NOMBRE:</label>
                      <span>{m.nombre}</span>
                    </div>
                    
                    <div className="credencial-row-split">
                      <div className="credencial-field">
                        <label>ESPECIE:</label>
                        <span>{m.especie}</span>
                      </div>
                      <div className="credencial-field" style={{ flex: '0.5' }}>
                        <label>SEXO:</label>
                        <span>{m.sexo}</span>
                      </div>
                    </div>

                    <div className="credencial-field">
                      <label>EDAD:</label>
                      <span>{m.edad ? `${m.edad} AÑOS` : 'N/A'}</span>
                    </div>

                    <div className="credencial-field">
                      <label>CARACTERÍSTICAS:</label>
                      <span>{m.caracteristicas ? m.caracteristicas : 'MUY BUEN CHICO'}</span>
                    </div>
                    
                    <button 
                      className="btn-editar-mascota" 
                      onClick={() => editarMascota(m)}
                    >
                      ✏️ Editar Datos
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <hr style={{ border: 'none', borderTop: '2px dashed #e0e0e0', margin: '30px 0' }} />
        <button 
          className="btn-toggle-form" 
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            if(idMascotaEditando) cancelarEdicion(); 
          }}
        >
          {mostrarFormulario ? '▲ Ocultar Formulario' : '➕ Agregar Nueva Mascota'}
        </button>
        {mostrarFormulario && (
          <div className="masc-form-box">
            <h3 style={{ textAlign: 'center', color: '#1a2a6c', marginTop: 0 }}>
              {idMascotaEditando ? '✏️ Editando Mascota' : 'Registrar Peludito'}
            </h3>
            
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

            <input
              placeholder="Características (Ej. Manchas negras, muy juguetón...)"
              value={caracteristicas}
              onChange={(e) => setCaracteristicas(e.target.value)}
              maxLength={40} 
            />
            
            <input
              id="foto-input"
              type="file"
              accept="image/*"
              className="masc-input-file"
              onChange={(e) => setFoto(e.target.files[0])}
            />
            <small style={{ color: '#777', fontSize: '0.8rem', marginTop: '-8px' }}>
              {idMascotaEditando ? 'Sube una foto solo si deseas cambiar la actual.' : 'Sube una foto de tu peludito (opcional)'}
            </small>

            <div className="masc-form-acciones">
              <button 
                className="masc-btn-guardar" 
                onClick={guardarMascota}
                disabled={cargando}
              >
                {cargando ? 'Guardando...' : (idMascotaEditando ? 'Actualizar Mascota' : 'Guardar Mascota')}
              </button>
              
              {idMascotaEditando && (
                <button 
                  className="masc-btn-cancelar" 
                  onClick={cancelarEdicion}
                  disabled={cargando}
                >
                  Cancelar Edición
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      <button className="masc-volver" onClick={() => navigate('/portal-cliente')}>
        ← Volver al Portal
      </button>

    </div>
  );
}

export default Mascotas;