import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import pb from "../lib/pb"
import { getImageUrl } from "../lib/products"

const TYPE_TO_PATH = { game: "topup", premium: "premium", ppob: "ppob", giftcard: "giftcard", vpn: "vpn", voucher: "voucher" }
const TYPE_LABEL   = { game: "🎮 Top Up Game", premium: "💎 Premium", ppob: "📱 PPOB", giftcard: "🎁 Gift Card", vpn: "🔒 VPN", voucher: "🎫 Voucher" }

const PROMOS = [
  { id: 1, title: "Flash Sale Game",        desc: "Top up game hemat hingga 15%", badge: "FLASH SALE",  color: "#7c5cfc", icon: "🎮" },
  { id: 2, title: "Promo Akhir Bulan",      desc: "Semua produk premium diskon",  badge: "LIMITED",    color: "#e50914", icon: "🔥" },
  { id: 3, title: "Gift Card Murah",        desc: "Steam & Google Play special",  badge: "HOT DEAL",   color: "#01875f", icon: "🎁" },
  { id: 4, title: "VPN 1 Tahun Hemat",      desc: "Harga spesial langganan tahunan", badge: "HEMAT",   color: "#4687ff", icon: "🔒" },
]

function fmt(n) { return "Rp " + Number(n).toLocaleString("id-ID") }

function CountdownTimer() {
  const [time, setTime] = useState({ h: 5, m: 59, s: 59 })
  useEffect(() => {
    const id = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev
        s -= 1
        if (s < 0) { s = 59; m -= 1 }
        if (m < 0) { m = 59; h -= 1 }
        if (h < 0) { h = 23; m = 59; s = 59 }
        return { h, m, s }
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])
  const pad = n => String(n).padStart(2, "0")
  return (
    <div className="flex items-center gap-1">
      {[pad(time.h), pad(time.m), pad(time.s)].map((v, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 min-w-[36px] text-center">
            <span className="font-syne font-extrabold text-white text-sm">{v}</span>
          </div>
          {i < 2 && <span className="text-white/40 font-bold text-sm">:</span>}
        </div>
      ))}
    </div>
  )
}

