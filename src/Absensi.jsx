import React, { useState, useEffect } from "react";

function AbsensiApp() {
  const [form, setForm] = useState({ nama: "", telp: "", foto: null });
  const [absensi, setAbsensi] = useState([]);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("absensi");
    if (saved) setAbsensi(JSON.parse(saved));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const saved = localStorage.getItem("absensi");
    const oldData = saved ? JSON.parse(saved) : [];

    // Jika ada foto, ubah ke base64 dulu
    if (form.foto) {
      const reader = new FileReader();
      reader.onload = () => {
        const newData = {
          id: Date.now(),
          nama: form.nama,
          telp: form.telp,
          foto: reader.result,
          status: "Menunggu",
        };
        const updatedData = [...oldData, newData];
        localStorage.setItem("absensi", JSON.stringify(updatedData));
        setAbsensi(updatedData);
        setForm({ nama: "", telp: "", foto: null });
        setPreview(null);
      };
      reader.readAsDataURL(form.foto);
    } else {
      const newData = {
        id: Date.now(),
        nama: form.nama,
        telp: form.telp,
        foto: null,
        status: "Menunggu",
      };
      const updatedData = [...oldData, newData];
      localStorage.setItem("absensi", JSON.stringify(updatedData));
      setAbsensi(updatedData);
      setForm({ nama: "", telp: "", foto: null });
      setPreview(null);
    }
  };

  return (
    <div>
      <h1>Absensi</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nama"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Telepon"
          value={form.telp}
          onChange={(e) => setForm({ ...form, telp: e.target.value })}
          required
        />
        <input
          type="file"
          onChange={(e) => {
            setForm({ ...form, foto: e.target.files[0] });
            if (e.target.files[0]) {
              setPreview(URL.createObjectURL(e.target.files[0]));
            } else {
              setPreview(null);
            }
          }}
        />
        {preview && <img src={preview} alt="Preview" width={80} />}
        <button type="submit">Simpan</button>
      </form>
      <div>
        {absensi.map((item) => (
          <div key={item.id}>
            <p>Nama: {item.nama}</p>
            <p>Telepon: {item.telp}</p>
            {item.foto && <img src={item.foto} alt="Foto" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AbsensiApp;