import { useState, useCallback } from "react"

export function useToast() {
  const [toasts, setToasts] = useState([])
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])
  return { toasts, addToast }
}

export function ToastContainer({ toasts }) {
  if (!toasts.length) return null
  return (
    <div className="fixed top-20 right-4 z-[999] flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-fade-in border ${
          t.type === "success" ? "bg-green-500/10 border-green-500/30 text-green-400"
          : t.type === "error" ? "bg-red-500/10 border-red-500/30 text-red-400"
          : "bg-purple/10 border-purple/30 text-purple-2"}`}>
          <span>{t.type === "success" ? "?" : t.type === "error" ? "?" : "?"}</span>
          {t.message}
        </div>
      ))}
    </div>
  )
}
