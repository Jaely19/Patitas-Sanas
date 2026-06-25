import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { usuariosEstaticos } from '../models/usuarios'; // Importamos el Modelo
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

  // Esta función actúa como tu Controlador
  const handleSubmit = (e) => {
    e.preventDefault();
    const emailLimpio = email.trim();
    setCargando(true);

    if (isLogin) {
      // 1. El Controlador consulta al Modelo
      const usuarioValido = usuariosEstaticos.find(
        (user) => user.correo === emailLimpio && user.password === password
      );

      // 2. El Controlador decide qué hacer con la Vista
      if (usuarioValido) {
        alert(`Bienvenido al sistema. Accediendo como: ${usuarioValido.rol}`);
        navigate(usuarioValido.ruta); // Redirige al panel correspondiente
      } else {
        alert('Credenciales incorrectas. Verifica tu correo y contraseña.');
      }
    } else {
      // Lógica estática para "Registro" (Opcional si el profesor pide solo estático)
      // En un entorno 100% estático sin backend, el registro es solo una simulación visual.
      if (!nombreCompleto) {
        alert('Por favor ingresa tu nombre completo.');
      } else {
        alert('Simulación de cuenta creada con éxito (Modo Estático).');
        const rutaDestino = location.state?.returnTo || '/agendar-cita';
        navigate(rutaDestino);
      }
    }
    
    setCargando(false);
  };

  // Lo que retorna el componente es tu Vista
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