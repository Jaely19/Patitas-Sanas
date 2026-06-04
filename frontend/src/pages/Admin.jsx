import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import "./Admin.css";

export default function Admin() {
  const [seccion, setSeccion] = useState("citas");
  const [citas, setCitas] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [nuevoVet, setNuevoVet] = useState({ nombre_completo: "", email: "", especialidad: "", telefono: "", contrasena_hash: "" });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarCitas();
    cargarMascotas();
    cargarVeterinarios();
  }, []);

  const cargarCitas = async () => {
    const { data } = await supabase.from("citas").select("*, mascotas(nombre), veterinarios(nombre_completo)");
    setCitas(data || []);
  };

  const cargarMascotas = async () => {
    const { data } = await supabase.from("mascotas").select("*, clientes(nombre_completo)");
    setMascotas(data || []);
  };

  const cargarVeterinarios = async () => {
    const { data } = await supabase.from("veterinarios").select("*");
    setVeterinarios(data || []);
  };

  const eliminarCita = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta cita?")) return;
    await supabase.from("citas").delete().eq("id_cita", id);
    cargarCitas();
    setMensaje("✅ Cita eliminada.");
  };

  const eliminarMascota = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta mascota?")) return;
    await supabase.from("mascotas").delete().eq("id_mascota", id);
    cargarMascotas();
    setMensaje("✅ Mascota eliminada.");
  };

  const agregarVeterinario = async () => {
    if (!nuevoVet.nombre_completo || !nuevoVet.email) {
      setMensaje("⚠️ Nombre y email son obligatorios.");
      return;
    }
    const { error } = await supabase.from("veterinarios").insert([nuevoVet]);
    if (error) {
      setMensaje("❌ Error: " + error.message);
    } else {
      setMensaje("✅ Veterinario agregado correctamente.");
      setNuevoVet({ nombre_completo: "", email: "", especialidad: "", telefono: "", contrasena_hash: "" });
      cargarVeterinarios();
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>⚙️ Panel Administrador</h1>
        <p>Gestión completa de la clínica</p>
      </div>

      <div className="admin-menu">
        <button className={seccion === "citas" ? "activo" : ""} onClick={() => setSeccion("citas")}>📅 Citas</button>
        <button className={seccion === "mascotas" ? "activo" : ""} onClick={() => setSeccion("mascotas")}>🐾 Mascotas</button>
        <button className={seccion === "veterinarios" ? "activo" : ""} onClick={() => setSeccion("veterinarios")}>🩺 Veterinarios</button>
      </div>

      {mensaje && <p className="admin-mensaje">{mensaje}</p>}

      {seccion === "citas" && (
        <div className="admin-seccion">
          <h2>Citas registradas</h2>
          {citas.length === 0 ? <p className="vacio">No hay citas.</p> : (
            citas.map((c) => (
              <div key={c.id_cita} className="admin-card">
                <p><strong>Mascota:</strong> {c.mascotas?.nombre}</p>
                <p><strong>Veterinario:</strong> {c.veterinarios?.nombre_completo}</p>
                <p><strong>Fecha:</strong> {new Date(c.fecha_hora).toLocaleString()}</p>
                <p><strong>Motivo:</strong> {c.motivo}</p>
                <p><strong>Estado:</strong> {c.estado}</p>
                <button className="btn-eliminar" onClick={() => eliminarCita(c.id_cita)}>🗑 Eliminar</button>
              </div>
            ))
          )}
        </div>
      )}

      {seccion === "mascotas" && (
        <div className="admin-seccion">
          <h2>Mascotas registradas</h2>
          {mascotas.length === 0 ? <p className="vacio">No hay mascotas.</p> : (
            mascotas.map((m) => (
              <div key={m.id_mascota} className="admin-card">
                <p><strong>Nombre:</strong> {m.nombre}</p>
                <p><strong>Especie:</strong> {m.especie}</p>
                <p><strong>Dueño:</strong> {m.clientes?.nombre_completo}</p>
                <button className="btn-eliminar" onClick={() => eliminarMascota(m.id_mascota)}>🗑 Eliminar</button>
              </div>
            ))
          )}
        </div>
      )}

      {seccion === "veterinarios" && (
        <div className="admin-seccion">
          <h2>Veterinarios registrados</h2>
          {veterinarios.map((v) => (
            <div key={v.id_veterinario} className="admin-card">
              <p><strong>Nombre:</strong> {v.nombre_completo}</p>
              <p><strong>Email:</strong> {v.email}</p>
              <p><strong>Especialidad:</strong> {v.especialidad}</p>
            </div>
          ))}

          <h2 style={{marginTop: "2rem"}}>Agregar veterinario</h2>
          <div className="admin-form">
            <input placeholder="Nombre completo *" value={nuevoVet.nombre_completo} onChange={(e) => setNuevoVet({...nuevoVet, nombre_completo: e.target.value})} />
            <input placeholder="Email *" value={nuevoVet.email} onChange={(e) => setNuevoVet({...nuevoVet, email: e.target.value})} />
            <input placeholder="Especialidad" value={nuevoVet.especialidad} onChange={(e) => setNuevoVet({...nuevoVet, especialidad: e.target.value})} />
            <input placeholder="Teléfono" value={nuevoVet.telefono} onChange={(e) => setNuevoVet({...nuevoVet, telefono: e.target.value})} />
            <input placeholder="Contraseña" type="password" value={nuevoVet.contrasena_hash} onChange={(e) => setNuevoVet({...nuevoVet, contrasena_hash: e.target.value})} />
            <button className="btn-agregar" onClick={agregarVeterinario}>➕ Agregar veterinario</button>
          </div>
        </div>
      )}
    </div>
  );
}