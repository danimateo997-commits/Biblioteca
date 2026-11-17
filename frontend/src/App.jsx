import { useState, useEffect } from "react";
import { obtenerProductosApi, obtenerCategoriasApi, eliminarProductoApi } from "./services/api.js";
import ListaProductos from "./components/ListaProductos.jsx";
import MensajeError from "./components/MensajeError.jsx";
import FormularioProducto from "./components/FormularioProducto.jsx";
import ClaveSesion from "./components/ClaveSesion.jsx";

function leerClaveGuardada() {
  try { return sessionStorage.getItem("apiKey") || ""; }
  catch { return ""; }
}

function App() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");
  const [errorAccion, setErrorAccion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [clave, setClave] = useState(leerClaveGuardada);
  const [editando, setEditando] = useState(null);
  const [eliminandoId, setEliminandoId] = useState(null);
  const [productoEliminar, setProductoEliminar] = useState(null);
  const [disponibilidad, setDisponibilidad] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [recarga, setRecarga] = useState(0);

  // La API es el sistema externo. Un filtro o un reintento vuelven a consultarla.
  useEffect(() => {
    const controlador = new AbortController();
    Promise.all([
      obtenerProductosApi(disponibilidad, controlador.signal),
      obtenerCategoriasApi(controlador.signal),
    ])
      .then(([listaProductos, listaCategorias]) => {
        if (controlador.signal.aborted) return;
        setProductos(listaProductos);
        setCategorias(listaCategorias);
      })
      .catch((error) => {
        if (!controlador.signal.aborted) setErrorCarga(error.message);
      })
      .finally(() => {
        if (!controlador.signal.aborted) setCargando(false);
      });
    return () => controlador.abort();
  }, [disponibilidad, recarga]);

  const manejarGuardado = (producto) => {
    // Reemplazamos el objeto al editar y creamos un array nuevo al dar de alta.
    setProductos((anteriores) => anteriores.some((actual) => actual.id === producto.id)
      ? anteriores.map((actual) => actual.id === producto.id ? producto : actual)
      : [producto, ...anteriores]);
    setMensaje(editando ? "Producto actualizado correctamente." : "Producto creado correctamente.");
    setErrorAccion("");
    setEditando(null);
    setCargando(true);
    setErrorCarga("");
    setRecarga((valor) => valor + 1);
  };

  const manejarEliminar = async (producto) => {
    if (eliminandoId !== null) return;
    setEliminandoId(producto.id);
    setErrorAccion("");
    setMensaje("");
    try {
      await eliminarProductoApi(producto.id, clave);
      setProductos((anteriores) => anteriores.filter((actual) => actual.id !== producto.id));
      if (editando?.id === producto.id) setEditando(null);
      setMensaje("Producto eliminado correctamente.");
      setProductoEliminar(null);
      setCargando(true);
      setErrorCarga("");
      setRecarga((valor) => valor + 1);
    } catch (error) {
      setErrorAccion(error.message);
    } finally {
      setEliminandoId(null);
    }
  };

  const productosVisibles = productos.filter((producto) => {
    const coincideEstado = disponibilidad === "todos" || producto.disponible === (disponibilidad === "true");
    return coincideEstado && producto.titulo.toLocaleLowerCase("es").includes(busqueda.trim().toLocaleLowerCase("es"));
  });

  return (
    <main>
      <h1>Tienda Incremental - Fase 2</h1>
      <h2>Gestión de productos</h2>
      <hr />
      <ClaveSesion clave={clave} onClaveCambiada={setClave} />
      <hr />
      {mensaje && <p className="aviso exito" role="status">{mensaje}</p>}
      <MensajeError mensaje={errorAccion} />
      <FormularioProducto
        key={editando?.id ?? "nuevo"}
        productoInicial={editando}
        categorias={categorias}
        token={clave}
        onProductoGuardado={manejarGuardado}
        onCancelar={() => setEditando(null)}
      />
      <hr />
      <section aria-labelledby="titulo-catalogo">
        <h2 id="titulo-catalogo">Catálogo de productos</h2>
        <button type="button" className="secundario" disabled={cargando} onClick={() => { setCargando(true); setErrorCarga(""); setRecarga((valor) => valor + 1); }}>Recargar datos</button>
        <div className="filtros">
          <label htmlFor="disponibilidad">Disponibilidad:</label>
          <select id="disponibilidad" value={disponibilidad} onChange={(evento) => { setCargando(true); setErrorCarga(""); setDisponibilidad(evento.target.value); }}>
            <option value="todos">Todos</option>
            <option value="true">Disponibles</option>
            <option value="false">No disponibles</option>
          </select>
          <label htmlFor="busqueda">Buscar por título:</label>
          <input id="busqueda" type="search" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} placeholder="Ej.: camiseta" />
        </div>
        {cargando && <p role="status">Cargando productos y categorías...</p>}
        <MensajeError mensaje={errorCarga} />
        {errorCarga && productos.length > 0 && <p>Se conservan los últimos datos cargados.</p>}
        {!cargando && !errorCarga && <p className="resumen">{productosVisibles.length} producto(s) en esta vista</p>}
        {productoEliminar && (
          <section className="aviso" aria-labelledby="titulo-borrado">
            <h3 id="titulo-borrado">Confirmar borrado</h3>
            <p>¿Eliminar «{productoEliminar.titulo}»? Esta acción no se puede deshacer.</p>
            <div className="acciones">
              <button type="button" disabled={eliminandoId !== null || !clave} onClick={() => manejarEliminar(productoEliminar)}>Confirmar eliminación</button>
              <button type="button" className="secundario" disabled={eliminandoId !== null} onClick={() => setProductoEliminar(null)}>Cancelar borrado</button>
            </div>
          </section>
        )}
        <ListaProductos
          productos={productosVisibles}
          mostrarVacio={!cargando && !errorCarga}
          puedeEscribir={Boolean(clave)}
          eliminandoId={eliminandoId}
          onEditar={(producto) => {
            setEditando(producto);
            setMensaje("");
            setErrorAccion("");
            document.getElementById("formulario-producto")?.scrollIntoView({ behavior: "smooth" });
          }}
          onEliminar={(producto) => { setProductoEliminar(producto); setErrorAccion(""); }}
        />
      </section>
    </main>
  );
}
export default App;
