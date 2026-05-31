import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import pb from "../lib/pb"
import { getImageUrl } from "../lib/products"

const VOUCHER_COLORS = {
  "roblox":           { accent: "#e53935" },
  "valorant":         { accent: "#ff4655" },
  "minecraft":        { accent: "#5c8a1e" },
  "fortnite":         { accent: "#00d1f7" },
  "point-blank":      { accent: "#f59e0b" },
  "ragnarok-origin":  { accent: "#0063d4" },
}

function fmt(n) { return "Rp " + Number(n).toLocaleString("id-ID") }

export default function VoucherPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
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
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="px-4 md:px-8 lg:px-12 py-12">
      <h1 className="font-syne font-bold text-3xl text-[var(--color-text)] mb-2">Voucher Game</h1>
      <p className="text-[#8888aa] mb-8">Voucher Roblox, Valorant, dan game favorit kamu lainnya.</p>
      {loading ? (
        <div className="text-[#8888aa] text-sm">Memuat produk...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {products.map((p) => {
            const colors = VOUCHER_COLORS[p.category] || { accent: "#7c5cfc" }
            return (
              <div key={p.id} onClick={() => navigate(`/voucher/${p.category}`)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
                style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                <div className="relative h-32 overflow-hidden" style={{ background: "#1a1b2e" }}>
                  {p.image ? (
                    <img src={getImageUrl(p.collectionId, p.id, p.image)}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold"
                      style={{ background: colors.accent + "33", color: colors.accent }}>
                      {p.name[0]}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/20 text-white">NEW</div>
                </div>
                <div className="p-3" style={{ background: "#181929", borderTop: `2px solid ${colors.accent}` }}>
                  <p className="text-[var(--color-text)] font-bold text-xs mb-0.5 truncate">{p.name}</p>
                  {p.minPrice && (
                    <p className="text-xs font-bold mb-2" style={{ color: "#f59e0b" }}>Mulai {fmt(p.minPrice)}</p>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/voucher/${p.category}`) }}
                    className="w-full text-white text-xs font-bold py-2 rounded-lg transition-all"
                    style={{ background: `linear-gradient(135deg,${colors.accent},${colors.accent}bb)` }}>
                    Beli Voucher
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
