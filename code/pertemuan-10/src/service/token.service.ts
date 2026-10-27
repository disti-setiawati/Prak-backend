/**
 * Pertemuan 10 — Service token.
 * Tujuan: memusatkan pembuatan dan verifikasi JWT serta memvalidasi secret
 *         dari environment saat aplikasi dimulai.
 * Cara menjalankan: fungsi dipanggil oleh auth.controller.ts dan middleware auth.
 * Contoh pengujian: buat token lalu verifikasi kembali dengan secret yang sama.
 */

import jwt from "jsonwebtoken";

/** Klaim yang dibawa token. Hanya id dan role yang diperlukan untuk authorization. */
export type KlaimToken = {
  sub: number;
  role: string;
};

/** Menolak secret kosong atau terlalu pendek agar signature tidak mudah ditebak. */
const ambilSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error("JWT_SECRET harus berisi secret acak minimal 32 byte");
  }
  return secret;
};

// Gagal saat startup, bukan saat ada pengguna mencoba login atau memakai endpoint terlindungi.
const JWT_SECRET = ambilSecret();

/** Membuat access token berisi klaim pengguna dan masa berlaku dari environment. */
export const buatToken = (klaim: KlaimToken) => {
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? "15m") as jwt.SignOptions["expiresIn"];
  return jwt.sign({ sub: klaim.sub, role: klaim.role }, JWT_SECRET, { expiresIn });
};

/**
 * Memverifikasi signature dan masa berlaku token.
 * @returns klaim bila token valid, atau null bila token tidak valid/kedaluwarsa.
 */
export const verifikasiToken = (token: string): KlaimToken | null => {
  try {
    const hasil = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
    if (typeof hasil === "string") {
      return null;
    }
    const sub = typeof hasil.sub === "number" ? hasil.sub : undefined;
    const role = typeof hasil.role === "string" ? hasil.role : undefined;
    if (sub === undefined || role === undefined) {
      return null;
    }
    return { sub, role };
  } catch {
    return null;
  }
};
