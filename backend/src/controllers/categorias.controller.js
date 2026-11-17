import prisma from "../lib/prisma.js";

export const crearCategoria = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: "El nombre de la categoría es obligatorio" });
  }

  try {
    // IMPORTANTE: "categoria" debe ir todo en minúsculas
    const nuevaCategoria = await prisma.categoria.create({
      data: { nombre },
    });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la categoría" });
  }
};

export const listarCategorias = async (req, res) => {
  try {
    // IMPORTANTE: "categoria" en minúsculas
    const categorias = await prisma.categoria.findMany();
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las categorías" });
  }
};

export const consultarProductosPorCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    // IMPORTANTE: "categoria" en minúsculas
    const categoriaConProductos = await prisma.categoria.findUnique({
      where: { id: parseInt(id) },
      include: { productos: true }
    });

    if (!categoriaConProductos) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json(categoriaConProductos.productos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};
