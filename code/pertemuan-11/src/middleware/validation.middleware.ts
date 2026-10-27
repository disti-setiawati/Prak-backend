/**
 * Pertemuan 11 — Middleware validasi query string.
 * Tujuan: menolak parameter query yang tidak sesuai tipe atau format sebelum
 *         nilai dipakai pada query database.
 * Cara jalankan: dipasang pada route GET resource sebelum controller.
 * Contoh pengujian: GET /api/buku?minStok=abc menghasilkan 400.
 */

import type { Request, RequestHandler } from "express";

/** Query tervalidasi disimpan di request agar controller tidak memvalidasi ulang. */
export type RequestDivalidasi = Request & {
  queryTervalidasi?: { judul?: string; minStok?: number };
};

/**
 * Nilai query diperiksa tipe, karakter, dan batasnya sebelum dikirim ke service.
 * Masukan tidak dipotong atau diubah diam-diam agar client mengetahui kesalahan.
 */
export const validasiQueryBuku: RequestHandler = (request, response, next) => {
  const judulMentah = request.query.judul;
  const stokMentah = request.query.minStok;
  const errors: string[] = [];
  const hasil: { judul?: string; minStok?: number } = {};

  if (judulMentah !== undefined) {
    if (typeof judulMentah !== "string") {
      errors.push("judul harus berupa teks tunggal");
    } else if (judulMentah.length > 100) {
      errors.push("judul maksimal 100 karakter");
    } else if (/[\u0000-\u001f\u007f]/.test(judulMentah)) {
      errors.push("judul tidak boleh memuat karakter kontrol");
    } else {
      hasil.judul = judulMentah;
    }
  }

  if (stokMentah !== undefined) {
    const nilaiStok = typeof stokMentah === "string" ? Number(stokMentah) : undefined;
    if (typeof stokMentah !== "string" || stokMentah === "" || !/^\d+$/.test(stokMentah)) {
      errors.push("minStok harus berupa bilangan bulat non-negatif");
    } else if (nilaiStok === undefined || !Number.isSafeInteger(nilaiStok) || nilaiStok > 2_147_483_647) {
      errors.push("minStok berada di luar rentang bilangan bulat yang didukung database");
    } else {
      hasil.minStok = nilaiStok;
    }
  }

  if (errors.length > 0) {
    response.status(400).json({ success: false, message: "Validasi query gagal", errors });
    return;
  }

  (request as RequestDivalidasi).queryTervalidasi = hasil;
  next();
};
