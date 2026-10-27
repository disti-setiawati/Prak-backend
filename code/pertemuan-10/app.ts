/**
 * Pertemuan 10 — Aplikasi Express untuk JWT dan authorization.
 * Tujuan: menyusun parser JSON, endpoint auth, endpoint terlindungi, dan error handler.
 * Cara menjalankan: node --experimental-strip-types server.ts.
 * Contoh pengujian: POST /auth/login lalu GET /protected/me dengan token.
 */

import express, { type Request, type Response } from "express";
import { authRoutes } from "./src/routes/auth.routes.ts";
import { protectedRoutes } from "./src/routes/protected.routes.ts";

const app = express();
app.disable("x-powered-by");

// Parser harus terdaftar sebelum route; batas body mencegah payload besar menghabiskan memori.
app.use(express.json({ limit: "100kb" }));

// Endpoint ini memberi cara sederhana untuk memastikan server siap menerima request.
app.get("/health", (_request: Request, response: Response) => {
  response.status(200).json({ success: true, data: { status: "up" } });
});

// Prefix memisahkan route kredensial dari resource lain dalam API.
app.use("/auth", authRoutes);

// Route terlindungi memakai middleware autentikasi di dalam router-nya.
app.use("/protected", protectedRoutes);

// Middleware 404 berada setelah route supaya hanya endpoint yang tidak dikenal tertangkap.
app.use((_request: Request, response: Response) => {
  response.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

// Error handler tidak mengirim pesan internal agar detail database tidak bocor ke client.
app.use((error: Error, _request: Request, response: Response, _next: (error?: unknown) => void) => {
  const tipeError = (error as Error & { type?: string }).type;
  if (tipeError === "entity.parse.failed") {
    response.status(400).json({ success: false, message: "Body JSON tidak valid" });
    return;
  }
  if (tipeError === "entity.too.large") {
    response.status(413).json({ success: false, message: "Ukuran body melebihi batas" });
    return;
  }

  console.error("Kesalahan aplikasi:", error.message);
  response.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
});

export { app };
