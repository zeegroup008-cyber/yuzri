import { useState } from "react"
import "../index.css"
import { useNavigate } from "react-router-dom"
import pb from "../lib/pb"

export default function AdminLogin() {
  const [form, setForm]       = useState({ email: "", password: "" })
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await pb.admins.authWithPassword(form.email, form.password)
      navigate("/admin/dashboard")
    } catch {
      setError("Email atau password admin salah.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0b14] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-purple/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🛡️</span>
          </div>
          <h1 className="font-syne font-bold text-2xl text-white mb-1">Admin Panel</h1>
          <p className="text-muted text-sm">Masuk sebagai administrator</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-1.5 font-medium">Email Admin</label>
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@yuzri.store"
                className="w-full bg-bg-2 border border-border focus:border-purple rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-muted transition-colors" />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1.5 font-medium">Password</label>
              <input type="password" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password admin"
                className="w-full bg-bg-2 border border-border focus:border-purple rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-muted transition-colors" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-purple hover:bg-purple-3 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>Memproses...</>
              ) : "Masuk ke Admin Panel"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}


