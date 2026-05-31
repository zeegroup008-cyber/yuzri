import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import pb from "../lib/pb"

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
)

const Spinner = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
  </svg>
)

export default function RegisterPage() {
  const [form, setForm]         = useState({ nama: "", email: "", password: "", konfirmasi: "" })
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)
  const [gLoading, setGLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (form.password !== form.konfirmasi) {
      setError("Kata sandi tidak cocok!")
      return
    }
    if (form.password.length < 8) {
      setError("Kata sandi minimal 8 karakter.")
      return
    }
    setLoading(true)
    try {
      await pb.collection("users").create({
        name: form.nama,
        email: form.email,
        password: form.password,
        passwordConfirm: form.konfirmasi,
      })
      await pb.collection("users").authWithPassword(form.email, form.password)
      navigate("/")
    } catch (err) {
      const msg = err?.response?.data
      if (msg?.email) setError("Email sudah terdaftar. Gunakan email lain.")
      else setError("Pendaftaran gagal. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError("")
    setGLoading(true)
    try {
      await pb.collection("users").authWithOAuth2({ provider: "google" })
      navigate("/")
    } catch {
      setError("Daftar dengan Google gagal. Pastikan Google OAuth sudah dikonfigurasi di PocketBase.")
    } finally {
      setGLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="font-syne font-bold text-2xl text-white mb-2">Buat Akun Baru</h1>
            <p className="text-muted text-sm">Daftar dan nikmati kemudahan top up digital</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* Google OAuth button */}
          <button
            onClick={handleGoogle}
            disabled={gLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border font-medium text-sm transition-all duration-200 mb-5 disabled:opacity-60"
            style={{ background: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--color-text)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--nav-item-bg)"; e.currentTarget.style.borderColor = "var(--color-border)" }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--input-bg)"; e.currentTarget.style.borderColor = "var(--input-border)" }}
          >
            {gLoading ? <Spinner /> : <GoogleIcon />}
            {gLoading ? "Menghubungkan..." : "Daftar dengan Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>atau daftar dengan email</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "nama",       label: "Nama Lengkap",     type: "text",     placeholder: "Nama kamu" },
              { key: "email",      label: "Alamat Email",     type: "email",    placeholder: "contoh@email.com" },
              { key: "password",   label: "Kata Sandi",       type: "password", placeholder: "Minimal 8 karakter" },
              { key: "konfirmasi", label: "Konfirmasi Sandi", type: "password", placeholder: "Ulangi kata sandi" },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm text-white/70 mb-1.5 font-medium">{label}</label>
                <input
                  type={type}
                  required
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full bg-bg-2 border border-border focus:border-purple rounded-xl px-4 py-3 text-white text-sm outline-none placeholder:text-muted transition-colors"
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading || gLoading}
              className="w-full bg-purple hover:bg-purple-3 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors mt-2 flex items-center justify-center gap-2"
            >
              {loading ? <><Spinner /> Memproses...</> : "Buat Akun"}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Sudah punya akun?{" "}
            <Link to="/masuk" className="text-purple-2 hover:text-purple font-medium no-underline transition-colors">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
