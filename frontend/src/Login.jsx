import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from './supabase'; // 💡 Asegúrate de usar la ruta correcta a tu archivo de configuración de Supabase
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    // 🧼 Limpiamos espacios en blanco invisibles al inicio o final del correo
    const emailLimpio = email.trim();

    try {
      if (isLogin) {
        // --- INICIAR SESIÓN ---
        const { error } = await supabase.auth.signInWithPassword({ 
          email: emailLimpio, 
          password 
        });
        if (error) throw error;

        alert(`¡Bienvenido de nuevo!`);
        navigate('/portal-cliente');

      } else {
        // --- REGISTRARSE ---
        // 1. Crear el usuario únicamente en Supabase Auth
        // El flujo continuará en la pantalla de agendar cita, donde se guardarán los datos residenciales y de la mascota.
        const { error: errorAuth } = await supabase.auth.signUp({ 
          email: emailLimpio, 
          password 
        });
        if (errorAuth) throw errorAuth;

        alert('¡Cuenta creada con éxito! Ahora por favor completa los datos de tu cita.');
        navigate('/agendar-cita');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Portal de Acceso</h2>

        <div className="tabs">
          <button type="button" className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>
            Iniciar Sesión
          </button>
          <button type="button" className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">

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
            <label>{isLogin ? 'Contraseña' : 'Crear Contraseña'}</label>
            <input
              type="password"
              placeholder={isLogin ? 'Tu contraseña' : 'Mínimo 8 caracteres'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={cargando}>
            {cargando ? 'Cargando...' : isLogin ? 'Entrar a mi cuenta' : 'Crear Cuenta'}
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