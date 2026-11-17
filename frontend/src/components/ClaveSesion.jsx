import { useState } from "react";

function ClaveSesion({ clave, onClaveCambiada }) {
  const [entrada, setEntrada] = useState(clave);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const guardar = (evento) => {
    evento.preventDefault();
    setMensaje(""); setError("");
    if (!entrada.trim()) return setError("Introduce la clave de práctica del backend.");
    onClaveCambiada(entrada);
    try {
      sessionStorage.setItem("apiKey", entrada);
      setMensaje("Clave guardada. Se comprobará al realizar una operación protegida.");
    } catch { setError("Clave activa en esta página, pero el navegador no permitió guardarla para la recarga."); }
  };
  const borrar = () => {
    onClaveCambiada(""); setEntrada(""); setMensaje(""); setError("");
    try {
      sessionStorage.removeItem("apiKey");
      setMensaje("Clave borrada de la sesión.");
    } catch { setError("Clave desactivada en esta página; no se pudo limpiar el almacenamiento del navegador."); }
  };
  return (
    <section className="panel sesion" aria-labelledby="titulo-sesion">
      <div><h2 id="titulo-sesion">Sesión de trabajo</h2><p className="ayuda">{clave ? "Hay una clave activa; el servidor validará cada escritura." : "Consulta libre. Introduce una clave para gestionar productos."}</p></div>
      <form onSubmit={guardar}>
        <label htmlFor="clave-sesion">Clave de práctica</label>
        <div className="acciones">
          <input id="clave-sesion" type="password" autoComplete="off" value={entrada} onChange={(evento) => { setEntrada(evento.target.value); setMensaje(""); setError(""); }} />
          <button type="submit">Guardar clave</button>
          <button type="button" className="secundario" onClick={borrar}>Borrar clave</button>
        </div>
      </form>
      {mensaje && <p className="ayuda" role="status">{mensaje}</p>}
      {error && <p className="aviso error" role="alert">{error}</p>}
    </section>
  );
}
export default ClaveSesion;
