import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import 'dotenv/config';

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db"
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando el volcado de datos...');

  // 1. Limpiar base de datos para no duplicar en futuras pruebas
  await prisma.producto.deleteMany();
  await prisma.categoria.deleteMany();

  // 2. Crear las Categorías principales
  const catRopa = await prisma.categoria.create({ data: { nombre: 'Ropa y Calzado' } });
  const catElectro = await prisma.categoria.create({ data: { nombre: 'Electrónica' } });
  const catHogar = await prisma.categoria.create({ data: { nombre: 'Hogar y Cocina' } });

  // 3. Inyectar los 10 productos variados relacionados
  const productos = [
    { titulo: 'Camiseta de Algodón', descripcion: 'Camiseta básica 100% algodón transpirable', precio: 19.99, disponible: true, categoriaId: catRopa.id },
    { titulo: 'Pantalón Vaquero', descripcion: 'Pantalón denim clásico de corte recto', precio: 39.95, disponible: true, categoriaId: catRopa.id },
    { titulo: 'Chaqueta Impermeable', descripcion: 'Chaqueta ligera ideal para días de lluvia', precio: 59.90, disponible: false, categoriaId: catRopa.id },
    
    { titulo: 'Smartphone Pro', descripcion: 'Teléfono con pantalla OLED y 256GB de almacenamiento', precio: 899.00, disponible: true, categoriaId: catElectro.id },
    { titulo: 'Auriculares Inalámbricos', descripcion: 'Auriculares con cancelación de ruido activa', precio: 120.50, disponible: true, categoriaId: catElectro.id },
    { titulo: 'Reloj Inteligente', descripcion: 'Smartwatch con monitor de ritmo cardíaco y GPS', precio: 199.00, disponible: false, categoriaId: catElectro.id },
    { titulo: 'Altavoz Bluetooth', descripcion: 'Altavoz portátil resistente al agua', precio: 45.00, disponible: true, categoriaId: catElectro.id },

    { titulo: 'Cafetera de Goteo', descripcion: 'Cafetera automática con jarra de cristal de 1.2L', precio: 34.99, disponible: true, categoriaId: catHogar.id },
    { titulo: 'Sartén Antiadherente', descripcion: 'Sartén de aluminio forjado de 24cm', precio: 22.80, disponible: true, categoriaId: catHogar.id },
    { titulo: 'Lámpara de Escritorio', descripcion: 'Lámpara LED con regulador de intensidad y puerto USB', precio: 29.95, disponible: true, categoriaId: catHogar.id }
  ];

  for (const prod of productos) {
    await prisma.producto.create({ data: prod });
  }

  console.log('¡Éxito! Se han inyectado las categorías y los 10 productos correctamente.');
}

main()
  .catch((e) => {
    console.error('Error inyectando datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Cerramos el cliente al finalizar
  });
