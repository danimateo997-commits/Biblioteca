const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

async function pedirDatos(ruta, opciones = {}) {
  if (!API_BASE_URL) throw new Error("Falta configurar VITE_API_URL en el frontend.");
  let respuesta;
  try {
    respuesta = await fetch(`${API_BASE_URL}${ruta}`, opciones);
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("No se pudo conectar con el backend. Comprueba que esté encendido y pulsa Recargar datos.");
  }
  if (respuesta.status === 204) return null;
  const datos = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    const mensaje = respuesta.status === 401
      ? "Clave incorrecta o ausente. Guarda la clave de práctica correcta y vuelve a intentarlo."
      : datos?.error || "No se pudo completar la operación.";
    throw new Error(`${mensaje} (HTTP ${respuesta.status})`);
  }
  if (datos === null) throw new Error("El servidor no devolvió el JSON esperado.");
  return datos;
}

function opcionesProtegidas(method, clave, datos) {
  return {
    method,
    headers: { "x-api-key": clave, ...(datos ? { "Content-Type": "application/json" } : {}) },
    ...(datos ? { body: JSON.stringify(datos) } : {}),
  };
}

export function obtenerProductosApi(disponible = "todos", signal) {
  const consulta = disponible === "todos" ? "" : `?disponible=${encodeURIComponent(disponible)}`;
  return pedirDatos(`/productos${consulta}`, { signal });
}
export function obtenerCategoriasApi(signal) {
  return pedirDatos("/categorias", { signal });
}
export function crearProductoApi(datos, clave) {
  return pedirDatos("/productos", opcionesProtegidas("POST", clave, datos));
}
export function actualizarProductoApi(id, datos, clave) {
  return pedirDatos(`/productos/${id}`, opcionesProtegidas("PATCH", clave, datos));
}
export function eliminarProductoApi(id, clave) {
  return pedirDatos(`/productos/${id}`, opcionesProtegidas("DELETE", clave));
}
