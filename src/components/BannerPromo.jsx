import { useNavigate } from "react-router-dom"

const PROMOS = [
  {
    id: 1,
    badge: "PROMO",
    badgeColor: "#f59e0b",
    tag: "🔥 Flash Terbatas",
    title: "Diskon 20% Top Up Mobile Legends",
    desc: "Min. 56 Diamond. Berlaku hari ini.",
    cta: "Klaim Sekarang",
    link: "/topup/mobile-legends",
    from: "#1d4ed8",
    to: "#312e81",
  },
  {
    id: 2,
    badge: "FLASH SALE",
    badgeColor: "#ef4444",
    tag: "⚡ Penawaran Spesial",
    title: "Netflix Premium 1 Bulan Rp 25.000",
    desc: "Hemat Rp 3.000 dari harga normal. Stok terbatas.",
    cta: "Beli Sekarang",
    link: "/premium/netflix-premium",
    from: "#e50914",
    to: "#1a1a2e",
  },
  {
    id: 3,
    badge: "BONUS",
    badgeColor: "#10b981",
    tag: "🎁 Bonus Eksklusif",
    title: "PUBG Mobile Top Up, Gratis 60 UC",
    desc: "Untuk pembelian 325 UC ke atas.",
    cta: "Top Up Sekarang",
    link: "/topup/pubg-mobile",
    from: "#d97706",
    to: "#1c1917",
  },
]

export default function BannerPromo() {
  const navigate = useNavigate()

  return (
    <section className="px-4 md:px-8 lg:px-12 py-12">
      <div>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-syne font-bold text-2xl text-white">Promo & Flash Sale</h2>
            <p className="text-white/40 text-sm mt-1">Penawaran terbatas, update setiap hari</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Update live
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {PROMOS.map((p) => (
            <div key={p.id}
              onClick={() => navigate(p.link)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
              style={{
                background:`linear-gradient(135deg,${p.from},${p.to})`,
                boxShadow:`0 8px 32px rgba(0,0,0,0.35)`,
              }}>
              <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at 85% 15%,rgba(255,255,255,0.12),transparent 50%)"}} />
              <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full blur-[50px]"
                style={{background:p.from,opacity:0.3}} />

              <div className="relative p-6">
                {/* Badge */}
                <span className="inline-flex items-center text-[10px] font-extrabold px-3 py-1 rounded-full text-white tracking-wider mb-3"
                  style={{background:p.badgeColor,boxShadow:`0 4px 12px ${p.badgeColor}50`}}>
                  {p.badge}
                </span>

                <p className="text-white/60 text-xs font-medium mb-1.5">{p.tag}</p>
                <h3 className="font-syne font-bold text-white text-lg leading-snug mb-2">{p.title}</h3>
                <p className="text-white/50 text-xs mb-5 leading-relaxed">{p.desc}</p>

                <button className="flex items-center gap-2 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-200 group-hover:scale-105"
                  style={{background:"rgba(255,255,255,0.2)",backdropFilter:"blur(8px)"}}>
                  {p.cta}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
