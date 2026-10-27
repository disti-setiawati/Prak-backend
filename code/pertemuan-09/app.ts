/**
 * Pertemuan 9 — Aplikasi Express untuk authentication.
 * Tujuan: menyusun parser JSON, endpoint authentication, dan error handler.
 * Cara menjalankan: node --experimental-strip-types server.ts.
 * Contoh pengujian: POST /auth/register dan POST /auth/login.
 */

import express, { type Request, type Response } from "express";
import { authRoutes } from "./src/routes/auth.routes.ts";

const app = express();
app.disable("x-powered-by");

// Parser harus terdaftar sebelum route agar controller menerima request.body.
app.use(express.json());

// Endpoint ini memberi cara sederhana untuk memastikan server siap menerima request.
app.get("/health", (_request: Request, response: Response) => {
  response.status(200).json({ success: true, data: { status: "up" } });
});

// Prefix memisahkan route kredensial dari resource lain dalam API.
app.use("/auth", authRoutes);

// Middleware 404 berada setelah route supaya hanya endpoint yang tidak dikenal tertangkap.
app.use((_request: Request, response: Response) => {
  response.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

// Error handler tidak mengirim pesan internal agar detail database tidak bocor ke client.
app.use((error: Error, _request: Request, response: Response, _next: (error?: unknown) => void) => {
  console.error("Kesalahan aplikasi:", error.message);
  response.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
});

export { app };