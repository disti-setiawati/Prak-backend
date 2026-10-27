/**
 * Pertemuan 10 — Middleware authentication.
 * Tujuan: memverifikasi header Authorization Bearer dan menempelkan klaim pengguna
 *         pada request sebelum handler terlindungi dijalankan.
 * Cara menjalankan: dipasang pada route yang membutuhkan autentikasi.
 * Contoh pengujian: request tanpa token menghasilkan 401; token valid meneruskan request.
 */

import type { NextFunction, Request, Response } from "express";
import { verifikasiToken } from "../service/token.service.ts";

/** Menempelkan klaim pengguna yang sudah diverifikasi pada request. */
export type RequestTerautentikasi = Request & {
  klaim?: { sub: number; role: string };
};

/**
 * Middleware autentikasi: menolak request tanpa token valid.
 * Diletakkan sebelum handler agar handler tidak perlu memeriksa token sendiri.
 */
export const autentikasiWajib = (request: RequestTerautentikasi, response: Response, next: NextFunction) => {
  const header = request.headers.authorization;
  if (typeof header !== "string" || !header.startsWith("Bearer ")) {
    response.status(401).json({ success: false, message: "Token tidak ditemukan" });
    return;
  }

  const token = header.slice("Bearer ".length).trim();
  const klaim = verifikasiToken(token);
  if (!klaim) {
    response.status(401).json({ success: false, message: "Token tidak valid atau kedaluwarsa" });
    return;
  }

  request.klaim = klaim;
  next();
};

/**
 * Middleware authorization: hanya meneruskan request bila role pengguna termasuk
 * pada daftar role yang diizinkan. Dipanggil setelah autentikasiWajib.
 */
export const periksaRole =
  (...roleDiizinkan: string[]) =>
  (request: RequestTerautentikasi, response: Response, next: NextFunction) => {
    const role = request.klaim?.role;
    if (!role || !roleDiizinkan.includes(role)) {
      response.status(403).json({ success: false, message: "Anda tidak memiliki izin untuk endpoint ini" });
      return;
    }
    next();
  };
