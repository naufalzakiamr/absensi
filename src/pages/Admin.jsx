import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Admin() {
  const [absensi, setAbsensi] = useState([]);
  const [form, setForm] = useState({ nama: "", telp: "", foto: null });
  const [preview, setPreview] = useState(null);

  // Load data dari localStorage
  const loadData = () => {
    const saved = localStorage.getItem("absensi");
    if (saved) setAbsensi(JSON.parse(saved));
    else setAbsensi([]);
  };

  useEffect(() => {
    loadData();
    const handleStorageChange = (e) => {
      if (e.key === "absensi") loadData();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Simpan ke localStorage setiap absensi berubah
  useEffect(() => {
    localStorage.setItem("absensi", JSON.stringify(absensi));
  }, [absensi]);

  // Handle input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto" && files[0]) {
      setForm({ ...form, foto: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Tambah data baru
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama || !form.telp) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newData = {
        id: Date.now(),
        nama: form.nama,
        telp: form.telp,
        foto: form.foto ? reader.result : null,
      };
      setAbsensi([...absensi, newData]);
      setForm({ nama: "", telp: "", foto: null });
      setPreview(null);
    };
    if (form.foto) reader.readAsDataURL(form.foto);
    else reader.onload();
  };

  // Hapus semua data
  const handleHapusSemua = () => {
    if (confirm("Yakin ingin menghapus semua data?")) {
      localStorage.removeItem("absensi");
      setAbsensi([]);
    }
  };

  // Hapus per data
  const handleDelete = (id) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      const newData = absensi.filter((a) => a.id !== id);
      setAbsensi(newData);
      localStorage.setItem("absensi", JSON.stringify(newData));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">👨‍💻 Halaman Admin</h1>
          <p className="text-gray-600">Kelola data absensi di sini.</p>
        </div>
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          ⬅️ Kembali
        </Link>
      </div>

      {/* Form Tambah Data */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-4 mb-6 max-w-md mx-auto"
      >
        <h2 className="font-bold mb-2">Tambah Data Absensi</h2>
        <div className="mb-2">
          <label className="block mb-1">Nama</label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Telepon</label>
          <input
            type="text"
            name="telp"
            value={form.telp}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Foto</label>
          <input
            type="file"
            name="foto"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
          {preview && (
            <img src={preview} alt="Preview" className="mt-2 w-16 h-16 rounded" />
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full"
        >
          Simpan
        </button>
      </form>

      {/* Tombol Hapus Semua */}
      {absensi.length > 0 && (
        <button
          onClick={handleHapusSemua}
          className="mb-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Hapus Semua
        </button>
      )}

      {/* Tabel Daftar Absensi */}
      <div className="overflow-x-auto w-full max-w-4xl mx-auto">
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border-b">No</th>
              <th className="p-2 border-b">Nama</th>
              <th className="p-2 border-b">Telepon</th>
              <th className="p-2 border-b">Foto</th>
              <th className="p-2 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {absensi.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  Belum ada data absensi.
                </td>
              </tr>
            ) : (
              absensi.map((item, index) => (
                <tr key={item.id} className="text-center">
                  <td className="p-2 border-b">{index + 1}</td>
                  <td className="p-2 border-b">{item.nama}</td>
                  <td className="p-2 border-b">{item.telp}</td>
                  <td className="p-2 border-b">
                    {item.foto ? (
                      <img
                        src={item.foto}
                        alt={item.nama}
                        className="w-16 h-16 object-cover mx-auto rounded"
                      />
                    ) : (
                      "–"
                    )}
                  </td>
                  <td className="p-2 border-b flex justify-center gap-2">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
