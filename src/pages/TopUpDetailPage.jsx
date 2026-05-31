import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useToast, ToastContainer } from "./useToast"
import pb from "../lib/pb"

const GAME_DATA = {
  "mobile-legends": {
    name: "Mobile Legends: Bang Bang", type: "Diamond", color: "from-blue-600 to-blue-900", icon: "??",
    pakets: [
      { id: 1, label: "11 Diamond",   harga: 3000   },
      { id: 2, label: "22 Diamond",   harga: 5500   },
      { id: 3, label: "56 Diamond",   harga: 12000  },
      { id: 4, label: "112 Diamond",  harga: 22000  },
      { id: 5, label: "257 Diamond",  harga: 50000  },
      { id: 6, label: "514 Diamond",  harga: 98000  },
      { id: 7, label: "1188 Diamond", harga: 215000 },
      { id: 8, label: "2195 Diamond", harga: 395000 },
    ],
  },
  "free-fire": {
    name: "Free Fire", type: "Diamond", color: "from-orange-500 to-red-800", icon: "??",
    pakets: [
      { id: 1, label: "70 Diamond",   harga: 12000  },
      { id: 2, label: "140 Diamond",  harga: 22000  },
      { id: 3, label: "355 Diamond",  harga: 52000  },
      { id: 4, label: "720 Diamond",  harga: 98000  },
      { id: 5, label: "1450 Diamond", harga: 195000 },
      { id: 6, label: "2180 Diamond", harga: 285000 },
    ],
  },
  "pubg-mobile": {
    name: "PUBG Mobile", type: "UC (Unknown Cash)", color: "from-yellow-500 to-yellow-800", icon: "??",
    pakets: [
      { id: 1, label: "60 UC",   harga: 12000   },
      { id: 2, label: "325 UC",  harga: 55000   },
      { id: 3, label: "660 UC",  harga: 110000  },
      { id: 4, label: "1800 UC", harga: 285000  },
      { id: 5, label: "3850 UC", harga: 580000  },
      { id: 6, label: "8100 UC", harga: 1150000 },
    ],
  },
  "genshin-impact": {
    name: "Genshin Impact", type: "Genesis Crystal", color: "from-purple-500 to-indigo-800", icon: "??",
    pakets: [
      { id: 1, label: "60 Crystal",   harga: 15000   },
      { id: 2, label: "300 Crystal",  harga: 75000   },
      { id: 3, label: "980 Crystal",  harga: 235000  },
      { id: 4, label: "1980 Crystal", harga: 470000  },
      { id: 5, label: "3280 Crystal", harga: 750000  },
      { id: 6, label: "6480 Crystal", harga: 1450000 },
    ],
  },
  "honor-of-kings": {
    name: "Honor of Kings", type: "Token", color: "from-green-500 to-teal-800", icon: "??",
    pakets: [
      { id: 1, label: "100 Token",  harga: 15000  },
      { id: 2, label: "300 Token",  harga: 45000  },
      { id: 3, label: "980 Token",  harga: 145000 },
      { id: 4, label: "1980 Token", harga: 285000 },
    ],
  },
  "arena-breakout": {
    name: "Arena Breakout", type: "Bonds", color: "from-gray-600 to-gray-900", icon: "??",
    pakets: [
      { id: 1, label: "100 Bonds",  harga: 15000  },
      { id: 2, label: "300 Bonds",  harga: 42000  },
      { id: 3, label: "980 Bonds",  harga: 130000 },
      { id: 4, label: "2000 Bonds", harga: 255000 },
    ],
  },
}

const METODE_BAYAR = []

function fmt(n) { return "Rp " + Number(n ?? 0).toLocaleString("id-ID") }

