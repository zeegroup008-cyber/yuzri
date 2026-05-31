const FEATURES = [
  {
    number: "01",
    icon: "💰",
    title: "Harga Termurah",
    desc: "Jaminan harga kompetitif setiap hari. Refund penuh jika ada yang lebih murah.",
    color: "#f59e0b",
    stat: "Hemat s/d 30%",
  },
  {
    number: "02",
    icon: "⚡",
    title: "Proses Instan",
    desc: "Langsung masuk dalam 1–5 menit, sistem otomatis 24 jam nonstop.",
    color: "#7c5cfc",
    stat: "< 5 Menit",
  },
  {
    number: "03",
    icon: "🛡️",
    title: "100% Aman",
    desc: "Keamanan berlapis, data terenkripsi, dan ribuan transaksi terbukti aman.",
    color: "#22c55e",
    stat: "0 Kasus Fraud",
  },
  {
    number: "04",
    icon: "💬",
    title: "CS Siap 24/7",
    desc: "Tim support kami responsif, ramah, dan siap membantu kapanpun.",
    color: "#3b82f6",
    stat: "< 3 Mnt Respons",
  },
  {
    number: "05",
    icon: "🔄",
    title: "Selalu Update",
    desc: "Ratusan game & layanan premium selalu tersedia dan up-to-date.",
    color: "#ec4899",
    stat: "100+ Produk",
  },
]

export default function WhyYuzri() {
  return (
    <section className="px-4 md:px-8 lg:px-12 py-20" style={{background:"var(--color-bg)"}}>
      <div>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
            style={{background:"rgba(124,92,252,0.1)",border:"1px solid rgba(124,92,252,0.25)",color:"#a78bfa"}}>
            ✨ Kenapa Ribuan Orang Pilih YuzriID
          </div>
          <h2 className="font-syne font-extrabold mb-4 text-[var(--color-text)]" style={{fontSize:"clamp(1.8rem,3.5vw,2.8rem)"}}>
            Bukan Sekadar Platform<br />
            <span style={{background:"linear-gradient(135deg,#c4b5fd,#7c5cfc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              Top Up Biasa
            </span>
          </h2>
          <p className="text-white/40 max-w-lg mx-auto" style={{fontSize:"0.95rem"}}>
            Kami membangun standar baru untuk pengalaman top up game dan produk premium di Indonesia.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {FEATURES.map((f) => (
            <div key={f.number}
              className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{
                background:"var(--card-bg)",
                border:"1px solid var(--card-border)",
              }}>
              {/* Top row */}
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{background:`${f.color}18`,border:`1px solid ${f.color}30`}}>
                  {f.icon}
                </div>
                <span className="font-syne font-extrabold text-3xl leading-none"
                  style={{color:`${f.color}20`,fontVariantNumeric:"tabular-nums"}}>
                  {f.number}
                </span>
              </div>

              <h3 className="font-bold text-sm text-[var(--color-text)] mb-2">{f.title}</h3>
              <p className="text-xs leading-relaxed mb-4 text-white/40">{f.desc}</p>

              {/* Stat chip */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold"
                style={{background:`${f.color}15`,color:f.color}}>
                <span className="w-1 h-1 rounded-full" style={{background:f.color}} />
                {f.stat}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-12 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{background:"linear-gradient(135deg,rgba(124,92,252,0.12),rgba(124,92,252,0.06))",border:"1px solid rgba(124,92,252,0.2)"}}>
          <div>
            <h3 className="font-syne font-bold text-xl text-[var(--color-text)] mb-1">Siap memulai?</h3>
            <p className="text-white/40 text-sm">Bergabung dengan 500K+ pengguna aktif di seluruh Indonesia</p>
          </div>
          <div className="flex gap-3">
            <a href="/topup" className="px-6 py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 no-underline"
              style={{background:"linear-gradient(135deg,#7c5cfc,#5b3fd4)",boxShadow:"0 8px 24px rgba(124,92,252,0.35)"}}>
              Top Up Sekarang ⚡
            </a>
            <a href="/premium" className="px-6 py-3 rounded-xl text-white/70 hover:text-white text-sm font-semibold transition-all no-underline"
              style={{border:"1px solid rgba(255,255,255,0.12)"}}>
              Lihat Premium
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
