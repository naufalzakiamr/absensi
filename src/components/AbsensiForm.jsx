import { useState } from "react";

// helper: ubah File menjadi base64 (biar bisa disimpan di localStorage)
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export default function AbsensiForm({ onSubmit }) {
  const [nama, setNama] = useState("");
  const [telepon, setTelepon] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    // preview cepat
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  };

  const resetForm = () => {
    setNama("");
    setTelepon("");
    setFile(null);
    setPreviewUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nama.trim() || !telepon.trim() || !file) {
      alert("Nama, Telepon, dan Foto wajib diisi.");
      return;
    }

    // validasi sederhana nomor telepon
    const onlyDigits = telepon.replace(/\D/g, "");
    if (onlyDigits.length < 8) {
      alert("Nomor telepon tidak valid.");
      return;
    }

    const fotoDataUrl = await fileToBase64(file);

    const data = {
      id: Date.now(),
      nama: nama.trim(),
      telepon: telepon.trim(),
      foto: fotoDataUrl, // base64
      status: "Menunggu", // Menunggu | Diterima | Ditolak
      createdAt: new Date().toISOString(),
    };

    onSubmit(data);
    resetForm();
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2 className="card-title">Form Absensi</h2>

      <label className="field">
        <span>Nama</span>
        <input
          type="text"
          placeholder="Nama lengkap"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
      </label>

      <label className="field">
        <span>Nomor Telepon</span>
        <input
          type="tel"
          placeholder="08xxxxxxxxxx"
          value={telepon}
          onChange={(e) => setTelepon(e.target.value)}
        />
      </label>

      <label className="field">
        <span>Foto Bukti</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFile}
        />
      </label>

      {previewUrl && (
        <div className="preview">
          <img src={previewUrl} alt="Preview" />
        </div>
      )}

      <button className="btn primary" type="submit">
        Kirim Absen
      </button>
    </form>
  );
}
