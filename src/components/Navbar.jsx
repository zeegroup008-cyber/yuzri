import { useState, useRef, useEffect, useCallback } from "react"
import pb from "../lib/pb"
import { getImageUrl } from "../lib/products"
import { useTheme } from "../pages/useTheme"
import { Link, useNavigate, useLocation } from "react-router-dom"

/* ── icons ──────────────────────────────────────────────────── */
const SearchIcon  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
const BellIcon    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
const MoonIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
const SunIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
const GlobeIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
const UserIcon    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const CartIcon    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
const ChevronDown = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
const LogoutIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const HistoryIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
const WalletIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
const SettingsIcon= () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
const MenuIcon    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
const XIcon       = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
const SpinIcon    = () => <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>

const LANGUAGES = [
  { code: "ID", label: "Indonesia", flag: "🇮🇩" },
  { code: "EN", label: "English",   flag: "🇺🇸" },
  { code: "MY", label: "Melayu",    flag: "🇲🇾" },
]

const NAV_LINKS = [
  { label: "Beranda", to: "/" },
  { label: "Promo",   to: "/promo" },
]

const PRODUK_ITEMS = [
  { label: "Top Up Game",  desc: "Isi ulang saldo game favoritmu",      icon: "🎮", to: "/topup" },
  { label: "Akun Premium", desc: "Aktivasi instan ke email kamu",        icon: "💎", to: "/premium" },
  { label: "PPOB",         desc: "Pulsa, data & token listrik",          icon: "📱", to: "/ppob" },
  { label: "Gift Card",    desc: "Steam, Google Play, App Store & lainnya", icon: "🎁", to: "/giftcard" },
  { label: "VPN Premium",  desc: "Internet aman & tanpa batas",          icon: "🔒", to: "/vpn" },
  { label: "Voucher Game", desc: "Roblox, Valorant & lainnya",           icon: "🎫", to: "/voucher" },
]

const EXTRA_LINKS = [
  { label: "Cara Pembayaran", to: "/cara-pembayaran" },
  { label: "Tentang Kami",    to: "/tentang-kami" },
  { label: "Hubungi Kami",    to: "/hubungi-kami" },
]

const TYPE_TO_PATH = { game: "topup", premium: "premium", ppob: "ppob", giftcard: "giftcard", vpn: "vpn", voucher: "voucher" }
const TYPE_LABEL   = { game: "🎮 Top Up Game", premium: "💎 Produk Premium", ppob: "📱 PPOB", giftcard: "🎁 Gift Card", vpn: "🔒 VPN Premium", voucher: "🎫 Voucher Game" }

