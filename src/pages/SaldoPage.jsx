import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import pb from "../lib/pb"
import { SkeletonRow } from "../components/Skeleton"

const TOPUP_OPTIONS = [
  { label: "Rp 10.000",  value: 10000 },
  { label: "Rp 25.000",  value: 25000 },
  { label: "Rp 50.000",  value: 50000 },
  { label: "Rp 100.000", value: 100000 },
  { label: "Rp 200.000", value: 200000 },
  { label: "Rp 500.000", value: 500000 },
]

function fmt(n) { return "Rp " + Number(n).toLocaleString("id-ID") }

const statusStyle = s => {
  if (s === "Berhasil" || s === "Approved") return { color: "#4ade80", bg: "rgba(74,222,128,0.1)" }
  if (s === "Pending")                      return { color: "#facc15", bg: "rgba(250,204,21,0.1)" }
  return                                           { color: "#f87171", bg: "rgba(248,113,113,0.1)" }
}

export default function SaldoPage() {
  const navigate = useNavigate()
  const user = pb.authStore.model

  const [balance,     setBalance]     = useState(0)
  const [ledger,      setLedger]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [selected,    setSelected]    = useState(null)
  const [customAmt,   setCustomAmt]   = useState("")
  const [voucher,     setVoucher]     = useState("")
  const [voucherMsg,  setVoucherMsg]  = useState({ text: "", ok: true })
  const [claimingV,   setClaimingV]   = useState(false)

  useEffect(() => {
    if (!user) { navigate("/masuk"); return }
    ;(async () => {
      try {
        // Fetch balance from users record
        const u = await pb.collection("users").getOne(user.id)
        setBalance(Number(u.balance) || 0)

        // Fetch saldo-type transactions for ledger
        const txns = await pb.collection("transactions").getFullList({
          filter: `user_id = "${user.id}"`,
          sort: "-created", requestKey: null,
        })
        setLedger(txns.slice(0, 10))
      } catch { /* balance stays 0 */ }
      setLoading(false)
    })()
  }, [user, navigate])

  if (!user) return null

  const finalAmount = selected || Number(customAmt.replace(/\D/g, "")) || 0

  const handleTopUp = () => {
    if (finalAmount < 10000) return
    // Navigate to payment flow — pass amount as query param
    navigate(`/cara-pembayaran?amount=${finalAmount}&type=saldo`)
  }

  const claimVoucher = async () => {
    if (!voucher.trim()) return
    setClaimingV(true)
    // Stub: voucher system not yet implemented in PB
    await new Promise(r => setTimeout(r, 800))
    setVoucherMsg({ text: "Kode voucher tidak ditemukan atau sudah digunakan.", ok: false })
    setTimeout(() => setVoucherMsg({ text: "", ok: true }), 3500)
    setClaimingV(false)
  }

  const cardBase = {
    background: "var(--color-card)",
    border: "1px solid var(--color-border)",
  }

  return (
    <div className="px-4 md:px-8 lg:px-12 py-8 sm:py-12">
      <h1 className="font-syne font-extrabold text-white text-2xl mb-8">Saldo & Voucher</h1>

      {/* Balance card */}
      <div className="relative rounded-2xl overflow-hidden p-6 mb-5"
        style={{ background: "linear-gradient(135deg,rgba(124,92,252,0.22),rgba(91,63,212,0.12))", border: "1px solid rgba(124,92,252,0.3)" }}>
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(124,92,252,0.3),transparent 70%)", filter: "blur(28px)" }} />
        <p className="text-white/45 text-sm mb-1">Saldo Tersedia</p>
        {loading ? (
          <div className="h-10 w-40 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.08)" }} />
        ) : (
          <p className="font-syne font-extrabold text-4xl text-white">{fmt(balance)}</p>
        )}
        <p className="text-white/25 text-xs mt-1">Dapat digunakan untuk semua transaksi di YuzriID</p>
      </div>

      {/* Top up section */}
      <div className="rounded-2xl p-5 sm:p-6 mb-4" style={cardBase}>
        <h2 className="font-syne font-bold text-white text-base mb-5">Tambah Saldo</h2>

        {/* Quick amounts */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {TOPUP_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => { setSelected(opt.value); setCustomAmt("") }}
              className="py-2.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: selected === opt.value ? "linear-gradient(135deg,#7c5cfc,#5b3fd4)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${selected === opt.value ? "transparent" : "rgba(255,255,255,0.1)"}`,
                color: selected === opt.value ? "#fff" : "rgba(255,255,255,0.55)",
              }}>
              {opt.label}
            </button>
          ))}
        </div>

        {/* Custom amount */}
        <div className="mb-4">
          <label className="block text-xs text-white/40 mb-1.5">Nominal Lain</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              value={customAmt}
              onChange={e => {
                const raw = e.target.value.replace(/\D/g, "")
                setCustomAmt(raw ? Number(raw).toLocaleString("id-ID") : "")
                setSelected(null)
              }}
              placeholder="0"
              className="w-full rounded-xl pl-10 pr-4 py-2.5 text-[var(--color-text)] text-sm outline-none transition-colors"
              style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)" }}
              onFocus={e => (e.target.style.borderColor = "rgba(124,92,252,0.6)")}
              onBlur={e => (e.target.style.borderColor = "var(--input-border)")}
            />
          </div>
        </div>

        <button onClick={handleTopUp} disabled={finalAmount < 10000}
          className="w-full py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 active:scale-95"
          style={{
            background: finalAmount >= 10000 ? "linear-gradient(135deg,#7c5cfc,#5b3fd4)" : "rgba(255,255,255,0.06)",
            color: finalAmount >= 10000 ? "#fff" : "rgba(255,255,255,0.25)",
            cursor: finalAmount >= 10000 ? "pointer" : "not-allowed",
          }}>
          {finalAmount >= 10000 ? `Tambah ${fmt(finalAmount)}` : "Pilih nominal terlebih dahulu"}
        </button>
        {finalAmount > 0 && finalAmount < 10000 && (
          <p className="text-xs text-red-400 mt-1.5">Minimal top up Rp 10.000</p>
        )}
      </div>

      {/* Voucher */}
      <div className="rounded-2xl p-5 sm:p-6 mb-4" style={cardBase}>
        <h2 className="font-syne font-bold text-white text-base mb-4">Kode Voucher</h2>
        <div className="flex gap-2">
          <input
            value={voucher}
            onChange={e => setVoucher(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === "Enter" && claimVoucher()}
            placeholder="Masukkan kode voucher"
            className="flex-1 rounded-xl px-4 py-2.5 text-[var(--color-text)] text-sm outline-none uppercase tracking-widest transition-colors"
            style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)", letterSpacing: "0.1em" }}
            onFocus={e => (e.target.style.borderColor = "rgba(124,92,252,0.6)")}
            onBlur={e => (e.target.style.borderColor = "var(--input-border)")}
          />
          <button onClick={claimVoucher} disabled={claimingV || !voucher.trim()}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#7c5cfc,#5b3fd4)", opacity: (claimingV || !voucher.trim()) ? 0.5 : 1 }}>
            {claimingV ? "…" : "Klaim"}
          </button>
        </div>
        {voucherMsg.text && (
          <p className="text-xs mt-2" style={{ color: voucherMsg.ok ? "#4ade80" : "#f87171" }}>
            {voucherMsg.text}
          </p>
        )}
      </div>

      {/* Transaction ledger */}
      <div className="rounded-2xl p-5 sm:p-6" style={cardBase}>
        <h2 className="font-syne font-bold text-white text-base mb-5">Riwayat Transaksi</h2>
        {loading ? (
          <div className="space-y-1">{[1,2,3].map(i => <SkeletonRow key={i} />)}</div>
        ) : ledger.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-8">Belum ada transaksi</p>
        ) : (
          <div className="space-y-0">
            {ledger.map((t, i) => {
              const st = statusStyle(t.status)
              return (
                <div key={t.id} className="flex items-center gap-3 py-3 hover:bg-white/[0.03] rounded-xl px-2 transition-colors"
                  style={{ borderBottom: i !== ledger.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: st.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium truncate">{t.product_name || "Transaksi"}</p>
                    <p className="text-white/30 text-[10px]">
                      {new Date(t.created).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white text-xs font-semibold">{fmt(t.amount || 0)}</p>
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
        {ledger.length > 0 && (
          <button onClick={() => navigate("/riwayat")}
            className="mt-4 w-full py-2 rounded-xl text-xs font-semibold text-center transition-all hover:bg-white/[0.04]"
            style={{ color: "#9b7ffe", border: "1px solid rgba(124,92,252,0.2)" }}>
            Lihat Semua Riwayat →
          </button>
        )}
      </div>
    </div>
  )
}
