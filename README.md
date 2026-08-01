# Generator KTA Ekskul KaDigi x KKA — SDN 231 Sukaasih 🎮

Aplikasi web full-stack berbasis **Next.js 16 (App Router)** dengan desain **Modern UI x Retro (8-bit/16-bit gaming aesthetic)** untuk pembuatan dan pencetakan Kartu Tanda Anggota (KTA) Ekstrakurikuler **KaDigi x KKA** (Kelas Digital • Koding & Kecerdasan Artifisial) **SDN 231 Sukaasih**.

---

## ✨ Fitur Utama

1. **Akses Langsung Tanpa Login (*No-Auth Workflow*):**
   - Siswa dapat langsung membuka web, mengisi form, dan membuat KTA tanpa perlu registrasi akun atau login.
2. **Kompression & Resize Foto di Client-Side (*Zero DB Bloat*):**
   - File foto yang diupload otomatis di-resize dan dikompres di peramban pengguna menggunakan **HTML5 Canvas** ke format JPEG Base64 sebelum dikirim ke server.
3. **Kode Anggota Unik Otomatis:**
   - Sistem secara otomatis meng-generate kode identitas format `EKSTIKKAxxx` (3 digit unik tersinkronisasi dengan database Neon PostgreSQL).
4. **Desain KTA Modern Retro Siap Cetak (Standar CR-80):**
   - Dilengkapi logo resmi **KaDigi x KKA**, ornamen gaming retro 8-bit, barcode ekskul, serta foto dengan bingkai *pixelated*.
   - **Ekspor PDF & PNG resolusi tinggi (300 DPI)** dengan ukuran presisi standar kartu identitas antarbangsa **CR-80 / ID-1 (85.60 mm × 53.98 mm)** siap cetak di printer kartu atau kertas foto KTP/SIM.
5. **Wall of Fame & Cari KTA Saya:**
   - Siswa yang sudah membuat KTA dapat dicari kembali dan diunduh ulang melalui tombol **"Cari KTA Saya"** menggunakan kode `EKSTIKKAxxx`.

---

## 🛠️ Teknologi & Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, TypeScript)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) dengan kustomisasi **Modern Retro** (*Neo-brutalism hard shadows*, palet Navy `#004080`, Mustard `#EAA221`, Terracotta `#D35400`, Paper `#F4EBD0`)
- **Database:** [Neon Serverless PostgreSQL](https://neon.tech/)
- **ORM:** [Prisma ORM v7](https://www.prisma.io/) dengan `@prisma/adapter-pg`
- **PDF & Canvas Exporter:** `html2canvas` & `jspdf` (300 DPI High Resolution output)
- **Efek Visual:** `canvas-confetti` & `lucide-react`
- **Font:** Google Fonts `Inter` & `Press Start 2P`

---

## 🚀 Panduan Menjalankan Secara Lokal

### 1. Prasyarat
- Node.js versi **20.19.0+**
- npm / pnpm / yarn

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Database Neon PostgreSQL
Buat file `.env` di akar proyek:
```env
DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-weathered-cherry-az0vtecu-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### 4. Sinkronisasi Skema & Generate Prisma Client
```bash
npx prisma db push
npx prisma generate
```

### 5. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di peramban Anda.
