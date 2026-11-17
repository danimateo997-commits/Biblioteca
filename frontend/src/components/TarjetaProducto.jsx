function TarjetaProducto({ producto, puedeEscribir, ocupado, eliminando, onEditar, onEliminar }) {
  return (
    <li className="tarjeta">
      <article>
        <div className="fila">
          <h3>{producto.titulo}</h3>
          <strong className="precio">{producto.precio.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</strong>
        </div>
        <p className="categoria">{producto.categoria?.nombre || "Sin categoría"} · Ref. {producto.id}</p>
        {producto.descripcion && <p>{producto.descripcion}</p>}
        <p className={producto.disponible ? "estado disponible" : "estado"}>{producto.disponible ? "Disponible" : "No disponible"}</p>
        <div className="acciones">
          <button type="button" className="secundario" disabled={!puedeEscribir || ocupado} onClick={() => onEditar(producto)}>Editar</button>
          <button type="button" className="peligro" disabled={!puedeEscribir || ocupado} onClick={() => onEliminar(producto)}>{eliminando ? "Eliminando..." : "Eliminar"}</button>
        </div>
      </article>
    </li>
  );
}
export default TarjetaProducto;
