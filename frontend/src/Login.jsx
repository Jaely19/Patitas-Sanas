import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Asegúrate de que el nombre de tu archivo CSS coincida

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Función que se ejecuta al darle al botón
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Aquí en el futuro conectarás la autenticación real con Supabase
    // Por ahora, simulamos el éxito y los mandamos directo a agendar
    if (isLogin) {
      alert(`¡Bienvenido de nuevo, ${email}! Redirigiendo a tu agenda...`);
    } else {
      alert(`¡Cuenta creada con éxito! Ahora por favor completa los datos de tu cita.`);
    }
    
    // REDIRECCIÓN MÁGICA: Los mandamos a la agenda tras el login/registro
    navigate('/agendar-cita');
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Portal de Acceso</h2>
        
        <div className="tabs">
          <button 
            className={isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(true)}
          >
            Iniciar Sesión
          </button>
          <button 
            className={!isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(false)}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* EL FORMULARIO AHORA ES IDÉNTICO PARA AMBOS CASOS (SOLO CORREO Y PASSWORD) */}
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

          <button type="submit" className="btn-submit">
            {isLogin ? 'Entrar a mi cuenta' : 'Crear Cuenta'}
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