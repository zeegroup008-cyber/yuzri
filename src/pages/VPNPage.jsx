import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import pb from "../lib/pb"
import { getImageUrl } from "../lib/products"

const VPN_COLORS = {
  "nordvpn":     { color: "#4687ff", bg: "rgba(70,135,255,0.15)" },
  "expressvpn":  { color: "#da3940", bg: "rgba(218,57,64,0.15)" },
  "surfshark":   { color: "#1dbcd6", bg: "rgba(29,188,214,0.15)" },
  "cyberghost":  { color: "#f8a600", bg: "rgba(248,166,0,0.15)" },
  "ipvanish":    { color: "#6bc44a", bg: "rgba(107,196,74,0.15)" },
  "protonvpn":   { color: "#6d4aff", bg: "rgba(109,74,255,0.15)" },
}

function fmt(n) { return "Rp " + Number(n).toLocaleString("id-ID") }

export default function VPNPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const prods = await pb.collection("products").getFullList({
        filter: "type = 'vpn' && is_active = true",
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
      <h1 className="font-syne font-bold text-3xl text-white mb-2">VPN Premium</h1>
      <p className="text-[#8888aa] mb-8">Akses internet aman dan tanpa batas dengan VPN terpercaya.</p>
      {loading ? (
        <div className="text-[#8888aa] text-sm">Memuat produk...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {products.map((p) => {
            const colors = VPN_COLORS[p.category] || { color: "#7c5cfc", bg: "rgba(124,92,252,0.15)" }
            return (
              <div key={p.id} onClick={() => navigate(`/vpn/${p.category}`)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
                style={{ background: "#181929", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
                <div className="relative h-32 overflow-hidden" style={{ background: colors.bg }}>
                  {p.image ? (
                    <img src={getImageUrl(p.collectionId, p.id, p.image)}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold text-white"
                      style={{ background: colors.color }}>
                      {p.name[0]}
                    </div>
                  )}
                </div>
                <div className="p-3" style={{ borderTop: `2px solid ${colors.color}` }}>
                  <p className="text-white font-bold text-xs mb-0.5 truncate">{p.name}</p>
                  {p.minPrice && (
                    <p className="text-xs font-bold mb-2" style={{ color: "#f59e0b" }}>Mulai {fmt(p.minPrice)}</p>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/vpn/${p.category}`) }}
                    className="w-full text-white text-xs font-bold py-2 rounded-lg transition-all"
                    style={{ background: colors.color }}>
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
