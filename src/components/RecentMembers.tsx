"use client";

import React, { useEffect, useState, useRef } from "react";
import { Users, RefreshCw, Download, Award, AlertCircle } from "lucide-react";
import { KTACard, KTADetails } from "./KTACard";
import { exportToPDF } from "@/lib/pdfExporter";

interface RecentMembersProps {
  refreshTrigger: number;
}

export const RecentMembers: React.FC<RecentMembersProps> = ({
  refreshTrigger,
}) => {
  const [members, setMembers] = useState<KTADetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<KTADetails | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const fetchRecentMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/member", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal mengambil data anggota.");
      }
      setMembers(json.data || []);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat daftar anggota dari server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentMembers();
  }, [refreshTrigger]);

  const handleDownloadPDF = async (member: KTADetails) => {
    setSelectedMember(member);
    setTimeout(async () => {
      if (cardRef.current) {
        await exportToPDF(
          cardRef.current,
          member.memberCode || "",
          member.fullName
        );
      }
    }, 150);
  };

  return (
    <section className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t-[3px] border-[#004080]">
      {/* Hidden Card Render Container for High-Res PDF download from grid */}
      {selectedMember && (
        <div className="fixed -left-[9999px] top-0 pointer-events-none opacity-0">
          <KTACard data={selectedMember} cardRef={cardRef} />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#D35400]" />
            <span
              className="text-xs font-bold uppercase tracking-widest text-[#D35400]"
              style={{
                fontFamily: "var(--font-pixel, 'Courier New', monospace)",
              }}
            >
              WALL OF FAME
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#004080] mt-1">
            Anggota Terbaru KaDigi x KKA • SDN 231 Sukaasih
          </h2>
        </div>

        <button
          onClick={fetchRecentMembers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-[#EAA221] text-[#004080] border-2 border-[#004080] font-bold text-xs sm:text-sm shadow-[2px_2px_0px_#004080] transition-all disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Daftar</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-[#D35400]/10 border-2 border-[#D35400] text-[#D35400] text-sm font-semibold flex items-center gap-2 mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-44 bg-white/60 border-2 border-[#004080]/40 animate-pulse"
            />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white border-2 border-[#004080] p-8 text-center shadow-[4px_4px_0px_#004080]">
          <Users className="w-12 h-12 text-[#004080]/40 mx-auto mb-2" />
          <p className="font-bold text-lg text-[#004080]">
            Belum Ada KTA yang Diterbitkan
          </p>
          <p className="text-sm text-[#004080]/70 mt-1">
            Jadilah siswa pertama yang membuat Kartu Tanda Anggota di atas!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {members.map((m) => (
            <div
              key={m.id || m.fullName}
              className="bg-white border-2 border-[#004080] shadow-[3px_3px_0px_#004080] p-4 hover:-translate-y-1 hover:shadow-[5px_5px_0px_#004080] transition-all flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-14 bg-[#F4EBD0] border-2 border-[#004080] overflow-hidden flex-shrink-0">
                  {m.photoBase64 ? (
                    <img
                      src={m.photoBase64}
                      alt={m.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#EAA221] flex items-center justify-center text-xs font-bold text-[#004080]">
                      KTA
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4
                    className="font-extrabold text-sm text-[#004080] truncate uppercase"
                    title={m.fullName}
                  >
                    {m.fullName}
                  </h4>
                  <div className="inline-block bg-[#F4EBD0] border border-[#004080] px-1.5 py-0.5 mt-1">
                    <span className="text-[9px] font-bold text-[#D35400] uppercase">
                      ANGGOTA EKSKUL KaDigi x KKA
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#004080]/20 flex items-center justify-between text-xs">
                <span className="text-[#004080]/70 font-semibold">
                  {m.createdAt
                    ? new Date(m.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Baru Saja"}
                </span>

                <button
                  onClick={() => handleDownloadPDF(m)}
                  className="inline-flex items-center gap-1 text-[#D35400] hover:text-[#004080] font-bold transition-colors"
                  title="Download KTA PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
