import { useState, useEffect, useCallback } from "react"

const ACTIVITIES = [
  { user: "Rizky A.",  item: "112 Diamond ML",    icon: "🎮", color: "#1d4ed8",  price: "Rp 19.000" },
  { user: "Dewi S.",   item: "Netflix 1 Bulan",   icon: "🎬", color: "#e50914",  price: "Rp 25.000" },
  { user: "Bima R.",   item: "325 UC PUBG",       icon: "🎯", color: "#d97706",  price: "Rp 79.000" },
  { user: "Siti N.",   item: "Spotify Premium",   icon: "🎵", color: "#1db954",  price: "Rp 19.000" },
  { user: "Andi P.",   item: "1450 Diamond FF",   icon: "🔥", color: "#ea580c",  price: "Rp 149.000" },
  { user: "Rini H.",   item: "ChatGPT Plus",      icon: "🤖", color: "#10a37f",  price: "Rp 189.000" },
  { user: "Fajar M.",  item: "Canva Pro 1 Bln",   icon: "🎨", color: "#00c4cc",  price: "Rp 75.000" },
  { user: "Nadia K.",  item: "Disney+ Hotstar",   icon: "✨", color: "#0063e5",  price: "Rp 49.000" },
  { user: "Hendra L.", item: "5600 Diamond ML",   icon: "🎮", color: "#1d4ed8",  price: "Rp 899.000" },
  { user: "Yuli R.",   item: "Telegram Premium",  icon: "✈️", color: "#2AABEE",  price: "Rp 59.000" },
]

let notifIdCounter = 0

export default function LiveActivity() {
  const [hidden, setHidden] = useState(() => localStorage.getItem("liveActivityHidden") === "true")
  const [queue, setQueue] = useState([])
  const [actIdx, setActIdx] = useState(0)

  const close = () => {
    setHidden(true)
    localStorage.setItem("liveActivityHidden", "true")
  }

  const push = useCallback(() => {
    if (hidden) return
    const act = ACTIVITIES[actIdx % ACTIVITIES.length]
    const id = ++notifIdCounter
    setQueue(prev => [...prev.slice(-2), { ...act, id, leaving: false }])
    setActIdx(p => p + 1)

    setTimeout(() => {
      setQueue(prev => prev.map(n => n.id === id ? { ...n, leaving: true } : n))
    }, 4200)
    setTimeout(() => {
      setQueue(prev => prev.filter(n => n.id !== id))
    }, 4800)
  }, [actIdx, hidden])

  useEffect(() => {
    const first = setTimeout(push, 2500)
    const interval = setInterval(push, 6500)
    return () => { clearTimeout(first); clearInterval(interval) }
  }, [push])

  if (hidden || queue.length === 0) return null

  return (
    <div
      className="fixed bottom-6 left-5 z-[9000]"
      style={{ maxWidth: 288 }}
    >
      {/* X close button — pojok kanan atas widget */}
      <div className="flex justify-end mb-1.5">
        <button
          onClick={close}
          className="pointer-events-auto flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg transition-all"
          style={{
            color: "rgba(255,255,255,0.35)",
            background: "rgba(8,9,20,0.7)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}
        >
          Tutup <span className="font-bold ml-0.5">✕</span>
        </button>
      </div>

      {/* Notification stack — flex-col-reverse: newest notification di bagian atas */}
      <div className="flex flex-col-reverse gap-2.5 pointer-events-none">
        {queue.map(n => (
          <div
            key={n.id}
            className="pointer-events-auto"
            style={{
              animation: n.leaving
                ? "notif-out 0.55s ease forwards"
                : "notif-in 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}
          >
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{
                background: "rgba(8,9,20,0.94)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${n.color}30`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), 0 4px 16px ${n.color}18`,
              }}
            >
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: `${n.color}20`, border: `1px solid ${n.color}35` }}
              >
                {n.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold leading-tight truncate">
                  {n.user} <span className="text-white/50 font-normal">beli</span> {n.item}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold" style={{ color: n.color }}>{n.price}</span>
                  <span className="text-white/25 text-[10px]">•</span>
                  <span className="text-white/30 text-[10px]">baru saja</span>
                </div>
              </div>

              {/* Live dot */}
              <div className="flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block animate-badge-blink" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
