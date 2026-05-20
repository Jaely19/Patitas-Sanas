import { Link } from 'react-router-dom';
import './Inicio.css'; // Importamos el diseño que acabamos de crear

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
            {/* Usamos el enrutador de React para ir al Dashboard */}
            <Link to="/login" style={{ color: 'var(--accent-color)', fontWeight: 700 }}>
              Ingresar 👤
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
            <p>Email: hola@patitassanas.mx</p>
          </div>
          <div>
            <h3>Ubicación</h3>
            <p>Nos encontramos dentro del "Hospital para Mascotas Ixtacala", Avenida de los Barrios #220, Los Reyes Iztacala, Tlalnepantla de Baz, Estado de México.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Copyright © 2026 Consultorio Veterinario Patitas Sanas. Todos los derechos reservados.</p>
        </div>
      </footer>

      <a href="https://api.whatsapp.com/send/?phone=5215536317711&text=Hola,%20quisiera%20agendar%20una%20cita%20para%20mi%20mascota." className="whatsapp-float" target="_blank" rel="noopener noreferrer" title="Contáctanos por WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>
    </div>
  );
}

export default Inicio;