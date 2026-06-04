import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import "./Medico.css";

export default function Medico() {
  const [veterinario, setVeterinario] = useState(null);
  const [citas, setCitas] = useState([]);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [formulario, setFormulario] = useState({
    peso_kg: "", temperatura_c: "", sintomas: "",
    diagnostico: "", tratamiento: "", notas_adicionales: "",
  });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const obtenerSesion = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const email = data.session.user.email;
        const { data: vet } = await supabase
          .from("veterinarios")
          .select("*")
          .eq("email", email)
          .single();
        setVeterinario(vet);
        if (vet) cargarCitas(vet.id_veterinario);
      }
    };
    obtenerSesion();
  }, []);

const cargarCitas = async (id) => {
    const hoy = new Date();
    const inicio = new Date(hoy.setHours(0, 0, 0, 0)).toISOString();
    const { data } = await supabase
      .from("citas")
      .select("*, mascotas(nombre, especie)")
      .eq("id_veterinario", id)
      .gte("fecha_hora", inicio)
      .order("fecha_hora", { ascending: true });
    setCitas(data || []);
  };

  const guardarConsulta = async () => {
    if (!formulario.diagnostico) {
      setMensaje("⚠️ El diagnóstico es obligatorio.");
      return;
    }
    const { error } = await supabase.from("historial_medico").insert([{
      id_mascota: citaSeleccionada.id_mascota,
      id_veterinario: veterinario.id_veterinario,
      peso_kg: formulario.peso_kg || null,
      temperatura_c: formulario.temperatura_c || null,
      sintomas: formulario.sintomas,
      diagnostico: formulario.diagnostico,
      tratamiento: formulario.tratamiento,
      notas_adicionales: formulario.notas_adicionales,
    }]);
    if (error) {
      setMensaje("❌ Error: " + error.message);
    } else {
      await supabase.from("citas").update({ estado: "Completada" }).eq("id_cita", citaSeleccionada.id_cita);
      setMensaje("✅ Consulta guardada correctamente.");
      setCitaSeleccionada(null);
      setFormulario({ peso_kg: "", temperatura_c: "", sintomas: "", diagnostico: "", tratamiento: "", notas_adicionales: "" });
      cargarCitas(veterinario.id_veterinario);
    }
  };

  return (
    <div className="medico-container">
      <div className="medico-header">
        <div>
          <h1>🩺 Panel del Médico</h1>
          {veterinario && <p className="bienvenida">Bienvenido, Dr. {veterinario.nombre_completo} — {veterinario.especialidad}</p>}
        </div>
      </div>

      <p className="seccion-titulo">📋 Citas del Día</p>
      {citas.length === 0 ? (
        <div className="sin-citas">No tienes citas programadas para hoy.</div>
      ) : (
        <div className="citas-lista">
          {citas.map((cita) => (
            <div key={cita.id_cita} className="cita-card">
              <p><strong>Mascota:</strong> {cita.mascotas?.nombre} ({cita.mascotas?.especie})</p>
              <p><strong>Hora:</strong> {new Date(cita.fecha_hora).toLocaleTimeString()}</p>
              <p><strong>Motivo:</strong> {cita.motivo}</p>
              <p><strong>Estado:</strong> <span className={`badge ${cita.estado === "Completada" ? "completada" : ""}`}>{cita.estado}</span></p>
              {cita.estado !== "Completada" && (
                <button className="btn-consulta" onClick={() => setCitaSeleccionada(cita)}>
                  ➕ Iniciar consulta
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {citaSeleccionada && (
        <div className="formulario-consulta">
          <h2>📝 Consulta — {citaSeleccionada.mascotas?.nombre}</h2>
          <div className="fila-doble">
            <div className="campo">
              <label>Peso (kg)</label>
              <input type="number" placeholder="Ej. 4.5" value={formulario.peso_kg}
                onChange={(e) => setFormulario({ ...formulario, peso_kg: e.target.value })} />
            </div>
            <div className="campo">
              <label>Temperatura (°C)</label>
              <input type="number" placeholder="Ej. 38.5" value={formulario.temperatura_c}
                onChange={(e) => setFormulario({ ...formulario, temperatura_c: e.target.value })} />
            </div>
          </div>
          <div className="campo">
            <label>Síntomas</label>
            <textarea placeholder="Describe los síntomas..." value={formulario.sintomas}
              onChange={(e) => setFormulario({ ...formulario, sintomas: e.target.value })} />
          </div>
          <div className="campo">
            <label>Diagnóstico *</label>
            <textarea placeholder="Diagnóstico clínico..." value={formulario.diagnostico}
              onChange={(e) => setFormulario({ ...formulario, diagnostico: e.target.value })} />
          </div>
          <div className="campo">
            <label>Tratamiento</label>
            <textarea placeholder="Tratamiento indicado..." value={formulario.tratamiento}
              onChange={(e) => setFormulario({ ...formulario, tratamiento: e.target.value })} />
          </div>
          <div className="campo">
            <label>Notas adicionales</label>
            <textarea placeholder="Observaciones..." value={formulario.notas_adicionales}
              onChange={(e) => setFormulario({ ...formulario, notas_adicionales: e.target.value })} />
          </div>
          <div className="botones">
            <button className="btn-guardar" onClick={guardarConsulta}>💾 Guardar consulta</button>
            <button className="btn-cancelar" onClick={() => setCitaSeleccionada(null)}>Cancelar</button>
          </div>
          {mensaje && <p className="mensaje">{mensaje}</p>}
        </div>
      )}
    </div>
  );
}