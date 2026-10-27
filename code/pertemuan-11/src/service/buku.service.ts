/**
 * Pertemuan 11 — Service resource buku.
 * Tujuan: memusatkan operasi database dan menegakkan aturan bisnis
 *         sebelum data mencapai Prisma.
 * Cara jalankan: fungsi dipanggil oleh buku.controller.ts.
 * Contoh pengujian: POST /api/buku dengan stok negatif ditolak di controller;
 *                   service hanya menerima nilai yang sudah tervalidasi.
 */

import { prisma } from "../../client.ts";

type DataBuku = {
  judul: string;
  penulis: string;
  stok: number;
};

type FilterBuku = {
  judul?: string;
  minStok?: number;
};

/**
 * Daftar buku dengan filter opsional. Nilai filter sudah tervalidasi tipe
 * dan formatnya oleh middleware, sehingga query dibentuk dari nilai primitif
 * dan tidak rentan terhadap injection.
 */
export const daftarBuku = (filter: FilterBuku) => {
  return prisma.buku.findMany({
    where: {
      ...(filter.judul !== undefined && {
        judul: { contains: filter.judul },
      }),
      ...(filter.minStok !== undefined && {
        stok: { gte: filter.minStok },
      }),
    },
    orderBy: { id: "asc" },
  });
};

/** Membuat buku baru; nilai sudah dibatasi panjang dan rentangnya di controller. */
export const buatBuku = (data: DataBuku) => {
  return prisma.buku.create({ data });
};
