/**
 * Pertemuan 9 — Route authentication.
 * Tujuan: memasangkan endpoint auth dengan handler controller.
 * Cara menjalankan: route dipasang oleh app.ts pada prefix /auth.
 * Contoh pengujian: POST /auth/register dan POST /auth/login.
 */

import { Router } from "express";
import { handlerLogin, handlerRegister } from "../controller/auth.controller.ts";

const authRoutes = Router();

// Register membuat akun baru setelah controller memvalidasi input.
authRoutes.post("/register", handlerRegister);

// Login memverifikasi kredensial tanpa mengirim password atau hash ke client.
authRoutes.post("/login", handlerLogin);

export { authRoutes };