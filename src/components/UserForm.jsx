import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function UserForm() {
  const [absensi, setAbsensi] = useState([]);
  const [form, setForm] = useState({ nama: "", telp: "", foto: null });

  useEffect(() => {
    const saved = localStorage.getItem("absensi");
    if (saved) setAbsensi(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("absensi", JSON.stringify(absensi));
  }, [absensi]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      setForm({ ...form, foto: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nama || !form.telp || !form.foto) {
      alert("Lengkapi semua data!");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setAbsensi([
        ...absensi,
        { id: Date.now(), nama: form.nama, telp: form.telp, foto: reader.result },
      ]);
      setForm({ nama: "", telp: "", foto: null });
    };
    reader.readAsDataURL(form.foto);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">📋 Form Absensi</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md"
      >
        <input
          type="text"
          name="nama"
          value={form.nama}
          onChange={handleChange}
          placeholder="Nama"
          className="w-full border rounded-lg p-2 mb-3"
        />
        <input
          type="text"
          name="telp"
          value={form.telp}
          onChange={handleChange}
          placeholder="Nomor Telepon"
          className="w-full border rounded-lg p-2 mb-3"
        />
        <input
          type="file"
          name="foto"
          accept="image/*"
          onChange={handleChange}
          className="w-full mb-3"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
        >
          Absen Sekarang
        </button>
      </form>

      <Link
        to="/admin"
        className="block mt-4 text-blue-600 underline"
      >
        👨‍💻 Masuk Admin
      </Link>
    </div>
  );
}

export default UserForm;
