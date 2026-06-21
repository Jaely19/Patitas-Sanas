import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailLimpio = email.trim();

    // Cuentas Demo
    if (emailLimpio === 'veterinario@demo.com' && password === 'vet123') {
      navigate('/demo-veterinario');
      return; 
    }

    if (emailLimpio === 'recepcionista@demo.com' && password === 'rec123') {
      navigate('/demo-recepcionista');
      return; 
    }

    setCargando(true);
    try {
      // Capturamos la ruta de origen (si viene de la tienda) o usamos el portal por defecto
      const rutaDestino = location.state?.returnTo || '/portal-cliente';

      if (!isLogin) {
        // FLUJO DE REGISTRO
        if (!nombreCompleto) {
          alert('Por favor ingresa tu nombre completo.');
          setCargando(false);
          return;
        }
        
        const { data: authData, error: errorAuth } = await supabase.auth.signUp({ 
          email: emailLimpio, 
          password 
        });
        
        if (errorAuth) throw errorAuth;
        
        const { error: errorCliente } = await supabase
          .from('clientes')
          .insert([{ 
            nombre_completo: nombreCompleto, 
            telefono: telefono || null, 
            correo: emailLimpio, 
            user_id: authData.user.id 
          }]);
          
        if (errorCliente) throw errorCliente;
        
        alert('¡Cuenta creada con éxito!');
        
        // Si venía de la tienda lo regresamos a pagar, si no, a agendar su primera cita
        navigate(location.state?.returnTo ? rutaDestino : '/agendar-cita');

      } else {
        // FLUJO DE INICIO DE SESIÓN UNIFICADO
        const { error } = await supabase.auth.signInWithPassword({ email: emailLimpio, password });
        if (error) throw error;

        // ¿Es Veterinario?
        const { data: vet } = await supabase
          .from('veterinarios')
          .select('*')
          .eq('email', emailLimpio)
          .maybeSingle();

        if (vet) {
          navigate('/panel-vet');
          return;
        }

        // ¿Es Recepcionista o Administrador?
        const { data: rec } = await supabase
          .from('recepcionistas')
          .select('*')
          .eq('email', emailLimpio)
          .maybeSingle();

        if (rec) {
          if (rec.rol === 'Administrador') {
            navigate('/admin');
          } else {
            navigate('/recepcion');
          }
          return;
        }

        // Cliente: Lo mandamos a la ruta de retorno (carrito) o a su portal
        navigate(rutaDestino);
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