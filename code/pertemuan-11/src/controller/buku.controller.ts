/**
 * Pertemuan 11 — Controller resource buku.
 * Tujuan: memvalidasi body request, memilih status code, dan tidak
 *         mengembalikan detail internal kepada client.
 * Cara jalankan: handler dipasangkan pada buku.routes.ts.
 * Contoh pengujian: POST /api/buku dengan body tidak lengkap menghasilkan 400.
 */

import type { RequestHandler } from "express";
import { buatBuku, daftarBuku } from "../service/buku.service.ts";
import type { RequestDivalidasi } from "../middleware/validation.middleware.ts";

type DataBuku = {
  judul: string;
  penulis: string;
  stok: number;
};

/** Prisma Int memakai rentang signed 32-bit; menolak nilai di luarnya mencegah error database. */
const stokValid = (value: unknown): value is number =>
  typeof value === "number"
  && Number.isSafeInteger(value)
  && value >= 0
  && value <= 2_147_483_647;

/** Membaca body sebagai object lalu mengekstrak field dengan guard typeof. */
const bacaBuku = (body: unknown): { data?: DataBuku; errors: string[] } => {
  const errors: string[] = [];
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { errors: ["Body harus berupa object JSON"] };
  }

  const record = body as Record<string, unknown>;
  const judul = typeof record.judul === "string" ? record.judul.trim() : undefined;
  const penulis = typeof record.penulis === "string" ? record.penulis.trim() : undefined;
  const stokMentah = record.stok;

  if (!judul) {
    errors.push("judul wajib diisi");
  } else if (judul.length > 100) {
    errors.push("judul maksimal 100 karakter");
  }

  if (!penulis) {
    errors.push("penulis wajib diisi");
  } else if (penulis.length > 80) {
    errors.push("penulis maksimal 80 karakter");
  }

  let stok = 0;
  if (stokValid(stokMentah)) {
    stok = stokMentah;
  } else if (stokMentah !== undefined) {
    errors.push("stok harus berupa bilangan bulat non-negatif");
  }

  if (errors.length > 0 || judul === undefined || penulis === undefined || stok === undefined) {
    return { errors };
  }

  return { data: { judul, penulis, stok }, errors };
};

/** GET /api/buku — membaca query tervalidasi dari middleware. */
export const handlerDaftarBuku: RequestHandler = async (request, response) => {
  const filter = (request as RequestDivalidasi).queryTervalidasi ?? {};
  const buku = await daftarBuku(filter);
  response.status(200).json({ success: true, message: "Daftar buku", data: buku });
};

/** POST /api/buku — membuat buku baru dan mengembalikan 201. */
export const handlerBuatBuku: RequestHandler = async (request, response) => {
  const { data, errors } = bacaBuku(request.body);
  if (errors.length > 0 || !data) {
    response.status(400).json({ success: false, message: "Validasi gagal", errors });
    return;
  }

  const buku = await buatBuku(data);
  response.status(201).json({ success: true, message: "Buku dibuat", data: buku });
};
