import { useMemo, useState } from "react";

function formatWaktu(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "-";
  }
}

export default function AbsensiList({ data, onUpdate, onDelete }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("Semua"); // Semua | Menunggu | Diterima | Ditolak

  const filtered = useMemo(() => {
    return data
      .filter((item) => {
        const matchQ =
          item.nama.toLowerCase().includes(q.toLowerCase()) ||
          item.telepon.toLowerCase().includes(q.toLowerCase());
        const matchStatus =
          filter === "Semua" ? true : item.status === filter;
        return matchQ && matchStatus;
      })
      .sort((a, b) => b.id - a.id);
  }, [data, q, filter]);

  return (
    <section>
      <div className="card">
        <h2 className="card-title">Panel Admin</h2>

        <div className="toolbar">
          <input
            className="input"
            placeholder="Cari nama/telepon…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>Semua</option>
            <option>Menunggu</option>
            <option>Diterima</option>
            <option>Ditolak</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="empty">Belum ada data.</p>
        ) : (
          <ul className="list">
            {filtered.map((item) => (
              <li key={item.id} className="row">
                <img className="thumb" src={item.foto} alt={item.nama} />
                <div className="info">
                  <div className="name">{item.nama}</div>
                  <div className="meta">
                    <span>Telp: {item.telepon}</span>
                    <span>Waktu: {formatWaktu(item.createdAt)}</span>
                  </div>
                  <div className={`status ${item.status.toLowerCase()}`}>
                    {item.status}
                  </div>
                </div>

                <div className="actions">
                  <button
                    className="btn success"
                    onClick={() => onUpdate(item.id, "Diterima")}
                    disabled={item.status === "Diterima"}
                  >
                    Terima
                  </button>
                  <button
                    className="btn warn"
                    onClick={() => onUpdate(item.id, "Ditolak")}
                    disabled={item.status === "Ditolak"}
                  >
                    Tolak
                  </button>
                  <button
                    className="btn danger"
                    onClick={() => onDelete(item.id)}
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
