import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 memisahkan konfigurasi datasource dari schema agar URL database
// dibaca dari environment dan tidak ditulis di dalam berkas schema yang ikut ter-commit.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  },
});
