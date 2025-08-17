import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Absensi() {
  const [nama, setNama] = useState("");
  const [telp, setTelp] = useState("");
  const [foto, setFoto] = useState(null);
  const [absensi, setAbsensi] = useState([]);
  const [editId, setEditId] = useState(null);
  const inputNamaRef = useRef(null);

  // Load data dari localStorage saat mount
  useEffect(() => {
    const saved = localStorage.getItem("absensi");
    if (saved) setAbsensi(JSON.parse(saved));
  }, []);

  // Simpan data ke localStorage saat absensi berubah
  useEffect(() => {
    localStorage.setItem("absensi", JSON.stringify(absensi));
  }, [absensi]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nama || !telp || (!foto && !editId)) {
      alert("⚠️ Lengkapi semua data!");
      return;
    }
    if (!/^[0-9]+$/.test(telp)) {
      alert("⚠️ Nomor telepon harus angka!");
      return;
    }

    const saveData = (fotoURL) => {
      if (editId) {
        setAbsensi(
          absensi.map((a) =>
            a.id === editId
              ? { ...a, nama, telp, foto: fotoURL || a.foto }
              : a
          )
        );
      } else {
        const newAbsen = { id: Date.now(), nama, telp, foto: fotoURL };
        setAbsensi([...absensi, newAbsen]);
      }
      resetForm();
    };

    if (foto) {
      const reader = new FileReader();
      reader.onloadend = () => saveData(reader.result);
      reader.readAsDataURL(foto);
    } else {
      saveData(null);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setNama(item.nama);
    setTelp(item.telp);
    setFoto(null);
    inputNamaRef.current.focus();
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah yakin ingin menghapus data ini?")) {
      setAbsensi(absensi.filter((a) => a.id !== id));
    }
  };

  const resetForm = () => {
    setNama("");
    setTelp("");
    setFoto(null);
    setEditId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      {/* Form Absensi */}
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6 mb-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          📋 {editId ? "Edit Absensi" : "Form Absensi"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Nama</label>
            <input
              type="text"
              value={nama}
              ref={inputNamaRef}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Masukkan nama"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Nomor Telepon</label>
            <input
              type="text"
              value={telp}
              onChange={(e) => setTelp(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Masukkan nomor telepon"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              {editId ? "Ganti Foto (opsional)" : "Foto"}
            </label>
            <input
              type="file"
              onChange={(e) => setFoto(e.target.files[0])}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
            >
              {editId ? "Update Absensi" : "Simpan Absensi"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 rounded-lg"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Daftar Absensi */}
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">📑 Daftar Absensi</h2>
        {absensi.length === 0 ? (
          <p className="text-gray-500 text-center">Belum ada data absen.</p>
        ) : (
          <ul className="space-y-4">
            {absensi.map((a, index) => (
              <li
                key={a.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-500">{index + 1}.</span>
                  <div>
                    <p className="font-medium">{a.nama}</p>
                    <p className="text-sm text-gray-600">{a.telp}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  {a.foto && (
                    <img
                      src={a.foto}
                      alt="foto absen"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <button
                    onClick={() => handleEdit(a)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                  >
                    ❌
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Link ke Admin */}
      <Link
        to="/admin"
        className="bg-green-500 text-white p-2 rounded inline-block"
      >
        Lihat Data Admin
      </Link>
    </div>
  );
}
