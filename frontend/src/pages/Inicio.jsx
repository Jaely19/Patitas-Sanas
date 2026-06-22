import { Link } from 'react-router-dom';
import './Inicio.css'; 

function Inicio() {
  return (
    <div className="landing-wrapper">
      <header>
        <div className="container nav-container">
          <div className="logo">Patitas<span> Sanas</span></div>
          <nav className="nav-links">
            <a href="#inicio">Inicio</a>
            <a href="#servicios">Servicios</a>
            <a href="#contacto">Contacto</a>
      
            <Link to="/tienda" style={{ fontWeight: 600 }}>
              Tienda 
            </Link>
            <Link to="/login" style={{ color: 'var(--accent-color)', fontWeight: 700 }}>
              Ingresar 
            </Link>
          </nav>
          <a href="tel:5536317711" className="btn-contacto">Llamar: 55 3631 7711</a>
        </div>
      </header>

      <section id="inicio" className="hero">
        <div className="container">
          <h1>Consultorio Veterinario Patitas Sanas</h1>
          <p>Ciencia para curarlos, corazón para cuidarlos. Brindamos consultas generales, vacunación y medicina preventiva en un ambiente cálido y seguro para los consentidos de la house.</p>
          <p className="horario">Horario de atención: 11:00 am a 6:00 pm</p>
          <Link to="/login" className="btn-contacto" style={{ backgroundColor: 'var(--accent-color)' }}>
            ¡Agenda tu cita ahora!
          </Link>
        </div>
      </section>

      <section id="servicios" className="servicios">
        <div className="container">
          <h2 className="section-title">Nuestros Servicios</h2>
          <div className="grid-servicios">
            <div className="card">
              <h3>Consulta General</h3>
              <p>Revisión médica completa para detectar y tratar malestares cotidianos a tiempo, asegurando la salud de tu mejor amigo.</p>
            </div>
            <div className="card">
              <h3>Vacunación y Desparasitación</h3>
              <p>Protegemos a tu mascota de virus y parásitos internos y externos para que crezca fuerte y sana en todas sus etapas.</p>
            </div>
            <div className="card">
              <h3>Medicina Preventiva</h3>
              <p>Chequeos de rutina, asesoría nutricional y control de peso para prevenir enfermedades y garantizar su bienestar a largo plazo.</p>
            </div>
            <div className="card">
              <h3>Estudios de Laboratorio</h3>
              <p>Toma de muestras para análisis de sangre, orina y estudios coprológicos básicos para un diagnóstico oportuno.</p>
            </div>
            <div className="card">
              <h3>Farmacia Veterinaria</h3>
              <p>Contamos con los medicamentos y suplementos de patente necesarios para iniciar el tratamiento de tu mascota de inmediato.</p>
            </div>
            <div className="card">
              <h3>Estética Básica</h3>
              <p>Baños medicados, corte de uñas y limpieza de oídos para que luzcan increíbles y mantengan una excelente higiene.</p>
            </div>
          </div>
        </div>
      </section>

      <footer id="contacto">
        <div className="container footer-grid">
          <div>
            <h3>Horarios de Servicio</h3>
            <p>Lunes a Sábado: 11:00 am a 6:00 pm</p>
            <p>Domingo: Cerrado</p>
          </div>
          <div>
            <h3>Contacto</h3>
            <p>Teléfono: 55 3631 7711</p>
            <p>Email: vetatitassanas@gmail.com</p>
          </div>
          <div>
            <h3>Ubicación</h3>
            <p>Los Reyes la paz, Estado de México.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Proyecto Consultorio Veterinario Patitas Sanas. Escuela Superior de Computo, Instituto Politécnico Nacional.</p>
        </div>
      </footer>
    </div>
  );
}

export default Inicio;