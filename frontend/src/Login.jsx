import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [tabActiva, setTabActiva] = useState('login');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // Estados para el formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError(false);
    
    const correoLimpio = email.toLowerCase().trim();

    // Lógica de roles basada en tu HTML original
    if (correoLimpio === 'vet@gmail.com' && password === '12345') {
      // Redirige al panel del veterinario (ruta que armaremos después)
      navigate('/panel-vet');
    } else if (correoLimpio === 'rec@gmail.com' && password === '12345') {
      // Redirige al panel de recepción (que era tu dashboard oscuro)
      navigate('/recepcion'); 
    } else if ((correoLimpio === 'vet@gmail.com' || correoLimpio === 'rec@gmail.com') && password !== '12345') {
      setError(true);
    } else {
      // Si es un cliente normal, lo mandamos a la agenda pública
      navigate('/agendar-cita');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    alert('¡Cuenta creada con éxito! Ahora puedes agendar tus citas.');
    navigate('/agendar-cita');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        
        <div className="auth-header">
          <h1>Patitas<span> Sanas</span></h1>
          <p>Portal de Acceso</p>
        </div>

        {/* PESTAÑAS (TABS) */}
        <div className="tabs">
          <div className={`tab ${tabActiva === 'login' ? 'active' : ''}`} onClick={() => setTabActiva('login')}>
            Iniciar Sesión
          </div>
          <div className={`tab ${tabActiva === 'register' ? 'active' : ''}`} onClick={() => setTabActiva('register')}>
            Registrarse
          </div>
        </div>

        {/* FORMULARIO DE LOGIN */}
        {tabActiva === 'login' && (
          <div>
            {error && <p className="error-msg">Correo o contraseña incorrectos.</p>}
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Correo Electrónico</label>
                <input type="email" placeholder="ejemplo@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Contraseña</label>
                <input type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn-submit">Entrar</button>
            </form>
          </div>
        )}

        {/* FORMULARIO DE REGISTRO */}
        {tabActiva === 'register' && (
          <div>
            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label>Tu Nombre Completo</label>
                <input type="text" placeholder="Ej. Juan Pérez" required />
              </div>
              <div className="input-group">
                <label>Nombre de tu Mascota</label>
                <input type="text" placeholder="Ej. Toby" required />
              </div>
              <div className="input-group">
                <label>Correo Electrónico</label>
                <input type="email" placeholder="ejemplo@correo.com" required />
              </div>
              <div className="input-group">
                <label>Crear Contraseña</label>
                <input type="password" placeholder="Mínimo 8 caracteres" required />
              </div>
              <button type="submit" className="btn-submit" style={{ backgroundColor: '#FF9B1B' }}>Crear Cuenta</button>
            </form>
          </div>
        )}

        <Link to="/" className="back-home">← Volver al inicio</Link>
      </div>
    </div>
  );
}

export default Login;