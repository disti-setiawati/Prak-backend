/**
 * Pertemuan 10 — Route endpoint terlindungi.
 * Tujuan: mengumpulkan endpoint yang membutuhkan autentikasi dan authorization.
 * Cara menjalankan: route dipasang oleh app.ts pada prefix /protected.
 * Contoh pengujian: GET /protected/me dengan token valid menghasilkan 200.
 */

import { Router } from "express";
import { autentikasiWajib, periksaRole } from "../middleware/auth.middleware.ts";
import { handlerDaftarPengguna, handlerProfilSaya } from "../controller/protected.controller.ts";

const protectedRoutes = Router();

// Semua endpoint di router ini membutuhkan token valid.
protectedRoutes.use(autentikasiWajib);

// Profil sendiri dapat diakses oleh pengguna terautentikasi apa pun.
protectedRoutes.get("/me", handlerProfilSaya);

// Daftar pengguna hanya dapat diakses oleh role dosen.
protectedRoutes.get("/pengguna", periksaRole("dosen"), handlerDaftarPengguna);

export { protectedRoutes };
