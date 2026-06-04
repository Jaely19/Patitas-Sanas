const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

// Inicializar la aplicación de Express
const app = express();
app.use(cors());
app.use(express.json());

// Configurar la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// ==========================================
// --- RUTA DE PRUEBA ---
// ==========================================
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS hora_actual');
    res.json({ mensaje: '¡Conexión exitosa a Patitas Sanas!', hora: result.rows[0].hora_actual });
  } catch (error) {
    res.status(500).json({ error: 'Hubo un problema conectando a PostgreSQL' });
  }
});

// ==========================================
// --- RUTAS PARA CLIENTES ---
// ==========================================
app.post('/api/clientes', async (req, res) => {
  try {
    const { nombre_completo, telefono, email, direccion } = req.body;
    const nuevoCliente = await pool.query(
      'INSERT INTO clientes (nombre_completo, telefono, email, direccion) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre_completo, telefono, email, direccion]
    );
    res.json({ mensaje: 'Cliente registrado con éxito', cliente: nuevoCliente.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/clientes', async (req, res) => {
  try {
    const todosLosClientes = await pool.query('SELECT * FROM clientes ORDER BY fecha_registro DESC');
    res.json(todosLosClientes.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==========================================
// --- RUTAS PARA VETERINARIOS ---
// ==========================================
app.post('/api/veterinarios', async (req, res) => {
  try {
    const { nombre_completo, especialidad, telefono, email, contrasena_hash } = req.body;
    const nuevoVet = await pool.query(
      'INSERT INTO veterinarios (nombre_completo, especialidad, telefono, email, contrasena_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre_completo, especialidad, telefono, email, contrasena_hash]
    );
    res.json({ mensaje: 'Veterinario registrado', veterinario: nuevoVet.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/veterinarios', async (req, res) => {
  try {
    const veterinarios = await pool.query('SELECT id_veterinario, nombre_completo, especialidad FROM veterinarios');
    res.json(veterinarios.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==========================================
// --- RUTAS PARA MASCOTAS ---
// ==========================================
app.post('/api/mascotas', async (req, res) => {
  try {
    const { id_cliente, nombre, especie, raza, fecha_nacimiento, sexo, color } = req.body;
    const nuevaMascota = await pool.query(
      'INSERT INTO mascotas (id_cliente, nombre, especie, raza, fecha_nacimiento, sexo, color) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id_cliente, nombre, especie, raza, fecha_nacimiento, sexo, color]
    );
    res.json({ mensaje: 'Mascota registrada', mascota: nuevaMascota.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/mascotas/cliente/:id_cliente', async (req, res) => {
  try {
    const { id_cliente } = req.params;
    const mascotas = await pool.query('SELECT * FROM mascotas WHERE id_cliente = $1', [id_cliente]);
    res.json(mascotas.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener todas las citas con detalles completos usando JOIN (GET)
app.get('/api/citas_detalladas', async (req, res) => {
  try {
    const consultaSQL = `
      SELECT 
        c.id_cita, 
        c.fecha_hora, 
        c.motivo, 
        m.nombre AS nombre_mascota, 
        cl.nombre_completo AS nombre_dueño, 
        v.nombre_completo AS nombre_veterinario
      FROM citas c
      JOIN mascotas m ON c.id_mascota = m.id_mascota
      JOIN clientes cl ON m.id_cliente = cl.id_cliente
      JOIN veterinarios v ON c.id_veterinario = v.id_veterinario
      ORDER BY c.fecha_hora ASC;
    `;
    const citasDetalladas = await pool.query(consultaSQL);
    res.json(citasDetalladas.rows);
  } catch (error) {
    console.error('Error al obtener la agenda de citas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==========================================
// --- RUTAS PARA HISTORIAL MÉDICO ---
// ==========================================
app.post('/api/historial', async (req, res) => {
  try {
    const { id_mascota, id_veterinario, peso_kg, temperatura_c, sintomas, diagnostico, tratamiento, notas_adicionales } = req.body;
    const nuevoHistorial = await pool.query(
      'INSERT INTO historial_medico (id_mascota, id_veterinario, peso_kg, temperatura_c, sintomas, diagnostico, tratamiento, notas_adicionales) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [id_mascota, id_veterinario, peso_kg, temperatura_c, sintomas, diagnostico, tratamiento, notas_adicionales]
    );
    res.json({ mensaje: 'Historial actualizado', historial: nuevoHistorial.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/historial/mascota/:id_mascota', async (req, res) => {
  try {
    const { id_mascota } = req.params;
    const historial = await pool.query('SELECT * FROM historial_medico WHERE id_mascota = $1 ORDER BY fecha_consulta DESC', [id_mascota]);
    res.json(historial.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==========================================
// --- ENCENDER EL SERVIDOR ---
// ==========================================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor del backend corriendo en http://localhost:${PORT}`);
});