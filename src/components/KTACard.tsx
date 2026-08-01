"use client";

import React from "react";

export interface KTADetails {
  id?: string;
  fullName: string;
  memberCode?: string;
  photoBase64?: string;
  createdAt?: string;
}

interface KTACardProps {
  data: KTADetails;
  cardRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
  isPreview?: boolean;
}

/**
 * KTACard Component - CR-80 Standard ID Card (85.6mm x 53.98mm)
 * Clean Modern Retro ID Card — Focused on Photo, Student Name, School & Membership Term
 * 100% Pure HEX Colors (No Tailwind v4 color-mix/lab/oklch opacity modifiers) for HTML2Canvas compatibility.
 */
export const KTACard: React.FC<KTACardProps> = ({
  data,
  cardRef,
  className = "",
  isPreview = false,
}) => {
  const { fullName, photoBase64 } = data;

  return (
    <div
      ref={cardRef}
      className={`relative select-none overflow-hidden bg-[#F4EBD0] border-[3px] border-[#004080] shadow-retro text-[#004080] ${className}`}
      style={{
        width: "428px",
        height: "270px",
        fontFamily:
          "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Background Retro Grid & Geometric Decorations */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #004080 1px, transparent 1px),
            linear-gradient(to bottom, #004080 1px, transparent 1px)
          `,
          backgroundSize: "16px 16px",
        }}
      />

      {/* Watermark Official Logo KaDigi x KKA in Background */}
      <div className="absolute right-6 top-12 pointer-events-none flex items-center justify-center opacity-10">
        <img
          src="/logo-kodigi-kka.png"
          alt="Watermark KaDigi x KKA"
          className="w-48 h-auto object-contain grayscale"
        />
      </div>

      {/* Top Banner Accent with Navy Blue & Mustard Gold Stripe */}
      <div className="absolute top-0 left-0 right-0 h-11 bg-[#004080] text-[#F4EBD0] flex items-center justify-between px-3.5 border-b-2 border-[#EAA221]">
        {/* KaDigi x KKA Official Logo & School Name */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 px-1.5 py-0.5 bg-[#FFFFFF] border border-[#EAA221] rounded-sm flex items-center justify-center shadow-sm">
            <img
              src="/logo-kodigi-kka.png"
              alt="Logo KaDigi x KKA"
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[11px] font-black text-[#EAA221] uppercase tracking-normal leading-none">
              KaDigi x KKA
            </span>
            <span className="text-[8px] text-[#FFFFFF] uppercase font-bold tracking-wide mt-0.5 leading-none">
              SDN 231 SUKAASIH • KELAS DIGITAL
            </span>
          </div>
        </div>

        {/* Right Badge */}
        <div className="flex items-center gap-1.5 bg-[#EAA221] text-[#004080] px-2.5 py-1 border border-[#FFFFFF]">
          <div className="w-1.5 h-1.5 bg-[#004080] rounded-full" />
          <span className="text-[8px] font-black uppercase tracking-wide leading-none">
            KODING &amp; AI
          </span>
        </div>
      </div>

      {/* Main Card Content */}
      <div className="absolute top-11 bottom-8 left-0 right-0 px-5 py-3 flex items-center gap-5">
        {/* Left: Pixelated Frame Photo */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="w-[108px] h-[136px] bg-[#FFFFFF] border-[2.5px] border-[#004080] shadow-[3px_3px_0px_#004080] relative overflow-hidden flex items-center justify-center">
            {/* Corner Accent Squares */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#EAA221] z-10" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#EAA221] z-10" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-[#EAA221] z-10" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-[#EAA221] z-10" />

            {photoBase64 ? (
              <img
                src={photoBase64}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#EAA221] flex flex-col items-center justify-center p-2 text-[#004080]">
                <svg
                  viewBox="0 0 24 24"
                  className="w-12 h-12 fill-[#004080] opacity-80"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8 4h8v2H8V4zm-2 2h2v6H6V6zm10 0h2v6h-2V6zM8 12h8v2H8v-2zm-4 2h4v2H4v-2zm12 0h4v2h-4v-2zm-2 2h2v6h-2v-6zm-8 0h2v6H6v-6z" />
                </svg>
                <span className="text-[8px] font-bold mt-1 uppercase tracking-normal">
                  NO PHOTO
                </span>
              </div>
            )}
          </div>
          {/* Status badge below photo */}
          <div className="mt-2 bg-[#004080] text-[#EAA221] px-2.5 py-0.5 border border-[#004080] text-[8px] font-black uppercase tracking-wider">
            ANGGOTA AKTIF
          </div>
        </div>

        {/* Right: Clean Member Name & Membership Term Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center py-1 z-10 space-y-2.5">
          {/* Student Name Section */}
          <div className="border-b-2 border-[#EAA221] pb-2">
            <div className="text-[8.5px] font-bold uppercase tracking-wide text-[#D35400]">
              NAMA ANGGOTA / STUDENT NAME
            </div>
            <div
              className="text-[17px] font-black leading-snug text-[#004080] tracking-normal mt-0.5 uppercase break-words"
              style={{ minHeight: "24px" }}
            >
              {fullName || "NAMA SISWA"}
            </div>
          </div>

          {/* School & Extracurricular Info */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[9px]">
              <span className="font-semibold text-[#004080] opacity-75">
                SEKOLAH:
              </span>
              <span className="font-black text-[#004080] uppercase">
                SDN 231 SUKAASIH
              </span>
            </div>
            <div className="flex items-center justify-between text-[9px]">
              <span className="font-semibold text-[#004080] opacity-75">
                EKSKUL:
              </span>
              <span className="font-black text-[#D35400] uppercase">
                KODING &amp; KECERDASAN ARTIFISIAL
              </span>
            </div>
          </div>

          {/* Membership Active Term Explanation - Using pure hex #FDFBF7 instead of white/85 */}
          <div className="bg-[#FDFBF7] border-[1.5px] border-[#004080] px-2.5 py-1.5 shadow-[2px_2px_0px_#004080]">
            <div className="text-[7.5px] font-black text-[#004080] uppercase tracking-wide">
              MASA BERLAKU KEANGGOTAAN
            </div>
            <p className="text-[7.5px] font-medium text-[#004080] leading-normal mt-0.5 opacity-90">
              Berlaku selama menjadi siswa aktif SDN 231 Sukaasih atau hingga
              selesai mengikuti kegiatan ekstrakurikuler KaDigi x KKA.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Retro Footer Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#EAA221] border-t-2 border-[#004080] px-3.5 flex items-center justify-between text-[#004080]">
        {/* Organization Tagline */}
        <div className="flex items-center gap-1.5">
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5 fill-[#004080]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 6h12v4h4v4h-4v4H6v-4H2v-4h4V6zm2 4v4h8v-4H8zm2-2h4v2h-4V8zm-2 2h2v4H8v-4zm6 0h2v4h-2v-4zm-2 4h4v2h-4v-2z" />
          </svg>
          <span className="text-[8px] font-black uppercase tracking-wide text-[#004080]">
            KELAS DIGITAL • SDN 231 SUKAASIH
          </span>
        </div>

        {/* Simulated Retro Pixel Barcode */}
        <div className="flex items-center gap-0.5 h-4 opacity-80">
          {[2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3, 1, 2].map((w, idx) => (
            <div
              key={idx}
              className="bg-[#004080] h-full"
              style={{ width: `${w}px` }}
            />
          ))}
          <span className="text-[8px] font-mono font-black ml-1">KKA</span>
        </div>
      </div>
    </div>
  );
};
