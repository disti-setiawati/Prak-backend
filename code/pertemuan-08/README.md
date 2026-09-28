# mini-project — Pertemuan 8 (UTS)

Mini project backend berupa REST API untuk resource **buku** yang terintegrasi dengan SQLite melalui Prisma ORM. Struktur project mengikuti pola **service/controller/routes** (lapis tiga).

## Prasyarat

- Node.js 20+ (`node --version`)
- npm

## Menyiapkan dan Menjalankan

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma generate
npm start
```

Server berjalan di `http://localhost:3008`.

## Struktur Lapisan

```text
mini-project/
├── app.ts          # menyusun middleware, route, 404, error handler
├── server.ts       # menjalankan app + shutdown bersih
├── client.ts       # instance Prisma Client (singleton)
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── routes/buku.routes.ts            # path resource
│   ├── controller/buku.controller.ts    # validasi input, kode status
│   └── service/buku.service.ts          # operasi data (Prisma)
└── latihan.ts      # latihan resource pengguna (TODO terbimbing)
```

Alur request: `client → app.ts → buku.routes.ts → buku.controller.ts → buku.service.ts → client.ts (Prisma) → SQLite`.

## Endpoint

Semua response memakai struktur `{ success, message, data }`.

| Method | Endpoint | Deskripsi | Status Sukses |
|:-------|:---------|:----------|:--------------|
| GET | `/buku` | Daftar buku (filter `?penulis=` dan `?minStok=`) | 200 |
| GET | `/buku/:id` | Detail buku | 200 / 404 |
| POST | `/buku` | Buat buku | 201 / 400 |
| PATCH | `/buku/:id` | Update sebagian field | 200 / 404 / 400 |
| DELETE | `/buku/:id` | Hapus buku | 204 / 404 |
| GET | `/health` | Health check | 200 |

## Contoh Penggunaan (curl)

```bash
# Health check
curl -i http://localhost:3008/health

# Daftar buku
curl -i http://localhost:3008/buku

# Buat buku — 201
curl -i -X POST http://localhost:3008/buku \
  -H "Content-Type: application/json" \
  -d '{"judul":"Belajar Node.js","penulis":"Andi","tahun":2024,"stok":3}'

# Detail — 200
curl -i http://localhost:3008/buku/1

# Detail tidak ada — 404
curl -i http://localhost:3008/buku/999999

# Update sebagian — 200
curl -i -X PATCH http://localhost:3008/buku/1 \
  -H "Content-Type: application/json" \
  -d '{"stok":2}'

# Validasi gagal — 400
curl -i -X POST http://localhost:3008/buku \
  -H "Content-Type: application/json" \
  -d '{"judul":"","penulis":"","tahun":9999}'

# Hapus — 204
curl -i -I -X DELETE http://localhost:3008/buku/1
```

## Skema Database

Skema Prisma ada di [`prisma/schema.prisma`](./prisma/schema.prisma) — dua model `buku` dan `pengguna` pada SQLite. Hasil migration tersimpan di `prisma/migrations/`.

## Latihan

File `latihan.ts` berisi kerangka resource `pengguna` dengan TODO yang harus dilengkapi untuk memindahkan logika dari route langsung ke service/controller. Jalankan secara terpisah:

```bash
npx prisma migrate dev --name pengguna
node --experimental-strip-types latihan.ts
```

## Pengembangan Lanjutan

Pada pertemuan berikutnya (Minggu 9+), project ini dapat dikembangkan dengan:

- Authentication (register/login dengan password hashing)
- JWT untuk akses endpoint terlindungi
- Security checklist (validation, security headers, CORS, rate limiting)
- Test suite, dokumentasi API (OpenAPI/Swagger), dan deployment
