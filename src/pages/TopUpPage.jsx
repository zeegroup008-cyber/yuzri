import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import pb from "../lib/pb"
import { getImageUrl } from "../lib/products"

const GAME_COLORS = {
  "mobile-legends": { accent: "#1d4ed8" },
  "free-fire":      { accent: "#ea580c" },
  "pubg-mobile":    { accent: "#d97706" },
  "honor-of-kings": { accent: "#059669" },
  "genshin-impact": { accent: "#7c3aed" },
  "arena-breakout": { accent: "#b91c1c" },
}

function fmt(n) { return "Rp " + Number(n).toLocaleString("id-ID") }

export default function TopUpPage() {
  const navigate = useNavigate()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
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
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="px-4 md:px-8 lg:px-12 py-12">
      <h1 className="font-syne font-bold text-3xl text-[var(--color-text)] mb-2">Top Up Game</h1>
      <p className="text-[#8888aa] mb-8">Pilih game favorit kamu dan top up sekarang.</p>
      {loading ? (
        <div className="text-[#8888aa] text-sm">Memuat produk...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {games.map((game) => {
            const colors = GAME_COLORS[game.category] || { accent: "#7c5cfc" }
            return (
              <div key={game.id} onClick={() => navigate(`/topup/${game.category}`)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
                style={{boxShadow:"0 8px 32px rgba(0,0,0,0.4)"}}>
                <div className="relative h-32 overflow-hidden" style={{background:"#1a1b2e"}}>
                  {game.image && (
                    <img src={getImageUrl(game.collectionId, game.id, game.image)}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  )}
                  <div className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/20 text-white">HOT</div>
                </div>
                <div className="p-3" style={{background:"#181929",borderTop:`2px solid ${colors.accent}`}}>
                  <p className="text-[var(--color-text)] font-bold text-xs mb-0.5 truncate">{game.name}</p>
                  {game.minPrice && (
                    <p className="text-xs font-bold mb-2" style={{color:"#f59e0b"}}>Mulai {fmt(game.minPrice)}</p>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/topup/${game.category}`) }}
                    className="w-full text-white text-xs font-bold py-2 rounded-lg transition-all"
                    style={{background:`linear-gradient(135deg,${colors.accent},${colors.accent}bb)`}}>
                    Top Up ?
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
