import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      if (isLogin) {
        // --- INICIAR SESIÓN ---
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        alert(`¡Bienvenido de nuevo!`);
        navigate('/portal-cliente');

      } else {
        // --- REGISTRARSE ---
        if (!nombreCompleto) {
          alert('Por favor ingresa tu nombre completo.');
          setCargando(false);
          return;
        }

        // 1. Crear el usuario en Supabase Auth
        const { data, error: errorAuth } = await supabase.auth.signUp({ email, password });
        if (errorAuth) throw errorAuth;

        // 2. Insertar en la tabla clientes con el email
        const { error: errorCliente } = await supabase
          .from('clientes')
          .insert([{
            nombre_completo: nombreCompleto,
            telefono: telefono || null,
            email: email,
          }]);

        if (errorCliente) throw errorCliente;

        alert('¡Cuenta creada con éxito! Ahora agenda tu primera cita.');
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
          <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>
            Iniciar Sesión
          </button>
          <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">

          {/* Solo al registrarse pedimos nombre y teléfono */}
          {!isLogin && (
            <>
              <div className="input-group">
                <label>Nombre Completo *</label>
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  required
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
