import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../generated/prisma/index.js"; // <-- Corregido con C mayúscula

// En Prisma 7, instanciamos el adaptador pasándole la URL
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db"
});

// Instanciamos el cliente correctamente usando la clase oficial
const prisma = new PrismaClient({ adapter }); // <-- Corregido con C mayúscula

export default prisma;
