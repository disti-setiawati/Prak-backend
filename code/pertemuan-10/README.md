# Praktikum Pertemuan 10 — JWT dan Authorization

Contoh API autentikasi dan otorisasi menggunakan Express.js 5, Prisma ORM 7, SQLite, dan JWT (`jsonwebtoken`). Login menerbitkan access token berisi klaim `sub` dan `role`. Middleware memverifikasi token pada setiap request ke endpoint terlindungi, lalu memeriksa role sebelum mengizinkan akses.

## Prasyarat dan Menjalankan

- Node.js 22.12+; Node.js 24 LTS direkomendasikan.
- npm.

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma generate
```

Sebelum menjalankan server, buat secret acak minimal 32 byte:

```bash
node --input-type=module -e 'import { randomBytes } from "node:crypto"; console.log(randomBytes(32).toString("hex"));'
```

Salin keluarannya ke nilai `JWT_SECRET` di `.env`. Server menolak secret yang kosong atau kurang dari 32 byte saat startup.

Kemudian jalankan server:

```bash
npm start
```

Server berjalan di `http://localhost:3010`.

Isi `.env` sebelum menjalankan:

```dotenv
DATABASE_URL="file:./prisma/dev.db"
PORT=3010
JWT_SECRET=""
JWT_EXPIRES_IN="15m"
```

Aplikasi menolak berjalan bila `JWT_SECRET` kosong atau kurang dari 32 byte.

## Endpoint

| Method | Endpoint | Akses | Sukses | Kondisi gagal |
|:-------|:---------|:------|:------:|:-------------|
| GET | `/health` | Publik | 200 | — |
| POST | `/auth/register` | Publik | 201 | 400 input/JSON tidak valid; 409 email sudah terdaftar; 413 body terlalu besar |
| POST | `/auth/login` | Publik | 200 | 400 input/JSON tidak valid; 401 kredensial tidak sesuai; 413 body terlalu besar |
| GET | `/protected/me` | Token valid | 200 | 401 token hilang atau tidak valid |
| GET | `/protected/pengguna` | Token role `dosen` | 200 | 401 token tidak valid; 403 role tidak sesuai |

## Contoh Pengujian

```bash
curl -i -X POST http://localhost:3010/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nama":"Percobaan Role","email":"role-test@p10.test","password":"password123","role":"dosen"}'

curl -i -X POST http://localhost:3010/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nama":"Dosen Uji","email":"dosen@p10.test","password":"password123"}'

curl -i -X POST http://localhost:3010/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nama":"Mhs Uji","email":"mhs@p10.test","password":"password123"}'
```

Registrasi publik selalu memberikan role `mahasiswa`; client tidak dapat memilih role. Untuk mencoba endpoint khusus dosen dalam lingkungan praktikum, jalankan `npx prisma studio`, ubah role akun `dosen@p10.test` menjadi `dosen` melalui antarmuka database lokal, lalu login ulang untuk memperoleh token dengan klaim role terbaru. Jangan menambahkan endpoint publik untuk mengubah role.

```bash
curl -i -X POST http://localhost:3010/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dosen@p10.test","password":"password123"}'
```

Simpan nilai `token` dari response login, lalu uji endpoint terlindungi:

```bash
curl -i http://localhost:3010/protected/me \
  -H "Authorization: Bearer TOKEN_DOSEN"

curl -i http://localhost:3010/protected/me

curl -i http://localhost:3010/protected/pengguna \
  -H "Authorization: Bearer TOKEN_DOSEN"

curl -i http://localhost:3010/protected/pengguna \
  -H "Authorization: Bearer TOKEN_MAHASISWA"
```

Ringkasan hasil yang diharapkan:

| Skenario | Status |
|:---------|:------:|
| Register pertama | 201 |
| Register dengan field `role` | 400; role tidak boleh ditentukan melalui endpoint publik |
| Register email yang sama | 409 |
| Login benar | 200 (response memuat `token`) |
| Login dengan password salah | 401 |
| Register dengan email tidak valid | 400 |
| `/protected/me` dengan token | 200 |
| `/protected/me` tanpa token | 401 |
| `/protected/me` dengan token diubah satu karakter | 401 |
| `/protected/pengguna` dengan token dosen | 200 |
| `/protected/pengguna` dengan token mahasiswa | 403 |

## Catatan Keamanan pada Contoh

- `JWT_SECRET` hanya dibaca dari environment dan tidak di-*hardcode*.
- Secret harus dibuat secara acak dengan panjang minimal 32 byte; `.env.example` sengaja tidak menyediakan secret yang dapat digunakan.
- Password disimpan sebagai `scrypt$salt$derivedKey`; hash tidak pernah dikirim pada response.
- Payload JWT hanya memuat `sub` dan `role`; tidak ada data sensitif.
- Role dibaca dari klaim token. Pada sistem nyata, role untuk keputusan sensitif sebaiknya dibaca ulang dari database.
- Contoh belum memakai refresh token maupun pencabutan token. Jangan memakai project ini sebagai layanan production.

## Struktur

```text
app.ts
server.ts
client.ts
prisma/schema.prisma
src/routes/auth.routes.ts
src/routes/protected.routes.ts
src/controller/auth.controller.ts
src/controller/protected.controller.ts
src/service/auth.service.ts
src/service/token.service.ts
src/middleware/auth.middleware.ts
```
