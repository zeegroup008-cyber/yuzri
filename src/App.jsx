import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Hero from "./components/Hero"
import TrustBar from "./components/TrustBar"
import BannerPromo from "./components/BannerPromo"
import TopUpGame from "./components/TopUpGame"
import ProdukPremium from "./components/ProdukPremium"
import PPOBSection from "./components/PPOBSection"
import GiftCardSection from "./components/GiftCardSection"
import VPNSection from "./components/VPNSection"
import VoucherSection from "./components/VoucherSection"
import WhyYuzri from "./components/WhyYuzri"
import Testimonials from "./components/Testimonials"
import LiveActivity from "./components/LiveActivity"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import TopUpPage from "./pages/TopUpPage"
import TopUpDetailPage from "./pages/TopUpDetailPage"
import PremiumPage from "./pages/PremiumPage"
import PremiumDetailPage from "./pages/PremiumDetailPage"
import ProfilePage from "./pages/ProfilePage"
import RiwayatPage from "./pages/RiwayatPage"
import SaldoPage from "./pages/SaldoPage"
import PengaturanPage from "./pages/PengaturanPage"
import CaraPembayaranPage from "./pages/CaraPembayaranPage"
import TentangKamiPage from "./pages/TentangKamiPage"
import HubungiKamiPage from "./pages/HubungiKamiPage"
import PromoPage from "./pages/PromoPage"
import PPOBPage from "./pages/PPOBPage"
import PPOBDetailPage from "./pages/PPOBDetailPage"
import GiftCardPage from "./pages/GiftCardPage"
import GiftCardDetailPage from "./pages/GiftCardDetailPage"
import VPNPage from "./pages/VPNPage"
import VPNDetailPage from "./pages/VPNDetailPage"
import VoucherPage from "./pages/VoucherPage"
import VoucherDetailPage from "./pages/VoucherDetailPage"
import AdminLogin from "./admin/AdminLogin"
import AdminDashboard from "./admin/AdminDashboard"

function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <BannerPromo />
      <TopUpGame />
      <ProdukPremium />
      <PPOBSection />
      <GiftCardSection />
      <VPNSection />
      <VoucherSection />
      <WhyYuzri />
      <Testimonials />
      <LiveActivity />
    </>
  )
}

function AdminLayout() {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/*" element={
          <div className="min-h-screen font-dm" style={{background:"var(--color-bg)",color:"var(--color-text)"}}>
            <Navbar />
            <Routes>
              <Route path="/"                    element={<HomePage />} />
              <Route path="/topup"               element={<TopUpPage />} />
              <Route path="/topup/:gameId"       element={<TopUpDetailPage />} />
              <Route path="/premium"             element={<PremiumPage />} />
              <Route path="/premium/:produkId"   element={<PremiumDetailPage />} />
              <Route path="/masuk"               element={<LoginPage />} />
              <Route path="/daftar"              element={<RegisterPage />} />
              <Route path="/profil"              element={<ProfilePage />} />
              <Route path="/riwayat"             element={<RiwayatPage />} />
              <Route path="/saldo"               element={<SaldoPage />} />
              <Route path="/pengaturan"          element={<PengaturanPage />} />
              <Route path="/promo"               element={<PromoPage />} />
              <Route path="/ppob"                element={<PPOBPage />} />
              <Route path="/ppob/:produkId"      element={<PPOBDetailPage />} />
              <Route path="/giftcard"            element={<GiftCardPage />} />
              <Route path="/giftcard/:produkId"  element={<GiftCardDetailPage />} />
              <Route path="/vpn"                 element={<VPNPage />} />
              <Route path="/vpn/:produkId"       element={<VPNDetailPage />} />
              <Route path="/voucher"             element={<VoucherPage />} />
              <Route path="/voucher/:produkId"   element={<VoucherDetailPage />} />
              <Route path="/cara-pembayaran"     element={<CaraPembayaranPage />} />
              <Route path="/tentang-kami"        element={<TentangKamiPage />} />
              <Route path="/hubungi-kami"        element={<HubungiKamiPage />} />
            </Routes>
            <Footer />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}


