
import { Router } from "express";

import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from "../controllers/productos.controller.js";

import {
  listarCategorias,
  crearCategoria,
  consultarProductosPorCategoria
} from "../controllers/categorias.controller.js";

import { validarProducto } from "../middleware/validarProducto.js";
import { comprobarApiKey } from "../middleware/apiKey.js";

const router = Router();

// --- ENDPOINTS DE PRODUCTOS ---
router.get("/productos", listarProductos);
router.get("/productos/:id", obtenerProducto);
router.post("/productos", comprobarApiKey, validarProducto, crearProducto);
router.patch("/productos/:id", comprobarApiKey, validarProducto, actualizarProducto);
router.delete("/productos/:id", comprobarApiKey, eliminarProducto);

// --- ENDPOINTS DE CATEGORÍAS ---
router.get("/categorias", listarCategorias);
router.post("/categorias", comprobarApiKey, crearCategoria);
router.get("/categorias/:id/productos", consultarProductosPorCategoria);

export default router;
