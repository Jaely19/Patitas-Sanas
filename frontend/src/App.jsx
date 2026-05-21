import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Login from './Login';
import Clientes from './pages/Clientes';
import Mascotas from './pages/Mascotas';
import MisMascotas from './pages/MisMascotas'; // IMPORTACIÓN AGREGADA
import Citas from './pages/Citas';
import Recepcion from './pages/Recepcion'; 
import Medico from './pages/Medico'; 
import AgendarCita from './pages/AgendarCita'; 
import PortalCliente from './pages/PortalCliente';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === RUTA PÚBLICA === */}
        <Route path="/" element={<Inicio />} />
        <Route path="/portal-cliente" element={<PortalCliente />} />
        
        {/* === RUTA DE LOGIN === */}
        <Route path="/login" element={<Login />} />

        {/* === RUTAS DE CLIENTES === */}
        <Route path="/agendar-cita" element={<AgendarCita />} />
        <Route path="/mis-mascotas" element={<MisMascotas />} />

        {/* === RUTA DE PANEL MÉDICO === */}
        <Route path="/panel-vet" element={<Medico />} />

        {/* === RUTAS DEL SISTEMA (Dashboard) === */}
        <Route path="/*" element={
          <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
            
            {/* MENÚ LATERAL */}
            <nav style={{ width: '250px', backgroundColor: '#1a1a1a', padding: '20px', borderRight: '2px solid #4CAF50' }}>
              <h2 style={{ color: '#4CAF50', textAlign: 'center', marginBottom: '40px' }}>🐾 Panel Interno</h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ margin: '20px 0' }}>
                  <Link to="/recepcion" style={{ color: 'white', textDecoration: 'none', fontSize: '18px', display: 'block', padding: '10px', backgroundColor: '#012b81', borderRadius: '5px', fontWeight: 'bold' }}>📅 Agenda y Caja</Link>
                </li>
                <li style={{ margin: '20px 0' }}>
                  <Link to="/clientes" style={{ color: 'white', textDecoration: 'none', fontSize: '18px', display: 'block', padding: '10px', backgroundColor: '#333', borderRadius: '5px' }}>👥 Dueños</Link>
                </li>
                <li style={{ margin: '20px 0' }}>
                  <Link to="/mascotas" style={{ color: 'white', textDecoration: 'none', fontSize: '18px', display: 'block', padding: '10px', backgroundColor: '#333', borderRadius: '5px' }}>🐕 Mascotas</Link>
                </li>
                <li style={{ margin: '20px 0' }}>
                  <Link to="/citas" style={{ color: 'white', textDecoration: 'none', fontSize: '18px', display: 'block', padding: '10px', backgroundColor: '#333', borderRadius: '5px' }}>📅 Agenda</Link>
                </li>
                <li style={{ marginTop: '50px' }}>
                  <Link to="/" style={{ color: '#aaa', textDecoration: 'none', fontSize: '15px', display: 'block', padding: '10px', border: '1px solid #555', borderRadius: '5px', textAlign: 'center' }}>⬅ Volver al Inicio</Link>
                </li>
              </ul>
            </nav>

            {/* ÁREA DINÁMICA */}
            <main style={{ flex: 1, backgroundColor: '#242424', height: '100vh', overflowY: 'auto' }}>
              <Routes>
                <Route path="/recepcion" element={<Recepcion />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/mascotas" element={<Mascotas />} />
                <Route path="/mis-mascotas" element={<MisMascotas />} />
                <Route path="/citas" element={<Citas />} />
              </Routes>
            </main>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;