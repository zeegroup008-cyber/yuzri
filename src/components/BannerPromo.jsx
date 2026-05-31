import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import pb from "../lib/pb"
import { getImageUrl } from "../lib/products"

export default function BannerPromo() {
  const navigate = useNavigate()
  const [promos, setPromos] = useState([])
  const [productImages, setProductImages] = useState({})

  useEffect(() => {
    pb.collection("promos").getFullList({
      filter: "is_active = true", sort: "sort_order", requestKey: null,
    }).then(data => setPromos(data)).catch(() => {})

    pb.collection("products").getFullList({
      filter: "is_active = true", requestKey: null,
    }).then(prods => {
      const imgMap = {}
      prods.forEach(p => { imgMap[p.category] = p })
      setProductImages(imgMap)
    }).catch(() => {})
  }, [])

  if (promos.length === 0) return null

  return (
    <section className="px-4 md:px-8 lg:px-12 py-12">
      <div>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-syne font-bold text-2xl text-[var(--color-text)]">Promo & Flash Sale</h2>
            <p className="text-white/40 text-sm mt-1">Penawaran terbatas, update setiap hari</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Update live
          </span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {promos.map((p) => {
            const prod = productImages[p.category]
            return (
              <div key={p.id}
                onClick={() => navigate(p.link)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: `linear-gradient(135deg,${p.from_color},${p.to_color})`,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.35)`,
                  minHeight: 200,
                }}>
                {prod?.image && (
                  <img
                    src={getImageUrl(prod.collectionId, prod.id, prod.image)}
                    className="absolute right-0 top-0 h-full w-40 object-cover object-center opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                  />
                )}
                <div className="absolute inset-0" style={{
                  background: `linear-gradient(90deg, ${p.from_color}ff 45%, ${p.from_color}99 70%, transparent 100%)`
                }} />
                <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at 20% 20%,rgba(255,255,255,0.12),transparent 60%)"}} />
                <div className="relative z-10 p-6">
                  <span className="inline-flex items-center text-[10px] font-extrabold px-3 py-1 rounded-full text-white tracking-wider mb-3"
                    style={{background:p.badge_color,boxShadow:`0 4px 12px ${p.badge_color}50`}}>
                    {p.badge}
                  </span>
                  <p className="text-white/70 text-xs font-medium mb-1.5">{p.tag}</p>
                  <h3 className="font-syne font-bold text-white text-lg leading-snug mb-2 drop-shadow-lg">{p.title}</h3>
                  <p className="text-white/60 text-xs mb-5 leading-relaxed">{p.desc}</p>
                  <button className="flex items-center gap-2 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-200 group-hover:scale-105"
                    style={{background:"rgba(255,255,255,0.2)",backdropFilter:"blur(8px)"}}>
                    {p.cta}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
