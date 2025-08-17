import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";

// ==========================
// Halaman Absensi
// ==========================
function Absensi() {
  const [absensi, setAbsensi] = useState([]);
  const [form, setForm] = useState({ nama: "", telp: "", foto: null });
  const [editId, setEditId] = useState(null);
  const inputNamaRef = useRef(null);

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
    if (!form.nama || !form.telp || (!form.foto && !editId)) {
      alert("⚠️ Lengkapi semua data!");
      return;
    }
    if (!/^[0-9]+$/.test(form.telp)) {
      alert("⚠️ Nomor telepon harus angka!");
      return;
    }

    const saveData = (fotoURL) => {
      if (editId) {
        setAbsensi(
          absensi.map((item) =>
            item.id === editId
              ? { ...item, nama: form.nama, telp: form.telp, foto: fotoURL || item.foto }
              : item
          )
        );
      } else {
        setAbsensi([...absensi, { id: Date.now(), nama: form.nama, telp: form.telp, foto: fotoURL }]);
      }
      resetForm();
    };

    if (form.foto) {
      const reader = new FileReader();
      reader.onloadend = () => saveData(reader.result);
      reader.readAsDataURL(form.foto);
    } else {
      saveData(null);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah yakin ingin menghapus data ini?")) {
      setAbsensi(absensi.filter((item) => item.id !== id));
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({ nama: item.nama, telp: item.telp, foto: null });
    inputNamaRef.current.focus();
  };

  const resetForm = () => {
    setForm({ nama: "", telp: "", foto: null });
    setEditId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">📋 Form Absensi</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <div className="mb-4">
          <label className="block font-semibold mb-1">Nama</label>
          <input
            type="text"
            name="nama"
            value={form.nama}
            ref={inputNamaRef}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Masukkan nama"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Nomor Telepon</label>
          <input
            type="text"
            name="telp"
            value={form.telp}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Masukkan nomor telepon"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">{editId ? "Ganti Foto (opsional)" : "Foto"}</label>
          <input type="file" name="foto" accept="image/*" onChange={handleChange} className="w-full" />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold">
            {editId ? "Update Data" : "Simpan Absensi"}
          </button>
          {editId && (
            <button type="button" onClick={resetForm} className="bg-gray-400 hover:bg-gray-500 text-white px-4 rounded-lg">
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="mt-8 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">📑 Daftar Absensi</h2>
        {absensi.length === 0 ? (
          <p className="text-gray-600">Belum ada data absen.</p>
        ) : (
          <ul className="space-y-4">
            {absensi.map((item, index) => (
              <li key={item.id} className="bg-white shadow rounded-lg p-4 flex items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-500">{index + 1}.</span>
                  {item.foto && <img src={item.foto} alt="foto" className="w-16 h-16 object-cover rounded-full border" />}
                  <div>
                    <p className="font-semibold">{item.nama}</p>
                    <p className="text-gray-600">{item.telp}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg">
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg">
                    ❌ Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ==========================
// Halaman Admin (akses via /admin)
// ==========================
function AdminPage() {
  const [absensi, setAbsensi] = useState([]);

  const loadData = () => {
    const saved = localStorage.getItem("absensi");
    setAbsensi(saved ? JSON.parse(saved) : []);
  };

  useEffect(() => {
    loadData();
    const handleStorageChange = (e) => {
      if (e.key === "absensi") loadData();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      const newData = absensi.filter((a) => a.id !== id);
      setAbsensi(newData);
      localStorage.setItem("absensi", JSON.stringify(newData));
    }
  };
  
  // Fungsi untuk mengekspor data ke file JSON
  const handleExportData = () => {
    const dataStr = JSON.stringify(absensi, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `absensi_backup_${new Date().toLocaleDateString().replace(/\//g, "-")}.json`;
    
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };
  
  // Fungsi untuk mengekspor data ke file PDF
  const handleExportPDF = async () => {
    try {
      // Import jsPDF dan jsPDF-AutoTable
      const jsPDFModule = await import("jspdf");
      const autoTableModule = await import("jspdf-autotable");
      
      const { default: jsPDF } = jsPDFModule;
      
      // Buat dokumen PDF baru dengan orientasi potrait
      const doc = new jsPDF();
        
        // Tambahkan header dengan logo dan judul
        doc.setFillColor(41, 128, 185);
        doc.rect(0, 0, 210, 30, 'F');
        
        // Tambahkan judul dengan warna putih
        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255);
        doc.text("LAPORAN DATA ABSENSI", 105, 15, { align: 'center' });
        
        // Tambahkan informasi
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 40);
        doc.text(`Waktu: ${new Date().toLocaleTimeString('id-ID')}`, 14, 47);
        doc.text(`Total Data: ${absensi.length} orang`, 14, 54);
        
        // Tambahkan garis pemisah
        doc.setDrawColor(41, 128, 185);
        doc.setLineWidth(0.5);
        doc.line(14, 58, 196, 58);
        
        // Siapkan data untuk tabel
        const tableColumn = ["No", "Nama", "Nomor Telepon", "Waktu Absensi"];
        const tableRows = [];
        
        // Cek jika tidak ada data absensi
        if (absensi.length === 0) {
          tableRows.push(['-', 'Tidak ada data absensi', '-', '-']);
        } else {
          // Isi data tabel dari data absensi
          absensi.forEach((item, index) => {
            // Format waktu dari timestamp ID
            const date = new Date(item.id);
            const formattedDate = date.toLocaleDateString('id-ID', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric' 
            });
            const formattedTime = date.toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            });
            
            const rowData = [
              index + 1,
              item.nama,
              item.telp,
              `${formattedDate} ${formattedTime}`
            ];
            tableRows.push(rowData);
          });
        }
        
        // Buat tabel otomatis dengan menggunakan plugin autoTable
        const { default: autoTable } = autoTableModule;
        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 65,
          styles: { fontSize: 10, cellPadding: 4 },
          headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [240, 240, 240] },
          columnStyles: {
            0: { cellWidth: 15 },
            3: { cellWidth: 40 }
          }
        });
        
        // Tambahkan footer
        const pageCount = doc.internal.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setFontSize(10);
          doc.setTextColor(150);
          doc.text(`Halaman ${i} dari ${pageCount}`, 105, 285, { align: 'center' });
          doc.text('Aplikasi Absensi © ' + new Date().getFullYear(), 105, 290, { align: 'center' });
        }
        
        // Simpan PDF dengan nama yang sesuai
        const pdfName = `laporan_absensi_${new Date().toLocaleDateString().replace(/\//g, "-")}.pdf`;
        doc.save(pdfName);
    } catch (error) {
      console.error("Error saat membuat PDF:", error);
      alert("Terjadi kesalahan saat membuat PDF. Silakan coba lagi.");
    }
  };
  
  // Fungsi untuk mengimpor data dari file JSON atau PDF
  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Reset input file agar bisa mengimpor file yang sama berulang kali
    event.target.value = "";
    
    // Cek tipe file
    if (file.type === "application/json" || file.name.endsWith(".json")) {
      // Proses file JSON
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          if (Array.isArray(importedData)) {
            if (window.confirm("Impor data akan menggantikan data yang ada. Lanjutkan?")) {
              setAbsensi(importedData);
              localStorage.setItem("absensi", JSON.stringify(importedData));
              alert("Data berhasil diimpor!");
            }
          } else {
            alert("Format file JSON tidak valid!");
          }
        } catch (error) {
          alert("Gagal mengimpor data JSON: " + error.message);
        }
      };
      reader.readAsText(file);
    } else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      // Proses file PDF
      import("pdfjs-dist").then(async (pdfJS) => {
        try {
          // Inisialisasi worker PDF.js
          const pdfjsLib = pdfJS;
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
          
          // Baca file PDF sebagai array buffer
          const arrayBuffer = await file.arrayBuffer();
          
          // Load dokumen PDF
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          
          // Konfirmasi impor
          if (window.confirm(`PDF terdeteksi dengan ${pdf.numPages} halaman. Impor data akan mencoba mengekstrak data dari PDF. Lanjutkan?`)) {
            // Array untuk menyimpan data yang diekstrak
            const extractedData = [];
            
            // Proses setiap halaman
            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const textItems = textContent.items;
              
              // Cari data dalam format yang sesuai (nama dan telepon)
              // Ini adalah implementasi sederhana, mungkin perlu disesuaikan dengan format PDF yang diharapkan
              for (let j = 0; j < textItems.length; j++) {
                const text = textItems[j].str.trim();
                if (text && j + 1 < textItems.length) {
                  const nextText = textItems[j + 1].str.trim();
                  // Asumsikan format: nama diikuti oleh nomor telepon
                  if (nextText && /^\d+$/.test(nextText)) {
                    extractedData.push({
                      id: Date.now() + Math.random(),
                      nama: text,
                      telp: nextText,
                      foto: null // PDF tidak menyimpan foto
                    });
                    j++; // Skip item berikutnya karena sudah diproses
                  }
                }
              }
            }
            
            if (extractedData.length > 0) {
              // Gabungkan dengan data yang ada atau ganti sepenuhnya
              if (window.confirm(`Ditemukan ${extractedData.length} data dari PDF. Gabungkan dengan data yang ada?`)) {
                const newData = [...absensi, ...extractedData];
                setAbsensi(newData);
                localStorage.setItem("absensi", JSON.stringify(newData));
                alert("Data berhasil diimpor dan digabungkan!");
              } else {
                setAbsensi(extractedData);
                localStorage.setItem("absensi", JSON.stringify(extractedData));
                alert("Data berhasil diimpor dan menggantikan data lama!");
              }
            } else {
              alert("Tidak dapat menemukan data yang valid dalam PDF.");
            }
          }
        } catch (error) {
          console.error("Error saat memproses PDF:", error);
          alert("Gagal mengimpor data PDF: " + error.message);
        }
      }).catch(error => {
        console.error("Error saat memuat PDF.js:", error);
        alert("Gagal memuat library PDF: " + error.message);
      });
    } else {
      alert("Format file tidak didukung. Harap pilih file JSON atau PDF.");
    }
  };

  const handleHapusSemua = () => {
    if (window.confirm("Yakin ingin menghapus semua data?")) {
      localStorage.removeItem("absensi");
      setAbsensi([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">👨‍💻 Halaman Admin</h1>
          <p className="text-gray-600">Kelola data absensi di sini.</p>
        </div>
        <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
          ⬅️ Kembali
        </Link>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={handleExportPDF} className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded">
          📄 Ekspor PDF
        </button>
        {absensi.length > 0 && (
          <button onClick={handleHapusSemua} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            🗑️ Hapus Semua
          </button>
        )}
        <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
          📂 Impor Data
          <input 
            type="file" 
            accept=".json,.pdf" 
            onChange={handleImportData} 
            className="hidden" 
          />
        </label>
      </div>

      <div className="overflow-x-auto w-full max-w-4xl">
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
                    {item.foto ? <img src={item.foto} alt={item.nama} className="w-16 h-16 object-cover mx-auto rounded" /> : "–"}
                  </td>
                  <td className="p-2 border-b flex justify-center gap-2">
                    <button onClick={() => handleDelete(item.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg">
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

// ==========================
// App utama
// ==========================
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Absensi />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route
          path="*"
          element={
            <div className="p-6 text-center">
              <h1 className="text-2xl font-bold text-red-500">404</h1>
              <p>Halaman tidak ditemukan</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
