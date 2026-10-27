/**
 * Pertemuan 11 — Aplikasi Express dengan lapisan keamanan.
 * Tujuan: menyusun middleware keamanan (helmet, CORS, rate limit, request id)
 *         sebelum route bisnis, lalu menutup request yang tidak dikenal.
 * Cara menjalankan: node --experimental-strip-types server.ts.
 * Contoh pengujian: GET /health, POST /api/buku, dan respons 404.
 */

import express, { type Request, type Response } from "express";
import { bukuRoutes } from "./src/routes/buku.routes.ts";
import {
  beriRequestId,
  corsTerbatas,
  pembatasiRequest,
  securityHeaders,
  type RequestBerId,
} from "./src/middleware/security.middleware.ts";

const app = express();
app.disable("x-powered-by");

// Urutan middleware keamanan penting: header dan CORS dipasang lebih awal agar
// seluruh respons, termasuk error, membawa header yang sama.
app.use(beriRequestId);
app.use(securityHeaders);
app.use(corsTerbatas);

// Rate limiter berlaku untuk seluruh request pada project ini; pada aplikasi nyata
// endpoint autentikasi diberi limiter yang lebih ketat daripada endpoint baca.
app.use(pembatasiRequest);

// Batas ukuran body mencegah payload besar menghabiskan memori server.
app.use(express.json({ limit: "100kb" }));

// Endpoint pemeriksaan kesehatan dipakai client untuk memastikan server siap menerima request.
app.get("/health", (_request: Request, response: Response) => {
  response.status(200).json({ success: true, data: { status: "up" } });
});

app.use("/api/buku", bukuRoutes);

// Handler 404 diletakkan setelah seluruh route supaya hanya path yang tidak
// dikenal yang tertangkap, bukan request ke endpoint yang valid.
app.use((_request: Request, response: Response) => {
  response.status(404).json({ success: false, message: "Endpoint tidak ditemukan" });
});

// Error handler tidak mengirim pesan internal agar detail database tidak bocor
// ke client; pesan lengkap hanya ditulis pada log server.
app.use((error: Error, request: Request, response: Response, _next: (error?: unknown) => void) => {
  const id = (request as RequestBerId).requestId ?? "-";
  const tipeError = (error as Error & { type?: string }).type;
  if (tipeError === "entity.parse.failed") {
    response.status(400).json({ success: false, message: "Body JSON tidak valid" });
    return;
  }
  if (tipeError === "entity.too.large") {
    response.status(413).json({ success: false, message: "Ukuran body melebihi batas" });
    return;
  }

  console.error(`[${id}] Kesalahan aplikasi:`, error.message);
  response.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
});

export { app };
