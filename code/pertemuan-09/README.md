# Praktikum Pertemuan 9 — Authentication

Contoh API register dan login menggunakan Express.js 5, Prisma ORM 7, SQLite, dan password hashing `scrypt` dari Node.js. Password maupun hash tidak dikirim dalam response. Implementasi login belum menerbitkan session atau JWT; JWT dan authorization menjadi materi Pertemuan 10.

## Prasyarat dan Menjalankan

- Node.js 22.12+; Node.js 24 LTS direkomendasikan.
- npm.

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma generate
npm start
```

Server berjalan di `http://localhost:3009`.

## Endpoint

| Method | Endpoint | Sukses | Kondisi gagal |
|:-------|:---------|:------:|:--------------|
| GET | `/health` | 200 | — |
| POST | `/auth/register` | 201 | 400 input; 409 email sudah terdaftar |
| POST | `/auth/login` | 200 | 400 input; 401 kredensial tidak sesuai |

## Contoh Pengujian

```bash
curl -i -X POST http://localhost:3009/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nama":"Ayu Lestari","email":"ayu@example.test","password":"password-kuat-123"}'

curl -i -X POST http://localhost:3009/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ayu@example.test","password":"password-kuat-123"}'

curl -i -X POST http://localhost:3009/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ayu@example.test","password":"salah-password"}'

curl -i -X POST http://localhost:3009/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nama":"Ayu Lestari","email":"ayu@example.test","password":"password-kuat-123"}'
```

Register pertama menghasilkan `201`; login benar `200`; login salah `401`; register email sama `409`. Periksa database lokal untuk memastikan `passwordHash` berisi `scrypt$salt$derivedKey`, bukan password asli.

## Struktur

```text
app.ts
server.ts
client.ts
prisma/schema.prisma
src/routes/auth.routes.ts
src/controller/auth.controller.ts
src/service/auth.service.ts
```

Project ini merupakan contoh pembelajaran, bukan konfigurasi production. Terapkan rate limiting, pengelolaan secret, proses pemulihan akun, HTTPS, monitoring, dan tinjauan keamanan sebelum digunakan pada layanan nyata.
