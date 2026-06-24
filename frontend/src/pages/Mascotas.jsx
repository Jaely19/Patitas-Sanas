import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [idCliente, setIdCliente] = useState(null);
  
  const [idMascotaEditando, setIdMascotaEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    obtenerClienteYMascotas();
  }, []);

  const obtenerClienteYMascotas = () => {
    // Obtener sesión local simulada
    const sesionActual = localStorage.getItem('currentUser');
    if (!sesionActual) return navigate('/login');

    const cliente = JSON.parse(sesionActual);
    setIdCliente(cliente.email); // Usamos el email como identificador único estático

    // Cargar mascotas del localStorage
    const todasLasMascotas = JSON.parse(localStorage.getItem('patitas_mascotas') || '[]');
    const mascotasDelCliente = todasLasMascotas.filter(m => m.id_cliente === cliente.email);
    setMascotas(mascotasDelCliente);
  };

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
    setNombre(''); 
    setEspecie(''); 
    setSexo(''); 
    setEdad('');
    setCaracteristicas(''); 
    setFoto(null);
    if(document.getElementById('foto-input')) document.getElementById('foto-input').value = '';
    setIdMascotaEditando(null);
    setMostrarFormulario(false); 
  };

  const procesarImagenBase64 = (archivo) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(archivo);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const guardarMascota = async () => {
    if (!nombre || !especie) return alert('Nombre y especie son obligatorios');
    setCargando(true);

    try {
      let fotoUrl = null;

      // Si suben una foto, la convertimos a formato Base64 para guardarla estáticamente
      if (foto) {
        fotoUrl = await procesarImagenBase64(foto);
      }

      const todasLasMascotas = JSON.parse(localStorage.getItem('patitas_mascotas') || '[]');

      if (idMascotaEditando) {
        const index = todasLasMascotas.findIndex(m => m.id_mascota === idMascotaEditando);
        if(index !== -1) {
          todasLasMascotas[index] = {
            ...todasLasMascotas[index],
            nombre, especie, sexo, edad: edad ? parseInt(edad) : null, caracteristicas,
            ...(fotoUrl && { foto_url: fotoUrl }) // Solo actualiza foto si se subió una nueva
          };
        }
        alert('¡Datos de la mascota actualizados!');
      } else {
        const nuevaMascota = {
          id_mascota: Date.now().toString(), // Generar un ID único estático
          id_cliente: idCliente,
          nombre, especie, sexo, edad: edad ? parseInt(edad) : null, caracteristicas,
          foto_url: fotoUrl
        };
        todasLasMascotas.push(nuevaMascota);
        alert('¡Mascota guardada con éxito!');
      }
      
      // Guardar en la base de datos simulada del navegador
      localStorage.setItem('patitas_mascotas', JSON.stringify(todasLasMascotas));
      
      cancelarEdicion(); 
      obtenerClienteYMascotas();

    } catch (error) {
      console.error("Error al guardar la mascota:", error);
      alert('Hubo un error al guardar localmente.');
    } finally {
      setCargando(false);
    }
  };

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
              placeholder="Características (Ej. Manchas negras...)"
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