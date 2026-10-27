/**
 * Pertemuan 10 — Controller endpoint terlindungi.
 * Tujuan: mengembalikan data yang hanya boleh diakses pengguna terautentikasi
 *         dan data yang dibatasi berdasarkan role.
 * Cara menjalankan: handler dipasangkan pada protected.routes.ts.
 * Contoh pengujian: GET /me dengan token valid menghasilkan 200; tanpa token 401.
 */

import type { RequestHandler } from "express";
import type { RequestTerautentikasi } from "../middleware/auth.middleware.ts";
import { prisma } from "../../client.ts";

/** Mengambil profil pengguna dari klaim token yang sudah diverifikasi middleware. */
export const handlerProfilSaya: RequestHandler = async (request, response) => {
  const klaim = (request as RequestTerautentikasi).klaim;
  if (!klaim) {
    response.status(401).json({ success: false, message: "Token tidak ditemukan" });
    return;
  }

  const pengguna = await prisma.pengguna.findUnique({
    where: { id: klaim.sub },
    select: { id: true, nama: true, email: true, role: true, createdAt: true },
  });
  if (!pengguna) {
    response.status(404).json({ success: false, message: "Pengguna tidak ditemukan" });
    return;
  }

  response.status(200).json({ success: true, message: "Profil berhasil diambil", data: pengguna });
};

/** Mengambil daftar pengguna; hanya role yang diizinkan yang dapat mengakses. */
export const handlerDaftarPengguna: RequestHandler = async (_request, response) => {
  const pengguna = await prisma.pengguna.findMany({
    select: { id: true, nama: true, email: true, role: true },
    orderBy: { id: "asc" },
  });
  response.status(200).json({ success: true, message: "Daftar pengguna berhasil diambil", data: pengguna });
};
