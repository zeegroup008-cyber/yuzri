import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import pb from "../lib/pb"
import { SkeletonRow, EmptyState } from "../components/Skeleton"

// Normalize PB statuses → display groups
const normalize = s => {
  if (s === "Approved" || s === "Berhasil" || s === "success") return "Berhasil"
  if (s === "Pending"  || s === "pending"  || s === "waiting")  return "Pending"
  return "Gagal"
}

const statusStyle = s => {
  if (s === "Berhasil") return { color: "#4ade80", bg: "rgba(74,222,128,0.1)" }
  if (s === "Pending")  return { color: "#facc15", bg: "rgba(250,204,21,0.1)" }
  return                       { color: "#f87171", bg: "rgba(248,113,113,0.1)" }
}

const FILTERS = ["Semua", "Berhasil", "Pending", "Gagal"]

export default function RiwayatPage() {
  const navigate = useNavigate()
  const [riwayat, setRiwayat] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)
  const [filter,  setFilter]  = useState("Semua")

  useEffect(() => {
    ;(async () => {
      try {
        const userId = pb.authStore.model?.id
        if (!userId) { navigate("/masuk"); return }
        const records = await pb.collection("transactions").getFullList({
          sort: "-created",
          filter: `user_id = "${userId}"`,
          requestKey: null,
        })
        setRiwayat(records.map(r => ({
          id:      r.id,
          produk:  r.product_name || "Transaksi",
          tanggal: new Date(r.created).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
          status:  normalize(r.status),
          rawStatus: r.status,
          nominal: "Rp " + Number(r.amount || 0).toLocaleString("id-ID"),
        })))
      } catch {
        setError(true)
      }
      setLoading(false)
    })()
  }, [navigate])

  const filtered = filter === "Semua" ? riwayat : riwayat.filter(r => r.status === filter)

  const cardBase = {
    background: "var(--color-card)",
    border: "1px solid var(--color-border)",
  }

  // count per filter for badge
  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === "Semua" ? riwayat.length : riwayat.filter(r => r.status === f).length
    return acc
  }, {})

  return (
    <div className="px-4 md:px-8 lg:px-12 py-8 sm:py-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-syne font-extrabold text-white text-2xl">Riwayat Transaksi</h1>
          {!loading && !error && (
            <p className="text-white/35 text-sm mt-1">{riwayat.length} transaksi ditemukan</p>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => {
            const active = filter === f
            return (
              <button key={f} onClick={() => setFilter(f)}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
                style={{
                  background: active ? "linear-gradient(135deg,#7c5cfc,#5b3fd4)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${active ? "transparent" : "rgba(255,255,255,0.1)"}`,
                  color: active ? "#fff" : "rgba(255,255,255,0.45)",
                }}>
                {f}
                {!loading && counts[f] > 0 && (
                  <span className="text-[10px] rounded-full px-1.5 py-0.5 leading-none"
                    style={{
                      background: active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                      color: active ? "#fff" : "rgba(255,255,255,0.4)",
                    }}>
                    {counts[f]}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="rounded-2xl overflow-hidden" style={cardBase}>
          {[1,2,3,4,5].map(i => <SkeletonRow key={i} />)}
        </div>
      ) : error ? (
        <div className="rounded-2xl py-8 text-center" style={cardBase}>
          <p className="text-white/50 text-sm">Gagal memuat riwayat. Periksa koneksi dan coba lagi.</p>
          <button onClick={() => window.location.reload()}
            className="mt-3 text-violet-400 text-xs hover:underline">
            Muat Ulang
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={filter === "Semua" ? "📭" : filter === "Berhasil" ? "✅" : filter === "Pending" ? "⏳" : "❌"}
          title={filter === "Semua" ? "Belum ada transaksi" : `Tidak ada transaksi ${filter}`}
          desc={filter === "Semua" ? "Mulai top up game atau beli akun premium favoritmu" : `Tidak ditemukan transaksi dengan status ${filter}`}
          action={filter === "Semua" ? "Mulai Top Up →" : undefined}
          onAction={filter === "Semua" ? () => navigate("/topup") : undefined}
        />
      ) : (
        <div className="rounded-2xl overflow-hidden" style={cardBase}>
          {filtered.map((r, i) => {
            const st = statusStyle(r.status)
            return (
              <div key={r.id}
                className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-white/[0.03] transition-colors"
                style={{ borderBottom: i !== filtered.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: st.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{r.produk}</p>
                  <p className="text-white/30 text-xs mt-0.5">
                    <span className="font-mono">{r.id.slice(0, 12)}…</span> · {r.tanggal}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-white font-semibold text-sm">{r.nominal}</p>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full mt-0.5 inline-block"
                    style={{ background: st.bg, color: st.color }}>
                    {r.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
