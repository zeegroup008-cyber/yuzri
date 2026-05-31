import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import pb from "../lib/pb"

export default function CaraPembayaranPage() {
  const navigate = useNavigate()
  const [metode, setMetode] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    pb.collection("payment_methods").getFullList({ filter: "is_active = true", requestKey: null })
      .then(data => setMetode(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const langkah = [
    { no: "01", judul: "Pilih Produk",     desc: "Pilih game atau layanan premium yang ingin kamu beli." },
    { no: "02", judul: "Isi Data",         desc: "Masukkan ID akun atau email yang akan menerima produk." },
    { no: "03", judul: "Pilih Pembayaran", desc: "Pilih metode pembayaran yang paling nyaman untukmu." },
    { no: "04", judul: "Konfirmasi",       desc: "Cek kembali detail pesanan lalu klik Bayar Sekarang." },
    { no: "05", judul: "Selesai",          desc: "Produk langsung dikirim ke akunmu dalam hitungan detik." },
  ]

  return (
    <div className="px-4 md:px-8 lg:px-12 py-12">
      <button onClick={() => navigate(-1)} className="text-muted hover:text-white text-sm mb-8 flex items-center gap-1 transition-colors">? Kembali</button>
      <h1 className="font-syne font-bold text-3xl text-white mb-2">Cara Pembayaran</h1>
      <p className="text-muted mb-10">Berbagai metode pembayaran tersedia untuk kemudahan transaksimu.</p>

      <h2 className="font-syne font-bold text-xl text-white mb-4">Metode Pembayaran</h2>
      {loading ? (
        <div className="text-muted text-sm mb-12">Memuat...</div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {metode.map((m) => (
            <div key={m.id} className="bg-card border border-border rounded-2xl p-5">
              {m.icon ? (
                <img src={`https://yuzri-api.onrender.com/api/files/payment_methods/${m.id}/${m.icon}`}
                  className="w-10 h-10 object-contain rounded-lg mb-3" />
              ) : (
                <div className="text-3xl mb-3">??</div>
              )}
              <div className="text-white font-semibold mb-1">{m.name}</div>
              <div className="text-purple-2 font-bold text-sm">{m.account_number}</div>
              <div className="text-muted text-xs mt-0.5">a.n. {m.account_name}</div>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-syne font-bold text-xl text-white mb-4">Langkah Pembayaran</h2>
      <div className="space-y-3">
        {langkah.map((l) => (
          <div key={l.no} className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4">
            <div className="text-purple-2 font-bold text-2xl font-syne w-10 flex-shrink-0">{l.no}</div>
            <div>
              <div className="text-white font-semibold mb-1">{l.judul}</div>
              <div className="text-muted text-sm">{l.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
