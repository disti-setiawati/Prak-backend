/**
 * Pertemuan 11 — Route resource buku.
 * Tujuan: memetakan endpoint buku dan memasang middleware validasi query.
 * Cara jalankan: route dipasang oleh app.ts pada prefix /api/buku.
 * Contoh pengujian: GET /api/buku?minStok=1 dan POST /api/buku.
 */

import { Router } from "express";
import { handlerBuatBuku, handlerDaftarBuku } from "../controller/buku.controller.ts";
import { validasiQueryBuku } from "../middleware/validation.middleware.ts";

const bukuRoutes = Router();

// Contoh ini sengaja hanya memasang validasi; authentication dan authorization
// dari Pertemuan 10 perlu ditambahkan pada mini project sesuai kebutuhan endpoint.
bukuRoutes.get("/", validasiQueryBuku, handlerDaftarBuku);
bukuRoutes.post("/", handlerBuatBuku);

export { bukuRoutes };
