"use client";

import React from "react";
import { Search, Sparkles } from "lucide-react";

interface NavbarProps {
  onOpenSearch: () => void;
  onScrollToForm: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onScrollToForm,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F4EBD0]/95 backdrop-blur-md border-b-[3px] border-[#004080] px-3 sm:px-4 py-2.5 shadow-[0px_4px_0px_rgba(0,64,128,0.15)]">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left Branding */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group min-w-0"
          onClick={onScrollToForm}
        >
          {/* Official KaDigi x KKA Logo Badge */}
          <div className="h-10 sm:h-11 px-1.5 sm:px-2 bg-white border-[2px] sm:border-[2.5px] border-[#004080] shadow-[2px_2px_0px_#004080] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <img
              src="/logo-kodigi-kka.png"
              alt="Logo KaDigi x KKA"
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span
                className="text-xs sm:text-base font-extrabold tracking-wider text-[#004080] whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-pixel, 'Courier New', monospace)",
                }}
              >
                KaDigi x KKA
              </span>
              <span className="hidden md:inline-block bg-[#EAA221] text-[#004080] text-[10px] font-bold px-1.5 py-0.5 border border-[#004080] uppercase">
                SDN 231 SUKAASIH
              </span>
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-[#004080]/85 tracking-tight truncate max-w-[180px] sm:max-w-none">
              Kelas Digital • Koding &amp; AI
            </span>
          </div>
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onOpenSearch}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white hover:bg-[#EAA221] text-[#004080] border-2 border-[#004080] font-bold text-xs sm:text-sm transition-all shadow-[2px_2px_0px_#004080] hover:translate-x-0.5 hover:translate-y-0.5"
            title="Cari KTA yang sudah dibuat sebelumnya"
          >
            <Search className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#D35400]" />
            <span className="hidden sm:inline">Cari KTA Saya</span>
            <span className="sm:hidden">Cari</span>
          </button>

          <button
            onClick={onScrollToForm}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#EAA221] hover:bg-[#D35400] hover:text-white text-[#004080] border-2 border-[#004080] font-bold text-xs sm:text-sm shadow-[3px_3px_0px_#004080] sm:shadow-[4px_4px_0px_#004080] transition-all"
          >
            <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            <span>Buat KTA</span>
          </button>
        </div>
      </div>
    </header>
  );
};
