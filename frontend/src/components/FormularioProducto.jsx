import { useState } from "react";
import { crearProductoApi, actualizarProductoApi } from "../services/api.js";
import MensajeError from "./MensajeError.jsx";

function FormularioProducto({ productoInicial, categorias, token, onProductoGuardado, onCancelar }) {
  const [titulo, setTitulo] = useState(productoInicial?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(productoInicial?.descripcion ?? "");
  const [precio, setPrecio] = useState(productoInicial ? String(productoInicial.precio) : "");
  const [categoriaId, setCategoriaId] = useState(productoInicial ? String(productoInicial.categoriaId) : "");
  const [disponible, setDisponible] = useState(productoInicial?.disponible ?? true);
  const [errorLocal, setErrorLocal] = useState("");
  const [enviando, setEnviando] = useState(false);

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    if (enviando) return;
    setErrorLocal("");
    const precioNumerico = Number(precio);
    const idNumerico = Number(categoriaId);
    if (!titulo.trim()) return setErrorLocal("El título es obligatorio.");
    if (precio.trim() === "" || !Number.isFinite(precioNumerico) || precioNumerico < 0) {
      return setErrorLocal("Introduce un precio válido, mayor o igual que cero.");
    }
    if (!categorias.some((categoria) => categoria.id === idNumerico)) {
      return setErrorLocal("Selecciona una categoría del listado real.");
    }
    if (!token) return setErrorLocal("Guarda primero la clave de sesión.");
    const datos = { titulo: titulo.trim(), descripcion: descripcion.trim(), precio: precioNumerico, categoriaId: idNumerico, disponible };
    setEnviando(true);
    try {
      const guardado = productoInicial
        ? await actualizarProductoApi(productoInicial.id, datos, token)
        : await crearProductoApi(datos, token);
      onProductoGuardado(guardado);
      if (!productoInicial) {
        setTitulo(""); setDescripcion(""); setPrecio(""); setCategoriaId(""); setDisponible(true);
      }
    } catch (error) {
      // Un error de acción conserva los campos y el catálogo.
      setErrorLocal(error.message);
    } finally { setEnviando(false); }
  };

  return (
    <form id="formulario-producto" onSubmit={manejarEnvio}>
      <h2 id="titulo-formulario">{productoInicial ? "Editar producto" : "Nuevo producto"}</h2>
      <MensajeError mensaje={errorLocal} />
      {!token && <p className="ayuda">Guarda una clave de sesión para crear o modificar productos.</p>}
      {categorias.length === 0 && <p className="ayuda">Todavía no hay categorías cargadas. Comprueba la conexión y recarga los datos.</p>}
      <fieldset disabled={enviando || categorias.length === 0}>
        <legend className="solo-lectores">Datos del producto</legend>
        <label htmlFor="titulo">Título</label>
        <input id="titulo" value={titulo} onChange={(evento) => setTitulo(evento.target.value)} required />
        <label htmlFor="descripcion">Descripción</label>
        <textarea id="descripcion" value={descripcion} onChange={(evento) => setDescripcion(evento.target.value)} rows="3" />
        <label htmlFor="precio">Precio (€)</label>
        <input id="precio" type="number" min="0" step="0.01" value={precio} onChange={(evento) => setPrecio(evento.target.value)} required />
        <label htmlFor="categoria">Categoría</label>
        <select id="categoria" value={categoriaId} onChange={(evento) => setCategoriaId(evento.target.value)} required>
          <option value="">Selecciona una categoría</option>
          {categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>)}
        </select>
        <label className="checkbox" htmlFor="disponible">
          <input id="disponible" type="checkbox" checked={disponible} onChange={(evento) => setDisponible(evento.target.checked)} />
          Producto disponible
        </label>
        <div className="acciones">
          <button type="submit" disabled={!token}>{enviando ? "Guardando..." : productoInicial ? "Guardar cambios" : "Crear producto"}</button>
          {productoInicial && <button type="button" className="secundario" onClick={onCancelar}>Cancelar edición</button>}
        </div>
      </fieldset>
    </form>
  );
}
export default FormularioProducto;
