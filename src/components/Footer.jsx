import { useState } from "react"
import { Link } from "react-router-dom"

const PAYMENT_METHODS = [
  { label: "QRIS",    bg: "#ffffff", fg: "#000000" },
  { label: "GoPay",   bg: "#00AED6", fg: "#ffffff" },
  { label: "OVO",     bg: "#4C3494", fg: "#ffffff" },
  { label: "Dana",    bg: "#118EEA", fg: "#ffffff" },
  { label: "ShopeePay", bg: "#FF5722", fg: "#ffffff" },
  { label: "BCA",     bg: "#005BAA", fg: "#ffffff" },
  { label: "Mandiri", bg: "#003D79", fg: "#ffd700" },
  { label: "BRI",     bg: "#00529B", fg: "#ffffff" },
  { label: "BNI",     bg: "#F47920", fg: "#ffffff" },
  { label: "BSI",     bg: "#00703C", fg: "#ffffff" },
]

const footerLinks = {
  Produk: [
    { label: "Top Up Game",   to: "/topup" },
    { label: "Akun Premium",  to: "/premium" },
    { label: "Voucher",       to: "/saldo" },
    { label: "Flash Sale",    to: "/" },
  ],
  Bantuan: [
    { label: "Cara Top Up",   to: "/cara-pembayaran" },
    { label: "Cara Bayar",    to: "/cara-pembayaran" },
    { label: "FAQ",           to: "/cara-pembayaran" },
    { label: "Cek Status",    to: "/riwayat" },
  ],
  Perusahaan: [
    { label: "Tentang Kami",        to: "/tentang-kami" },
    { label: "Syarat & Ketentuan",  to: "/tentang-kami" },
    { label: "Kebijakan Privasi",   to: "/tentang-kami" },
    { label: "Hubungi Kami",        to: "/hubungi-kami" },
  ],
}

const SOCIALS = [
  { icon: "💬", label: "WhatsApp",  color: "#25D366", href: "#" },
  { icon: "✈️", label: "Telegram",  color: "#2AABEE", href: "#" },
  { icon: "📸", label: "Instagram", color: "#E1306C", href: "#" },
  { icon: "🎵", label: "TikTok",    color: "#ffffff", href: "#" },
]

const TRUST_BADGES = [
  { icon: "🔒", label: "SSL Aman",        sub: "Enkripsi 256-bit" },
  { icon: "✅", label: "Transaksi Aman",  sub: "100% terjamin" },
  { icon: "⚡", label: "Server 99.9%",    sub: "Uptime dijamin" },
]

export default function Footer() {
  const [email, setEmail] = useState("")
  const [subbed, setSubbed] = useState(false)

  const handleSub = (e) => {
    e.preventDefault()
    if (email.includes("@")) { setSubbed(true); setEmail("") }
  }

  return (
    <footer style={{ background: "var(--color-bg)", borderTop: "1px solid var(--color-border)" }}>

      {/* Trust strip */}
      <div style={{ borderBottom: "1px solid var(--color-border)", background: "rgba(124,92,252,0.04)" }}>
        <div className="px-4 md:px-8 lg:px-12 py-4 flex flex-wrap items-center justify-center gap-8 md:justify-between">
          {TRUST_BADGES.map(b => (
            <div key={b.label} className="flex items-center gap-2.5">
              <span className="text-lg">{b.icon}</span>
              <div>
                <div className="text-xs font-bold text-white">{b.label}</div>
                <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>{b.sub}</div>
              </div>
            </div>
          ))}

          {/* Mini newsletter */}
          <form onSubmit={handleSub} className="flex items-center gap-2 flex-shrink-0">
            {subbed ? (
              <span className="text-xs font-semibold" style={{ color: "#22c55e" }}>✓ Berhasil! Promo dikirim ke email.</span>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email untuk promo eksklusif"
                  className="text-xs px-4 py-2 rounded-xl outline-none text-[var(--color-text)] placeholder:text-muted w-[200px]"
                  style={{ background: "var(--input-bg)", border: "1px solid var(--color-border)" }}
                  onFocus={e => e.target.style.borderColor = "rgba(124,92,252,0.5)"}
                  onBlur={e => e.target.style.borderColor = "var(--color-border)"}
                />
                <button
                  type="submit"
                  className="text-xs font-bold px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #7c5cfc, #5b3fd4)" }}
                >
                  Berlangganan
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 py-14">

          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 no-underline mb-4">
              <img src="/vacicon.png" alt="Y" className="w-10 h-10 object-contain" />
              <span className="text-white font-extrabold text-2xl tracking-widest font-syne">
                Yuzri<span style={{color:"#9b7ffe"}}>ID</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed mb-5 max-w-[220px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              Platform Top Up Game & Akun Premium terpercaya di Indonesia. Harga terbaik, proses instan.
            </p>

            {/* Social icons */}
            <div className="flex gap-2 mb-5">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="group w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all duration-200 no-underline"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${s.color}20`
                    e.currentTarget.style.borderColor = `${s.color}50`
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = `0 4px 16px ${s.color}30`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)"
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
                    e.currentTarget.style.transform = "none"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Trust badge */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl w-fit"
              style={{ background: "rgba(124,92,252,0.1)", border: "1px solid rgba(124,92,252,0.2)" }}
            >
              <span style={{ color: "#22c55e", fontSize: "0.7rem", fontWeight: 700 }}>✓</span>
              <span className="text-xs font-semibold" style={{ color: "#a78bfa" }}>Platform Terpercaya #1</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-extrabold text-white mb-4 tracking-widest uppercase">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-xs transition-all duration-200 no-underline hover:text-white hover:translate-x-0.5 inline-block"
                      style={{ color: "rgba(255,255,255,0.38)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-xs font-extrabold text-white mb-4 tracking-widest uppercase">Kontak</h4>
            <div className="space-y-3">
              {[
                { icon: "💬", text: "Live Chat 24/7",       sub: "Respon cepat",       color: "#22c55e" },
                { icon: "✈️", text: "@yuzriid_support",       sub: "Telegram",           color: "#2AABEE" },
                { icon: "✉️", text: "support@yuzriid.store",  sub: "Email",              color: "#7c5cfc" },
              ].map(c => (
                <div key={c.text} className="flex items-start gap-2.5 group cursor-pointer">
                  <span className="text-sm mt-0.5 flex-shrink-0">{c.icon}</span>
                  <div>
                    <div
                      className="text-xs font-medium transition-colors"
                      style={{ color: "rgba(255,255,255,0.65)" }}
                    >
                      {c.text}
                    </div>
                    <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="py-6" style={{ borderTop: "1px solid var(--color-border)" }}>
          <p className="text-[10px] font-bold mb-4 tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>
            Metode Pembayaran yang Diterima
          </p>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map(pm => (
              <div
                key={pm.label}
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-default select-none transition-transform duration-200 hover:-translate-y-0.5"
                style={{ background: pm.bg, color: pm.fg, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
              >
                {pm.label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.28)" }}>
            © 2025 YuzriID. Hak cipta dilindungi.
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.18)" }}>
            Platform Top Up Game & Premium Terpercaya di Indonesia
          </p>
        </div>
      </div>
    </footer>
  )
}
