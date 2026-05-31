import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import pb from "../lib/pb"
import { getImageUrl } from "../lib/products"
import { SkeletonGrid, ErrorState, EmptyState } from "./Skeleton"

const VOUCHER_COLORS = {
  "roblox":          "#e53935",
  "valorant":        "#ff4655",
  "minecraft":       "#5c8a1e",
  "fortnite":        "#00b4d8",
  "point-blank":     "#f59e0b",
  "ragnarok-origin": "#0063d4",
}

function fmt(n) { return "Rp " + Number(n).toLocaleString("id-ID") }

function VoucherCard({ product: p, onClick, index }) {
  const accent = VOUCHER_COLORS[p.category] || "#7c5cfc"

  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer shine-card glow-hover"
      style={{
        background: "rgba(255,255,255,0.028)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{ height: 120, background: `linear-gradient(135deg, ${accent}28 0%, ${accent}0f 100%)` }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 60% 40%, ${accent}35, transparent 70%)` }}
        />
        {p.image ? (
          <img
            src={getImageUrl(p.collectionId, p.id, p.image)}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-syne font-extrabold text-white/80" style={{ fontSize: "2.5rem" }}>
              {p.name[0]}
            </span>
          </div>
        )}
        <span
          className="absolute top-2.5 right-2.5 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider"
          style={{
            background: "rgba(124,92,252,0.9)",
            color: "#fff",
            backdropFilter: "blur(6px)",
            boxShadow: "0 0 12px rgba(124,92,252,0.5)",
          }}
        >
          🎫 VOUCHER
        </span>
      </div>

      <div className="p-3.5 transition-all duration-300" style={{ borderTop: `2px solid ${accent}` }}>
        <p className="text-white font-bold text-xs mb-0.5 truncate">{p.name}</p>
        {p.minPrice && (
          <p className="text-xs font-semibold mb-3" style={{ color: "#fbbf24" }}>
            Mulai {fmt(p.minPrice)}
          </p>
        )}
        <button
          onClick={e => { e.stopPropagation(); onClick() }}
          className="w-full text-white text-[11px] font-extrabold py-2.5 rounded-xl transition-all duration-200 active:scale-95 group-hover:shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
            boxShadow: `0 4px 12px ${accent}40`,
          }}
        >
          Beli Voucher
        </button>
      </div>
    </div>
  )
}

export default function VoucherSection() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(false)
  const [showAll,  setShowAll]  = useState(false)

  const load = async () => {
    setLoading(true); setError(false)
    try {
      const prods = await pb.collection("products").getFullList({
        filter: "type = 'voucher' && is_active = true",
        sort: "sort_order", requestKey: null,
      })
      const withPrice = await Promise.all(prods.map(async (p) => {
        try {
          const pakets = await pb.collection("pakets").getFullList({
            filter: `product_id = "${p.id}" && is_active = true`,
            sort: "price", requestKey: null,
          })
          return { ...p, minPrice: pakets.length > 0 ? pakets[0].price : null }
        } catch { return { ...p, minPrice: null } }
      }))
      setProducts(withPrice)
    } catch { setError(true) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  if (!loading && !error && products.length === 0) return null

  return (
    <section className="px-4 md:px-8 lg:px-12 py-4 pb-16">
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(124,92,252,0.4), transparent)" }} />
        <div className="flex items-center gap-2 px-5 py-2 rounded-full" style={{ background: "rgba(124,92,252,0.1)", border: "1px solid rgba(124,92,252,0.25)" }}>
          <span style={{ fontSize: "0.9rem" }}>🎫</span>
          <span className="text-xs font-extrabold tracking-widest" style={{ color: "#c4b5fd" }}>VOUCHER GAME</span>
        </div>
        <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(124,92,252,0.4))" }} />
      </div>

      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-1 h-7 rounded-full" style={{ background: "linear-gradient(180deg, #7c5cfc, #5b3fd4)" }} />
            <h2 className="font-syne font-extrabold text-2xl text-white tracking-tight">Voucher Game</h2>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: "rgba(124,92,252,0.2)", color: "#a78bfa", border: "1px solid rgba(124,92,252,0.3)" }}>
              {products.length} VOUCHER
            </span>
          </div>
          <p className="text-white/35 text-sm ml-4">Roblox, Valorant & game lainnya · Harga terbaik</p>
        </div>
        <button onClick={() => navigate("/voucher")}
          className="text-sm font-semibold transition-colors hover:opacity-80 hidden sm:block"
          style={{ color: "#9b7ffe" }}>
          Lihat Semua →
        </button>
      </div>

      {loading ? (
        <SkeletonGrid count={6} cols="grid-cols-2 sm:grid-cols-3 md:grid-cols-6" />
      ) : error ? (
        <ErrorState message="Gagal memuat voucher game." onRetry={load} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {(showAll ? products : products.slice(0, 12)).map((p, i) => (
            <VoucherCard key={p.id} product={p} index={i} onClick={() => navigate(`/voucher/${p.category}`)} />
          ))}
        </div>
      )}

      {!loading && !error && !showAll && products.length > 12 && (
        <div className="text-center mt-8">
          <button onClick={() => setShowAll(true)}
            className="px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-white/[0.05]"
            style={{ color: "#9b7ffe", border: "1px solid rgba(124,92,252,0.3)" }}>
            Tampilkan Semua {products.length} Voucher
          </button>
        </div>
      )}
    </section>
  )
}
