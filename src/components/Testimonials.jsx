import { useEffect, useRef, useState } from "react"

const REVIEWS = [
  {
    initials: "RP",
    name: "Rizky Pratama",
    location: "Jakarta",
    time: "2 jam lalu",
    stars: 5,
    text: "Proses cepat banget, 1 menit langsung masuk. Sudah 20+ transaksi di sini, tidak pernah gagal sekalipun!",
    transaksi: "23 transaksi",
    color: "#7c5cfc",
    product: "Mobile Legends",
    productIcon: "🎮",
    verified: true,
  },
  {
    initials: "DL",
    name: "Dewi Lestari",
    location: "Surabaya",
    time: "5 jam lalu",
    stars: 5,
    text: "Harga paling murah dibanding tempat lain, pelayanan CS ramah & responsif. Langganan terus deh!",
    transaksi: "11 transaksi",
    color: "#3b82f6",
    product: "Netflix Premium",
    productIcon: "🎬",
    verified: true,
  },
  {
    initials: "BA",
    name: "Bima Anggara",
    location: "Bandung",
    time: "1 hari lalu",
    stars: 5,
    text: "Langganan tiap bulan untuk ML dan Netflix. YuzriID selalu memuaskan, ga pernah nyoba pindah.",
    transaksi: "47 transaksi",
    color: "#ef4444",
    product: "Multi-produk",
    productIcon: "⚡",
    verified: true,
  },
  {
    initials: "SA",
    name: "Siti Aisyah",
    location: "Medan",
    time: "2 hari lalu",
    stars: 5,
    text: "Spotify langganan bulanan di sini terus. Harga murah, proses cepat, dan aman. Recommended banget!",
    transaksi: "8 transaksi",
    color: "#22c55e",
    product: "Spotify Premium",
    productIcon: "🎵",
    verified: true,
  },
]

function Avatar({ initials, color, size = 44 }) {
  return (
    <div
      className="flex-shrink-0 flex items-center justify-center rounded-full font-extrabold text-white select-none"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 30%, ${color}dd, ${color})`,
        boxShadow: `0 4px 16px ${color}40, inset 0 1px 0 rgba(255,255,255,0.3)`,
        fontSize: size * 0.33,
      }}
    >
      {initials}
    </div>
  )
}

function ReviewCard({ r, index }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="relative rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s, box-shadow 0.3s ease`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
      }}
    >
      {/* Decorative quote */}
      <div
        className="absolute top-3 right-4 font-syne font-extrabold select-none pointer-events-none"
        style={{ fontSize: "5rem", lineHeight: 1, color: "rgba(124,92,252,0.06)" }}
      >
        "
      </div>

      {/* Stars */}
      <div className="flex items-center gap-1">
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{ color: "#fbbf24", fontSize: "0.85rem" }}>★</span>
        ))}
        <span
          className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}
        >
          5.0
        </span>
      </div>

      {/* Review text */}
      <p className="text-sm leading-relaxed flex-1 relative z-10" style={{ color: "rgba(255,255,255,0.72)" }}>
        "{r.text}"
      </p>

      {/* Product pill */}
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full w-fit text-[10px] font-semibold"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
      >
        <span>{r.productIcon}</span> {r.product}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <Avatar initials={r.initials} color={r.color} size={40} />
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-white text-sm font-semibold leading-none">{r.name}</p>
              {r.verified && (
                <span
                  className="flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: "rgba(124,92,252,0.2)", color: "#a78bfa" }}
                >
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              {r.location} · {r.time}
            </p>
          </div>
        </div>
        <span
          className="text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: "rgba(124,92,252,0.15)", color: "#9b7ffe", border: "1px solid rgba(124,92,252,0.2)" }}
        >
          {r.transaksi}
        </span>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const headerRef = useRef(null)
  const [headerVisible, setHeaderVisible] = useState(false)

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHeaderVisible(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="px-4 md:px-8 lg:px-12 py-20" style={{ background: "var(--color-bg)" }}>
      <div>

        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-14 transition-all duration-700"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
            style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", color: "#fbbf24" }}
          >
            ⭐ Dipercaya Ribuan Pelanggan
          </div>
          <h2
            className="font-syne font-extrabold text-white mb-3"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}
          >
            Kata Mereka Tentang YuzriID
          </h2>
          <p className="text-white/40 text-sm max-w-sm mx-auto">
            500K+ pengguna aktif. Ribuan transaksi sukses setiap harinya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-start">

          {/* Score card */}
          <div
            className="md:col-span-1 rounded-2xl p-6 flex flex-col justify-between transition-all duration-700"
            style={{
              background: "linear-gradient(135deg, rgba(0,182,122,0.1), rgba(0,182,122,0.04))",
              border: "1px solid rgba(0,182,122,0.18)",
              backdropFilter: "blur(8px)",
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
            }}
          >
            <div>
              <div className="text-xs font-semibold mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                Rating Keseluruhan
              </div>
              <div
                className="font-syne font-extrabold text-white mb-1 animate-count-pulse"
                style={{ fontSize: "3.8rem", lineHeight: 1 }}
              >
                4.9
              </div>
              <div className="flex gap-0.5 mb-2">
                {[1,2,3,4,5].map(i => (
                  <span key={i} style={{ color: "#00b67a", fontSize: "1.25rem" }}>★</span>
                ))}
              </div>
              <div className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>
                Dari 2.500+ ulasan terverifikasi
              </div>

              {/* Rating bar chart */}
              <div className="space-y-1.5">
                {[
                  { star: 5, pct: 82 },
                  { star: 4, pct: 12 },
                  { star: 3, pct: 4  },
                  { star: 2, pct: 1  },
                  { star: 1, pct: 1  },
                ].map(({ star, pct }) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-[10px] text-white/35 w-2.5">{star}</span>
                    <div
                      className="flex-1 h-1.5 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.07)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: "#00b67a",
                          transition: "width 1.2s ease 0.5s",
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-white/25 w-6 text-right">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-1.5 font-bold text-sm" style={{ color: "#00b67a" }}>
              ★ Trustpilot
            </div>
          </div>

          {/* Review cards */}
          <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REVIEWS.map((r, i) => (
              <ReviewCard key={r.name} r={r} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
