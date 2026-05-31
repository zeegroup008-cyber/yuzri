import { useState, useEffect } from "react"

const LIVE_TRANSACTIONS = [
  { user: "Rizky A.", item: "112 Diamond ML", time: "baru saja" },
  { user: "Dewi S.", item: "Netflix 1 Bln", time: "1 mnt lalu" },
  { user: "Bima R.", item: "325 UC PUBG", time: "2 mnt lalu" },
  { user: "Siti N.", item: "Spotify Premium", time: "3 mnt lalu" },
  { user: "Andi P.", item: "1450 Diamond FF", time: "4 mnt lalu" },
  { user: "Rini H.", item: "ChatGPT Plus", time: "5 mnt lalu" },
]

const STATS = [
  { value: "500K+", label: "Pengguna Aktif", icon: "👥" },
  { value: "2M+",   label: "Transaksi Sukses", icon: "✅" },
  { value: "99.9%", label: "Uptime Server", icon: "⚡" },
  { value: "< 1 Mnt", label: "Rata-rata Proses", icon: "🚀" },
]

export default function TrustBar() {
  const [liveIdx, setLiveIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setLiveIdx(p => (p + 1) % LIVE_TRANSACTIONS.length)
        setVisible(true)
      }, 300)
    }, 3500)
    return () => clearInterval(t)
  }, [])

  const tx = LIVE_TRANSACTIONS[liveIdx]

  return (
    <div style={{background:"rgba(255,255,255,0.02)",borderTop:"1px solid rgba(255,255,255,0.05)",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
      {/* Stats row */}
      <div className="px-4 md:px-8 lg:px-12 py-5">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{background:"rgba(124,92,252,0.15)",border:"1px solid rgba(124,92,252,0.25)"}}>
                  {s.icon}
                </div>
                <div>
                  <div className="text-[var(--color-text)] font-extrabold text-base leading-none font-syne">{s.value}</div>
                  <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Live transaction ticker */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl"
            style={{background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.2)"}}>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-bold tracking-wide">LIVE</span>
            </div>
            <div
              className="text-xs transition-all duration-300"
              style={{opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(4px)"}}>
              <span className="text-white/80 font-semibold">{tx.user}</span>
              <span className="text-white/50"> beli </span>
              <span className="text-white/80">{tx.item}</span>
              <span className="text-white/35 ml-2">{tx.time}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
