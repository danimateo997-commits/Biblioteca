import "dotenv/config";
import express from "express";
import cors from "cors";
import productosRouter from "./routes/productos.routes.js";
import { logger } from "./middleware/logger.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// CORS se ejecuta antes de las rutas protegidas y resuelve el preflight OPTIONS.
const origenes = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:4173"];

app.use(cors({
  origin: origenes,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-api-key"],
}));

app.use(express.json());
app.use(logger);
app.get("/", (req, res) => res.json({ nombre: "API de Tienda - Productos y Categorías", estado: "funcionando" }));
app.use("/api", productosRouter);
app.use((req, res) => res.status(404).json({ error: "Ruta no encontrada." }));
app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "El cuerpo de la petición no contiene JSON válido." });
  }
  console.error("Error del servidor:", error.name);
  res.status(500).json({ error: "Error interno del servidor. Inténtalo más tarde." });
});
app.listen(PORT, () => console.log(`Servidor iniciado en http://localhost:${PORT}`));
