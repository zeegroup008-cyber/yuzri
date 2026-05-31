import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import pb from "../lib/pb"
import { SkeletonRow, EmptyState } from "../components/Skeleton"

function getInitials(str) {
  if (!str) return "Y"
  return str.split(" ").filter(Boolean).map(w => w[0]).join("").toUpperCase().slice(0, 2)
}

function avatarColor(str) {
  const palette = ["#7c5cfc","#3b82f6","#ef4444","#22c55e","#f59e0b","#ec4899","#06b6d4","#8b5cf6"]
  if (!str) return palette[0]
  return palette[str.charCodeAt(0) % palette.length]
}

const statusStyle = s => {
  if (s === "Berhasil" || s === "Approved") return { color: "#4ade80", bg: "rgba(74,222,128,0.1)" }
  if (s === "Pending")                      return { color: "#facc15", bg: "rgba(250,204,21,0.1)" }
  return { color: "#f87171", bg: "rgba(248,113,113,0.1)" }
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const user     = pb.authStore.model

  const [stats,      setStats]      = useState({ total: 0, spent: 0 })
  const [recentTxns, setRecentTxns] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [editing,    setEditing]    = useState(false)
  const [editName,   setEditName]   = useState(user?.name || "")
  const [saving,     setSaving]     = useState(false)
  const [msg,        setMsg]        = useState({ text: "", ok: true })

  useEffect(() => {
    if (!user) { navigate("/masuk"); return }
    ;(async () => {
      try {
        const txns = await pb.collection("transactions").getFullList({
          filter: `user_id = "${user.id}"`, sort: "-created", requestKey: null,
        })
        const spent = txns.reduce((s, t) => s + (Number(t.amount) || 0), 0)
        setStats({ total: txns.length, spent })
        setRecentTxns(txns.slice(0, 6))
      } catch { /* no transactions yet */ }
      setLoading(false)
    })()
  }, [user, navigate])

  if (!user) return null

  const initials = getInitials(user.name || user.email)
  const color    = avatarColor(user.name || user.email)
  const joinDate = new Date(user.created).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })

  const saveName = async () => {
    if (!editName.trim()) return
    setSaving(true)
    try {
      await pb.collection("users").update(user.id, { name: editName.trim() })
      pb.authStore.model.name = editName.trim()
      setEditing(false)
      flash("Nama berhasil diperbarui ✓", true)
    } catch { flash("Gagal menyimpan. Coba lagi.", false) }
    setSaving(false)
  }

  const flash = (text, ok) => {
    setMsg({ text, ok })
    setTimeout(() => setMsg({ text: "", ok: true }), 3500)
  }

  const cardBase = {
    background: "var(--color-card)",
    border: "1px solid var(--color-border)",
  }

  return (
    <div className="px-4 md:px-8 lg:px-12 py-8 sm:py-12">

      {/* Header card */}
      <div className="relative rounded-2xl overflow-hidden mb-5 p-5 sm:p-8"
        style={{ background: "linear-gradient(135deg,rgba(124,92,252,0.18),rgba(124,92,252,0.04))", border: "1px solid rgba(124,92,252,0.22)" }}>
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(124,92,252,0.28),transparent 70%)", filter: "blur(32px)" }} />

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white flex-shrink-0 font-syne select-none"
            style={{ background: `radial-gradient(circle at 35% 30%,${color}cc,${color})`, boxShadow: `0 0 28px ${color}55` }}>
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && saveName()}
                  autoFocus
                  className="rounded-xl px-3 py-1.5 text-white font-semibold text-lg outline-none w-full sm:w-auto sm:max-w-[220px]"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(124,92,252,0.4)" }}
                />
                <button onClick={saveName} disabled={saving}
                  className="px-4 py-1.5 rounded-xl text-white text-sm font-semibold"
                  style={{ background: "#7c5cfc", opacity: saving ? 0.7 : 1 }}>
                  {saving ? "Menyimpan…" : "Simpan"}
                </button>
                <button onClick={() => { setEditing(false); setEditName(user.name || "") }}
                  className="px-3 py-1.5 rounded-xl text-white/50 text-sm border border-white/15">
                  Batal
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="font-syne font-extrabold text-white text-xl sm:text-2xl truncate">
                  {user.name || "Pengguna YuzriID"}
                </h1>
                <button onClick={() => setEditing(true)} title="Edit nama"
                  className="text-violet-400 hover:text-violet-300 transition-colors text-base leading-none">
                  ✏️
                </button>
              </div>
            )}
            {msg.text && (
              <p className="text-xs mb-1" style={{ color: msg.ok ? "#4ade80" : "#f87171" }}>{msg.text}</p>
            )}
            <p className="text-white/45 text-sm truncate">{user.email}</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-white/35 text-xs">Bergabung {joinDate}</span>
            </div>
          </div>

          <div className="flex-shrink-0 px-5 py-3 rounded-2xl text-center"
            style={{ background: "rgba(124,92,252,0.18)", border: "1px solid rgba(124,92,252,0.28)" }}>
            <div className="text-violet-300 text-[10px] font-extrabold tracking-widest mb-0.5">MEMBER</div>
            <div className="text-white font-extrabold text-lg font-syne">Aktif</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { icon: "🧾", value: loading ? "—" : stats.total,    label: "Transaksi",    color: "#a78bfa" },
          { icon: "💰", value: loading ? "—" : "Rp " + stats.spent.toLocaleString("id-ID"), label: "Total Belanja", color: "#fbbf24" },
          { icon: "✅", value: "Aktif",                         label: "Status Akun",  color: "#4ade80" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-3 sm:p-5 text-center" style={cardBase}>
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="font-syne font-extrabold text-xs sm:text-base mb-0.5 break-all leading-tight"
              style={{ color: s.color }}>{s.value}</div>
            <div className="text-white/35 text-[10px] sm:text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Two-col grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Account info */}
        <div className="rounded-2xl p-5 sm:p-6" style={cardBase}>
          <h2 className="font-syne font-bold text-white text-base mb-5">Informasi Akun</h2>
          <dl className="space-y-4">
            {[
              { label: "Nama Lengkap",    value: user.name || "—" },
              { label: "Alamat Email",    value: user.email },
              { label: "ID Akun",         value: user.id.slice(0, 14) + "…" },
              { label: "Bergabung Sejak", value: joinDate },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-white/35 text-xs mb-0.5">{label}</dt>
                <dd className="text-white text-sm font-medium break-all">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 pt-4 flex flex-col sm:flex-row gap-2"
            style={{ borderTop: "1px solid var(--color-border)" }}>
            <button onClick={() => navigate("/pengaturan")}
              className="flex-1 text-white text-xs font-bold py-2.5 rounded-xl hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg,#7c5cfc,#5b3fd4)" }}>
              Ubah Pengaturan
            </button>
            <button onClick={() => navigate("/riwayat")}
              className="flex-1 text-white/65 hover:text-white text-xs font-semibold py-2.5 rounded-xl transition-all border border-white/10 hover:border-white/20">
              Riwayat Transaksi
            </button>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="rounded-2xl p-5 sm:p-6" style={cardBase}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-syne font-bold text-white text-base">Transaksi Terbaru</h2>
            <button onClick={() => navigate("/riwayat")} className="text-xs" style={{ color: "#9b7ffe" }}>
              Lihat semua →
            </button>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <SkeletonRow key={i} />)}
            </div>
          ) : recentTxns.length === 0 ? (
            <EmptyState icon="📭" title="Belum ada transaksi"
              desc="Mulai top up game atau beli akun premium favoritmu"
              action="Mulai Top Up →" onAction={() => navigate("/topup")} />
          ) : (
            <div className="space-y-1">
              {recentTxns.map(t => {
                const st = statusStyle(t.status)
                return (
                  <div key={t.id} className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-white/[0.04] transition-colors">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: st.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{t.product_name || "Transaksi"}</p>
                      <p className="text-white/30 text-[10px]">
                        {new Date(t.created).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white text-xs font-semibold">
                        Rp {Number(t.amount || 0).toLocaleString("id-ID")}
                      </p>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                        style={{ background: st.bg, color: st.color }}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
