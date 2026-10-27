/**
 * Pertemuan 10 — Prisma Client.
 * Tujuan: menyediakan satu instance Prisma untuk operasi akun pada service.
 * Cara menjalankan: konfigurasi .env, lalu jalankan server.ts.
 * Contoh pengujian: POST /auth/register membuat satu row pengguna.
 */

import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "./prisma/generated/client.ts";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

export { prisma };
