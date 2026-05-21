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
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/portal-cliente');
      } else {
        if (!nombreCompleto) {
          alert('Por favor ingresa tu nombre completo.');
          setCargando(false);
          return;
        }
        const { error: errorAuth } = await supabase.auth.signUp({ email, password });
        if (errorAuth) throw errorAuth;

        const { error: errorCliente } = await supabase
          .from('clientes')
          .insert([{ nombre_completo: nombreCompleto, telefono: telefono || null, email: email }]);
        if (errorCliente) throw errorCliente;

        alert('¡Cuenta creada! Ahora agenda tu primera cita.');
        navigate('/agendar-cita');
      }
    } catch (error) {