export default function PromoPage() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const prods = await pb.collection("products").getFullList({
          filter: "is_active = true",
          sort: "sort_order", requestKey: null,
        })
        const withPrice = await Promise.all(prods.slice(0, 12).map(async (p) => {
          try {
            const pakets = await pb.collection("pakets").getFullList({
              filter: `product_id = "${p.id}" && is_active = true`,
              sort: "price", requestKey: null,
            })
            return { ...p, minPrice: pakets.length > 0 ? pakets[0].price : null }
          } catch { return { ...p, minPrice: null } }
        }))
        setFeatured(withPrice)
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="px-4 md:px-8 lg:px-12 py-12">

      {/* Hero banner */}
      <div
        className="relative rounded-3xl overflow-hidden mb-12 p-8 md:p-12"
        style={{
          background: "linear-gradient(135deg, #1a0a4e 0%, #2d1b8e 40%, #4c1d95 70%, #1e0a3e 100%)",
          border: "1px solid rgba(124,92,252,0.3)",
          boxShadow: "0 20px 80px rgba(124,92,252,0.25)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full opacity-10"
              style={{
                width: `${80 + i * 40}px`, height: `${80 + i * 40}px`,
                background: "radial-gradient(circle, #7c5cfc, transparent)",
                top: `${10 + i * 15}%`, left: `${60 + i * 5}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{ background: "rgba(124,92,252,0.3)", border: "1px solid rgba(124,92,252,0.5)" }}>
            <span className="text-xs font-bold text-purple-300 tracking-widest">🔥 FLASH SALE AKTIF</span>
          </div>
          <h1 className="font-syne font-extrabold text-3xl md:text-5xl text-white mb-3 leading-tight">
            Promo Spesial<br />
            <span style={{ color: "#a78bfa" }}>Hari Ini!</span>
          </h1>
          <p className="text-white/60 text-base mb-6">Dapatkan harga terbaik untuk semua produk digital. Promo berakhir dalam:</p>
          <CountdownTimer />
          <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={() => navigate("/topup")}
              className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#7c5cfc,#5b3fd4)", boxShadow: "0 4px 20px rgba(124,92,252,0.4)" }}>
              Top Up Game
            </button>
            <button onClick={() => navigate("/premium")}
              className="px-6 py-2.5 rounded-xl text-white/80 font-semibold text-sm transition-all hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.2)" }}>
              Akun Premium
            </button>
          </div>
        </div>
      </div>

      {/* Promo cards */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-7 rounded-full" style={{ background: "linear-gradient(180deg,#7c5cfc,#5b3fd4)" }} />
          <h2 className="font-syne font-extrabold text-2xl text-white">Penawaran Spesial</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROMOS.map(promo => (
            <div key={promo.id}
              className="rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1"
              style={{
                background: `linear-gradient(135deg, ${promo.color}20, ${promo.color}08)`,
                border: `1px solid ${promo.color}35`,
                boxShadow: `0 4px 20px ${promo.color}15`,
              }}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{promo.icon}</span>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full"
                  style={{ background: promo.color, color: "#fff" }}>
                  {promo.badge}
                </span>
              </div>
              <h3 className="font-syne font-bold text-white text-base mb-1">{promo.title}</h3>
              <p className="text-white/50 text-xs">{promo.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured products */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-7 rounded-full" style={{ background: "linear-gradient(180deg,#7c5cfc,#5b3fd4)" }} />
            <h2 className="font-syne font-extrabold text-2xl text-white">Produk Unggulan</h2>
          </div>
        </div>
        {loading ? (
          <div className="text-white/40 text-sm">Memuat produk...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {featured.map((p) => {
              const path = TYPE_TO_PATH[p.type] || "topup"
              const discountPct = [5, 8, 10, 12, 15][Math.abs(p.name.charCodeAt(0)) % 5]
              return (
                <div key={p.id}
                  onClick={() => navigate(`/${path}/${p.category}`)}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "rgba(255,255,255,0.028)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
                  }}>
                  <div className="relative h-28 overflow-hidden" style={{ background: "rgba(124,92,252,0.1)" }}>
                    {p.image ? (
                      <img src={getImageUrl(p.collectionId, p.id, p.image)}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white/60">
                        {p.name[0]}
                      </div>
                    )}
                    <div className="absolute top-2 left-2 text-[9px] font-extrabold px-2 py-0.5 rounded-full"
                      style={{ background: "#ef4444", color: "#fff" }}>
                      -{discountPct}%
                    </div>
                    <div className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(0,0,0,0.5)", color: "rgba(255,255,255,0.7)" }}>
                      {TYPE_LABEL[p.type] || "Produk"}
                    </div>
                  </div>
                  <div className="p-3" style={{ borderTop: "2px solid rgba(124,92,252,0.4)" }}>
                    <p className="text-white font-bold text-xs mb-1 truncate">{p.name}</p>
                    {p.minPrice && (
                      <div>
                        <p className="text-white/40 text-[10px] line-through">
                          {fmt(Math.round(p.minPrice * (1 + discountPct / 100)))}
                        </p>
                        <p className="text-xs font-bold" style={{ color: "#fbbf24" }}>
                          {fmt(p.minPrice)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Info banner */}
      <div className="mt-12 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ background: "rgba(124,92,252,0.08)", border: "1px solid rgba(124,92,252,0.2)" }}>
        <div>
          <h3 className="font-syne font-bold text-white text-lg mb-1">Tidak menemukan promo yang kamu cari?</h3>
          <p className="text-white/50 text-sm">Cek semua produk kami atau hubungi CS untuk info promo eksklusif.</p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button onClick={() => navigate("/hubungi-kami")}
            className="px-5 py-2.5 rounded-xl text-white/70 text-sm font-medium transition-all hover:text-white"
            style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
            Hubungi CS
          </button>
          <button onClick={() => navigate("/")}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#7c5cfc,#5b3fd4)" }}>
            Lihat Semua
          </button>
        </div>
      </div>
    </div>
  )
}
