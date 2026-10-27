# USA-WP2360225 - Pemrograman Web Backend

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=nodedotjs&logoColor=white)
![Framework](https://img.shields.io/badge/Framework-Express.js-000000?logo=express&logoColor=white)
![Semester](https://img.shields.io/badge/Semester-2026%2F2027%20Gasal-blue)
![Pertemuan](https://img.shields.io/badge/Pertemuan-16%20Minggu-purple)

## Daftar Isi

| No. | Dokumen | Deskripsi |
| :-: | ------- | --------- |
| 01 | [Timeline Pertemuan — `Timeline.md`](./Timeline.md) | Rencana 16 pertemuan Pemrograman Web Backend — Semester 2026/2027 Gasal: CPMK, materi, aktivitas, output/asesmen |
| 02 | [Milestone — `Milestone.md`](./Milestone.md) | Peta fase pembelajaran: Fondasi, API Core, Security & Reliability, Quality & Delivery, hingga UAS |
| 03 | [Pertemuan 1 — `pertemuan-01/01-Pertemuan-1.md`](./pertemuan-01/01-Pertemuan-1.md) | Orientasi Backend Web, Client–Server, HTTP, REST & JSON — dilengkapi diagram Mermaid, demo server Node.js, CBL API Perpustakaan, kuis, dan Tugas 1 + rubrik |
| 04 | Kode praktikum Pertemuan 1 — [`code/pertemuan-01/`](./code/pertemuan-01/) | Contoh kode siap jalan: `server.js` (demo HTTP server), `latihan.js` (kerangka TODO terbimbing), `perpustakaan.js` (implementasi referensi CBL) |
| 05 | Kode praktikum Pertemuan 2 — [`code/pertemuan-02/`](./code/pertemuan-02/) | `demo-es6.js`, `demo-async.js`, `service-buku.js` (CBL), `latihan.js` (TODO terbimbing), `modul-02.js`, `data.txt` |
| 06 | [Pertemuan 3 — `pertemuan-03/03-Pertemuan-3.md`](./pertemuan-03/03-Pertemuan-3.md) | Node.js Fundamentals — runtime, module ESM, npm, filesystem, environment variable, HTTP server, CBL, kuis, dan Tugas 2 |
| 07 | Kode praktikum Pertemuan 3 — [`code/pertemuan-03/`](./code/pertemuan-03/) | `config.js`, `demo-node.js`, `server.js`, dan `latihan.js` — seluruhnya menggunakan Node.js 20+ tanpa dependency eksternal |
| 08 | [Pertemuan 4 — `pertemuan-04/04-Pertemuan-4.md`](./pertemuan-04/04-Pertemuan-4.md) | Express.js Dasar — instalasi, struktur app/server, routing, request/response, middleware, parameter, query, 404, error, CBL, kuis, dan Tugas 2 |
| 09 | Kode praktikum Pertemuan 4 — [`code/pertemuan-04/`](./code/pertemuan-04/) | `package.json`, `app.js`, `server.js`, dan `latihan.js` — Express.js 5 pada Node.js 20+ |
| 10 | [Pertemuan 5 — `pertemuan-05/05-Pertemuan-5.md`](./pertemuan-05/05-Pertemuan-5.md) | RESTful API dengan Express.js — resource, endpoint, method HTTP, query, parameter, validasi, status code, response JSON, CBL, kuis, dan Tugas 3 |
| 11 | Kode praktikum Pertemuan 5 — [`code/pertemuan-05/`](./code/pertemuan-05/) | `package.json`, `app.js`, `server.js`, dan `latihan.js` — API resource `buku` dan latihan resource `mahasiswa` |
| 12 | [Pertemuan 6 — `pertemuan-06/06-Pertemuan-6.md`](./pertemuan-06/06-Pertemuan-6.md) | Database dan ORM — konsep database relasional, skema Prisma, migration, koneksi, environment variable, CRUD dengan Prisma Client, CBL, kuis, dan Tugas 4 |
| 13 | Kode praktikum Pertemuan 6 — [`code/pertemuan-06/`](./code/pertemuan-06/) | `package.json`, `prisma/schema.prisma`, `client.ts`, `app.ts`, `server.ts`, `latihan.ts`, dan `.env.example` — API database dengan Prisma ORM 7 (TypeScript) |
| 14 | [Pertemuan 7 — `pertemuan-07/07-Pertemuan-7.md`](./pertemuan-07/07-Pertemuan-7.md) | CRUD REST API — pola service/controller, pengelompokan endpoint dengan `express.Router()`, penguatan validasi input, integrasi Express.js dengan database, CBL, kuis, dan Tugas 5 |
| 15 | Kode praktikum Pertemuan 7 — [`code/pertemuan-07/`](./code/pertemuan-07/) | `app.ts`, `server.ts`, `client.ts`, `src/routes/buku.routes.ts`, `src/controller/buku.controller.ts`, `src/service/buku.service.ts`, dan `latihan.ts` — resource `buku` dengan pola lapis (TypeScript) |
| 16 | [Pertemuan 8 — `pertemuan-08/08-Pertemuan-8.md`](./pertemuan-08/08-Pertemuan-8.md) | UTS — Mini Project Backend: ruang lingkup project, persiapan teknis, alur presentasi dan pengujian, kriteria kelayakan, studi kasus domain, kuis, dan rubrik UTS |
| 17 | Kode referensi Pertemuan 8 — [`code/pertemuan-08/`](./code/pertemuan-08/) | `app.ts`, `server.ts`, `client.ts`, `src/routes/buku.routes.ts`, `src/controller/buku.controller.ts`, `src/service/buku.service.ts`, `latihan.ts`, `README.md`, dan `.gitignore` — mini project referensi domain perpustakaan (TypeScript) |
| 18 | [Pertemuan 9 — `pertemuan-09/09-Pertemuan-9.md`](./pertemuan-09/09-Pertemuan-9.md) | Authentication — identity, register/login, password hashing dengan `scrypt`, perbandingan session dan token, CBL, kuis, dan tugas |
| 19 | Kode praktikum Pertemuan 9 — [`code/pertemuan-09/`](./code/pertemuan-09/) | `app.ts`, `server.ts`, `client.ts`, `src/routes/auth.routes.ts`, `src/controller/auth.controller.ts`, `src/service/auth.service.ts`, dan Prisma schema — API register/login dengan Express.js, SQLite, dan password hashing |
| 20 | [Pertemuan 10 — `pertemuan-10/10-Pertemuan-10.md`](pertemuan-10/10-Pertemuan-10.md) | JWT dan Authorization — struktur JWT, access token, header `Authorization`, middleware authentication, role-based authorization, CBL, kuis, dan tugas |
| 21 | Kode praktikum Pertemuan 10 — [`code/pertemuan-10/`](./code/pertemuan-10/) | `app.ts`, `server.ts`, `client.ts`, `src/service/token.service.ts`, `src/middleware/auth.middleware.ts`, route/controller auth dan protected, serta Prisma schema — protected API dengan role-based authorization |
| 22 | [Pertemuan 11 — `pertemuan-11/11-Pertemuan-11.md`](pertemuan-11/11-Pertemuan-11.md) | Keamanan Backend dan API — input validation, SQL injection dan query terparameterisasi, security header, CORS, rate limiting, secret management, security checklist, kuis, dan tugas |
| 23 | Kode praktikum Pertemuan 11 — [`code/pertemuan-11/`](./code/pertemuan-11/) | `app.ts`, `server.ts`, `client.ts`, `src/middleware/security.middleware.ts`, `src/middleware/validation.middleware.ts`, route/controller/service buku, dan README — API dengan lapisan keamanan |

## Referensi Terkait

### 01-Pertemuan-1.md — Orientasi Backend, Client–Server, HTTP, REST & JSON

- [MDN — An overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview) — konsep dasar HTTP: request, response, dan siklusnya
- [MDN — HTTP Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) — GET, POST, PUT, PATCH, DELETE, dan sifat *safe*/idempotent
- [MDN — HTTP Status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) — daftar lengkap status code dan keluarga 1xx–5xx
- [RESTful API Tutorial](https://restfulapi.net/) — prinsip REST, resource naming, dan desain endpoint
- [MDN — Working with JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) — sintaks JSON serta `JSON.stringify()` / `JSON.parse()`
- [Node.js — HTTP module](https://nodejs.org/docs/latest/api/http.html) — dokumentasi resmi `http.createServer()` yang dipakai pada demo
- [Postman Learning Center](https://learning.postman.com/docs/) — menguji endpoint demo (GET/POST) secara visual

### 02-Pertemuan-2.md — JavaScript Modern untuk Backend

- [MDN — Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) — object/array destructuring, default, dan rename
- [MDN — Spread syntax (...)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) — spread operator dan rest parameter
- [MDN — Array methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) — `map`, `filter`, `find`, `reduce`, dan kawan-kawan
- [MDN — Optional chaining (?.)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) dan [Nullish coalescing (??)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) — akses data aman
- [MDN — Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) — keadaan pending/fulfilled/rejected, `then`/`catch`/`finally`
- [MDN — async function & await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) — aturan main async/await dan try/catch
- [Node.js — File system (fs/promises)](https://nodejs.org/docs/latest/api/fs.html) — baca/tulis file berbasis Promise yang dipakai pada demo
- [javascript.info — Event loop](https://javascript.info/event-loop) — animasi dan penjelasan urutan eksekusi sync/async

### 03-Pertemuan-3.md — Node.js Fundamentals

- [Node.js — Introduction to Node.js](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs) — runtime JavaScript dan penggunaan Node.js
- [Node.js — Modules: ECMAScript modules](https://nodejs.org/api/esm.html) — `import`, `export`, dan module ESM
- [Node.js — File system](https://nodejs.org/api/fs.html) — operasi filesystem dan `node:fs/promises`
- [Node.js — HTTP](https://nodejs.org/api/http.html) — pembuatan HTTP server dengan module bawaan
- [npm — package.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-json) — metadata project, script, dan dependency

### 04-Pertemuan-4.md — Express.js Dasar

- [Express.js — Installing](https://expressjs.com/en/starter/installing.html) — instalasi Express.js dan pembuatan project
- [Express.js — Hello World example](https://expressjs.com/en/starter/hello-world.html) — aplikasi dan server Express sederhana
- [Express.js — Routing](https://expressjs.com/en/guide/routing.html) — method HTTP, route path, parameter, dan handler
- [Express.js — Using middleware](https://expressjs.com/en/guide/using-middleware.html) — middleware aplikasi, router, dan penanganan error
- [Express.js — API reference](https://expressjs.com/en/5x/api.html) — referensi `request`, `response`, `app.use`, dan method Express

### 05-Pertemuan-5.md — RESTful API dengan Express.js

- [RESTful API Tutorial](https://restfulapi.net/) — prinsip resource, endpoint, method HTTP, status code, dan desain REST
- [MDN — HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) — karakteristik `GET`, `POST`, `PUT`, `PATCH`, dan `DELETE`
- [MDN — HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) — status `2xx`, `4xx`, dan `5xx` pada response API
- [Express.js — Routing](https://expressjs.com/en/guide/routing.html) — route path, method, parameter, dan handler
- [Express.js — API reference](https://expressjs.com/en/5x/api.html) — `request.params`, `request.query`, `response.status`, dan `response.json`

### 06-Pertemuan-6.md — Database dan ORM

- [Prisma ORM Documentation](https://www.prisma.io/docs) — setup, skema, migration, dan Prisma Client
- [Prisma — Getting started with Prisma and SQLite](https://www.prisma.io/docs/getting-started/quickstart) — inisialisasi Prisma dan migration pertama
- [Prisma — Prisma Client](https://www.prisma.io/docs/reference/api-reference/prisma-client) — operasi `findMany`, `findFirst`, `create`, `update`, dan `delete`
- [Node.js — Environment variables](https://nodejs.org/api/process.html#processenv) — membaca `process.env` dan penggunaan `.env`

### 07-Pertemuan-7.md — CRUD REST API

- [Express.js — Routing](https://expressjs.com/en/guide/routing.html) — `express.Router()`, path resource, dan pemisahan endpoint per resource
- [Express.js — Using middleware](https://expressjs.com/en/guide/using-middleware.html) — urutan pendaftaran middleware, error handler, dan 404
- [MDN — HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) — pilihan status `201`, `404`, `204`, `400`, dan `500`
- [Node.js — Error handling](https://nodejs.org/api/errors.html) — praktik error handling dan cara mengirim error antar lapisan

### 09-Pertemuan-9.md — Authentication

- [Node.js — Crypto](https://nodejs.org/api/crypto.html) — `scrypt`, salt, dan perbandingan nilai hash dengan waktu konstan
- [OWASP — Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) — algoritma password hashing, salt, dan parameter biaya
- [Express.js — Routing](https://expressjs.com/en/guide/routing.html) — pemetaan endpoint register dan login
- [Prisma — Database constraints](https://www.prisma.io/docs/orm/prisma-schema/data-model/models#defining-a-unique-field) — unique constraint untuk identitas akun
- [OWASP — Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) — pengelolaan session dan cookie
- [OWASP — JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html) — risiko dan praktik penggunaan JWT

### Timeline.md — Materi 16 Pertemuan

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) — panduan resmi JavaScript: ES6+, object, async/await (Minggu 2)
- [Node.js Official Documentation](https://nodejs.org/en/docs/) — runtime, npm, module system, filesystem (Minggu 3)
- [Express.js Official Documentation](https://expressjs.com/en/api.html) — routing, middleware, request/response (Minggu 4–7)
- [Prisma ORM Documentation](https://www.prisma.io/docs) — setup, schema, migration, dan Prisma Client (Minggu 6–7)
- [JSON Web Token (JWT)](https://jwt.io/) — konsep token dan library `jsonwebtoken` (Minggu 9–10)
- [OWASP API Security Top 10](https://owasp.org/API-Security/) — keamanan API: validation, injection, auth (Minggu 11)
- [Postman Learning Center](https://learning.postman.com/docs/) — testing & dokumentasi endpoint API (Minggu 13–14)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) — standar dokumentasi API / Swagger (Minggu 14)

### Repository Kelas

- https://github.com/PBWFEND/SI-VA-Backend
- https://github.com/PBWFEND/SI-VB-Backend