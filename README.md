# Yuzri - Platform Top Up Game & Premium Digital

## Stack
- React 18
- Vite 5
- Tailwind CSS 3

## Cara Menjalankan

### 1. Install dependencies
```bash
npm install
```

### 2. Jalankan development server
```bash
npm run dev
```
Buka browser di `http://localhost:5173`

### 3. Build untuk production
```bash
npm run build
```

### 4. Preview build production
```bash
npm run preview
```

---

## Struktur Project

```
yuzri/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx         # Navigation bar
│   │   ├── Hero.jsx           # Hero section utama
│   │   ├── TrustBar.jsx       # Bar kepercayaan (24/7, payment, dll)
│   │   ├── TopUpGame.jsx      # Section kartu game
│   │   ├── ProdukPremium.jsx  # Section produk premium
│   │   ├── WhyYuzri.jsx       # Section kenapa pilih Yuzri
│   │   ├── Testimonials.jsx   # Section testimoni
│   │   └── Footer.jsx         # Footer
│   ├── App.jsx                # Root component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles + Tailwind
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Langkah Pengembangan Selanjutnya

1. **Halaman Top Up Game** - Form input User ID + pilih nominal diamond
2. **Halaman Produk Premium** - Detail produk + pilih durasi
3. **Halaman Checkout** - Ringkasan order + pilih metode pembayaran
4. **Integrasi Payment Gateway** - Midtrans atau Xendit
5. **Halaman Akun / Dashboard** - Riwayat transaksi user
6. **Backend / API** - Node.js + Express atau Next.js

---

## Kontak Developer
support@yuzri.store
