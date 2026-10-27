# Praktikum Pertemuan 11 — Keamanan Backend dan API

Contoh API resource buku dengan lapisan keamanan pada Express.js 5, Prisma ORM 7, dan SQLite. Project ini menunjukkan input validation, query terparameterisasi, security header dari `helmet`, CORS selektif, rate limiting, batas ukuran body, serta error handler yang tidak membocorkan detail internal.

> **Batasan contoh:** route buku pada project ini sengaja bersifat publik agar lapisan keamanan pada Pertemuan 11 dapat diuji secara terpisah. Authentication dan authorization tidak dipasang ulang di sini; integrasikan middleware dari Pertemuan 10 sebelum membuka endpoint write pada layanan nyata.

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

Server berjalan di `http://localhost:3011`.

Isi `.env` sebelum menjalankan:

```dotenv
DATABASE_URL="file:./prisma/dev.db"
PORT=3011
CORS_ORIGIN="http://localhost:5173,http://localhost:3000"
RATE_LIMIT_WINDOW_MS=15000
RATE_LIMIT_MAX=20
```

## Endpoint

| Method | Endpoint | Sukses | Kondisi gagal |
|:-------|:---------|:------:|:-------------|
| GET | `/health` | 200 | 429 melebihi batas laju |
| GET | `/api/buku` | 200 | 400 query tidak valid/di luar rentang; 429 |
| POST | `/api/buku` | 201 | 400 body tidak valid/angka di luar rentang; 413 body terlalu besar; 429 |

## Lapisan Keamanan

| Lapisan | Implementasi | Tujuan |
|:--------|:-------------|:--------|
| Input validation | Middleware query dan controller body | Menolak input di luar kontrak |
| SQL injection | Prisma Client | Nilai dikirim sebagai parameter, bukan disisipkan ke teks SQL |
| Security header | `helmet` | Header anti-`sniff`, anti-frame, CSP, HSTS, dan `Referrer-Policy` |
| CORS | Daftar `CORS_ORIGIN` | Hanya origin terdaftar yang mendapat `Access-Control-Allow-Origin` |
| Rate limiting | `express-rate-limit` | Membatasi jumlah request per window dan mengirim `429` |
| Batas body | `express.json({ limit: "100kb" })` | Mencegah payload besar menghabiskan memori |
| Error handling | Error handler terpusat | Detail kegagalan hanya ke log server, pesan umum ke client |
| Request ID | `X-Request-Id` | Menghubungkan log server dengan request tertentu |

## Contoh Pengujian

Periksa header keamanan:

```bash
curl -i http://localhost:3011/health
```

Uji validasi:

```bash
curl -i -X POST http://localhost:3011/api/buku \
  -H "Content-Type: application/json" \
  -d '{"judul":"Clean Code","penulis":"Robert Martin","stok":5}'

curl -i -X POST http://localhost:3011/api/buku \
  -H "Content-Type: application/json" \
  -d '{"judul":"","penulis":"X","stok":-1}'

curl -i "http://localhost:3011/api/buku?minStok=abc"
curl -i "http://localhost:3011/api/buku?minStok=999999999999999999999999"
curl -i -X POST http://localhost:3011/api/buku \
  -H "Content-Type: application/json" \
  -d '{broken'
```

Uji CORS:

```bash
curl -i -H "Origin: http://localhost:5173" http://localhost:3011/health
curl -i -H "Origin: https://evil.test" http://localhost:3011/health
```

Uji rate limiting:

```bash
for i in $(seq 1 26); do curl -s -o /dev/null -w "%{http_code} " http://localhost:3011/health; done
```

## Security Checklist

- [ ] Semua endpoint `write` memvalidasi body: tipe, panjang, dan format.
- [ ] Semua parameter dan query divalidasi sebelum dipakai.
- [ ] Tidak ada penggabungan input pengguna ke teks SQL.
- [ ] Endpoint sensitif memakai autentikasi dan authorization.
- [ ] `helmet` terpasang sebelum route.
- [ ] CORS memakai daftar origin, bukan `origin: true`.
- [ ] Rate limiting terpasang pada seluruh endpoint.
- [ ] Batas ukuran body ditetapkan.
- [ ] Error handler tidak mengirim pesan internal.
- [ ] Tidak ada secret di dalam kode atau repository.

## Batasan

Rate limiter pada contoh ini menyimpan state di memori satu proses sehingga tidak tepat untuk deployment banyak instance. Pada production, pembatasan laju sebaiknya diterapkan juga pada reverse proxy atau API gateway. Contoh ini belum mencakup WAF, deteksi anomali, maupun pemantauan keamanan.

## Struktur

```text
app.ts
server.ts
client.ts
prisma/schema.prisma
src/routes/buku.routes.ts
src/controller/buku.controller.ts
src/service/buku.service.ts
src/middleware/security.middleware.ts
src/middleware/validation.middleware.ts
```
