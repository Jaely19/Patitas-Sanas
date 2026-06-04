import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import './Login.css';

function Login() {
  const [modo, setModo] = useState('cliente');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailLimpio = email.trim();

    // ==========================================
    // --- MODO DEMO: USUARIOS DE PRUEBA ---
    // ==========================================
    if (emailLimpio === 'veterinario@demo.com' && password === 'vet123') {
      navigate('/demo-veterinario');
      return; 
    }

    if (emailLimpio === 'recepcionista@demo.com' && password === 'rec123') {
      navigate('/demo-recepcionista');
      return; 
    }
    // ==========================================

    setCargando(true);
    try {
      if (modo === 'cliente') {
        if (isLogin) {
          const { error } = await supabase.auth.signInWithPassword({ email: emailLimpio, password });
          if (error) throw error;
          navigate('/portal-cliente');
        } else {
          if (!nombreCompleto) {
            alert('Por favor ingresa tu nombre completo.');
            setCargando(false);
            return;
          }
          const { error: errorAuth } = await supabase.auth.signUp({ email: emailLimpio, password });
          if (errorAuth) throw errorAuth;
          const { error: errorCliente } = await supabase
            .from('clientes')
            .insert([{ nombre_completo: nombreCompleto, telefono: telefono || null, email: emailLimpio }]);
          if (errorCliente) throw errorCliente;
          alert('¡Cuenta creada! Ahora agenda tu primera cita.');
          navigate('/agendar-cita');
        }
      } else if (modo === 'veterinario') {
        const { error } = await supabase.auth.signInWithPassword({ email: emailLimpio, password });
        if (error) throw error;
        const { data: emp } = await supabase
          .from('veterinarios')
          .select('*')
          .eq('email', emailLimpio)
          .single();
        if (!emp) {
          await supabase.auth.signOut();
          throw new Error('No tienes acceso como veterinario.');
        }
        navigate('/panel-vet');
      } else if (modo === 'administrador') {
        const { error } = await supabase.auth.signInWithPassword({ email: emailLimpio, password });
        if (error) throw error;
        const { data: emp } = await supabase
          .from('recepcionistas')
          .select('*')
          .eq('email', emailLimpio)
          .eq('rol', 'Administrador')
          .single();
        if (!emp) {
          await supabase.auth.signOut();
          throw new Error('No tienes acceso como administrador.');
        }
        navigate('/admin');
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

        <div className="rol-selector">
          <button className={modo === 'cliente' ? 'rol-btn active-cliente' : 'rol-btn'} onClick={() => { setModo('cliente'); setIsLogin(true); }}>
            🐾 Cliente
          </button>
          <button className={modo === 'veterinario' ? 'rol-btn active-vet' : 'rol-btn'} onClick={() => { setModo('veterinario'); setIsLogin(true); }}>
            🩺 Veterinario
          </button>
          <button className={modo === 'administrador' ? 'rol-btn active-admin' : 'rol-btn'} onClick={() => { setModo('administrador'); setIsLogin(true); }}>
            ⚙️ Administrador
          </button>
        </div>

        {modo === 'cliente' && (
          <div className="tabs">
            <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Iniciar Sesión</button>
            <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Registrarse</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {modo === 'cliente' && !isLogin && (
            <>
              <div className="input-group">
                <label>Nombre Completo *</label>
                <input type="text" placeholder="Tu nombre completo" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Teléfono (opcional)</label>
                <input type="tel" placeholder="10 dígitos" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              </div>
            </>
          )}

          <div className="input-group">
            <label>Correo Electrónico</label>
            <input type="email" placeholder="ejemplo@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input type="password" placeholder="Tu contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className={`btn-submit btn-${modo}`} disabled={cargando}>
            {cargando ? 'Cargando...' : 'Entrar'}
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