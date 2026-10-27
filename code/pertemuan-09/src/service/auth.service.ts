/**
 * Pertemuan 9 — Service authentication.
 * Tujuan: memisahkan akses database serta pembuatan dan verifikasi hash dari HTTP.
 * Cara menjalankan: fungsi dipanggil oleh auth.controller.ts.
 * Contoh pengujian: register lalu login memakai email dan password yang sama.
 */

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { prisma } from "../../client.ts";

type DataRegister = {
    nama: string;
    email: string;
    password: string;
};

type ProfilPublik = {
    id: number;
    nama: string;
    email: string;
    createdAt: Date;
};

/** Menghitung derived key asynchronous agar operasi CPU tidak memblokir event loop. */
const hitungDerivedKey = (password: string, salt: Buffer) =>
    new Promise<Buffer>((resolve, reject) => {
        scryptCallback(password, salt, 64, (error, key) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(Buffer.from(key));
        });
    });

/** Menyimpan salt bersama hash agar verifikasi dapat mengulang derivasi untuk akun tertentu. */
const hashPassword = async (password: string) => {
    const salt = randomBytes(16);
    const derivedKey = await hitungDerivedKey(password, salt);
    return `scrypt$${salt.toString("hex")}$${derivedKey.toString("hex")}`;
};

/** Membandingkan kandidat login dengan hash tanpa mengungkap field kredensial. */
const verifikasiPassword = async (password: string, storedHash: string) => {
    const [algorithm, saltHex, keyHex] = storedHash.split("$");
    if (algorithm !== "scrypt" || !saltHex || !keyHex) {
        return false;
    }

    const salt = Buffer.from(saltHex, "hex");
    const expectedKey = Buffer.from(keyHex, "hex");
    const actualKey = await hitungDerivedKey(password, salt);
    return actualKey.length === expectedKey.length && timingSafeEqual(actualKey, expectedKey);
};

/** Membuat akun dan mengembalikan hanya field profil yang aman untuk response. */
export const buatAkun = async ({ nama, email, password }: DataRegister): Promise<ProfilPublik> => {
    const passwordHash = await hashPassword(password);
    return prisma.pengguna.create({
        data: { nama, email, passwordHash },
        select: { id: true, nama: true, email: true, createdAt: true },
    });
};

/** Mengembalikan profil hanya jika email ditemukan dan password cocok. */
export const autentikasi = async (email: string, password: string): Promise<ProfilPublik | null> => {
    const pengguna = await prisma.pengguna.findUnique({ where: { email } });
    if (!pengguna || !(await verifikasiPassword(password, pengguna.passwordHash))) {
        return null;
    }

    return {
        id: pengguna.id,
        nama: pengguna.nama,
        email: pengguna.email,
        createdAt: pengguna.createdAt,
    };
};