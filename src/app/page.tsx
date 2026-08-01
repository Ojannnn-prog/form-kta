"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { KTAForm } from "@/components/KTAForm";
import { RecentMembers } from "@/components/RecentMembers";
import { SearchModal } from "@/components/SearchModal";
import { Footer } from "@/components/Footer";
import { ShieldCheck, Printer, Zap } from "lucide-react";

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const scrollToForm = () => {
    const formElement = document.getElementById("kta-form-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCreationSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Top Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onScrollToForm={scrollToForm}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-12">
        {/* Hero Banner Section */}
        <section className="mb-10 sm:mb-14 text-center flex flex-col items-center">
          {/* Official Logo Showcase Box */}
          <div className="mb-5 sm:mb-6 p-3 sm:p-5 bg-white border-[3px] border-[#004080] shadow-[4px_4px_0px_#004080] sm:shadow-[6px_6px_0px_#004080] inline-block">
            <img
              src="/logo-kodigi-kka.png"
              alt="Logo Resmi KaDigi x KKA — SDN 231 Sukaasih"
              className="h-24 sm:h-36 w-auto object-contain mx-auto"
            />
          </div>

          {/* Main H1 Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#004080] tracking-tight max-w-3xl leading-snug sm:leading-tight">
            Generator KTA Resmi <br className="hidden sm:inline" />
            <span
              className="text-[#D35400] block sm:inline mt-1 sm:mt-0"
              style={{
                fontFamily: "var(--font-pixel, 'Courier New', monospace)",
              }}
            >
              KaDigi x KKA
            </span>
          </h1>

          <p className="mt-3 text-xs sm:text-sm font-bold tracking-wide text-[#EAA221] uppercase bg-[#004080] px-3 py-1.5 border border-[#004080] inline-block">
            Kelas Digital • Koding &amp; AI
          </p>

          <p className="mt-3 sm:mt-4 text-sm sm:text-lg font-semibold text-[#004080]/80 max-w-2xl leading-relaxed px-2">
            Buat Kartu Tanda Anggota Ekstrakurikuler secara mandiri dengan
            desain <span className="text-[#D35400] font-bold">Modern Retro</span>{" "}
            &amp; unduh langsung dalam resolusi tinggi standar siap cetak{" "}
            <span className="bg-white px-1.5 py-0.5 border border-[#004080] font-bold">
              CR-80 (85.6 × 54 mm)
            </span>
            .
          </p>

          {/* 3 Step Features Highlights */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-4xl px-1">
            <div
              id="feature-card-1"
              className="bg-white border-[2.5px] border-[#004080] p-4 shadow-[3px_3px_0px_#004080] sm:shadow-[4px_4px_0px_#004080] flex items-start gap-3 text-left"
            >
              <div className="p-2 bg-[#EAA221] border border-[#004080] flex-shrink-0">
                <Zap className="w-5 h-5 text-[#004080]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#004080]">
                  1. TANPA REGISTRASI
                </h3>
                <p className="text-xs text-[#004080]/75 mt-0.5 font-semibold">
                  Isi nama &amp; pilih foto. Langsung generate tanpa ribet
                  daftar akun.
                </p>
              </div>
            </div>

            <div
              id="feature-card-2"
              className="bg-white border-[2.5px] border-[#004080] p-4 shadow-[3px_3px_0px_#004080] sm:shadow-[4px_4px_0px_#004080] flex items-start gap-3 text-left"
            >
              <div className="p-2 bg-[#D35400] border border-[#004080] flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#004080]">
                  2. FOKUS NAMA &amp; FOTO
                </h3>
                <p className="text-xs text-[#004080]/75 mt-0.5 font-semibold">
                  Tampilan kartu bersih dan rapi dengan fokus pada identitas nama
                  siswa dan foto resmi ekskul.
                </p>
              </div>
            </div>

            <div
              id="feature-card-3"
              className="bg-white border-[2.5px] border-[#004080] p-4 shadow-[3px_3px_0px_#004080] flex items-start gap-3 text-left"
            >
              <div className="p-2 bg-[#004080] border border-[#004080] flex-shrink-0">
                <Printer className="w-5 h-5 text-[#EAA221]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-[#004080]">
                  3. SIAP CETAK (300 DPI)
                </h3>
                <p className="text-xs text-[#004080]/75 mt-0.5 font-semibold">
                  Unduh PDF ukuran presisi CR-80 KTP/SIM dengan ketajaman
                  maksimal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* KTA Generation Form Section */}
        <section id="kta-form-section" className="scroll-mt-20 sm:scroll-mt-24">
          <KTAForm onSuccess={handleCreationSuccess} />
        </section>

        {/* Recent Members / Wall of Fame Section */}
        <RecentMembers refreshTrigger={refreshTrigger} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Search existing KTA Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
