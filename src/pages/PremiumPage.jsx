import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import pb from "../lib/pb"
import { getImageUrl } from "../lib/products"

const PREMIUM_COLORS = {
  "youtube-premium":  { color: "#ff0000", bg: "rgba(255,0,0,0.15)" },
  "spotify-premium":  { color: "#1db954", bg: "rgba(29,185,84,0.15)" },
  "netflix-premium":  { color: "#e50914", bg: "rgba(229,9,20,0.15)" },
  "disney-plus":      { color: "#0063e5", bg: "rgba(0,99,229,0.15)" },
  "canva-pro":        { color: "#00c4cc", bg: "rgba(0,196,204,0.15)" },
  "chatgpt-plus":     { color: "#10a37f", bg: "rgba(16,163,127,0.15)" },
  "telegram-premium": { color: "#2AABEE", bg: "rgba(42,171,238,0.15)" },
  "claude-pro":       { color: "#cc785c", bg: "rgba(204,120,92,0.15)" },
  "google-one":       { color: "#4285f4", bg: "rgba(66,133,244,0.15)" },
  "icloud-plus":      { color: "#3693f3", bg: "rgba(54,147,243,0.15)" },
  "microsoft-365":    { color: "#f25022", bg: "rgba(242,80,34,0.15)" },
  "adobe-creative":   { color: "#ff0000", bg: "rgba(255,0,0,0.15)" },
  "duolingo-plus":    { color: "#58cc02", bg: "rgba(88,204,2,0.15)" },
  "capcut-pro":       { color: "#000000", bg: "rgba(255,255,255,0.05)" },
}

function fmt(n) { return "Rp " + Number(n).toLocaleString("id-ID") }

export default function PremiumPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const prods = await pb.collection("products").getFullList({
        filter: "type = 'premium' && is_active = true",
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
      <h1 className="font-syne font-bold text-3xl text-[var(--color-text)] mb-2">Layanan Premium</h1>
      <p className="text-[#8888aa] mb-8">Aktivasi instan ke email kamu.</p>
      {loading ? (
        <div className="text-[#8888aa] text-sm">Memuat produk...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {products.map((p) => {
            const colors = PREMIUM_COLORS[p.category] || { color: "#7c5cfc", bg: "rgba(124,92,252,0.15)" }
            return (
              <div key={p.id} onClick={() => navigate(`/premium/${p.category}`)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
                style={{background:"#181929",border:"1px solid rgba(255,255,255,0.07)",boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>
                <div className="relative h-32 overflow-hidden" style={{background:colors.bg}}>
                  {p.image ? (
                    <img src={getImageUrl(p.collectionId, p.id, p.image)}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-white"
                      style={{background:colors.color}}>
                      {p.name[0]}
                    </div>
                  )}
                </div>
                <div className="p-3" style={{borderTop:`2px solid ${colors.color}`}}>
                  <p className="text-[var(--color-text)] font-bold text-xs mb-0.5 truncate">{p.name}</p>
                  {p.minPrice && (
                    <p className="text-xs font-bold mb-2" style={{color:"#f59e0b"}}>Mulai {fmt(p.minPrice)}</p>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/premium/${p.category}`) }}
                    className="w-full text-white text-xs font-bold py-2 rounded-lg transition-all"
                    style={{background:colors.color}}>
                    Beli Sekarang
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
