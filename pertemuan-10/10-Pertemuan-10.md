# Pertemuan 10 — JWT dan Authorization: Access Token, Middleware, dan Role

| | |
|:--|:--|
| **Minggu** | 10 |
| **Tanggal** | Senin, 16 November 2026 (SI-VA) / Selasa, 17 November 2026 (SI-VB) |
| **CPMK** | CPMK118 |
| **Model Pembelajaran** | Case Based Learning / Problem Based Learning |
| **Stack** | Node.js 22.12+, Express.js 5, Prisma ORM 7, SQLite, jsonwebtoken, TypeScript |

> **Catatan penting:** Pertemuan ini membahas JWT (JSON Web Token) dan authorization, yaitu proses menentukan tindakan yang boleh dilakukan oleh pengguna yang identitasnya telah diverifikasi. Anda akan menerbitkan access token setelah login, memverifikasinya pada setiap request melalui middleware, serta membatasi akses endpoint berdasarkan role. Contoh praktikum menggunakan `jsonwebtoken` dengan access token bermasa berlaku singkat dan secret yang dibaca dari environment. Penerapan production memerlukan pengelolaan secret yang aman, mekanisme pencabutan token, rate limiting, serta penyimpanan token yang terlindung dari akses JavaScript pada halaman.

---

## Daftar Isi

