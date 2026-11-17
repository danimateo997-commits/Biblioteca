export function validarProducto(req, res, next) {
  const datos = req.body;
  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return res.status(400).json({ error: "Debes enviar un objeto JSON con los datos del producto." });
  }
  const parcial = req.method === "PATCH";
  const campos = ["titulo", "descripcion", "precio", "disponible", "categoriaId"];
  if (parcial && !campos.some((campo) => datos[campo] !== undefined)) {
    return res.status(400).json({ error: "Incluye al menos un campo del producto para modificar." });
  }
  if ((!parcial || datos.titulo !== undefined) &&
      (typeof datos.titulo !== "string" || !datos.titulo.trim())) {
    return res.status(400).json({ error: "El título es obligatorio y debe ser texto." });
  }
  if (datos.descripcion !== undefined && datos.descripcion !== null && typeof datos.descripcion !== "string") {
    return res.status(400).json({ error: "La descripción debe ser texto." });
  }
  if (datos.precio !== undefined &&
      (typeof datos.precio !== "number" || !Number.isFinite(datos.precio) || datos.precio < 0)) {
    return res.status(400).json({ error: "El precio debe ser un número mayor o igual que cero." });
  }
  if ((!parcial || datos.categoriaId !== undefined) &&
      (!Number.isInteger(datos.categoriaId) || datos.categoriaId <= 0)) {
    return res.status(400).json({ error: "Selecciona una categoría válida con id numérico." });
  }
  if (datos.disponible !== undefined && typeof datos.disponible !== "boolean") {
    return res.status(400).json({ error: "La disponibilidad debe ser true o false." });
  }
  next();
}
