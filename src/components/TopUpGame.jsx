import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import pb from "../lib/pb"
import { getImageUrl } from "../lib/products"
import { SkeletonGrid, ErrorState, EmptyState } from "./Skeleton"

const GAME_COLORS = {
  "mobile-legends": "#1d4ed8",
  "free-fire":      "#ea580c",
  "pubg-mobile":    "#d97706",
  "honor-of-kings": "#059669",
  "genshin-impact": "#7c3aed",
  "arena-breakout": "#b91c1c",
}

const LIMITED_STOCK = ["mobile-legends", "free-fire", "genshin-impact"]
const HOT_BADGE     = ["mobile-legends", "pubg-mobile", "free-fire", "honor-of-kings"]

function fmt(n) { return "Rp " + Number(n).toLocaleString("id-ID") }

function GameCard({ game, onClick, index }) {
  const accent = GAME_COLORS[game.category] || "#7c5cfc"
  const isLimited = LIMITED_STOCK.includes(game.category)
  const isHot     = HOT_BADGE.includes(game.category)

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
      {/* Image area */}
      <div
        className="relative overflow-hidden"
        style={{
          height: 120,
          background: `linear-gradient(135deg, ${accent}28 0%, ${accent}0f 100%)`,
        }}
      >
        {/* Glow blob */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 60% 40%, ${accent}35, transparent 70%)` }}
        />
        {game.image && (
          <img
            src={getImageUrl(game.collectionId, game.id, game.image)}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-500"
          />
        )}

        {/* HOT badge */}
        {isHot && (
          <span
            className="absolute top-2.5 right-2.5 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider animate-badge-blink"
            style={{
              background: "rgba(239,68,68,0.9)",
              color: "#fff",
              backdropFilter: "blur(6px)",
              boxShadow: "0 0 12px rgba(239,68,68,0.6)",
            }}
          >
            🔥 HOT
          </span>
        )}

        {/* Shine sweep — handled by CSS .shine-card::after */}
      </div>

      {/* Info area */}
      <div
        className="p-3.5 transition-all duration-300"
        style={{ borderTop: `2px solid ${accent}` }}
      >
        <p className="text-white font-bold text-xs mb-0.5 truncate">{game.name}</p>

        {/* Limited stock badge */}
        {isLimited && (
          <span
            className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full mb-1.5"
            style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.25)" }}
          >
            ⚡ Stok Terbatas
          </span>
        )}

        {game.minPrice && (
          <p className="text-xs font-semibold mb-3" style={{ color: "#fbbf24" }}>
            Mulai {fmt(game.minPrice)}
          </p>
        )}

        <button
          onClick={e => { e.stopPropagation(); onClick() }}
          className="w-full text-white text-[11px] font-extrabold py-2.5 rounded-xl transition-all duration-200 active:scale-95 group-hover:shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
            boxShadow: `0 4px 12px ${accent}40`,
            transition: "box-shadow 0.3s ease",
          }}
        >
          Top Up ⚡
        </button>
      </div>
    </div>
  )
}

export default function TopUpGame() {
  const navigate = useNavigate()
  const [games,   setGames]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)
  const [showAll, setShowAll] = useState(false)

  const load = async () => {
    setLoading(true); setError(false)
    try {
      const products = await pb.collection("products").getFullList({
        filter: "type = 'game' && is_active = true",
        sort: "sort_order", requestKey: null,
      })
      const withPrice = await Promise.all(products.map(async (g) => {
        try {
          const pakets = await pb.collection("pakets").getFullList({
            filter: `product_id = "${g.id}" && is_active = true`,
            sort: "price", requestKey: null,
          })
          return { ...g, minPrice: pakets.length > 0 ? pakets[0].price : null }
        } catch { return { ...g, minPrice: null } }
      }))
      setGames(withPrice)
    } catch { setError(true) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return (
    <section className="px-4 md:px-8 lg:px-12 py-16">
      <div>
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <div
                className="w-1 h-7 rounded-full"
                style={{ background: "linear-gradient(180deg, #7c5cfc, #5b3fd4)" }}
              />
              <h2 className="font-syne font-extrabold text-2xl text-white tracking-tight">Top Up Game</h2>
              <span
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                style={{ background: "rgba(124,92,252,0.2)", color: "#a78bfa", border: "1px solid rgba(124,92,252,0.3)" }}
              >
                {games.length} GAME
              </span>
            </div>
            <p className="text-white/35 text-sm ml-4">Proses instan · Harga terbaik · Update tiap hari</p>
          </div>
          <button
            onClick={() => navigate("/topup")}
            className="text-sm font-semibold transition-colors hover:opacity-80 hidden sm:block"
            style={{ color: "#9b7ffe" }}
          >
            Lihat Semua →
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <SkeletonGrid count={12} cols="grid-cols-2 sm:grid-cols-3 md:grid-cols-6" />
        ) : error ? (
          <ErrorState message="Gagal memuat daftar game." onRetry={load} />
        ) : games.length === 0 ? (
          <EmptyState icon="🎮" title="Belum ada produk game" desc="Produk game akan segera tersedia" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {(showAll ? games : games.slice(0, 12)).map((game, i) => (
              <GameCard
                key={game.id}
                game={game}
                index={i}
                onClick={() => navigate(`/topup/${game.category}`)}
              />
            ))}
          </div>
        )}

        {!loading && !error && !showAll && games.length > 12 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(true)}
              className="px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-white/[0.05]"
              style={{ color: "#9b7ffe", border: "1px solid rgba(124,92,252,0.3)" }}
            >
              Tampilkan Semua {games.length} Game
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
