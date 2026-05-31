import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function HubungiKamiPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nama: "", email: "", pesan: "" })
  const [terkirim, setTerkirim] = useState(false)

  const handleKirim = () => {
    if (!form.nama || !form.email || !form.pesan) return
    setTerkirim(true)
  }

  const kontak = [
    { icon: "??", label: "Live Chat",  nilai: "Tersedia 24/7 di pojok kanan bawah" },
    { icon: "??", label: "WhatsApp",   nilai: "+62 812-3456-7890" },
    { icon: "??", label: "Email",      nilai: "support@yuzriid.store" },
    { icon: "??", label: "Telegram",   nilai: "@yuzriid_support" },
  ]

  return (
    <div className="px-4 md:px-8 lg:px-12 py-12">
      <button onClick={() => navigate(-1)} className="text-muted hover:text-white text-sm mb-8 flex items-center gap-1 transition-colors">? Kembali</button>
      <h1 className="font-syne font-bold text-3xl text-white mb-2">Hubungi Kami</h1>
      <p className="text-muted mb-10">Ada pertanyaan atau kendala? Tim kami siap membantu 24/7.</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-syne font-bold text-xl text-white mb-4">Informasi Kontak</h2>
          <div className="space-y-3 mb-6">
            {kontak.map((k) => (
              <div key={k.label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
                <span className="text-2xl">{k.icon}</span>
                <div>
                  <div className="text-muted text-xs">{k.label}</div>
                  <div className="text-white font-medium text-sm">{k.nilai}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-syne font-bold text-xl text-white mb-4">Kirim Pesan</h2>
          {terkirim ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">?</div>
              <p className="text-green-400 font-semibold">Pesan berhasil dikirim!</p>
              <p className="text-muted text-sm mt-1">Kami akan membalas dalam 1x24 jam.</p>
              <button onClick={() => { setForm({ nama: "", email: "", pesan: "" }); setTerkirim(false) }}
                className="mt-4 text-purple-2 text-sm hover:underline">Kirim pesan lain</button>
            </div>
          ) : (
            <div className="space-y-3">
              <input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })}
                placeholder="Nama kamu" className="w-full bg-card border border-border focus:border-purple rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-muted transition-colors" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email kamu" type="email" className="w-full bg-card border border-border focus:border-purple rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-muted transition-colors" />
              <textarea value={form.pesan} onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                placeholder="Tuliskan pesanmu di sini..." rows={4}
                className="w-full bg-card border border-border focus:border-purple rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-muted transition-colors resize-none" />
              <button onClick={handleKirim}
                className="w-full bg-purple hover:bg-purple-3 text-white font-semibold py-3 rounded-xl transition-colors">
                Kirim Pesan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
