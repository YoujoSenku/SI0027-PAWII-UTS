// TODO B: Controller Buku - CRUD lengkap (Pertemuan 3-4, 9-12)
//
// Format error: lempar objek { status, message } (lihat middlewares/errorHandler.js),
// mis. throw { status: 404, message: "Buku tidak ditemukan" }
// express-async-errors sudah aktif di app.js, jadi tidak perlu try/catch.

const Buku = require("../models/bukuModel");

const MAX_LIMIT = 100;

// GET /buku
// Query opsional:
//   kategoriId  filter berdasarkan kategori
//   sort        nama field, urut ascending (default: createdAt)
//   page        default 1
//   limit       default 10, maksimum 100
//   fields      projection, dipisah koma, mis. fields=judul,isbn
// Respons 200: { data, page, limit, total }
//   - total = jumlah dokumen yang cocok dengan filter (BUKAN jumlah data pada halaman ini)
//   - data memuat kategoriId yang ter-populate (objek Kategori)
exports.getAll = async (req, res) => {
  // TODO B1
  const filter = {};
  if(req.query.kategoriId){
    filter.kategoriId = req.query.kategoriId
  }

  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, MAX_LIMIT);
  const sortField = req.query.sort || 'createdAt';
  const projection = req.query.fields ? req.query.fields.split(",").join(" ") : "";

  const data = await Buku.find(filter)
      .populate("kategoriId")
      .select(projection)
      .sort({ [sortField]: 1 })
      .skip((page - 1) * limit)
      .limit(limit);
  const total = await Buku.countDocuments(filter);

  res.status(200).json({ data, page, limit, total });
};

// GET /buku/:id
//   - 200 -> dokumen buku, kategoriId ter-populate
//   - tidak ada -> 404 { message }
//   - format id salah -> 400 (ditangani errorHandler lewat CastError)
exports.getById = async (req, res) => {
  // TODO B2
  const data = await Buku.findById(req.params.id).populate("kategoriId");  
  if (!data) throw { status: 404, message: "Buku Tidak ditemukan" };
  res.status(200).json(data);
};

// POST /buku
//   - 201 -> dokumen yang baru dibuat
//   - validasi gagal / ISBN duplikat -> 400 (ditangani errorHandler)
exports.create = async (req, res) => {
  // TODO B3
  const buku = await Buku.create(req.body);  
  res.status(201).json(buku);
};

// PUT /buku/:id
//   - 200 -> dokumen setelah diperbarui (bukan sebelum)
//   - validasi schema HARUS tetap berjalan saat update
//   - tidak ada -> 404 { message }
exports.update = async (req, res) => {
  // TODO B4
  const data = await Buku.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!data) throw { status: 404, message: "Buku Tidak ditemukan" };
  res.status(200).json(data);
};

// DELETE /buku/:id
//   - 204 tanpa body
//   - tidak ada -> 404 { message }
exports.remove = async (req, res) => {
  // TODO B5
  const data = await Buku.findByIdAndDelete(req.params.id);
  if (!data) throw { status: 404, message: "Buku Tidak ditemukan" };
  res.status(204).send();
};
