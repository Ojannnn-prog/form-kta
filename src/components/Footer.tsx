"use client";

import React from "react";
import { Terminal, Shield, Cpu } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 bg-[#004080] text-[#F4EBD0] border-t-[4px] border-[#EAA221] py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#F4EBD0]/20">
        {/* Left Branding */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 px-1.5 bg-white border border-[#EAA221] flex items-center justify-center rounded-sm">
              <img
                src="/logo-kodigi-kka.png"
                alt="Logo KaDigi x KKA"
                className="h-5 w-auto object-contain"
              />
            </div>
            <span
              className="font-bold text-sm text-[#EAA221]"
              style={{
                fontFamily: "var(--font-pixel, 'Courier New', monospace)",
              }}
            >
              KaDigi x KKA
            </span>
          </div>
          <p className="text-xs text-white/85 leading-relaxed font-semibold">
            Kelas Digital • Koding &amp; Kecerdasan Artifisial (AI) —{" "}
            <span className="text-[#EAA221] font-bold">SDN 231 SUKAASIH</span>.
            Membangun generasi kreator digital dan inovator teknologi masa depan.
          </p>
        </div>

        {/* Center Features */}
        <div className="space-y-2">
          <h4
            className="text-xs font-bold uppercase tracking-wider text-[#EAA221]"
            style={{
              fontFamily: "var(--font-pixel, 'Courier New', monospace)",
            }}
          >
            SPESIFIKASI SISTEM
          </h4>
          <ul className="text-xs text-white/85 space-y-1.5 font-semibold">
            <li className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[#EAA221]" />
              <span>Next.js App Router &amp; Tailwind CSS</span>
            </li>
            <li className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#EAA221]" />
              <span>Neon PostgreSQL Serverless DB</span>
            </li>
            <li className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#D35400]" />
              <span>300 DPI CR-80 Ready to Print PDF Export</span>
            </li>
          </ul>
        </div>

        {/* Right Info */}
        <div>
          <h4
            className="text-xs font-bold uppercase tracking-wider text-[#EAA221]"
            style={{
              fontFamily: "var(--font-pixel, 'Courier New', monospace)",
            }}
          >
            PANDUAN CETAK
          </h4>
          <p className="text-xs text-white/85 leading-relaxed mt-1">
            Gunakan file PDF unduhan dari sistem ini untuk hasil cetak ID card
            standar CR-80 (85.6mm × 54mm) terbaik tanpa pecah resolusi.
          </p>
          <div className="mt-3 inline-block bg-[#EAA221] text-[#004080] text-[10px] font-black px-2 py-1 uppercase border border-white">
            STATUS: ACTIVE LEVEL 1 — SDN 231 SUKAASIH
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
        <p>
          &copy; {new Date().getFullYear()} KaDigi x KKA (SDN 231 Sukaasih). All
          rights reserved.
        </p>
        <p className="font-mono text-[#EAA221]">
          DESIGNED WITH 8-BIT RETRO NOSTALGIA x OFFICIAL KADIGI LOGO
        </p>
      </div>
    </footer>
  );
};
