import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './Login.css'; 

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cargando, setCargando] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // PRE-CARGAR DATOS ESTÁTICOS PARA QUE EL PROYECTO NO SE VEA VACÍO
  useEffect(() => {
    const usuariosDB = JSON.parse(localStorage.getItem('patitas_usuarios') || '[]');
    
    // Si no hay usuarios, inyectamos los datos de prueba iniciales
    if (usuariosDB.length === 0) {
      const demoUser = { 
        email: 'usuariodemo@gmail.com', 
        password: 'usuario1234', 
        nombreCompleto: 'Usuario de Prueba', 
        telefono: '5512345678', 
        rol: 'Cliente' 
      };
      localStorage.setItem('patitas_usuarios', JSON.stringify([demoUser]));
      
      // Mascotas de prueba
      const mascotasDemo = [
        { id: 1, dueñoEmail: 'usuariodemo@gmail.com', nombre: 'Firulais', especie: 'Perro', raza: 'Mestizo', edad: 3 },
        { id: 2, dueñoEmail: 'usuariodemo@gmail.com', nombre: 'Michi', especie: 'Gato', raza: 'Siamés', edad: 2 }
      ];
      localStorage.setItem('patitas_mascotas', JSON.stringify(mascotasDemo));

      // Citas de prueba para que Recepción y Veterinario tengan qué ver
      const citasDemo = [
        { id: 1, clienteEmail: 'usuariodemo@gmail.com', mascota: 'Firulais', fecha: '2026-06-30', hora: '10:00', motivo: 'Vacunación', estado: 'Pendiente' },
        { id: 2, clienteEmail: 'usuariodemo@gmail.com', mascota: 'Michi', fecha: '2026-07-02', hora: '12:30', motivo: 'Revisión General', estado: 'Pendiente' }
      ];
      localStorage.setItem('patitas_citas', JSON.stringify(citasDemo));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailLimpio = email.trim();

    // --- CUENTAS ESTÁTICAS DEL SISTEMA ---
    
    // 1. Administrador
    if (emailLimpio === 'admin@patitassanas.com' && password === 'Admin1234') {
      localStorage.setItem('currentUser', JSON.stringify({ email: emailLimpio, rol: 'Administrador', nombreCompleto: 'Administrador del Sistema' }));
      navigate('/admin');
      return; 
    }

    // 2. Recepcionista
    if (emailLimpio === 'marirep@gmail.com' && password === 'Spam18091809.') {
      localStorage.setItem('currentUser', JSON.stringify({ email: emailLimpio, rol: 'Recepcionista', nombreCompleto: 'Mari (Recepción)' }));
      navigate('/recepcion');
      return; 
    }

    // 3. Veterinario
    if (emailLimpio === 'veterinario@demo.com' && password === 'vet123') {
      localStorage.setItem('currentUser', JSON.stringify({ email: emailLimpio, rol: 'Veterinario', nombreCompleto: 'Dr. Veterinario' }));
      navigate('/demo-veterinario');
      return; 
    }

    // 4. Usuario de Prueba (Cliente)
    if (emailLimpio === 'usuariodemo@gmail.com' && password === 'usuario1234') {
      localStorage.setItem('currentUser', JSON.stringify({ email: emailLimpio, rol: 'Cliente', nombreCompleto: 'Usuario de Prueba' }));
      navigate(location.state?.returnTo || '/portal-cliente');
      return; 
    }

    setCargando(true);
    
    // Simulamos un pequeño tiempo de carga para los clientes dinámicos
    setTimeout(() => {
      const rutaDestino = location.state?.returnTo || '/portal-cliente';
      const usuariosDB = JSON.parse(localStorage.getItem('patitas_usuarios') || '[]');

      if (!isLogin) {
        // --- REGISTRO SIMULADO PARA CLIENTES ---
        if (!nombreCompleto) {
          alert('Por favor ingresa tu nombre completo.');
          setCargando(false);
          return;
        }
        
        // Verificar si el correo ya existe
        if (usuariosDB.find(u => u.email === emailLimpio)) {
          alert('Este correo ya está registrado.');
          setCargando(false);
          return;
        }

        // Crear nuevo usuario local
        const nuevoUsuario = { email: emailLimpio, password, nombreCompleto, telefono, rol: 'Cliente' };
        usuariosDB.push(nuevoUsuario);
        localStorage.setItem('patitas_usuarios', JSON.stringify(usuariosDB));
        
        // Iniciar sesión automáticamente
        localStorage.setItem('currentUser', JSON.stringify(nuevoUsuario));
        
        alert('¡Cuenta creada con éxito!');
        navigate(location.state?.returnTo ? rutaDestino : '/agendar-cita');

      } else {
        // --- INICIO DE SESIÓN SIMULADO PARA CLIENTES NUEVOS ---
        const usuarioEncontrado = usuariosDB.find(u => u.email === emailLimpio && u.password === password);
        
        if (usuarioEncontrado) {
          localStorage.setItem('currentUser', JSON.stringify(usuarioEncontrado));
          navigate(rutaDestino);
        } else {
          alert('Credenciales incorrectas o el usuario no existe.');
        }
      }
      setCargando(false);
    }, 600);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Portal de Acceso</h2>

        <div className="tabs">
          <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>
            Iniciar Sesión
          </button>
          <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <>
              <div className="input-group">
                <label>Nombre Completo *</label>
                <input 
                  type="text" 
                  placeholder="Tu nombre completo" 
                  value={nombreCompleto} 
                  onChange={(e) => setNombreCompleto(e.target.value)} 
                  required={!isLogin} 
                />
              </div>
              <div className="input-group">
                <label>Teléfono (opcional)</label>
                <input 
                  type="tel" 
                  placeholder="10 dígitos" 
                  value={telefono} 
                  onChange={(e) => setTelefono(e.target.value)} 
                />
              </div>
            </>
          )}

          <div className="input-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="ejemplo@correo.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              placeholder="Tu contraseña" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn-submit" disabled={cargando}>
            {cargando ? 'Cargando...' : (isLogin ? 'Entrar' : 'Crear Cuenta')}
          </button>
        </form>

        <div className="login-footer">
          <Link to="/">← Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;