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
 * Restored to exact original early working version (commit 36876c2),
 * with the ID code box removed so it focuses purely on Student Name and Photo.
 * Zero experimental typography styles — 100% clean and never overlaps.
 */
export const KTACard: React.FC<KTACardProps> = ({
  data,
  cardRef,
  className = "",
  isPreview = false,
}) => {
  const { fullName, photoBase64, createdAt } = data;

  const displayDate = createdAt
    ? new Date(createdAt).toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
      })
    : "Aktif";

  return (
    <div
      ref={cardRef}
      className={`relative select-none overflow-hidden bg-[#F4EBD0] border-[3px] border-[#004080] shadow-retro text-[#004080] ${className}`}
      style={{
        width: "428px",
        height: "270px",
        fontFamily: "var(--font-inter, 'Segoe UI', sans-serif)",
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
          backgroundSize: "14px 14px",
        }}
      />

      {/* Watermark Official Logo KaDigi x KKA in Background */}
      <div className="absolute right-4 top-10 pointer-events-none flex items-center justify-center opacity-10">
        <img
          src="/logo-kodigi-kka.png"
          alt="Watermark KaDigi x KKA"
          className="w-48 h-auto object-contain grayscale"
        />
      </div>

      {/* Top Banner Accent with Navy Blue & Mustard Gold Stripe */}
      <div className="absolute top-0 left-0 right-0 h-11 bg-[#004080] text-[#F4EBD0] flex items-center justify-between px-3 border-b-2 border-[#EAA221]">
        {/* KaDigi x KKA Official Logo & School Name */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 px-1.5 py-0.5 bg-white border border-[#EAA221] rounded-sm flex items-center justify-center shadow-sm">
            <img
              src="/logo-kodigi-kka.png"
              alt="Logo KaDigi x KKA"
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span
              className="text-[10px] font-bold tracking-wider leading-tight text-[#EAA221]"
              style={{
                fontFamily:
                  "var(--font-pixel, 'Courier New'), 'Courier New', Courier, monospace",
              }}
            >
              KaDigi x KKA
            </span>
            <span className="text-[7.5px] tracking-wide text-white uppercase font-bold mt-0.5">
              SDN 231 SUKAASIH • KELAS DIGITAL
            </span>
          </div>
        </div>

        {/* Right Badge: KODING & AI */}
        <div className="flex items-center gap-1 bg-[#EAA221] text-[#004080] px-2 py-0.5 border border-white">
          <div className="w-1.5 h-1.5 bg-[#004080] rounded-full" />
          <span
            className="text-[7px] font-black uppercase tracking-wider"
            style={{
              fontFamily:
                "var(--font-pixel, 'Courier New'), 'Courier New', Courier, monospace",
            }}
          >
            KODING &amp; AI
          </span>
        </div>
      </div>

      {/* Main Card Content */}
      <div className="absolute top-11 bottom-8 left-0 right-0 px-4 py-2 flex items-center gap-4">
        {/* Left: Pixelated Frame Photo */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className="w-[102px] h-[124px] bg-white border-[2.5px] border-[#004080] shadow-[2px_2px_0px_#004080] relative overflow-hidden flex items-center justify-center">
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
                <span className="text-[8px] font-bold mt-1 uppercase tracking-tighter">
                  NO PHOTO
                </span>
              </div>
            )}
          </div>
          {/* Status badge below photo */}
          <div className="mt-1 bg-[#004080] text-[#EAA221] px-2 py-0.5 border border-[#004080] text-[8px] font-bold uppercase tracking-wider">
            ANGGOTA AKTIF
          </div>
        </div>

        {/* Right: Member Info & Details (Exact original early clean layout, without ID code box) */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5 z-10">
          <div>
            <div className="text-[8.5px] font-bold uppercase tracking-widest text-[#D35400]">
              NAMA ANGGOTA / STUDENT NAME
            </div>
            <div
              className="text-[17px] font-extrabold leading-normal text-[#004080] tracking-tight mt-0.5 break-words uppercase py-0.5"
              title={fullName || "NAMA SISWA"}
            >
              {fullName || "NAMA SISWA"}
            </div>
            <div className="w-12 h-0.5 bg-[#EAA221] mt-0.5" />
          </div>

          {/* Division & School Info (Original clean layout at bottom of right column) */}
          <div className="flex flex-col text-[8px] font-semibold text-[#004080] pt-1">
            <div className="flex items-center justify-between">
              <div>
                <span className="opacity-70">SEKOLAH:</span>{" "}
                <span className="font-bold">SDN 231 SUKAASIH</span>
              </div>
              <div>
                <span className="opacity-70">STATUS:</span>{" "}
                <span className="font-bold">{displayDate}</span>
              </div>
            </div>
            <div className="text-[8px] mt-0.5 font-bold text-[#D35400]">
              KODING &amp; KECERDASAN ARTIFISIAL
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Retro Footer Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#EAA221] border-t-2 border-[#004080] px-3 flex items-center justify-between text-[#004080]">
        {/* Joystick / Gamepad Retro Pixel Ornament */}
        <div className="flex items-center gap-1.5">
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 fill-[#004080]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 6h12v4h4v4h-4v4H6v-4H2v-4h4V6zm2 4v4h8v-4H8zm2-2h4v2h-4V8zm-2 2h2v4H8v-4zm6 0h2v4h-2v-4zm-2 4h4v2h-4v-2z" />
          </svg>
          <span
            className="text-[7px] font-bold uppercase tracking-wide text-[#004080]"
            style={{
              fontFamily:
                "var(--font-pixel, 'Courier New'), 'Courier New', Courier, monospace",
            }}
          >
            KELAS DIGITAL SDN 231 SUKAASIH
          </span>
        </div>

        {/* Simulated Pixel Barcode */}
        <div className="flex items-center gap-0.5 h-4 opacity-80">
          {[2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 1, 3, 1, 2].map((w, idx) => (
            <div
              key={idx}
              className="bg-[#004080] h-full"
              style={{ width: `${w}px` }}
            />
          ))}
          <span className="text-[7px] font-mono font-bold ml-1">KKA</span>
        </div>
      </div>
    </div>
  );
};
