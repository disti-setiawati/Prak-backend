/**
 * Pertemuan 9 — Proses server.
 * Tujuan: menjalankan Express dan menutup koneksi Prisma saat proses dihentikan.
 * Cara menjalankan: npm start setelah migration dan generate Prisma.
 * Contoh pengujian: curl http://localhost:3009/health.
 */

import { app } from "./app.ts";
import { prisma } from "./client.ts";

const port = Number(process.env.PORT ?? 3009);

// Menutup Prisma sebelum proses berakhir mencegah koneksi database tertinggal.
const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

app.listen(port, () => {
  console.log(`Authentication API berjalan di http://localhost:${port}`);
});