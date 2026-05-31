import { useState, useEffect } from "react"
import "../index.css"
import { useNavigate, Link } from "react-router-dom"
import pb from "../lib/pb"

export default function AdminDashboard() {
  const navigate  = useNavigate()
  const [users, setUsers]             = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]         = useState(true)
  const [activeTab, setActiveTab]     = useState("dashboard")

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate("/admin")
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const u = await pb.collection("users").getFullList({ sort: "-created" })
      const t = await pb.collection("transactions").getFullList({ sort: "-created" })
      setUsers(u)
      setTransactions(t)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    pb.authStore.clear()
    navigate("/admin")
  }

  const stats = [
    { label: "Total User",        nilai: users.length,                          icon: "👥", color: "from-purple/20" },
    { label: "Total Transaksi",   nilai: transactions.length,                   icon: "📋", color: "from-blue-500/20" },
    { label: "Transaksi Berhasil",nilai: transactions.filter(t => t.status === "Berhasil").length, icon: "✅", color: "from-green-500/20" },
    { label: "Transaksi Gagal",   nilai: transactions.filter(t => t.status === "Gagal").length,    icon: "❌", color: "from-red-500/20" },
  ]

  return (
    <div className="min-h-screen bg-[#0a0b14] text-white">
      {/* Topbar */}
      <div className="sticky top-0 z-40 bg-[#111028] border-b border-white/10 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-purple-2 font-syne font-bold text-lg">YUZRI</span>
          <span className="text-white/30">|</span>
          <span className="text-white/60 text-sm">Admin Panel</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-white/50 hover:text-white text-sm transition-colors">← Ke Website</Link>
          <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm px-4 py-1.5 rounded-lg transition-colors">
            Keluar
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-56 min-h-[calc(100vh-64px)] bg-[#111028] border-r border-white/10 p-4 flex flex-col gap-1">
          {[
            { id: "dashboard", label: "Dashboard",   icon: "📊" },
            { id: "users",     label: "Manajemen User", icon: "👥" },
            { id: "transaksi", label: "Transaksi",    icon: "📋" },
          ].map((m) => (
            <button key={m.id} onClick={() => setActiveTab(m.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left ${
                activeTab === m.id ? "bg-purple text-white font-medium" : "text-white/60 hover:text-white hover:bg-white/5"
              }`}>
              <span>{m.icon}</span> {m.label}
            </button>
          ))}
        </div>

        {/* Main */}
        <div className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-muted">Memuat data...</div>
          ) : (
            <>
              {/* DASHBOARD */}
              {activeTab === "dashboard" && (
                <div>
                  <h1 className="font-syne font-bold text-2xl mb-6">Dashboard</h1>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {stats.map((s) => (
                      <div key={s.label} className={`bg-gradient-to-br ${s.color} to-transparent border border-white/10 rounded-2xl p-5`}>
                        <div className="text-2xl mb-2">{s.icon}</div>
                        <div className="font-syne font-bold text-2xl text-white">{s.nilai}</div>
                        <div className="text-muted text-xs mt-1">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <h2 className="font-semibold text-lg mb-4">Transaksi Terbaru</h2>
                  <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    {transactions.slice(0, 5).map((t, i) => (
                      <div key={t.id} className={`flex items-center gap-4 px-5 py-3 ${i !== 0 ? "border-t border-border" : ""}`}>
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.status === "Berhasil" ? "bg-green-400" : "bg-red-400"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{t.product_name}</p>
                          <p className="text-muted text-xs">{t.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white text-sm font-semibold">{t.amount ? "Rp " + Number(t.amount).toLocaleString("id-ID") : "-"}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === "Berhasil" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>{t.status}</span>
                        </div>
                      </div>
                    ))}
                    {transactions.length === 0 && <div className="text-center py-8 text-muted text-sm">Belum ada transaksi.</div>}
                  </div>
                </div>
              )}

              {/* USERS */}
              {activeTab === "users" && (
                <div>
                  <h1 className="font-syne font-bold text-2xl mb-6">Manajemen User ({users.length})</h1>
                  <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-4 px-5 py-3 border-b border-border text-muted text-xs font-semibold uppercase">
                      <span>Nama</span><span>Email</span><span>Dibuat</span><span>Status</span>
                    </div>
                    {users.map((u, i) => (
                      <div key={u.id} className={`grid grid-cols-4 px-5 py-3 items-center ${i !== 0 ? "border-t border-border" : ""}`}>
                        <span className="text-white text-sm font-medium truncate">{u.name || "-"}</span>
                        <span className="text-muted text-sm truncate">{u.email}</span>
                        <span className="text-muted text-xs">{new Date(u.created).toLocaleDateString("id-ID")}</span>
                        <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full w-fit">Aktif</span>
                      </div>
                    ))}
                    {users.length === 0 && <div className="text-center py-8 text-muted text-sm">Belum ada user.</div>}
                  </div>
                </div>
              )}

              {/* TRANSAKSI */}
              {activeTab === "transaksi" && (
                <div>
                  <h1 className="font-syne font-bold text-2xl mb-6">History Transaksi ({transactions.length})</h1>
                  <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-5 px-5 py-3 border-b border-border text-muted text-xs font-semibold uppercase">
                      <span>Produk</span><span>Target ID</span><span>Metode</span><span>Nominal</span><span>Status</span>
                    </div>
                    {transactions.map((t, i) => (
                      <div key={t.id} className={`grid grid-cols-5 px-5 py-3 items-center ${i !== 0 ? "border-t border-border" : ""}`}>
                        <span className="text-white text-sm truncate">{t.product_name}</span>
                        <span className="text-muted text-sm truncate">{t.target_id || "-"}</span>
                        <span className="text-muted text-sm">{t.payment_method || "-"}</span>
                        <span className="text-white text-sm font-semibold">{t.amount ? "Rp " + Number(t.amount).toLocaleString("id-ID") : "-"}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${t.status === "Berhasil" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>{t.status}</span>
                      </div>
                    ))}
                    {transactions.length === 0 && <div className="text-center py-8 text-muted text-sm">Belum ada transaksi.</div>}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}



