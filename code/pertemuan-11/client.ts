/**
 * Pertemuan 11 — Prisma Client.
 * Tujuan: menyediakan satu instance Prisma untuk operasi resource buku pada service.
 * Cara menjalankan: konfigurasi .env, lalu jalankan server.ts.
 * Contoh pengujian: GET /api/buku mengembalikan daftar buku dari SQLite.
 */

import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./prisma/generated/client.ts";

// Adapter menerima URL database dari environment agar lokasi file tidak di-hardcode.
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

export { prisma };
