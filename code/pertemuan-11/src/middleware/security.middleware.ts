/**
 * Pertemuan 11 — Middleware keamanan aplikasi.
 * Tujuan: memasang security header, CORS selektif, dan rate limiting
 *         sebelum request masuk ke route bisnis.
 * Cara jalankan: dipanggil app.ts; tidak bisa diuji sendiri tanpa server.
 * Contoh pengujian: respons /health memiliki header X-Request-Id; request ke-21
 *                   dalam window 15 detik menghasilkan 429.
 */

import { randomUUID } from "node:crypto";
import type { Request, RequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

/** Membaca nilai environment sebagai number dengan nilai cadangan bila tidak valid. */
const bacaAngka = (nama: string, cadangan: number) => {
  const nilai = process.env[nama];
  if (nilai === undefined) return cadangan;
  const angka = Number(nilai);
  return Number.isFinite(angka) && angka > 0 ? angka : cadangan;
};

/**
 * Security header dari helmet menambahkan X-Content-Type-Options, X-Frame-Options,
 * Strict-Transport-Security, dan membatasi header yang membocorkan teknologi server.
 */
export const securityHeaders: RequestHandler = helmet();

/**
 * CORS hanya mengizinkan origin yang tercantum pada CORS_ORIGIN.
 * Browser memblokir response untuk origin lain; origin tanpa header tidak
 * dianggap same-origin sehingga lolos dari pemeriksaan ini.
 */
export const corsTerbatas = cors({
  origin: (origin, callback) => {
    const daftarIzin = (process.env.CORS_ORIGIN ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    // Request tanpa Origin (curl, postman) diperbolehkan karena aturan CORS
    // ditegakkan oleh browser, bukan oleh server.
    if (!origin) {
      callback(null, true);
      return;
    }
    callback(null, daftarIzin.includes(origin));
  },
});

/**
 * Rate limiting membatasi jumlah request per IP dalam window tertentu.
 * Membatasi permintaan melindungi endpoint login dan resource database
 * dari perulangan otomatis yang membanjiri server.
 */
export const pembatasiRequest = rateLimit({
  windowMs: bacaAngka("RATE_LIMIT_WINDOW_MS", 15_000),
  limit: bacaAngka("RATE_LIMIT_MAX", 20),
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Terlalu banyak permintaan, coba lagi nanti" },
});

/**
 * Request yang sudah diberi ID oleh middleware beriRequestId.
 * Deklarasi ini mencegah error handler harus menebak bentuk request.
 */
export type RequestBerId = Request & { requestId?: string };

/**
 * Menempelkan ID unik pada setiap request agar log server dapat
 * dihubungkan kembali dengan satu permintaan tertentu saat debugging.
 */
export const beriRequestId: RequestHandler = (request, response, next) => {
  const id = randomUUID();
  (request as RequestBerId).requestId = id;
  response.setHeader("X-Request-Id", id);
  next();
};
