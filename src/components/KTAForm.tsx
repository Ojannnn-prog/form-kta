"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  User,
  Sparkles,
  Download,
  Image as ImageIcon,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { KTACard, KTADetails } from "./KTACard";
import { resizeImageToBase64 } from "@/lib/imageResizer";
import { exportToPDF, exportToPNG } from "@/lib/pdfExporter";

interface KTAFormProps {
  onSuccess?: () => void;
}

export const KTAForm: React.FC<KTAFormProps> = ({ onSuccess }) => {
  const [fullName, setFullName] = useState("");
  const [photoBase64, setPhotoBase64] = useState<string>("");
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedKTA, setGeneratedKTA] = useState<KTADetails | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const previewData: KTADetails = generatedKTA || {
    fullName: fullName.trim() || "NAMA SISWA",
    memberCode: "",
    photoBase64: photoBase64,
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setLoadingPhoto(true);

    try {
      const base64 = await resizeImageToBase64(file, 600, 0.85);
      setPhotoBase64(base64);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memproses foto di perangkat Anda."
      );
    } finally {
      setLoadingPhoto(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setError(null);
    setLoadingPhoto(true);

    try {
      const base64 = await resizeImageToBase64(file, 600, 0.85);
      setPhotoBase64(base64);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memproses foto yang didrop."
      );
    } finally {
      setLoadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Silakan masukkan nama lengkap siswa.");
      return;
    }

    if (!photoBase64) {
      setError("Silakan upload foto siswa (3x4 / setengah badan).");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          photoBase64,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.error || "Gagal membuat KTA. Silakan coba lagi."
        );
      }

      setGeneratedKTA(json.data);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#EAA221", "#D35400", "#004080", "#F4EBD0"],
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan koneksi ke server Neon Database."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setFullName("");
    setPhotoBase64("");
    setGeneratedKTA(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadPDF = async () => {
    if (!cardRef.current || !generatedKTA) return;
    await exportToPDF(
      cardRef.current,
      generatedKTA.memberCode || "",
      generatedKTA.fullName
    );
  };

  const handleDownloadPNG = async () => {
    if (!cardRef.current || !generatedKTA) return;
    await exportToPNG(
      cardRef.current,
      generatedKTA.memberCode || "",
      generatedKTA.fullName
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
      {/* Left Column: Form Controls */}
      <div className="lg:col-span-6 bg-white border-[3px] border-[#004080] shadow-[4px_4px_0px_#004080] sm:shadow-[6px_6px_0px_#004080] p-5 sm:p-8">
        <div className="border-b-2 border-[#004080] pb-4 mb-6 flex items-center justify-between">
          <div>
            <span
              className="text-xs text-[#D35400] font-bold tracking-widest uppercase block mb-1"
              style={{
                fontFamily: "var(--font-pixel, 'Courier New', monospace)",
              }}
            >
              FORM REGISTRASI
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-[#004080]">
              Buat KTA KaDigi x KKA
            </h2>
            <p className="text-xs font-semibold text-[#004080]/70 mt-0.5">
              SDN 231 Sukaasih • Kelas Digital
            </p>
          </div>
          <div className="w-8 sm:w-9 h-8 sm:h-9 bg-[#EAA221] border-2 border-[#004080] shadow-[2px_2px_0px_#004080] flex items-center justify-center font-bold text-xs text-[#004080]">
            AI
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#D35400]/10 border-2 border-[#D35400] text-[#D35400] text-sm font-semibold flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Perhatian</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {!generatedKTA ? (
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Full Name Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#004080] mb-2">
                Nama Lengkap Siswa <span className="text-[#D35400]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#004080]/60">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Alex Pradana..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#F4EBD0]/40 border-2 border-[#004080] text-[#004080] font-bold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#EAA221] placeholder:font-normal placeholder:text-[#004080]/40"
                />
              </div>
            </div>

            {/* Photo Upload with Drag & Drop */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#004080] mb-2">
                Foto Siswa (3x4 / Setengah Badan){" "}
                <span className="text-[#D35400]">*</span>
              </label>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group relative cursor-pointer border-2 border-dashed border-[#004080] bg-[#F4EBD0]/20 hover:bg-[#EAA221]/15 transition-all p-5 sm:p-6 text-center ${
                  photoBase64 ? "border-solid bg-[#F4EBD0]/40" : ""
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />

                {loadingPhoto ? (
                  <div className="py-6 sm:py-8 flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-[#EAA221] border-t-transparent rounded-full animate-spin mb-2" />
                    <p className="text-sm font-semibold text-[#004080]">
                      Memproses &amp; mengompres foto...
                    </p>
                  </div>
                ) : photoBase64 ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-20 h-24 overflow-hidden border-2 border-[#004080] shadow-[2px_2px_0px_#004080]">
                      <img
                        src={photoBase64}
                        alt="Preview Foto"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#004080]">
                        Foto Berhasil Dipilih
                      </p>
                      <p className="text-xs text-[#D35400] font-semibold underline mt-1">
                        Klik atau drag foto baru untuk mengganti
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 sm:py-6 flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-white border-2 border-[#004080] flex items-center justify-center group-hover:scale-110 transition-transform shadow-[2px_2px_0px_#004080]">
                      <Upload className="w-6 h-6 text-[#D35400]" />
                    </div>
                    <p className="text-sm font-bold text-[#004080] mt-2">
                      Klik untuk Upload atau Drag &amp; Drop Foto
                    </p>
                    <p className="text-xs text-[#004080]/70">
                      Format JPG, PNG, WEBP — Otomatis dikompres &amp; resize di
                      perangkat Anda
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Generation Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || loadingPhoto || !fullName || !photoBase64}
                className="w-full py-3.5 sm:py-4 bg-[#EAA221] hover:bg-[#D35400] hover:text-white text-[#004080] border-2 border-[#004080] font-black text-sm sm:text-base shadow-[4px_4px_0px_#004080] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#004080] border-t-transparent rounded-full animate-spin" />
                    <span>MENGHUBUNGKAN...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 flex-shrink-0" />
                    <span>GENERATE KTA SEKARANG</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Success Generated Actions Card */
          <div className="space-y-5 sm:space-y-6">
            <div className="p-4 bg-[#EAA221]/20 border-2 border-[#004080] flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#D35400] flex-shrink-0" />
              <div>
                <h3 className="font-extrabold text-[#004080]">
                  KTA Berhasil Diterbitkan!
                </h3>
                <p className="text-xs text-[#004080]/80 mt-0.5">
                  Kartu Tanda Anggota untuk{" "}
                  <strong className="text-[#D35400] font-extrabold uppercase">
                    {generatedKTA.fullName}
                  </strong>{" "}
                  siap diunduh dan dicetak.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleDownloadPDF}
                className="w-full py-3.5 bg-[#EAA221] hover:bg-[#D35400] hover:text-white text-[#004080] border-2 border-[#004080] font-black text-xs sm:text-base shadow-[4px_4px_0px_#004080] transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5 flex-shrink-0" />
                <span>DOWNLOAD PDF (CR-80 SIAP CETAK)</span>
              </button>

              <button
                onClick={handleDownloadPNG}
                className="w-full py-3 bg-[#F4EBD0] hover:bg-[#004080] hover:text-white text-[#004080] border-2 border-[#004080] font-bold text-xs sm:text-sm shadow-[2px_2px_0px_#004080] transition-all flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-4 h-4 flex-shrink-0" />
                <span>DOWNLOAD FILE GAMBAR (PNG)</span>
              </button>

              <button
                onClick={handleReset}
                className="w-full py-2.5 bg-white hover:bg-[#F4EBD0] text-[#004080] border-2 border-[#004080] font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4 flex-shrink-0" />
                <span>Buat KTA Lainnya</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Live KTA Preview & Specifications */}
      <div className="lg:col-span-6 flex flex-col items-center w-full">
        <div className="w-full bg-white border-[3px] border-[#004080] shadow-[4px_4px_0px_#004080] sm:shadow-[6px_6px_0px_#004080] p-4 sm:p-8 flex flex-col items-center">
          <div className="w-full flex items-center justify-between pb-3 sm:pb-4 mb-4 sm:mb-6 border-b-2 border-[#004080]">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-bold text-[#D35400] uppercase tracking-wider"
                style={{
                  fontFamily: "var(--font-pixel, 'Courier New', monospace)",
                }}
              >
                LIVE PREVIEW KTA
              </span>
            </div>
            <span className="text-xs font-bold text-[#004080]/70">
              CR-80 (85.6 × 54 mm)
            </span>
          </div>

          {/* Fully Responsive Card Container Without Overlap or Overflow */}
          <div className="w-full flex justify-center items-center overflow-hidden py-1">
            <div
              className="relative flex justify-center items-center"
              style={{
                width: "428px",
                height: "270px",
                maxWidth: "100%",
              }}
            >
              <div className="origin-top transform scale-[0.68] xs:scale-[0.78] sm:scale-95 md:scale-100 transition-transform">
                <KTACard
                  data={previewData}
                  cardRef={cardRef}
                  isPreview={true}
                />
              </div>
            </div>
          </div>

          {/* Info Card Banner */}
          <div className="mt-2 sm:mt-4 w-full bg-[#F4EBD0]/60 border-2 border-[#004080] p-3 text-xs text-[#004080] space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span>🎮 KaDigi x KKA • SDN 231 Sukaasih</span>
            </div>
            <p className="text-[#004080]/80 leading-relaxed">
              Kartu ini di-generate dengan resolusi 300 DPI siap dicetak pada
              printer kartu identitas CR-80 atau kertas foto standar KTP/SIM
              lengkap dengan logo resmi KaDigi x KKA.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