export default function TopUpDetailPage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { toasts, addToast } = useToast()
  const game = GAME_DATA[gameId]
  const [paketsDB, setPaketsDB] = useState([])

  useEffect(() => {
    if (!game) return
    pb.collection("products").getFullList({
      filter: `category = "${gameId}"`,
      requestKey: null,
    }).then(async (products) => {
      if (products.length > 0) {
        const p = await pb.collection("pakets").getFullList({
          filter: `product_id = "${products[0].id}" && is_active = true`,
          sort: "price",
          requestKey: null,
        })
        setPaketsDB(p)
      }
    }).catch(() => {})
  }, [gameId])

  const paketList = paketsDB.length > 0 ? paketsDB : (game?.pakets || [])

  const [userId,       setUserId]       = useState("")
  const [serverId,     setServerId]     = useState("")
  const [paket,        setPaket]        = useState(null)
  const [metode,       setMetode]       = useState(null)
  const [errors,       setErrors]       = useState({})
  const [loading,      setLoading]      = useState(false)
  const [step,         setStep]         = useState(1)
  const [metodeBayar, setMetodeBayar] = useState([])

  useEffect(() => {
    pb.collection("payment_methods").getFullList({ filter: "is_active = true", requestKey: null })
      .then(data => setMetodeBayar(data))
      .catch(() => {})
  }, [])

  const [buktiTransfer, setBuktiTransfer] = useState(null)

  const [trxId,        setTrxId]        = useState(null)
  const [ticketId,     setTicketId]     = useState("")
  const [trxStatus,    setTrxStatus]    = useState("Pending")
  const [rejectReason, setRejectReason] = useState("")

  useEffect(() => {
    if (!trxId) return
    let stopped = false
    const poll = async () => {
      while (!stopped) {
        await new Promise(r => setTimeout(r, 2000))
        if (stopped) break
        try {
          const rec = await pb.collection("transactions").getOne(trxId, { requestKey: null })
          if (rec.status === "Approved") {
            setTrxStatus("Approved")
            stopped = true
          } else if (rec.status === "Rejected") {
            setTrxStatus("Rejected")
            setRejectReason(rec.reject_reason || "")
            stopped = true
          }
        } catch {}
      }
    }
    poll()
    const timeout = setTimeout(() => { stopped = true }, 300000)
    return () => { stopped = true; clearTimeout(timeout) }
  }, [trxId])

  if (!game) return (
    <div className="min-h-[60vh] flex items-center justify-center text-muted">
      Game tidak ditemukan.
      <button onClick={() => navigate("/topup")} className="ml-2 text-purple-2 underline">Kembali</button>
    </div>
  )

  const validate = () => {
    const e = {}
    if (!userId.trim()) e.userId = "ID Pengguna wajib diisi."
    if (!paket)         e.paket  = "Pilih nominal top up terlebih dahulu."
    if (!metode)        e.metode = "Pilih metode pembayaran."
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleLanjut = () => { if (validate()) setStep(2) }

  const handleBayar = async () => {
    if (!buktiTransfer) {
      addToast("Upload bukti transfer terlebih dahulu.", "error")
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("user_id",        pb.authStore.model?.id || "")
      formData.append("product_name",   `${game.name} — ${paket.label}`)
      formData.append("amount",         paket.price || paket.harga)
      formData.append("status",         "Pending")
      formData.append("target_id",      userId + (serverId ? ` (${serverId})` : ""))
      formData.append("payment_method", metode.name)
      formData.append("bukti_transfer", buktiTransfer)
      const record = await pb.collection("transactions").create(formData)
      setTrxId(record.id)
      setTicketId(record.id)
      setTrxStatus("Pending")
      setStep(3)
    } catch (e) {
      console.error(e)
      addToast("Transaksi gagal. Silakan coba lagi.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 md:px-8 lg:px-12 py-10">
      <ToastContainer toasts={toasts} />
      <div className={`bg-gradient-to-r ${game.color} rounded-2xl p-6 mb-6 flex items-center gap-4`}>
        <span className="text-4xl">{game.icon}</span>
        <div>
          <h1 className="font-syne font-bold text-xl text-white">{game.name}</h1>
          <p className="text-white/70 text-sm">Top Up {game.type}</p>
        </div>
        <button onClick={() => navigate("/topup")}
          className="ml-auto text-white/60 hover:text-white text-sm border border-white/20 hover:border-white/40 px-3 py-1.5 rounded-lg transition-colors">
          Kembali
        </button>
      </div>

      <div className="flex items-center gap-2 mb-8">
        {["Isi Data", "Konfirmasi", "Selesai"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              step > i + 1 ? "bg-green-500 text-white" : step === i + 1 ? "bg-purple text-white" : "bg-white/10 text-muted"}`}>
              {step > i + 1 ? "?" : i + 1}
            </div>
            <span className={`text-xs ${step === i + 1 ? "text-white font-medium" : "text-muted"}`}>{s}</span>
            {i < 2 && <div className="w-8 h-px bg-white/10" />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <h2 className="font-semibold text-white">Data Akun</h2>
            <div>
              <label className="block text-sm text-white/70 mb-1.5 font-medium">ID Pengguna <span className="text-red-400">*</span></label>
              <input value={userId} onChange={(e) => { setUserId(e.target.value); setErrors((p) => ({ ...p, userId: "" })) }}
                placeholder="Masukkan User ID akun game kamu"
                className={`w-full bg-bg-2 border rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-muted transition-colors ${errors.userId ? "border-red-500" : "border-border focus:border-purple"}`} />
              {errors.userId && <p className="text-red-400 text-xs mt-1">{errors.userId}</p>}
              <p className="text-muted text-xs mt-1">Pastikan ID yang dimasukkan sudah benar sebelum melanjutkan.</p>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1.5 font-medium">Server <span className="text-muted text-xs font-normal">(opsional)</span></label>
              <input value={serverId} onChange={(e) => setServerId(e.target.value)}
                placeholder="Masukkan Server ID jika diperlukan"
                className="w-full bg-bg-2 border border-border focus:border-purple rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-muted transition-colors" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold text-white mb-3">Pilih Nominal <span className="text-red-400">*</span></h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {paketList.map((p) => (
                <button key={p.id} onClick={() => { setPaket(p); setErrors((prev) => ({ ...prev, paket: "" })) }}
                  className={`rounded-xl p-3 text-left border transition-all ${paket?.id === p.id ? "border-purple bg-purple/10" : "border-border bg-bg-2 hover:border-purple/50"}`}>
                  <div className="text-white text-xs font-semibold">{p.label}</div>
                  <div className="text-purple-2 text-xs font-bold mt-0.5">{fmt(p.price || p.harga)}</div>
                </button>
              ))}
            </div>
            {errors.paket && <p className="text-red-400 text-xs mt-2">{errors.paket}</p>}
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold text-white mb-3">Metode Pembayaran <span className="text-red-400">*</span></h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {metodeBayar.map((m) => (
                <button key={m.id} onClick={() => { setMetode(m); setErrors((prev) => ({ ...prev, metode: "" })) }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${metode?.id === m.id ? "border-purple bg-purple/10 text-white" : "border-border bg-bg-2 text-white/70 hover:border-purple/50"}`}>
                  {m.icon ? <img src={`https://yuzri-api.onrender.com/api/files/payment_methods/${m.id}/${m.icon}`} className="w-5 h-5 object-contain rounded" /> : <span>??</span>} {m.name}
                </button>
              ))}
            </div>
            {errors.metode && <p className="text-red-400 text-xs mt-2">{errors.metode}</p>}
            {metode && (
              <div className="mt-3 bg-purple/10 border border-purple/30 rounded-xl px-4 py-3">
                <p className="text-white/70 text-xs mb-1">Detail Pembayaran:</p>
                <p className="text-white font-semibold text-sm">{metode.name}</p>
                <p className="text-purple-2 font-bold text-sm">{metode.account_number}</p>
                <p className="text-white/60 text-xs">a.n. {metode.account_name}</p>
              </div>
            )}
          </div>

          <button onClick={handleLanjut} className="w-full bg-purple hover:bg-purple-3 text-white font-semibold py-3.5 rounded-xl transition-colors">
            Lanjutkan
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-syne font-bold text-lg text-white">Konfirmasi Pesanan</h2>
          <div className="divide-y divide-border">
            {[
              { label: "Produk",     value: game.name },
              { label: "Nominal",    value: paket.label },
              { label: "ID Akun",    value: userId + (serverId ? ` (Server: ${serverId})` : "") },
              { label: "Pembayaran", value: metode.label },
              { label: "Total",      value: fmt(paket.harga ?? paket.price), bold: true },
            ].map(({ label, value, bold }) => (
              <div key={label} className="flex justify-between py-3">
                <span className="text-muted text-sm">{label}</span>
                <span className={`text-sm ${bold ? "text-purple-2 font-bold text-base" : "text-white font-medium"}`}>{value}</span>
              </div>
            ))}
          </div>
          {/* Upload Bukti Transfer */}
          <div className="bg-bg-2 border border-border rounded-xl p-4">
            <p className="text-white font-medium text-sm mb-1">
              Bukti Transfer <span className="text-red-400">*</span>
            </p>
            <p className="text-muted text-xs mb-3">Upload screenshot bukti pembayaran kamu</p>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all ${buktiTransfer ? "border-purple bg-purple/10 text-white" : "border-border text-muted hover:border-purple/50"}`}>
                <span>??</span>
                <span className="truncate">{buktiTransfer ? buktiTransfer.name : "Pilih gambar..."}</span>
              </div>
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => setBuktiTransfer(e.target.files[0] || null)} />
            </label>
            {buktiTransfer && (
              <div className="mt-3 relative">
                <img src={URL.createObjectURL(buktiTransfer)}
                  className="w-full max-h-48 object-contain rounded-xl border border-border" />
                <button onClick={() => setBuktiTransfer(null)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white/70 hover:text-white text-xs flex items-center justify-center transition-colors">
                  ?
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep(1)} className="flex-1 border border-border hover:border-white/30 text-white/70 hover:text-white font-medium py-3 rounded-xl transition-colors">Ubah</button>
            <button onClick={handleBayar} disabled={loading || !buktiTransfer}
              className="flex-1 bg-purple hover:bg-purple-3 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading ? (<><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Memproses...</>) : "Bayar Sekarang"}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className={`border rounded-2xl p-8 text-center bg-card ${
          trxStatus === "Approved" ? "border-green-500/30" :
          trxStatus === "Rejected" ? "border-red-500/30" : "border-yellow-500/30"}`}>

          {ticketId ? (
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 mb-6 inline-block">
              <span className="text-muted text-xs">No. Tiket: </span>
              <span className="text-purple-2 font-bold text-sm">{trxId}</span>
            </div>
          ) : null}

          {trxStatus === "Pending" ? (
            <>
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="animate-spin w-8 h-8 text-yellow-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              </div>
              <h2 className="font-syne font-bold text-xl text-white mb-2">Menunggu Konfirmasi Admin</h2>
              <p className="text-muted text-sm mb-2">Transaksi kamu sedang diproses.</p>
              <p className="text-yellow-400 text-xs">Halaman ini otomatis update saat status berubah.</p>
            </>
          ) : trxStatus === "Approved" ? (
            <>
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-3xl">?</span></div>
              <h2 className="font-syne font-bold text-xl text-white mb-2">Transaksi Disetujui!</h2>
              <p className="text-muted text-sm mb-1">{paket?.label} sedang dikirim ke akun <span className="text-white font-medium">{userId}</span></p>
              <p className="text-muted text-sm mb-6">Periksa akun game kamu dalam 1-5 menit.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => navigate("/riwayat")} className="border border-border hover:border-white/30 text-white/70 hover:text-white px-5 py-2.5 rounded-xl text-sm transition-colors">Lihat Riwayat</button>
                <button onClick={() => navigate("/topup")} className="bg-purple hover:bg-purple-3 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">Top Up Lagi</button>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-3xl">x</span></div>
              <h2 className="font-syne font-bold text-xl text-white mb-2">Transaksi Ditolak</h2>
              <p className="text-muted text-sm mb-3">Transaksi kamu tidak dapat diproses.</p>
              {rejectReason ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6 text-left">
                  <p className="text-red-400 text-sm font-medium">Alasan Penolakan:</p>
                  <p className="text-red-300 text-sm mt-1">{rejectReason}</p>
                </div>
              ) : null}
              <div className="flex gap-3 justify-center">
                <button onClick={() => { setStep(1); setTrxStatus("Pending"); setTrxId(null) }}
                  className="border border-border hover:border-white/30 text-white/70 hover:text-white px-5 py-2.5 rounded-xl text-sm transition-colors">Coba Lagi</button>
                <button onClick={() => navigate("/topup")} className="bg-purple hover:bg-purple-3 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">Kembali</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}















