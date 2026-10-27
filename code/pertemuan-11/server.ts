/**
 * Pertemuan 11 — Proses server.
 * Tujuan: menjalankan Express dan menutup koneksi Prisma saat proses dihentikan.
 * Cara menjalankan: npm start setelah migration dan generate Prisma.
 * Contoh pengujian: curl -i http://localhost:3011/health.
 */

import { app } from "./app.ts";
import { prisma } from "./client.ts";

const port = Number(process.env.PORT ?? 3011);

// Menutup Prisma sebelum proses berakhir mencegah koneksi database tertinggal
// dan mencegah SIGINT menggantung pada proses yang sedang menunggu database.
const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

app.listen(port, () => {
  console.log(`Secure API berjalan di http://localhost:${port}`);
});
