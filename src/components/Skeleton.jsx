/* Reusable skeleton / loading-state components */

const pulse = {
  background: "var(--input-bg)",
  borderRadius: "0.5rem",
}

function Bar({ w = "100%", h = 12, style = {} }) {
  return (
    <div
      className="animate-pulse"
      style={{ width: w, height: h, borderRadius: 6, ...pulse, ...style }}
    />
  )
}

/** Single product card skeleton (matches GameCard / PremiumCard layout) */
export function SkeletonCard() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
    >
      <div className="animate-pulse" style={{ height: 120, ...pulse }} />
      <div className="p-3.5 space-y-2">
        <Bar w="68%" h={11} />
        <Bar w="45%" h={10} />
        <div className="pt-1">
          <Bar h={34} style={{ borderRadius: 10 }} />
        </div>
      </div>
    </div>
  )
}

/** Grid of N skeleton cards */
export function SkeletonGrid({ count = 6, cols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-6" }) {
  return (
    <div className={`grid ${cols} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

/** Single transaction row skeleton */
export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={pulse} />
      <div className="flex-1 space-y-1.5">
        <Bar w="60%" h={12} />
        <Bar w="38%" h={10} />
      </div>
      <div className="space-y-1.5 text-right">
        <Bar w={64} h={12} />
        <Bar w={48} h={10} />
      </div>
    </div>
  )
}

/** Full-page inline error message */
export function ErrorState({ message = "Gagal memuat data.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
      >
        ⚠️
      </div>
      <div className="text-center">
        <p className="text-white/70 font-semibold text-sm mb-0.5">Koneksi Bermasalah</p>
        <p className="text-white/35 text-xs">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-80"
          style={{ background: "linear-gradient(135deg,#7c5cfc,#5b3fd4)" }}
        >
          Coba Lagi
        </button>
      )}
    </div>
  )
}

/** Empty state */
export function EmptyState({ icon = "📭", title = "Belum ada data.", desc, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
        style={{ background: "rgba(124,92,252,0.1)", border: "1px solid rgba(124,92,252,0.2)" }}
      >
        {icon}
      </div>
      <div>
        <p className="text-white/70 font-semibold text-sm">{title}</p>
        {desc && <p className="text-white/35 text-xs mt-0.5">{desc}</p>}
      </div>
      {action && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-80"
          style={{ background: "rgba(124,92,252,0.25)", color: "#a78bfa", border: "1px solid rgba(124,92,252,0.3)" }}
        >
          {action}
        </button>
      )}
    </div>
  )
}
