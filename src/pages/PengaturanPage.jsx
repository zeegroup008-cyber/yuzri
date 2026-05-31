import { useState } from "react"
import { useNavigate } from "react-router-dom"
import pb from "../lib/pb"

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full relative transition-colors duration-300 flex-shrink-0 ${value ? "bg-violet-600" : "bg-white/20"}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${value ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  )
}

function SectionCard({ children, danger }) {
  return (
    <div className="rounded-2xl p-5 sm:p-6"
      style={{
        background: danger ? "rgba(239,68,68,0.04)" : "var(--color-card)",
        border: `1px solid ${danger ? "rgba(239,68,68,0.2)" : "var(--color-border)"}`,
      }}>
      {children}
    </div>
  )
}

function Field({ label, type = "text", value, onChange, placeholder, autoComplete }) {
  return (
    <div>
      <label className="block text-xs text-white/40 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl px-4 py-2.5 text-[var(--color-text)] text-sm outline-none transition-colors"
        style={{
          background: "var(--input-bg)",
          border: "1px solid var(--input-border)",
        }}
        onFocus={e => (e.target.style.borderColor = "rgba(124,92,252,0.6)")}
        onBlur={e => (e.target.style.borderColor = "var(--input-border)")}
      />
    </div>
  )
}

function Flash({ msg }) {
  if (!msg.text) return null
  return (
    <p className="text-xs mt-2" style={{ color: msg.ok ? "#4ade80" : "#f87171" }}>
      {msg.text}
    </p>
  )
}

