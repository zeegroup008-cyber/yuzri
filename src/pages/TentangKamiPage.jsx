import { useNavigate } from "react-router-dom"

export default function TentangKamiPage() {
  const navigate = useNavigate()
  const stats = [
    { nilai: "500K+",  label: "Pengguna Aktif" },
    { nilai: "1 Juta+",label: "Transaksi Sukses" },
    { nilai: "99.9%",  label: "Uptime Server" },
    { nilai: "24/7",   label: "Layanan Support" },
  ]
  const tim = [
    { nama: "Yuzri",   peran: "Founder & CEO",       inisial: "Y" },
    { nama: "Andi",    peran: "Lead Developer",       inisial: "A" },
    { nama: "Sari",    peran: "Product Manager",      inisial: "S" },
    { nama: "Budi",    peran: "Customer Support Lead",inisial: "B" },
  ]
  return (
    <div className="px-4 md:px-8 lg:px-12 py-12">
      <button onClick={() => navigate(-1)} className="text-muted hover:text-white text-sm mb-8 flex items-center gap-1 transition-colors">? Kembali</button>
      <h1 className="font-syne font-bold text-3xl text-white mb-2">Tentang Kami</h1>
      <p className="text-muted mb-10">Kenali lebih jauh siapa kami dan apa yang kami perjuangkan.</p>

      <div className="bg-card border border-border rounded-2xl p-8 mb-8">
        <h2 className="font-syne font-bold text-xl text-white mb-3">Siapa YuzriID?</h2>
        <p className="text-muted leading-relaxed mb-4">YuzriID adalah platform top up game dan produk digital terpercaya yang hadir sejak 2023. Kami berkomitmen memberikan layanan tercepat, termurah, dan terpercaya untuk jutaan gamer dan pengguna digital di Indonesia.</p>
        <p className="text-muted leading-relaxed">Dengan teknologi terkini dan tim yang berpengalaman, setiap transaksi di YuzriID diproses secara instan dan aman.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5 text-center">
            <div className="text-purple-2 font-bold text-2xl font-syne mb-1">{s.nilai}</div>
            <div className="text-muted text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="font-syne font-bold text-xl text-white mb-4">Tim Kami</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {tim.map((t) => (
          <div key={t.nama} className="bg-card border border-border rounded-2xl p-5 text-center">
            <div className="w-14 h-14 bg-purple/20 rounded-full flex items-center justify-center text-purple-2 font-bold text-xl mx-auto mb-3">{t.inisial}</div>
            <div className="text-white font-semibold text-sm">{t.nama}</div>
            <div className="text-muted text-xs mt-0.5">{t.peran}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
