import TarjetaProducto from "./TarjetaProducto.jsx";

function ListaProductos({ productos, mostrarVacio, puedeEscribir, eliminandoId, onEditar, onEliminar }) {
  if (productos.length === 0) return mostrarVacio ? <p className="vacio">No hay productos que coincidan con esta vista.</p> : null;
  return (
    <ul className="lista-productos">
      {productos.map((producto) => (
        <TarjetaProducto key={producto.id} producto={producto} puedeEscribir={puedeEscribir} ocupado={eliminandoId !== null} eliminando={eliminandoId === producto.id} onEditar={onEditar} onEliminar={onEliminar} />
      ))}
    </ul>
  );
}
export default ListaProductos;
