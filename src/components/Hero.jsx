import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import pb from "../lib/pb"
import { getImageUrl } from "../lib/products"

const GAME_COLORS = {
  "mobile-legends": "#1d4ed8",
  "free-fire":      "#ea580c",
  "pubg-mobile":    "#d97706",
  "honor-of-kings": "#059669",
  "genshin-impact": "#7c3aed",
  "arena-breakout": "#b91c1c",
  "youtube-premium":"#ff0000",
  "spotify-premium":"#1db954",
  "netflix-premium":"#e50914",
  "disney-plus":    "#0063e5",
  "canva-pro":      "#00c4cc",
  "chatgpt-plus":   "#10a37f",
}

function fmt(n) { return "Rp " + Number(n).toLocaleString("id-ID") }

export default function Hero() {
  const navigate = useNavigate()

  /* ── state ── */
  const [products,      setProducts]      = useState([])
  const [current,       setCurrent]       = useState(0)
  const [liveText,      setLiveText]      = useState(0)
  const [banners,       setBanners]       = useState([])
  const [bannerIdx,     setBannerIdx]     = useState(0)
  const [bannerVisible, setBannerVisible] = useState(true)
  const [cardVisible,   setCardVisible]   = useState(true)

  const liveActivities = [
    { user: "Rizky",  action: "top up", item: "112 Diamond ML" },
    { user: "Dewi",   action: "beli",   item: "Netflix Premium" },
    { user: "Bima",   action: "top up", item: "325 UC PUBG" },
    { user: "Siti",   action: "beli",   item: "Spotify Premium" },
    { user: "Andi",   action: "top up", item: "1450 Diamond FF" },
    { user: "Rini",   action: "beli",   item: "ChatGPT Plus" },
  ]

  /* ── live ticker ── */
  useEffect(() => {
    const t = setInterval(() => setLiveText(p => (p + 1) % liveActivities.length), 4000)
    return () => clearInterval(t)
  }, [])

  /* ── load banners ── */
  useEffect(() => {
    pb.collection("banners").getFullList({
      filter: "is_active = true", sort: "sort_order", requestKey: null,
    }).then(data => { if (data.length > 0) setBanners(data) }).catch(() => {})
  }, [])

  /* ── auto-rotate banner promo ── */
  useEffect(() => {
    if (banners.length < 2) return
    const t = setInterval(() => {
      setBannerVisible(false)
      setTimeout(() => { setBannerIdx(p => (p + 1) % banners.length); setBannerVisible(true) }, 420)
    }, 5000)
    return () => clearInterval(t)
  }, [banners])

  /* ── load products ── */
  useEffect(() => {
    const load = async () => {
      try {
        const prods = await pb.collection("products").getFullList({
          filter: "is_active = true", sort: "sort_order", requestKey: null,
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
      } catch {}
    }
    load()
  }, [])

  /* ── auto-slide products ── */
  useEffect(() => {
    if (products.length === 0) return
    const t = setInterval(() => {
      setCardVisible(false)
      setTimeout(() => { setCurrent(p => (p + 1) % products.length); setCardVisible(true) }, 380)
    }, 3200)
    return () => clearInterval(t)
  }, [products])

  const activeProd  = products[current]
  const accentColor = activeProd ? (GAME_COLORS[activeProd.category] || "#7c5cfc") : "#7c5cfc"
  const banner      = banners[bannerIdx]
  const nextProd    = products.length > 1 ? products[(current + 1) % products.length] : null
  const nextColor   = nextProd ? (GAME_COLORS[nextProd.category] || "#7c5cfc") : "#7c5cfc"

  return (
    <section
      className="relative overflow-hidden noise-overlay"
      style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center" }}
    >
      {/* ── Background ── */}
      <div className="absolute inset-0" style={{ background: "var(--color-bg)" }} />

      {/* Primary glow — follows accent color of active product */}
      <div
        className="absolute pointer-events-none transition-all"
        style={{
          width: "65%", height: "75%",
          top: "8%", left: "32%",
          background: `radial-gradient(ellipse at 50% 45%, ${accentColor}22 0%, transparent 65%)`,
          filter: "blur(2px)",
          transition: "background 1.2s ease",
        }}
      />
      {/* Purple base glow — always present */}
      <div
        className="absolute pointer-events-none animate-radial-breathe"
        style={{
          width: "60%", height: "70%",
          top: "10%", left: "35%",
          background: "radial-gradient(ellipse at 50% 45%, rgba(124,92,252,0.16) 0%, transparent 65%)",
        }}
      />
      {/* Left bleed */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "45%", height: "55%",
          top: "22%", left: "-4%",
          background: "radial-gradient(ellipse at 50% 50%, rgba(124,92,252,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(124,92,252,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,252,0.03) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 w-full px-4 md:px-8 lg:px-12 py-10 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">

        {/* ════ LEFT ════ */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 animate-fade-in-up glass-purple">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-badge-blink" />
            <span style={{ color: "#a78bfa" }}>Platform Top Up Terpercaya #1 Indonesia</span>
          </div>

          {/* Headline */}
          <h1
            className="font-syne font-extrabold leading-[1.05] tracking-tight mb-6 animate-fade-in-up delay-100"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
          >
            <span className="block text-white">Top Up Game &</span>
            <span
              className="block animate-gradient-flow"
              style={{
                backgroundImage: "linear-gradient(135deg, #e9d5ff, #a78bfa, #7c5cfc, #5b3fd4, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Produk Premium
            </span>
            <span
              className="block text-white/55 font-semibold mt-2"
              style={{ fontSize: "clamp(0.85rem, 1.8vw, 1.15rem)", letterSpacing: "0.07em" }}
            >
              INSTAN · TERMURAH · 100% AMAN
            </span>
          </h1>

          {/* Description */}
          <p
            className="text-white/48 leading-relaxed mb-10 max-w-[420px] animate-fade-in-up delay-200"
            style={{ fontSize: "1rem", color: "rgba(255,255,255,0.48)" }}
          >
            Top up favoritmu dalam hitungan menit. Harga selalu terbaik, sistem otomatis 24/7, setiap transaksi terjamin aman.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-3 mb-10 animate-fade-in-up delay-300">
            <button
              onClick={() => navigate("/topup")}
              className="animate-pulse-glow flex items-center gap-2.5 text-white font-bold px-8 py-4 rounded-2xl text-sm transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #7c5cfc, #5b3fd4)" }}
            >
              ⚡ Top Up Sekarang
            </button>
            <button
              onClick={() => navigate("/premium")}
              className="flex items-center gap-2.5 font-semibold px-8 py-4 rounded-2xl text-sm transition-all duration-200 hover:bg-white/[0.06] group"
              style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}
            >
              Lihat Premium
              <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">→</span>
            </button>
          </div>

          {/* Trust avatars */}
          <div className="flex items-center gap-4 animate-fade-in-up delay-400">
            <div className="flex -space-x-2">
              {["#7c5cfc","#5b3fd4","#3b82f6","#0ea5e9","#22c55e"].map((c,i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-[2.5px] flex items-center justify-center text-[10px] font-extrabold text-white select-none"
                  style={{ background: c, borderColor: "#080912" }}
                >
                  {["R","D","B","A","S"][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="text-white font-semibold text-sm">500K+ Pengguna Aktif</div>
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => <span key={i} style={{ color: "#fbbf24", fontSize: "0.7rem" }}>★</span>)}
                </div>
                <span className="text-white/35 text-xs">4.9 (2.500+ ulasan)</span>
              </div>
            </div>
          </div>

          {/* Live ticker */}
          <div
            className="flex items-center gap-3 mt-8 px-4 py-2.5 rounded-xl w-fit animate-fade-in-up delay-500"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-badge-blink" />
              <span className="text-emerald-400 text-[10px] font-bold tracking-widest">LIVE</span>
            </div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              <span className="text-white/80 font-semibold">{liveActivities[liveText].user}</span>
              {" "}baru saja {liveActivities[liveText].action}{" "}
              <span className="text-white/70 font-medium">{liveActivities[liveText].item}</span>
            </p>
          </div>
        </div>

        {/* ════ RIGHT — Banner Promo + Product Carousel ════ */}
        <div className="flex flex-col gap-3 animate-fade-in-up delay-200">

          {/* 1 ── Banner Promo iklan (fade in/out, auto-rotate) */}
          <div
            className="relative rounded-2xl overflow-hidden cursor-pointer shine-card h-48"
            style={{
              minHeight: 192,
              background: banner?.bg_color || "linear-gradient(135deg,#f59e0b,#ef4444,#ec4899)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
              opacity: bannerVisible ? 1 : 0,
              transform: bannerVisible ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.42s ease, transform 0.42s ease",
            }}
          >
            {/* Sheen overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 78% 40%, rgba(255,255,255,0.18), transparent 55%)" }}
            />
            {/* Image (if set in CMS) */}
            {banner?.image && (
              <img
                src={`https://yuzri-api.onrender.com/api/files/banners/${banner.id}/${banner.image}`}
                className="absolute inset-0 w-full h-full object-cover"
                alt={banner?.title}
              />
            )}
            {/* Text overlay */}
            <div className="absolute inset-0 flex flex-col justify-center px-5">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full text-white animate-badge-blink"
                  style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  🔥 PROMO
                </span>
                <span className="text-[10px] text-white/65 font-medium">{banner?.subtitle || "Hari Ini Saja!"}</span>
              </div>
              <h3 className="font-syne font-extrabold text-white text-xl leading-tight mb-1" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
                {banner?.title || "Diskon 20% Semua Top Up!"}
              </h3>
              <p className="text-white/65 text-xs">
                Gunakan kode:{" "}
                <span className="font-extrabold text-yellow-200">{banner?.code || "YUZRIID20"}</span>
              </p>
            </div>
            {/* Banner indicator dots */}
            {banners.length > 1 && (
              <div className="absolute bottom-2.5 right-3 flex gap-1">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setBannerVisible(false); setTimeout(() => { setBannerIdx(i); setBannerVisible(true) }, 300) }}
                    className="rounded-full transition-all duration-300"
                    style={{ width: i === bannerIdx ? 14 : 5, height: 5, background: i === bannerIdx ? "#fff" : "rgba(255,255,255,0.4)" }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 2 ── Active Product Card (big) */}
          {activeProd && (
            <div
              onClick={() => navigate(`/${activeProd.type === "game" ? "topup" : "premium"}/${activeProd.category}`)}
              className="relative rounded-2xl overflow-hidden cursor-pointer shine-card"
              style={{
                height: 196,
                background: `linear-gradient(135deg, ${accentColor}38, ${accentColor}14)`,
                border: `1px solid ${accentColor}45`,
                boxShadow: `0 16px 48px ${accentColor}28`,
                opacity: cardVisible ? 1 : 0,
                transform: cardVisible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.38s ease, transform 0.38s ease, background 0.8s ease, border-color 0.8s ease, box-shadow 0.8s ease",
              }}
            >
              {/* Radial glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 68% 50%, ${accentColor}50, transparent 65%)` }}
              />
              {/* Product image */}
              {activeProd.image && (
                <img
                  src={getImageUrl(activeProd.collectionId, activeProd.id, activeProd.image)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-44 object-contain drop-shadow-2xl"
                  style={{ filter: `drop-shadow(0 0 24px ${accentColor}55)`, transition: "filter 0.8s ease" }}
                  alt={activeProd.name}
                />
              )}
              {/* Text */}
              <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-full mb-3 text-white"
                  style={{ background: accentColor, boxShadow: `0 4px 14px ${accentColor}55` }}
                >
                  {activeProd.type === "game" ? "🎮 TOP UP" : "💎 PREMIUM"}
                </span>
                <h3 className="font-syne font-extrabold text-white text-2xl leading-tight mb-1">{activeProd.name}</h3>
                {activeProd.description && (
                  <p className="text-white/45 text-xs mb-2.5 max-w-[155px] leading-relaxed line-clamp-2">{activeProd.description}</p>
                )}
                {activeProd.minPrice && (
                  <p className="text-white font-bold text-sm">
                    Mulai <span style={{ color: "#fbbf24", fontSize: "1.05em" }}>{fmt(activeProd.minPrice)}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 3 ── Next Product Preview (small) */}
          {nextProd && (
            <div
              onClick={() => navigate(`/${nextProd.type === "game" ? "topup" : "premium"}/${nextProd.category}`)}
              className="relative rounded-2xl overflow-hidden cursor-pointer shine-card"
              style={{
                height: 120,
                background: `linear-gradient(135deg, ${nextColor}28, ${nextColor}0d)`,
                border: `1px solid ${nextColor}35`,
                opacity: 0.82,
                transition: "background 0.8s ease, border-color 0.8s ease, opacity 0.3s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "1"}
              onMouseLeave={e => e.currentTarget.style.opacity = "0.82"}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 72% 50%, ${nextColor}38, transparent 65%)` }}
              />
              {nextProd.image && (
                <img
                  src={getImageUrl(nextProd.collectionId, nextProd.id, nextProd.image)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-24 object-contain drop-shadow-xl"
                  alt={nextProd.name}
                />
              )}
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                <span
                  className="inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-full mb-1.5 text-white"
                  style={{ background: nextColor }}
                >
                  {nextProd.type === "game" ? "🎮" : "💎"} SELANJUTNYA
                </span>
                <h3 className="font-syne font-extrabold text-white text-base leading-tight">{nextProd.name}</h3>
                {nextProd.minPrice && (
                  <p className="text-white/60 text-xs mt-0.5">
                    Mulai <span style={{ color: "#fbbf24" }}>{fmt(nextProd.minPrice)}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 4 ── Live activity ticker */}
          <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
            style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)" }}
          >
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-badge-blink" />
              <span className="text-emerald-400 text-[10px] font-bold tracking-widest">LIVE</span>
            </div>
            <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.5)" }}>
              <span className="text-white/80 font-semibold">{liveActivities[liveText].user}</span>
              {" "}baru saja {liveActivities[liveText].action}{" "}
              <span className="text-white/70 font-medium">{liveActivities[liveText].item}</span>
            </p>
          </div>

          {/* 5 ── Carousel dots */}
          {products.length > 1 && (
            <div className="flex gap-1.5 justify-center pt-0.5">
              {products.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCardVisible(false); setTimeout(() => { setCurrent(i); setCardVisible(true) }, 320) }}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? 20 : 6,
                    height: 6,
                    background: i === current ? accentColor : "rgba(255,255,255,0.2)",
                    boxShadow: i === current ? `0 0 8px ${accentColor}80` : "none",
                  }}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
