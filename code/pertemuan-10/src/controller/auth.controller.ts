/**
 * Pertemuan 10 — Controller authentication.
 * Tujuan: memvalidasi request, menerbitkan token setelah login, dan memilih status HTTP.
 * Cara menjalankan: handler dipasangkan pada auth.routes.ts.
 * Contoh pengujian: kirim JSON register/login ke endpoint terkait.
 */

import type { RequestHandler } from "express";
import { autentikasi, buatAkun } from "../service/auth.service.ts";
import { buatToken } from "../service/token.service.ts";

type DataKredensial = {
  nama?: string;
  email: string;
  password: string;
};

/** Mengenali konflik unique Prisma tanpa mengirim detail error database ke client. */
const isUniqueConstraintError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return false;
  }

  const code = (error as Error & { code?: unknown }).code;
  return code === "P2002";
};

/** Mengekstrak nilai bertipe benar sebelum data request diteruskan ke service. */
const bacaKredensial = (body: unknown, perluNama: boolean) => {
  const errors: string[] = [];
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { errors: ["Body harus berupa object JSON"], data: undefined };
  }

  const record = body as Record<string, unknown>;
  const nama = typeof record.nama === "string" ? record.nama.trim() : undefined;
  const email = typeof record.email === "string" ? record.email.trim().toLowerCase() : undefined;
  const password = typeof record.password === "string" ? record.password : undefined;
  const posisiAt = email?.indexOf("@") ?? -1;
  const posisiTitik = email?.lastIndexOf(".") ?? -1;
  const emailValid = email !== undefined
    && posisiAt > 0
    && posisiAt === email.lastIndexOf("@")
    && posisiTitik > posisiAt + 1
    && posisiTitik < email.length - 1
    && !email.includes(" ");

  if (perluNama && !nama) errors.push("nama wajib diisi");
  if (!emailValid) {
    errors.push("email harus memiliki format yang valid");
  }
  if (password === undefined || password.length < 8) {
    errors.push("password wajib berupa string minimal 8 karakter");
  }
  if (perluNama && Object.hasOwn(record, "role")) {
    errors.push("role tidak dapat ditentukan melalui registrasi publik");
  }

  if (errors.length > 0 || email === undefined || password === undefined) {
    return { errors, data: undefined };
  }

  const data: DataKredensial = {
    ...(perluNama && nama !== undefined && { nama }),
    email,
    password,
  };
  return { errors, data };
};

/** Membuat akun dengan status 201 dan menangani konflik unique email sebagai 409. */
export const handlerRegister: RequestHandler = async (request, response) => {
  const { data, errors } = bacaKredensial(request.body, true);
  if (errors.length > 0 || !data?.nama) {
    response.status(400).json({ success: false, message: "Validasi gagal", errors });
    return;
  }

  try {
    const pengguna = await buatAkun({
      nama: data.nama,
      email: data.email,
      password: data.password,
    });
    response.status(201).json({ success: true, message: "Akun berhasil dibuat", data: pengguna });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      response.status(409).json({ success: false, message: "Email sudah terdaftar" });
      return;
    }
    throw error;
  }
};

/**
 * Memverifikasi kredensial dan menerbitkan access token bila cocok.
 * Token dikirim pada response agar client dapat mengirimkannya pada request berikutnya.
 */
export const handlerLogin: RequestHandler = async (request, response) => {
  const { data, errors } = bacaKredensial(request.body, false);
  if (errors.length > 0 || !data) {
    response.status(400).json({ success: false, message: "Validasi gagal", errors });
    return;
  }

  const pengguna = await autentikasi(data.email, data.password);
  if (!pengguna) {
    response.status(401).json({ success: false, message: "Email atau password tidak sesuai" });
    return;
  }

  const token = buatToken({ sub: pengguna.id, role: pengguna.role });
  response.status(200).json({
    success: true,
    message: "Login berhasil",
    data: { ...pengguna, token },
  });
};
