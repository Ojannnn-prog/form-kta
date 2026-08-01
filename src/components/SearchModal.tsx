"use client";

import React, { useState, useRef } from "react";
import { X, Search, Download, Image as ImageIcon, AlertCircle } from "lucide-react";
import { KTACard, KTADetails } from "./KTACard";
import { exportToPDF, exportToPNG } from "@/lib/pdfExporter";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundMember, setFoundMember] = useState<KTADetails | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameQuery = searchName.trim();
    if (!nameQuery) {
      setError("Silakan masukkan nama siswa yang ingin dicari.");
      return;
    }

    setLoading(true);
    setError(null);
    setFoundMember(null);

    try {
      const res = await fetch(`/api/member?name=${encodeURIComponent(nameQuery)}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Kartu KTA dengan nama tersebut tidak ditemukan.");
      }

      setFoundMember(json.data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mencari KTA."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!cardRef.current || !foundMember) return;
    await exportToPDF(
      cardRef.current,
      foundMember.memberCode || "",
      foundMember.fullName
    );
  };

  const handleDownloadPNG = async () => {
    if (!cardRef.current || !foundMember) return;
    await exportToPNG(
      cardRef.current,
      foundMember.memberCode || "",
      foundMember.fullName
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border-[3px] border-[#004080] shadow-[6px_6px_0px_#004080] sm:shadow-[8px_8px_0px_#004080] max-w-lg w-full p-5 sm:p-8 relative max-h-[95vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-[#EAA221] hover:bg-[#D35400] hover:text-white text-[#004080] border-2 border-[#004080] flex items-center justify-center font-bold transition-colors"
          title="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b-2 border-[#004080] pb-4 mb-6">
          <span
            className="text-xs text-[#D35400] font-bold tracking-widest uppercase block mb-1"
            style={{
              fontFamily: "var(--font-pixel, 'Courier New', monospace)",
            }}
          >
            PENCARIAN KTA
          </span>
          <h3 className="text-lg sm:text-xl font-black text-[#004080]">
            Cari &amp; Unduh Ulang KTA Saya
          </h3>
          <p className="text-xs font-semibold text-[#004080]/75 mt-0.5">
            KaDigi x KKA — SDN 231 SUKAASIH
          </p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1 min-w-0">
            <input
              type="text"
              placeholder="Masukkan Nama Lengkap (Contoh: Alex...)"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 bg-[#F4EBD0]/40 border-2 border-[#004080] text-[#004080] font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#EAA221] placeholder:font-normal placeholder:text-[#004080]/40"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 sm:px-5 py-2.5 bg-[#EAA221] hover:bg-[#D35400] hover:text-white text-[#004080] border-2 border-[#004080] font-extrabold text-xs sm:text-sm shadow-[2px_2px_0px_#004080] transition-all disabled:opacity-50 flex items-center gap-1.5 flex-shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? "..." : "CARI"}</span>
          </button>
        </form>

        {/* Error Feedback */}
        {error && (
          <div className="mb-6 p-4 bg-[#D35400]/10 border-2 border-[#D35400] text-[#D35400] text-sm font-semibold flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Found Card Preview & Downloads */}
        {foundMember && (
          <div className="space-y-4 border-t-2 border-[#004080]/20 pt-4">
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-bold text-[#D35400] uppercase"
                style={{
                  fontFamily: "var(--font-pixel, 'Courier New', monospace)",
                }}
              >
                KARTU DITEMUKAN
              </span>
              <span className="text-xs font-bold text-[#004080]/70">
                SDN 231 SUKAASIH
              </span>
            </div>

            {/* Responsive KTACard container in modal */}
            <div className="w-full flex justify-center items-center overflow-hidden py-2">
              <div
                className="relative flex justify-center items-center"
                style={{
                  width: "428px",
                  height: "270px",
                  maxWidth: "100%",
                }}
              >
                <div className="origin-top transform scale-[0.66] xs:scale-[0.76] sm:scale-95 transition-transform">
                  <KTACard
                    data={foundMember}
                    cardRef={cardRef}
                    isPreview={true}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleDownloadPDF}
                className="w-full py-3 bg-[#EAA221] hover:bg-[#D35400] hover:text-white text-[#004080] border-2 border-[#004080] font-black text-xs sm:text-sm shadow-[2px_2px_0px_#004080] transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4 flex-shrink-0" />
                <span>DOWNLOAD PDF</span>
              </button>

              <button
                onClick={handleDownloadPNG}
                className="w-full py-3 bg-[#F4EBD0] hover:bg-[#004080] hover:text-white text-[#004080] border-2 border-[#004080] font-bold text-xs sm:text-sm shadow-[2px_2px_0px_#004080] transition-all flex items-center justify-center gap-1.5"
              >
                <ImageIcon className="w-4 h-4 flex-shrink-0" />
                <span>DOWNLOAD PNG</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