- [Pertemuan 10 — JWT dan Authorization: Access Token, Middleware, dan Role](#pertemuan-10--jwt-dan-authorization-access-token-middleware-dan-role)
  - [Daftar Isi](#daftar-isi)
  - [1. Keterkaitan Pertemuan dengan RPS OBE](#1-keterkaitan-pertemuan-dengan-rps-obe)
  - [2. Capaian Pembelajaran Pertemuan](#2-capaian-pembelajaran-pertemuan)
  - [3. Pemantik Kasus: Endpoint yang Terbuka untuk Semua](#3-pemantik-kasus-endpoint-yang-terbuka-untuk-semua)
  - [4. Dari Authentication ke Authorization](#4-dari-authentication-ke-authorization)
  - [5. Struktur JWT](#5-struktur-jwt)
  - [6. Access Token dan Refresh Token](#6-access-token-dan-refresh-token)
  - [7. Header Authorization](#7-header-authorization)
  - [8. Alur Verifikasi Token](#8-alur-verifikasi-token)
  - [9. Middleware Authentication](#9-middleware-authentication)
  - [10. Authorization Berbasis Role](#10-authorization-berbasis-role)
  - [11. Status Code Autentikasi dan Authorization](#11-status-code-autentikasi-dan-authorization)
  - [12. Penerapan pada Express.js](#12-penerapan-pada-expressjs)
  - [13. Case Based Learning: Studi Kasus Authorization](#13-case-based-learning-studi-kasus-authorization)
  - [14. Alur Demonstrasi dan Pengujian Endpoint](#14-alur-demonstrasi-dan-pengujian-endpoint)
  - [15. Tinjauan Keputusan Desain](#15-tinjauan-keputusan-desain)
  - [16. Kesalahan Umum](#16-kesalahan-umum)
  - [17. Batasan Implementasi](#17-batasan-implementasi)
  - [18. Aktivitas Kelompok](#18-aktivitas-kelompok)
  - [19. Latihan Individu](#19-latihan-individu)
  - [20. Pemanfaatan AI sebagai Coding Assistant](#20-pemanfaatan-ai-sebagai-coding-assistant)
  - [21. Kuis Formatif](#21-kuis-formatif)
  - [22. Output Pembelajaran — Tugas JWT dan Authorization](#22-output-pembelajaran--tugas-jwt-dan-authorization)
    - [Cara Pengumpulan — Push ke Repository GitHub Kelas](#cara-pengumpulan--push-ke-repository-github-kelas)
  - [23. Rubrik Tugas JWT dan Authorization](#23-rubrik-tugas-jwt-dan-authorization)
  - [24. Persiapan menuju Pertemuan 11](#24-persiapan-menuju-pertemuan-11)
  - [Lampiran: Kode Referensi](#lampiran-kode-referensi)

---

## 1. Keterkaitan Pertemuan dengan RPS OBE

Pertemuan 10 melanjutkan fase **Keamanan & Keandalan** dan mendukung CPMK118: mahasiswa mampu menerapkan authentication dan authorization, mengamankan API, serta membangun error handling dan konfigurasi terpusat. Endpoint register dan login dari Pertemuan 9 menjadi dasar; pada pertemuan ini konteks login diubah menjadi token yang dapat diverifikasi pada request berikutnya.

```mermaid
timeline
    title Posisi Pertemuan 10 dalam Peta 16 Minggu
    section API Core
        Minggu 4-5 : Express.js dan RESTful API
        Minggu 6-7 : Database, ORM, dan CRUD
        Minggu 8 : UTS Mini Project
    section Keamanan dan Keandalan
        Minggu 9 : Authentication dan password hashing
        Minggu 10 : JWT dan authorization (pertemuan ini)
        Minggu 11 : Keamanan Backend dan API
        Minggu 12 : Error handling, logging, konfigurasi
    section Quality dan Delivery
        Minggu 13-15 : Testing, dokumentasi, deployment
        Minggu 16 : UAS Final Project
```

## 2. Capaian Pembelajaran Pertemuan

| No. | Kemampuan | Indikator |
| :-: | --------- | --------- |
| 1 | Menjelaskan struktur dan isi JWT | Menjelaskan fungsi header, payload, dan signature serta cara server memverifikasi signature |
| 2 | Menerbitkan access token setelah login | Response login membawa token yang memuat klaim pengguna |
| 3 | Menyusun middleware authentication | Request tanpa token atau dengan token rusak ditolak dengan `401` |
| 4 | Membatasi akses berdasarkan role | Role tidak sesuai ditolak dengan `403`, bukan `401` |
| 5 | Memilih status code yang sesuai | Menggunakan `201`, `400`, `401`, `403`, dan `409` sesuai kondisi |
| 6 | Menjelaskan risiko penggunaan token | Masa berlaku, secret, pencabutan, dan penyimpanan token pada client |

## 3. Pemantik Kasus: Endpoint yang Terbuka untuk Semua

Sebuah layanan akademik sudah memiliki endpoint login. Seorang mahasiswa menemukan bahwa endpoint `GET /api/pengguna` dapat dipanggil tanpa login, sementara halaman administrasi menampilkan seluruh daftar akun beserta alamat email. Menyembunyikan data sensitif pada frontend saja tidak cukup; backend harus menolak request yang tidak berhak.

Diskusikan: bagaimana server membedakan request yang sudah login dan belum? Apa keuntungan dan keterbatasan token yang diverifikasi secara *stateless* dibandingkan session ID yang disimpan di server? Apa yang terjadi bila token sampai ke orang lain? Bagaimana server membedakan "Anda belum login" dari "Anda login, tetapi tidak berhak"?

## 4. Dari Authentication ke Authorization

Pada Pertemuan 9, authentication membuktikan identitas melalui email dan password. Authorization memakai identitas tersebut untuk memeriksa hak akses. Keduanya berjalan berurutan: verifikasi token terlebih dahulu, baru pemeriksaan role.

| Aspek | Authentication | Authorization |
|:------|:---------------|:-------------|
| Pertanyaan | Siapa Anda? | Apa yang boleh Anda lakukan? |
| Bukti | Password, session, atau token | Role, permission, dan kebijakan akses |
| Hasil gagal | `401 Unauthorized` | `403 Forbidden` |
| Letak pemeriksaan | Login dan middleware token | Middleware role dan pengecekan pada service |

Urutannya adalah sebagai berikut: client login, server memverifikasi kredensial, server menerbitkan token, client menyimpan token, setiap request berikutnya melampirkan token, middleware memverifikasi token dan menempelkan klaim, kemudian middleware role memeriksa klaim tersebut.

## 5. Struktur JWT

JWT adalah format token yang terdiri atas tiga bagian yang dipisahkan oleh titik dan disandikan dengan *base64url*. Bagian tersebut adalah header, payload, dan signature.

```text
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJkb3NlbiJ9.L8mDikqWrcnTYg6K4bkYkaRnAImPat9aWDzhbKTBlgQ
```

| Bagian | Isi | Sifat |
|:-------|:----|:------|
| Header | Algoritma, misalnya `HS256` | Dapat dibaca client |
| Payload | Klaim seperti `sub`, `role`, `iat`, dan `exp` | Dapat dibaca client, isinya bukan rahasia |
| Signature | Hasil penandatanganan header dan payload memakai secret | Diverifikasi server |

Payload JWT **tidak terenkripsi**; isinya hanya disandikan sehingga dapat dibaca siapa pun yang memiliki token. Signature memastikan payload tidak diubah, tetapi tidak menyembunyikan isinya. Jangan menaruh data sensitif seperti password ke dalam payload. Klaim `exp` menentukan kedaluwarsa dan harus selalu diverifikasi server.

## 6. Access Token dan Refresh Token

| Aspek | Access Token | Refresh Token |
|:------|:--------------|:--------------|
| Masa berlaku | Pendek, misalnya 15 menit | Panjang, misalnya 7 hari |
| Dikirim | Pada setiap request | Hanya ke endpoint refresh |
| Isi | Klaim yang diperlukan untuk akses API | Dapat berupa token opaque atau token dengan klaim minimal, bergantung pada desain server |
| Tujuan | Akses API harian | Memperpanjang sesi tanpa login ulang |

Contoh praktikum hanya menerbitkan access token. Refresh token, pencabutan token, dan penyimpanan *blacklist* belum dibahas. Pada token yang berdiri sendiri, *logout* tidak langsung membatalkan token karena token tetap valid sampai kedaluwarsa. Refresh token dapat disimpan di server agar dapat dicabut ketika diperlukan.

## 7. Header Authorization

Token dikirim pada header, bukan pada query string:

```http
GET /protected/me HTTP/1.1
Host: localhost:3010
Authorization: Bearer <token>
```

| Bentuk | Hasil |
|:-------|:------|
| `Authorization: Bearer <token>` | Diproses sebagai token |
| Header kosong atau tanpa awalan `Bearer` | `401` |
| Awalan salah, misalnya `Basic` atau `Token` | `401` |
| Token rusak, kedaluwarsa, atau ditandatangani secret lain | `401` |

Query string seperti `?token=...` mudah bocor melalui log server, riwayat browser, dan header `Referer`. Header `Authorization` lebih aman untuk nilai sensitif.

## 8. Alur Verifikasi Token

```mermaid
sequenceDiagram
    actor Pengguna
    participant Client
    participant API as Express API
    participant MW as Middleware
    participant DB as SQLite / Prisma
    Pengguna->>Client: Login dengan email dan password
    Client->>API: POST /auth/login
    API->>DB: Verifikasi kredensial
    DB-->>API: Profil pengguna
    API->>API: Terbitkan token berisi sub dan role
    API-->>Client: 200 + token
    Client->>API: GET /protected/me dengan Authorization: Bearer
    API->>MW: Teruskan request
    MW->>MW: Verifikasi signature dan exp
    MW->>DB: Ambil data sesuai klaim
    DB-->>MW: Data pengguna
    MW-->>Client: 200 dengan data
```

## 9. Middleware Authentication

Middleware authentication diletakkan pada route agar setiap handler terlindungi tidak perlu memeriksa token satu per satu.

```typescript
export const autentikasiWajib = (request: RequestTerautentikasi, response: Response, next: NextFunction) => {
  const header = request.headers.authorization;
  if (typeof header !== "string" || !header.startsWith("Bearer ")) {
    response.status(401).json({ success: false, message: "Token tidak ditemukan" });
    return;
  }

  const token = header.slice("Bearer ".length).trim();
  const klaim = verifikasiToken(token);
  if (!klaim) {
    response.status(401).json({ success: false, message: "Token tidak valid atau kedaluwarsa" });
    return;
  }

  request.klaim = klaim;
  next();
};
```

Middleware hanya berjalan pada route yang memasangnya. Pada router terpisah, `router.use(autentikasiWajib)` berlaku untuk seluruh endpoint di dalam router tersebut sehingga tidak ada endpoint yang terlupa dilindungi.

## 10. Authorization Berbasis Role

Setelah token terverifikasi, klaim `role` digunakan untuk membatasi akses. Middleware factory menerima daftar role yang diizinkan dan menolak request lain dengan `403`.

```typescript
export const periksaRole =
  (...roleDiizinkan: string[]) =>
  (request: RequestTerautentikasi, response: Response, next: NextFunction) => {
    const role = request.klaim?.role;
    if (!role || !roleDiizinkan.includes(role)) {
      response.status(403).json({ success: false, message: "Anda tidak memiliki izin untuk endpoint ini" });
      return;
    }
    next();
  };
```

Perbedaan penting: `401` berarti request tidak membawa bukti identitas, sedangkan `403` berarti identitas sudah terbukti tetapi tidak cukup untuk melakukan tindakan tersebut. Role pada payload token dapat dibaca dan disandikan client, sehingga untuk keputusan sensitif role sebaiknya dibaca ulang dari database.

## 11. Status Code Autentikasi dan Authorization

| Kondisi | Status | Alasan |
|:--------|:------:|:-------|
| Register berhasil | `201` | Resource akun baru tersimpan |
| Input tidak valid | `400` | Request tidak memenuhi kontrak endpoint |
| Email sudah terdaftar | `409` | Konflik terhadap resource yang ada |
| Login berhasil | `200` | Kredensial benar dan token diterbitkan |
| Login gagal | `401` | Kredensial tidak membuktikan identitas |
| Token tidak ditemukan atau tidak valid | `401` | Request tidak membawa bukti identitas |
| Role tidak sesuai | `403` | Identitas terbukti, hak akses tidak cukup |
| Endpoint tidak dikenal | `404` | Tidak ada route yang cocok |
| Error tak terduga | `500` | Server gagal memproses request |

## 12. Penerapan pada Express.js

Project mengikuti pola dari Pertemuan 9 dan menambahkan lapisan middleware:

```text
request → protected.routes.ts → autentikasiWajib → periksaRole → protected.controller.ts → Prisma → SQLite
```

Service token memusatkan pembacaan `JWT_SECRET` dan `JWT_EXPIRES_IN` dari environment sehingga rahasia tidak tersebar di beberapa berkas. Middleware menempelkan klaim pada request sehingga controller dapat memakai `request.klaim.sub` untuk melakukan query tanpa memverifikasi token lagi.

## 13. Case Based Learning: Studi Kasus Authorization

Kasus: layanan peminjaman laboratorium sudah memiliki register dan login dari Pertemuan 9. Mahasiswa dapat melihat daftar alat yang tersedia, tetapi hanya staf yang boleh menambah alat, mengubah status peminjaman, atau melihat daftar peminjam. Tentukan klaim yang perlu dibawa token, endpoint mana yang memerlukan role apa, dan kapan `401` versus `403` harus dikirim. Jelaskan juga apa yang terjadi apabila seseorang memodifikasi payload token secara langsung.

## 14. Alur Demonstrasi dan Pengujian Endpoint

Kode praktikum ada pada [`code/pertemuan-10/`](../code/pertemuan-10/). Dari direktori tersebut jalankan:

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma generate
```

Sebelum menjalankan server, buat secret acak minimal 32 byte dan salin hasilnya ke `JWT_SECRET` pada `.env`:

```bash
node --input-type=module -e 'import { randomBytes } from "node:crypto"; console.log(randomBytes(32).toString("hex"));'
```

Lalu jalankan `npm start`. Server memakai port `3010` dan menolak startup bila secret kosong atau kurang dari 32 byte. Registrasi publik selalu menetapkan role `mahasiswa`; client tidak boleh memilih role sendiri. Buat dua akun untuk pengujian:

```bash
curl -i -X POST http://localhost:3010/auth/register -H "Content-Type: application/json" -d '{"nama":"Dosen Uji","email":"dosen@p10.test","password":"password123"}'
curl -i -X POST http://localhost:3010/auth/register -H "Content-Type: application/json" -d '{"nama":"Mhs Uji","email":"mhs@p10.test","password":"password123"}'
curl -i -X POST http://localhost:3010/auth/register -H "Content-Type: application/json" -d '{"nama":"Percobaan Role","email":"role-test@p10.test","password":"password123","role":"dosen"}'
```

Untuk menguji endpoint khusus dosen, jalankan `npx prisma studio` dan ubah role akun `dosen@p10.test` menjadi `dosen` melalui antarmuka database lokal. Ini adalah provisioning tepercaya untuk praktikum, bukan endpoint publik. Login ulang setelah perubahan agar token memuat role terbaru:

```bash
curl -i -X POST http://localhost:3010/auth/login -H "Content-Type: application/json" -d '{"email":"dosen@p10.test","password":"password123"}'
```

Simpan nilai `token` dari response login, lalu uji endpoint terlindungi:

```bash
curl -i http://localhost:3010/protected/me -H "Authorization: Bearer TOKEN"
curl -i http://localhost:3010/protected/me
curl -i http://localhost:3010/protected/pengguna -H "Authorization: Bearer TOKEN_DOSEN"
curl -i http://localhost:3010/protected/pengguna -H "Authorization: Bearer TOKEN_MAHASISWA"
```

Periksa kombinasi hasil berikut:

| Skenario | Status yang diharapkan |
|:---------|:-----------------------|
| Login dengan kredensial benar | `200` dan response memuat `token` |
| Register dengan field `role` | `400`; role tidak dapat dipilih melalui endpoint publik |
| Login dengan password salah | `401` |
| Register dengan email yang sama | `409` |
| Register dengan email tidak valid | `400` |
| `/protected/me` dengan token dosen | `200` |
| `/protected/me` tanpa token | `401` |
| `/protected/me` dengan token yang diubah satu karakter | `401` |
| `/protected/pengguna` dengan token dosen | `200` |
| `/protected/pengguna` dengan token mahasiswa | `403` |

## 15. Tinjauan Keputusan Desain

- Access token berumur pendek membatasi jendela penyalahgunaan ketika token bocor.
- `JWT_SECRET` hanya dibaca dari environment; secret kosong atau kurang dari 32 byte membuat startup ditolak.
- Verifikasi token ditempatkan sebagai middleware agar tidak ada handler yang lupa memeriksa.
- Klaim diletakkan pada request sehingga controller tidak perlu memverifikasi ulang.
- Role dibaca dari payload untuk kebutuhan pembelajaran, dengan catatan payload dapat dibaca client.
- Middleware role memakai `403` sehingga client dapat membedakan "belum login" dari "tidak berhak".

## 16. Kesalahan Umum

1. Menyimpan `JWT_SECRET` langsung di dalam kode dan ikut meng-commit berkas tersebut.
2. Memverifikasi token di dalam controller sehingga endpoint baru mudah lupa dilindungi.
3. Menggunakan `401` untuk role yang tidak sesuai sehingga client tidak dapat membedakan penyebab kegagalan.
4. Menaruh password atau nomor identitas di dalam payload JWT.
5. Mengirim token pada query string sehingga mudah bocor melalui log dan riwayat browser.
6. Tidak memeriksa klaim `exp` sehingga token kedaluwarsa masih diterima.
7. Menganggap payload JWT aman karena tidak dapat dibaca tanpa *decode*.
8. Tidak menguji kasus token rusak, token kedaluwarsa, dan role tidak sesuai.

## 17. Batasan Implementasi

Project referensi memakai access token tunggal tanpa refresh token, tanpa pencabutan token, dan tanpa *blacklist*. Role disimpan sebagai string pada kolom `role` tanpa tabel permission, dan pemeriksaan role membaca klaim dari token tanpa membaca ulang database. Belum tersedia rate limiting, rotasi secret, dan pengelolaan cookie. Jangan memakai project ini sebagai layanan production tanpa threat modeling, pengujian, dan konfigurasi keamanan yang sesuai.

## 18. Aktivitas Kelompok

Rancang endpoint terlindungi untuk domain kelompok. Buat tabel endpoint, klaim yang dibutuhkan, role yang diizinkan, serta status `401` atau `403` untuk setiap kasus. Tukarkan rancangan untuk meninjau endpoint yang tidak memasang middleware, kebocoran data sensitif pada payload, dan perbedaan antara "belum login" dengan "tidak berhak".

## 19. Latihan Individu

1. Tambahkan role ketiga `staf` dan buat endpoint yang hanya dapat diakses oleh role tersebut.
2. Uji login, akses tanpa token, token rusak, dan role tidak sesuai.
3. Jelaskan mengapa klaim `exp` harus diverifikasi pada setiap request.
4. Bandingkan dampak access token berumur 15 menit dengan berumur 24 jam ketika token bocor.

## 20. Pemanfaatan AI sebagai Coding Assistant

**Gunakan AI untuk:**

- Meminta penjelasan struktur JWT, perbedaan `401` dan `403`, serta fungsi klaim `exp`.
- Meminta tinjauan middleware authentication pada project Anda untuk mencari endpoint yang belum dilindungi.
- Menyusun daftar skenario uji token: tanpa token, token rusak, token kedaluwarsa, dan role tidak sesuai.

**Jangan gunakan AI untuk:**

- Mengirim `JWT_SECRET`, file `.env`, token nyata, atau data pribadi ke layanan AI.
- Menghasilkan seluruh lapisan authorization tanpa memahami tanggung jawab route, middleware, dan controller.
- Menganggap saran AI sebagai bukti keamanan atau melewatkan pengujian endpoint.

**Etika di kelas:**

1. Cantumkan penggunaan AI pada README atau refleksi tugas dan jelaskan saran yang diterapkan.
2. Verifikasi saran menggunakan dokumentasi `jsonwebtoken` dan hasil pengujian endpoint.
3. Anda tetap bertanggung jawab menjelaskan serta menguji keputusan keamanan yang digunakan.

## 21. Kuis Formatif

1. Apa perbedaan `401 Unauthorized` dan `403 Forbidden`?
2. Apa fungsi signature pada JWT?
3. Mengapa payload JWT tidak boleh memuat password?
4. Mengapa token dikirim pada header `Authorization`, bukan query string?
5. Mengapa secret JWT harus dibaca dari environment?
6. Apa risiko utama access token berumur sangat lama?

## 22. Output Pembelajaran — Tugas JWT dan Authorization

Tambahkan login yang menerbitkan access token, middleware authentication, serta pembatasan endpoint berdasarkan role pada mini project. Gunakan secret dari environment, masa berlaku token yang singkat, validasi role, dan response yang tidak membocorkan data sensitif.

### Cara Pengumpulan — Push ke Repository GitHub Kelas

| Kelas | Repository | Folder |
|:------|:-----------|:-------|
| SI-VA | `SI-VA-Backend` | `uts/<nim>-<nama>/` |
| SI-VB | `SI-VB-Backend` | `uts/<nim>-<nama>/` |

Langkah pengumpulan:

1. Buat branch menggunakan NIM Anda.
2. Perbarui mini project pada folder `uts/<nim>-<nama>/` yang dikumpulkan pada Pertemuan 8.
3. Jalankan `npm install`, `npx prisma migrate dev`, dan `npx prisma generate` sesuai README project.
4. Uji login, endpoint terlindungi tanpa token, token tidak valid, dan role yang tidak sesuai; catat hasilnya pada README.
5. Commit dan push branch, lalu buat Pull Request.

Pastikan `node_modules/`, `.env`, dan file database `.db` tidak ikut di-commit. Tambahkan pola berikut pada `.gitignore` bila belum tersedia:

```gitignore
node_modules/
.env
prisma/dev.db
prisma/generated/
```

> **Catatan:** File `prisma/generated/` adalah hasil `prisma generate` dan tidak perlu di-commit. File `prisma/migrations/` harus di-commit agar database dapat di-migrate ulang di komputer lain.

## 23. Rubrik Tugas JWT dan Authorization

| Kriteria | Bobot | 4 (Sangat Baik) | 3 (Baik) | 2 (Cukup) | 1 (Perlu Bimbingan) |
|:---------|:-----:|:----------------|:---------|:----------|:--------------------|
| Penerbitan token setelah login | 25% | Token terbit dengan klaim lengkap, masa berlaku dari environment, secret tidak di-hardcode | Token terbit dan terverifikasi | Token terbit tanpa masa berlaku yang jelas | Token tidak terbit atau endpoint belum terlindungi |
| Middleware authentication | 30% | Semua endpoint terlindungi memakai middleware, token rusak dan kedaluwarsa ditolak `401` | Middleware terpasang, sebagian kasus diuji | Middleware hanya pada sebagian endpoint | Token diperiksa manual di dalam controller |
| Authorization berbasis role | 25% | Role yang diizinkan diterapkan konsisten; role yang tidak berhak menghasilkan `403` | Pembatasan role berjalan pada sebagian besar endpoint | Pembatasan role hanya pada satu endpoint | Tidak ada pembatasan role |
| Secret dan konfigurasi | 10% | `JWT_SECRET` dari environment, `.env` diabaikan Git, README menjelaskan konfigurasinya | `JWT_SECRET` dari environment | Secret statis tetapi tidak di-commit | Secret di-hardcode di kode |
| Dokumentasi dan bukti pengujian | 10% | README lengkap, seluruh skenario uji terlampir dan dapat direproduksi | README cukup, bukti uji tersedia | README seadanya | Tidak ada README atau bukti uji |

**Nilai akhir = Σ(bobot × skor) / 4 × 100**, dengan bobot berupa proporsi—misalnya 25% ditulis sebagai 0,25.

## 24. Persiapan menuju Pertemuan 11

Pertemuan berikutnya membahas keamanan backend dan API secara menyeluruh: OWASP Top 10, injection, security headers, CORS, rate limiting, dan secret management. Tinjau kembali bagaimana token dapat dicuri dan bagaimana endpoint Anda dapat diserang dari luar jalur validasi. Bawa mini project beserta endpoint terlindungi yang sudah berjalan.

## Lampiran: Kode Referensi

Kode lengkap tersedia pada [`code/pertemuan-10/`](../code/pertemuan-10/).

| File | Tujuan |
|:-----|:-------|
| `src/service/token.service.ts` | Membuat dan memverifikasi JWT serta membaca secret dari environment |
| `src/middleware/auth.middleware.ts` | Middleware autentikasi dan pembatasan role |
| `src/service/auth.service.ts` | Membuat akun dan memverifikasi password (dipertahankan dari Pertemuan 9) |
| `src/controller/auth.controller.ts` | Validasi register/login dan penerbitan token |
| `src/controller/protected.controller.ts` | Handler endpoint terlindungi |
| `src/routes/auth.routes.ts` | Memetakan endpoint register dan login |
| `src/routes/protected.routes.ts` | Memasangkan middleware dengan endpoint terlindungi |
| `prisma/schema.prisma` | Model akun dengan unik email dan kolom role |
| `app.ts` / `server.ts` | Middleware Express dan proses server |
