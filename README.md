# SI0027 - UTS Pengembangan Aplikasi Web II

Starter project **Ujian Tengah Semester** mata kuliah **Pengembangan Aplikasi Web II**, Program Studi Sistem Informasi, Universitas Multi Data Palembang.

## Studi Kasus: Katalog Perpustakaan Digital Kampus

Bangun **RESTful API CRUD** untuk katalog buku sebuah perpustakaan kampus. API menyimpan data **Buku** yang dikelompokkan dalam **Kategori**. Semua endpoint bersifat publik (tanpa autentikasi).

Materi yang diuji: Pertemuan 1-12 (Express.js, middleware & konfigurasi, arsitektur MVC/Layered, pengujian Postman, MongoDB/Mongoose, CRUD NoSQL dengan filtering-sorting-pagination-projection, error handling terpusat).

## Skema Data

### Buku (`bukus`) - **entitas utama yang harus Anda implementasikan**

| Field | Tipe | Aturan |
|---|---|---|
| `judul` | String | wajib, spasi awal/akhir dibuang |
| `isbn` | String | wajib, **unik**, tepat 13 digit angka |
| `penulis` | Array of String | **embedded**, minimal 1 penulis |
| `penerbit` | Subdocument | **embedded**, tanpa `_id` sendiri |
| `penerbit.nama` | String | wajib |
| `penerbit.tahun` | Number | 1900 s.d. tahun berjalan |
| `kategoriId` | ObjectId | **referencing** ke `Kategori`, wajib |
| `stok` | Number | default `0`, tidak boleh negatif |
| `createdAt` | Date | default waktu saat dokumen dibuat |

### Kategori (`kategoris`) - sudah tersedia lengkap sebagai contoh referencing

| Field | Tipe | Aturan |
|---|---|---|
| `nama` | String | wajib, unik |
| `deskripsi` | String | default `""` |

Contoh dokumen Buku:

```json
{
  "_id": "665f1c2e8b1e4a0012ab34cd",
  "judul": "Basis Data Lanjut",
  "isbn": "9786021234567",
  "penulis": ["Penulis Satu", "Penulis Dua"],
  "penerbit": { "nama": "Penerbit Nusantara", "tahun": 2022 },
  "kategoriId": "665f1b9a8b1e4a0012ab34aa",
  "stok": 5,
  "createdAt": "2026-10-26T08:00:00.000Z"
}
```

## Kontrak API

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/kategori` | Daftar kategori (**sudah tersedia**) |
| POST | `/kategori` | Tambah kategori (**sudah tersedia**) |
| GET | `/buku` | Daftar buku + filter/sort/pagination/projection |
| GET | `/buku/:id` | Detail buku |
| POST | `/buku` | Tambah buku |
| PUT | `/buku/:id` | Ubah buku |
| DELETE | `/buku/:id` | Hapus buku |

### Query `GET /buku`

| Parameter | Contoh | Aturan |
|---|---|---|
| `kategoriId` | `?kategoriId=665f1b9a...` | filter kategori |
| `sort` | `?sort=judul` | urut ascending berdasarkan field; default `createdAt` |
| `page`, `limit` | `?page=2&limit=5` | default `1` dan `10`; `limit` maksimum **100** |
| `fields` | `?fields=judul,isbn` | projection, dipisah koma |

Respons berbentuk `{ data, page, limit, total }`; `total` adalah jumlah dokumen yang cocok dengan filter (bukan jumlah data pada halaman). `kategoriId` pada `data` dan pada detail buku harus **ter-populate** (objek kategori).

### Kode status & format error

| Situasi | Status |
|---|---|
| Berhasil dibuat | `201` |
| Berhasil dihapus | `204` (tanpa body) |
| Validasi gagal, ISBN/nama kategori duplikat, format id salah | `400` |
| Data tidak ditemukan | `404` |
| Error tak terduga | `500` (pesan generik, stack trace tidak dibocorkan) |

Semua respons error berbentuk `{ "message": "..." }`.

## Yang Harus Anda Kerjakan

Cari komentar `TODO` di source code. Bagian lain sudah tersedia lengkap.

- [ Selesai ] **A. Model** - `models/bukuModel.js` (schema Buku, embedded & referencing, validasi)
- [ Selesai ] **B. Controller Buku** - `controllers/bukuController.js` (`getAll`, `getById`, `create`, `update`, `remove`)
- [ Selesai ] **C. Routing** - `routes/bukuRoutes.js` dan pendaftaran route pada `app.js`
- [ Selesai ] **D. Error handling terpusat** - `middlewares/errorHandler.js` dan pendaftarannya pada `app.js`
- [ Selesai ] **E. Pengujian otomatis** - seluruh request pada Postman collection **lulus** (lihat bagian di bawah)

## Menjalankan Project

Prasyarat: Node.js (disarankan lewat NVM) dan MongoDB (cluster MongoDB Atlas gratis atau MongoDB lokal).

```bash
npm install
cp .env.example .env   # isi MONGODB_URI
npm start
# server berjalan di http://localhost:3000
```

> Jangan pernah meng-commit file `.env` (sudah diabaikan oleh `.gitignore`).

## Pengujian Otomatis dengan Postman

Folder `postman/` berisi:

- `SI0027-PAWII-UTS.postman_collection.json` - 28 request dengan test script (assertion)
- `uts.postman_environment.json` - environment `UTS - Local` (`baseUrl` = `http://localhost:3000`)

**Lewat aplikasi Postman:** impor kedua file, pilih environment **UTS - Local**, lalu jalankan collection memakai **Collection Runner** (urutan request jangan diubah - request saling berantai lewat variabel environment seperti `kategoriId` dan `bukuId`).

**Lewat command line (Newman)** - server harus sudah berjalan:

```bash
npm run test:api
```

Data uji (ISBN dan nama kategori) dibuat otomatis dan unik pada setiap run, sehingga collection dapat dijalankan berulang kali. Target akhir: **semua request dan assertion berstatus lulus (0 failed)**.

Hasil Newman/Runner menandai test yang gagal; baca nama test-nya untuk menelusuri bagian kode yang perlu diperbaiki. Endpoint yang belum selesai dikerjakan akan gagal karena timeout (5 detik per request). Jangan mengubah isi folder `postman/`.

## Ketentuan

- Kerjakan secara mandiri pada **fork** repositori ini di akun GitHub Anda.
- Ketentuan pengumpulan (tautan repositori, batas waktu, dan lainnya) mengikuti instruksi dosen pada LMS/Google Classroom.
- Struktur folder dan nama file boleh ditambah, tetapi kontrak API di atas **tidak boleh diubah** karena dipakai oleh pengujian otomatis.
