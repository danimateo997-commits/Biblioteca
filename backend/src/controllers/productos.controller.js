import prisma from "../lib/prisma.js";

function idValido(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function responderError(res, error) {
  if (error.code === "P2025") return res.status(404).json({ error: "Producto no encontrado." });
  if (error.code === "P2003") return res.status(400).json({ error: "La categoría seleccionada no existe." });
  console.error("Error al gestionar productos:", error.code || error.name);
  return res.status(500).json({ error: "No se pudo completar la operación. Inténtalo de nuevo." });
}

export async function listarProductos(req, res) {
  const { disponible } = req.query;
  if (disponible !== undefined && disponible !== "true" && disponible !== "false") {
    return res.status(400).json({ error: "El filtro disponible debe ser true o false." });
  }
  try {
    const productos = await prisma.producto.findMany({
      where: disponible === undefined ? {} : { disponible: disponible === "true" },
      include: { categoria: true },
      orderBy: { id: "desc" },
    });
    res.json(productos);
  } catch (error) { responderError(res, error); }
}

export async function obtenerProducto(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: "El id del producto no es válido." });
  try {
    const producto = await prisma.producto.findUnique({ where: { id }, include: { categoria: true } });
    if (!producto) return res.status(404).json({ error: "Producto no encontrado." });
    res.json(producto);
  } catch (error) { responderError(res, error); }
}

export async function crearProducto(req, res) {
  const { titulo, descripcion, precio, categoriaId, disponible } = req.body;
  try {
    const producto = await prisma.producto.create({
      data: { titulo: titulo.trim(), descripcion, precio, categoriaId, disponible },
      include: { categoria: true },
    });
    res.status(201).json(producto);
  } catch (error) { responderError(res, error); }
}

export async function actualizarProducto(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: "El id del producto no es válido." });
  const { titulo, descripcion, precio, disponible, categoriaId } = req.body;
  try {
    const producto = await prisma.producto.update({
      where: { id },
      data: { titulo: titulo?.trim(), descripcion, precio, disponible, categoriaId },
      include: { categoria: true },
    });
    res.json(producto);
  } catch (error) { responderError(res, error); }
}

export async function eliminarProducto(req, res) {
  const id = idValido(req.params.id);
  if (!id) return res.status(400).json({ error: "El id del producto no es válido." });
  try {
    await prisma.producto.delete({ where: { id } });
    res.status(204).end();
  } catch (error) { responderError(res, error); }
}