export default function PengaturanPage() {
  const navigate = useNavigate()
  const user = pb.authStore.model

  // Profile
  const [name,       setName]       = useState(user?.name || "")
  const [email,      setEmail]      = useState(user?.email || "")
  const [savingProf, setSavingProf] = useState(false)
  const [profMsg,    setProfMsg]    = useState({ text: "", ok: true })

  // Password
  const [oldPw,     setOldPw]     = useState("")
  const [newPw,     setNewPw]     = useState("")
  const [confPw,    setConfPw]    = useState("")
  const [savingPw,  setSavingPw]  = useState(false)
  const [pwMsg,     setPwMsg]     = useState({ text: "", ok: true })

  // Notifications
  const [notif, setNotif] = useState(true)
  const [promo, setPromo] = useState(false)
  const [twofa, setTwofa] = useState(false)

  // Delete
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deletingAcc,   setDeletingAcc]   = useState(false)

  if (!user) { navigate("/masuk"); return null }

  const flash = (setter, text, ok, ms = 3500) => {
    setter({ text, ok })
    setTimeout(() => setter({ text: "", ok: true }), ms)
  }

  const saveProfile = async () => {
    if (!name.trim()) return flash(setProfMsg, "Nama tidak boleh kosong.", false)
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRe.test(email)) return flash(setProfMsg, "Format email tidak valid.", false)
    setSavingProf(true)
    try {
      await pb.collection("users").update(user.id, { name: name.trim(), email: email.trim() })
      pb.authStore.model.name  = name.trim()
      pb.authStore.model.email = email.trim()
      flash(setProfMsg, "Profil berhasil diperbarui ✓", true)
    } catch (err) {
      const detail = err?.data?.data
      if (detail?.email) flash(setProfMsg, "Email sudah digunakan.", false)
      else flash(setProfMsg, "Gagal menyimpan. Coba lagi.", false)
    }
    setSavingProf(false)
  }

  const savePassword = async () => {
    if (!oldPw) return flash(setPwMsg, "Masukkan kata sandi lama.", false)
    if (newPw.length < 8) return flash(setPwMsg, "Kata sandi baru minimal 8 karakter.", false)
    if (newPw !== confPw) return flash(setPwMsg, "Konfirmasi kata sandi tidak cocok.", false)
    setSavingPw(true)
    try {
      await pb.collection("users").update(user.id, {
        oldPassword: oldPw,
        password: newPw,
        passwordConfirm: confPw,
      })
      setOldPw(""); setNewPw(""); setConfPw("")
      flash(setPwMsg, "Kata sandi berhasil diubah ✓", true)
    } catch (err) {
      const detail = err?.data?.data
      if (detail?.oldPassword) flash(setPwMsg, "Kata sandi lama salah.", false)
      else flash(setPwMsg, "Gagal mengubah kata sandi. Coba lagi.", false)
    }
    setSavingPw(false)
  }

  const deleteAccount = async () => {
    setDeletingAcc(true)
    try {
      await pb.collection("users").delete(user.id)
      pb.authStore.clear()
      navigate("/")
    } catch {
      setDeletingAcc(false)
      setConfirmDelete(false)
      alert("Gagal menghapus akun. Hubungi dukungan.")
    }
  }

  const btnPrimary = (loading) => ({
    background: loading ? "rgba(124,92,252,0.5)" : "linear-gradient(135deg,#7c5cfc,#5b3fd4)",
    cursor: loading ? "not-allowed" : "pointer",
  })

  return (
    <div className="px-4 md:px-8 lg:px-12 py-8 sm:py-12">
      <h1 className="font-syne font-extrabold text-white text-2xl mb-8">Pengaturan Akun</h1>

      <div className="space-y-4">

        {/* Profile section */}
        <SectionCard>
          <h2 className="font-syne font-bold text-white text-base mb-5">Informasi Profil</h2>
          <div className="space-y-4">
            <Field label="Nama Lengkap" value={name} onChange={setName}
              placeholder="Nama kamu" autoComplete="name" />
            <Field label="Alamat Email" type="email" value={email} onChange={setEmail}
              placeholder="email@example.com" autoComplete="email" />
          </div>
          <Flash msg={profMsg} />
          <button onClick={saveProfile} disabled={savingProf}
            className="mt-4 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
            style={btnPrimary(savingProf)}>
            {savingProf ? "Menyimpan…" : "Simpan Profil"}
          </button>
        </SectionCard>

        {/* Password section */}
        <SectionCard>
          <h2 className="font-syne font-bold text-white text-base mb-5">Ubah Kata Sandi</h2>
          <div className="space-y-4">
            <Field label="Kata Sandi Lama" type="password" value={oldPw} onChange={setOldPw}
              placeholder="••••••••" autoComplete="current-password" />
            <Field label="Kata Sandi Baru" type="password" value={newPw} onChange={setNewPw}
              placeholder="Minimal 8 karakter" autoComplete="new-password" />
            <Field label="Konfirmasi Kata Sandi Baru" type="password" value={confPw} onChange={setConfPw}
              placeholder="Ulangi kata sandi baru" autoComplete="new-password" />
          </div>
          <Flash msg={pwMsg} />
          <button onClick={savePassword} disabled={savingPw}
            className="mt-4 px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
            style={btnPrimary(savingPw)}>
            {savingPw ? "Menyimpan…" : "Ubah Kata Sandi"}
          </button>
        </SectionCard>

        {/* Notification toggles */}
        <SectionCard>
          <h2 className="font-syne font-bold text-white text-base mb-5">Notifikasi</h2>
          <div className="space-y-4">
            {[
              { label: "Notifikasi Transaksi",   desc: "Pemberitahuan setiap transaksi masuk",          value: notif, set: setNotif },
              { label: "Email Promo",             desc: "Info promo dan penawaran eksklusif via email",  value: promo, set: setPromo },
              { label: "Verifikasi Dua Langkah", desc: "Tingkatkan keamanan akun dengan OTP",           value: twofa, set: setTwofa },
            ].map(({ label, desc, value, set }) => (
              <div key={label} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-white text-sm font-medium">{label}</p>
                  <p className="text-white/35 text-xs mt-0.5">{desc}</p>
                </div>
                <Toggle value={value} onChange={set} />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Danger zone */}
        <SectionCard danger>
          <h2 className="font-syne font-bold text-red-400 text-base mb-1">Hapus Akun</h2>
          <p className="text-white/35 text-xs mb-4">
            Tindakan ini permanen dan tidak dapat dibatalkan. Semua data kamu akan dihapus.
          </p>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}
              className="text-red-400 border text-sm font-medium px-5 py-2 rounded-xl transition-all hover:bg-red-500/10"
              style={{ borderColor: "rgba(239,68,68,0.3)" }}>
              Hapus Akun Saya
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-white/60 text-xs w-full">Yakin ingin menghapus akun secara permanen?</p>
              <button onClick={deleteAccount} disabled={deletingAcc}
                className="px-5 py-2 rounded-xl text-white text-sm font-semibold"
                style={{ background: deletingAcc ? "rgba(239,68,68,0.4)" : "#ef4444" }}>
                {deletingAcc ? "Menghapus…" : "Ya, Hapus Sekarang"}
              </button>
              <button onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 rounded-xl text-white/50 text-sm border border-white/15">
                Batal
              </button>
            </div>
          )}
        </SectionCard>

      </div>
    </div>
  )
}