/* ── helpers ─────────────────────────────────────────────────── */
function IconBtn({ onClick, children, badge, style = {}, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 ${className}`}
      style={{ background: "var(--nav-item-bg)", border: "1px solid var(--nav-item-border)", ...style }}
    >
      <span className="text-white/60">{children}</span>
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full text-[10px] font-bold text-white border-2"
          style={{ background: "#7c5cfc", borderColor: "#080912" }}>
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </button>
  )
}

function Dropdown({ open, children, minWidth = "180px" }) {
  if (!open) return null
  return (
    <div
      className="absolute right-0 top-[calc(100%+10px)] z-50 rounded-2xl py-1.5 shadow-2xl"
      style={{ minWidth, background: "var(--nav-dropdown-bg)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid var(--nav-item-border)", boxShadow: "0 20px 60px rgba(0,0,0,0.45)" }}
      onMouseDown={e => e.stopPropagation()}
    >
      {children}
    </div>
  )
}

/* ── Navbar ─────────────────────────────────────────────────── */
export default function Navbar({ cartCount = 0 }) {
  const { isDark, setIsDark } = useTheme()
  const [user, setUser]         = useState(pb.authStore.model)
  const [lang, setLang]         = useState("ID")
  const [openMenu, setOpenMenu] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  /* search */
  const [searchQuery,   setSearchQuery]   = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searchOpen,    setSearchOpen]    = useState(false)
  const [searching,     setSearching]     = useState(false)
  const searchTimer   = useRef(null)
  const searchContRef = useRef(null)

  /* notifications */
  const [notifications, setNotifications] = useState([])
  const unreadCount = notifications.filter(n => !n.read).length

  const langRef    = useRef(null)
  const notifRef   = useRef(null)
  const profileRef = useRef(null)
  const produkRef  = useRef(null)
  const navigate   = useNavigate()
  const location   = useLocation()

  /* ── auth subscription ── */
  useEffect(() => pb.authStore.onChange(() => setUser(pb.authStore.model)), [])

  /* ── scroll detection ── */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  /* ── fetch notifications from PB ── */
  useEffect(() => {
    const userId = pb.authStore.model?.id
    if (!userId) {
      setNotifications([
        { id: 1, text: "Promo spesial! Diskon 20% untuk semua top up hari ini.", time: "1 jam lalu", read: false },
        { id: 2, text: "Selamat datang di YuzriID! Nikmati harga terbaik setiap hari.", time: "Baru saja", read: false },
      ])
      return
    }
    pb.collection("transactions").getList(1, 5, {
      filter: `user_id = "${userId}"`, sort: "-created", requestKey: null,
    }).then(res => {
      if (res.items.length > 0) {
        setNotifications(res.items.map(t => ({
          id: t.id,
          text: `${t.product_name || "Transaksi"} — ${t.status || "Diproses"}`,
          time: new Date(t.created).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
          read: t.status === "Berhasil" || t.status === "Approved",
        })))
      }
    }).catch(() => {})
  }, [user])

  /* ── close dropdowns on outside click ── */
  useEffect(() => {
    const handler = e => {
      const inside = langRef.current?.contains(e.target)
        || notifRef.current?.contains(e.target)
        || profileRef.current?.contains(e.target)
        || produkRef.current?.contains(e.target)
      if (!inside) setOpenMenu(null)
      if (!searchContRef.current?.contains(e.target)) setSearchOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  /* ── close on route change ── */
  useEffect(() => { setOpenMenu(null); setMobileOpen(false); setSearchOpen(false) }, [location.pathname])

  /* ── live search ── */
  const handleSearchChange = useCallback(e => {
    const val = e.target.value
    setSearchQuery(val)
    clearTimeout(searchTimer.current)
    if (val.trim().length < 2) { setSearchResults([]); setSearchOpen(false); return }
    searchTimer.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await pb.collection("products").getList(1, 7, {
          filter: `is_active = true && (name ~ "${val.trim()}" || category ~ "${val.trim()}")`,
          sort: "sort_order", requestKey: null,
        })
        setSearchResults(res.items)
        setSearchOpen(res.items.length > 0)
      } catch { setSearchResults([]) }
      finally { setSearching(false) }
    }, 280)
  }, [])

  const handleSearchEnter = e => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/topup?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery(""); setSearchOpen(false)
    }
  }

  const toggle = menu => setOpenMenu(p => p === menu ? null : menu)
  const markAllRead = () => setNotifications(p => p.map(n => ({ ...n, read: true })))
  const handleLogout = () => { pb.authStore.clear(); setUser(null); navigate("/") }
  const isActive = to => location.pathname === to

  /* ── shared input style ── */
  const inputBase = {
    background: "var(--nav-item-bg)",
    border: "1px solid var(--nav-item-border)",
  }

  return (
    <>
      {/* ═══════════════ NAVBAR ═══════════════ */}
      <nav
        className="sticky top-0 z-40 flex items-center gap-2 px-4 sm:px-6 h-16 font-sans transition-all duration-300"
        style={{
          background: scrolled ? "var(--nav-bg-scroll)" : "var(--nav-bg)",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          borderBottom: `1px solid ${scrolled ? "var(--nav-border-scroll)" : "var(--nav-border)"}`,
          boxShadow: scrolled ? "0 4px 28px rgba(0,0,0,0.35)" : "none",
        }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mr-2 flex-shrink-0 no-underline group">
          <img src="/vacicon.png" alt="Y" className="w-10 h-10 object-contain" style={{filter:"drop-shadow(0 0 0px transparent)"}} />
          <span className="text-white font-extrabold text-2xl tracking-widest font-syne group-hover:text-violet-300 transition-colors">
            Yuzri<span style={{color:"#9b7ffe"}}>ID</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-0.5 flex-1">
          {/* Beranda */}
          <Link to="/"
            className={`text-sm px-4 py-2 rounded-xl transition-all duration-200 no-underline font-medium whitespace-nowrap ${isActive("/") ? "text-violet-300" : "text-white/55 hover:text-white hover:bg-white/[0.06]"}`}
            style={isActive("/") ? { background: "rgba(124,92,252,0.18)" } : {}}>
            Beranda
          </Link>

          {/* Produk mega dropdown */}
          <div className="relative" ref={produkRef}>
            <button onClick={() => toggle("produk")}
              className={`flex items-center gap-1 text-sm px-4 py-2 rounded-xl transition-all font-medium ${PRODUK_ITEMS.some(i => location.pathname.startsWith(i.to)) ? "text-violet-300" : "text-white/55 hover:text-white hover:bg-white/[0.06]"}`}
              style={PRODUK_ITEMS.some(i => location.pathname.startsWith(i.to)) ? { background: "rgba(124,92,252,0.18)" } : {}}>
              Produk <ChevronDown />
            </button>
            {openMenu === "produk" && (
              <div
                className="absolute left-0 top-[calc(100%+10px)] z-50 rounded-2xl p-3 shadow-2xl"
                style={{
                  width: 420,
                  background: "var(--nav-dropdown-bg)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid var(--nav-item-border)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                }}
              >
                <p className="px-3 pb-2 text-[10px] font-bold tracking-widest" style={{ color: "rgba(167,139,250,0.6)" }}>KATEGORI PRODUK</p>
                <div className="grid grid-cols-2 gap-1">
                  {PRODUK_ITEMS.map(item => (
                    <button key={item.to}
                      onClick={() => { setOpenMenu(null); navigate(item.to) }}
                      className="flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors text-left hover:bg-white/[0.06] group/item">
                      <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold group-hover/item:text-violet-300 transition-colors truncate">{item.label}</p>
                        <p className="text-white/35 text-xs leading-relaxed">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Promo */}
          <Link to="/promo"
            className={`text-sm px-4 py-2 rounded-xl transition-all duration-200 no-underline font-medium whitespace-nowrap ${isActive("/promo") ? "text-violet-300" : "text-white/55 hover:text-white hover:bg-white/[0.06]"}`}
            style={isActive("/promo") ? { background: "rgba(124,92,252,0.18)" } : {}}>
            Promo
          </Link>

          {/* Lainnya dropdown */}
          <div className="relative">
            <button onClick={() => toggle("lainnya")}
              className="flex items-center gap-1 text-white/55 hover:text-white hover:bg-white/[0.06] text-sm px-4 py-2 rounded-xl transition-all font-medium">
              Lainnya <ChevronDown />
            </button>
            <Dropdown open={openMenu === "lainnya"}>
              {EXTRA_LINKS.map(({ label, to }) => (
                <Link key={label} to={to}
                  className="block px-4 py-2.5 text-sm text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors no-underline">
                  {label}
                </Link>
              ))}
            </Dropdown>
          </div>
        </div>

        {/* Search — desktop full, mobile hidden */}
        <div className="relative hidden sm:block flex-1 max-w-xs" ref={searchContRef}>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
            {searching ? <SpinIcon /> : <SearchIcon />}
          </span>
          <input
            type="text" value={searchQuery}
            onChange={handleSearchChange} onKeyDown={handleSearchEnter}
            onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
            placeholder="Cari game atau layanan..."
            className="w-full rounded-xl pl-9 pr-4 py-2 text-[var(--color-text)] text-sm outline-none placeholder:text-muted"
            style={inputBase}
            onFocus={e => { e.target.style.borderColor = "rgba(124,92,252,0.55)"; e.target.style.background = "rgba(124,92,252,0.07)"; if (searchResults.length > 0) setSearchOpen(true) }}
            onBlur={e => { e.target.style.borderColor = "var(--nav-item-border)"; e.target.style.background = "var(--nav-item-bg)" }}
          />
          {/* Search dropdown */}
          {searchOpen && (
            <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: "var(--nav-dropdown-bg)", backdropFilter: "blur(20px)", border: "1px solid var(--nav-item-border)" }}>
              {searchResults.map(r => (
                <button key={r.id}
                  onMouseDown={() => { navigate(`/${TYPE_TO_PATH[r.type] || "topup"}/${r.category}`); setSearchQuery(""); setSearchOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.06] transition-colors text-left">
                  {r.image
                    ? <img src={getImageUrl(r.collectionId, r.id, r.image)} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                    : <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ background: "rgba(124,92,252,0.2)" }} />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{r.name}</p>
                    <p className="text-white/35 text-xs">{TYPE_LABEL[r.type] || "🛒 Produk"}</p>
                  </div>
                </button>
              ))}
              <div className="px-4 py-2 border-t border-white/[0.06]">
                <button onMouseDown={() => { navigate(`/topup?q=${searchQuery}`); setSearchOpen(false) }}
                  className="text-xs transition-colors" style={{ color: "#9b7ffe" }}>
                  Lihat semua hasil untuk "{searchQuery}" →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto md:ml-0">

          {/* Language — desktop only */}
          <div className="relative hidden md:block" ref={langRef}>
            <IconBtn onClick={() => toggle("lang")}><GlobeIcon /></IconBtn>
            <Dropdown open={openMenu === "lang"}>
              {LANGUAGES.map(l => (
                <button key={l.code} onMouseDown={() => { setLang(l.code); setOpenMenu(null) }}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-white/[0.06] ${l.code === lang ? "text-violet-400 font-semibold" : "text-white/70"}`}>
                  <span>{l.flag}</span> {l.label}
                </button>
              ))}
            </Dropdown>
          </div>

          {/* Bell */}
          <div className="relative" ref={notifRef}>
            <IconBtn onClick={() => toggle("notif")} badge={unreadCount}><BellIcon /></IconBtn>
            <Dropdown open={openMenu === "notif"} minWidth="300px">
              <div className="px-4 py-2.5 flex items-center justify-between border-b border-border">
                <span className="text-white font-semibold text-sm">Notifikasi</span>
                {unreadCount > 0 && (
                  <button onMouseDown={markAllRead} className="text-xs" style={{ color: "#9b7ffe" }}>Tandai dibaca</button>
                )}
              </div>
              <div className="py-1 max-h-72 overflow-y-auto">
                {notifications.length === 0
                  ? <p className="px-4 py-4 text-white/35 text-xs text-center">Tidak ada notifikasi</p>
                  : notifications.map(n => (
                    <div key={n.id} className="flex gap-3 px-4 py-3 hover:bg-white/[0.04] cursor-pointer">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? "bg-white/20" : "bg-violet-500"}`} />
                      <div>
                        <p className="text-white/80 text-xs leading-relaxed">{n.text}</p>
                        <p className="text-white/30 text-[11px] mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))
                }
              </div>
              <div className="px-4 py-2.5 border-t border-border">
                <Link to="/riwayat" className="text-xs no-underline" style={{ color: "#9b7ffe" }}>Lihat riwayat transaksi →</Link>
              </div>
            </Dropdown>
          </div>

          {/* Theme toggle — desktop only */}
          <button onMouseDown={() => setIsDark(d => !d)}
            className="hidden md:flex items-center gap-1.5 h-9 px-2.5 rounded-xl transition-all duration-200"
            style={{ background: "var(--nav-item-bg)", border: "1px solid var(--nav-item-border)" }}>
            <span className="text-white/60">{isDark ? <MoonIcon /> : <SunIcon />}</span>
            <div className="w-7 h-3.5 rounded-full relative transition-colors duration-300"
              style={{ background: isDark ? "#7c5cfc" : "rgba(255,255,255,0.2)" }}>
              <div className={`absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full shadow transition-transform duration-300 ${isDark ? "translate-x-0.5" : "translate-x-4"}`} />
            </div>
          </button>

          <div className="w-px h-5 hidden md:block" style={{ background: "var(--nav-divider)" }} />

          {/* Auth — desktop */}
          {!user && (
            <div className="hidden md:flex items-center gap-1.5">
              <Link to="/masuk" className="px-4 py-2 rounded-xl text-white/80 hover:text-white text-sm font-medium transition-all no-underline"
                style={{ border: "1px solid rgba(255,255,255,0.14)" }}>
                Masuk
              </Link>
              <Link to="/daftar" className="px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all no-underline hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#7c5cfc,#5b3fd4)", boxShadow: "0 4px 14px rgba(124,92,252,0.35)" }}>
                Daftar
              </Link>
            </div>
          )}

          {/* Cart */}
          <Link to="/topup" className="no-underline hidden md:block">
            <IconBtn badge={cartCount}><CartIcon /></IconBtn>
          </Link>

          {/* Profile — desktop */}
          <div className="relative hidden md:block" ref={profileRef}>
            <button onClick={() => toggle("profile")}
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200"
              style={{ background: "rgba(124,92,252,0.2)", border: "1px solid rgba(124,92,252,0.35)" }}>
              <span style={{ color: "#c4b5fd" }}><UserIcon /></span>
            </button>
            <Dropdown open={openMenu === "profile"}>
              <div className="px-4 py-3 border-b border-border">
                <p className="text-white text-sm font-semibold">
                  {user?.name || user?.email?.split("@")[0] || "Pengguna"}
                </p>
                <p className="text-white/40 text-xs mt-0.5">{user?.email || "Masuk untuk lanjut"}</p>
              </div>
              <div className="py-1">
                {[
                  { icon: <UserIcon />,     label: "Profil Saya",       to: "/profil" },
                  { icon: <HistoryIcon />,  label: "Riwayat Transaksi", to: "/riwayat" },
                  { icon: <WalletIcon />,   label: "Saldo & Voucher",   to: "/saldo" },
                  { icon: <SettingsIcon />, label: "Pengaturan",        to: "/pengaturan" },
                ].map(({ icon, label, to }) => (
                  <Link key={label} to={to}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors no-underline">
                    <span className="text-white/35">{icon}</span> {label}
                  </Link>
                ))}
              </div>
              {user && (
                <div className="border-t border-border">
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors">
                    <LogoutIcon /> Keluar
                  </button>
                </div>
              )}
            </Dropdown>
          </div>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl transition-all"
            style={{ background: "var(--nav-border)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <span className="text-white">{mobileOpen ? <XIcon /> : <MenuIcon />}</span>
          </button>
        </div>
      </nav>

      {/* ═══════════════ MOBILE DRAWER ═══════════════ */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />
        </div>
      )}
      <div
        className="fixed top-16 left-0 right-0 z-30 md:hidden overflow-y-auto transition-all duration-300"
        style={{
          background: "var(--nav-drawer-bg)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--nav-border)",
          maxHeight: mobileOpen ? "calc(100vh - 64px)" : 0,
          overflow: "hidden",
          transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="px-4 py-4 space-y-1">

          {/* Mobile search */}
          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
              {searching ? <SpinIcon /> : <SearchIcon />}
            </span>
            <input
              type="text" value={searchQuery}
              onChange={handleSearchChange} onKeyDown={handleSearchEnter}
              placeholder="Cari game atau layanan..."
              className="w-full rounded-xl pl-9 pr-4 py-3 text-[var(--color-text)] text-sm outline-none placeholder:text-muted"
              style={{ background: "var(--nav-item-bg)", border: "1px solid var(--nav-item-border)" }}
            />
            {searchOpen && searchResults.length > 0 && (
              <div className="mt-2 rounded-xl overflow-hidden" style={{ border: "1px solid var(--nav-item-border)", background: "var(--nav-dropdown-bg)" }}>
                {searchResults.map(r => (
                  <button key={r.id}
                    onClick={() => { navigate(`/${TYPE_TO_PATH[r.type] || "topup"}/${r.category}`); setSearchQuery(""); setSearchOpen(false); setMobileOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.06] transition-colors text-left">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{r.name}</p>
                      <p className="text-white/35 text-xs">{TYPE_LABEL[r.type] || "🛒 Produk"}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nav links */}
          <Link to="/"
            className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium no-underline transition-all ${isActive("/") ? "text-violet-300" : "text-white/70 hover:text-white hover:bg-white/[0.05]"}`}
            style={isActive("/") ? { background: "rgba(124,92,252,0.15)" } : {}}>
            Beranda
          </Link>
          <Link to="/promo"
            className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium no-underline transition-all ${isActive("/promo") ? "text-violet-300" : "text-white/70 hover:text-white hover:bg-white/[0.05]"}`}
            style={isActive("/promo") ? { background: "rgba(124,92,252,0.15)" } : {}}>
            🔥 Promo
          </Link>

          {/* Produk group */}
          <div>
            <p className="px-4 pt-3 pb-1.5 text-[10px] font-extrabold tracking-widest" style={{ color: "rgba(167,139,250,0.5)" }}>PRODUK</p>
            {PRODUK_ITEMS.map(({ label, icon, to }) => (
              <Link key={to} to={to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium no-underline transition-all ${location.pathname.startsWith(to) ? "text-violet-300" : "text-white/70 hover:text-white hover:bg-white/[0.05]"}`}
                style={location.pathname.startsWith(to) ? { background: "rgba(124,92,252,0.15)" } : {}}>
                <span>{icon}</span> {label}
              </Link>
            ))}
          </div>

          {/* Info group */}
          <div>
            <p className="px-4 pt-3 pb-1.5 text-[10px] font-extrabold tracking-widest" style={{ color: "rgba(167,139,250,0.5)" }}>INFO</p>
            {EXTRA_LINKS.map(({ label, to }) => (
              <Link key={to} to={to}
                className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium no-underline transition-all ${isActive(to) ? "text-violet-300" : "text-white/70 hover:text-white hover:bg-white/[0.05]"}`}
                style={isActive(to) ? { background: "rgba(124,92,252,0.15)" } : {}}>
                {label}
              </Link>
            ))}
          </div>

          <div className="h-px my-2" style={{ background: "var(--nav-border)" }} />

          {/* Theme + Language row */}
          <div className="flex items-center justify-between px-2 py-2">
            <button onMouseDown={() => setIsDark(d => !d)} className="flex items-center gap-2 text-white/60 text-sm">
              {isDark ? <MoonIcon /> : <SunIcon />}
              <span>{isDark ? "Mode Gelap" : "Mode Terang"}</span>
            </button>
            <div className="flex items-center gap-2">
              {LANGUAGES.map(l => (
                <button key={l.code} onClick={() => setLang(l.code)}
                  className={`text-sm px-2 py-1 rounded-lg transition-all ${l.code === lang ? "text-violet-400 font-bold" : "text-white/40"}`}>
                  {l.flag}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px my-1" style={{ background: "var(--nav-border)" }} />

          {/* Auth */}
          {user ? (
            <div className="space-y-1 pb-2">
              <div className="px-4 py-3 rounded-xl mb-1" style={{ background: "rgba(124,92,252,0.1)", border: "1px solid rgba(124,92,252,0.2)" }}>
                <p className="text-white text-sm font-semibold">{user.name || "Pengguna"}</p>
                <p className="text-white/40 text-xs">{user.email}</p>
              </div>
              {[
                { label: "Profil Saya",       to: "/profil" },
                { label: "Riwayat Transaksi", to: "/riwayat" },
                { label: "Saldo & Voucher",   to: "/saldo" },
                { label: "Pengaturan",        to: "/pengaturan" },
              ].map(({ label, to }) => (
                <Link key={to} to={to} className="block px-4 py-2.5 text-sm text-white/70 hover:text-white rounded-xl hover:bg-white/[0.05] no-underline transition-colors">
                  {label}
                </Link>
              ))}
              <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                Keluar
              </button>
            </div>
          ) : (
            <div className="flex gap-2 pb-2">
              <Link to="/masuk" className="flex-1 text-center py-3 rounded-xl text-white/80 text-sm font-medium no-underline transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.14)" }}>
                Masuk
              </Link>
              <Link to="/daftar" className="flex-1 text-center py-3 rounded-xl text-white text-sm font-semibold no-underline"
                style={{ background: "linear-gradient(135deg,#7c5cfc,#5b3fd4)" }}>
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
