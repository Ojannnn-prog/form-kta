import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUniqueMemberCode } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, photoBase64, memberCode: customCode } = body;

    if (!fullName || typeof fullName !== "string" || fullName.trim() === "") {
      return NextResponse.json(
        { error: "Nama lengkap wajib diisi." },
        { status: 400 }
      );
    }

    if (!photoBase64 || typeof photoBase64 !== "string") {
      return NextResponse.json(
        { error: "Foto siswa wajib diupload (format Base64)." },
        { status: 400 }
      );
    }

    // Determine unique member code
    let memberCode = customCode;
    if (!memberCode) {
      memberCode = await getUniqueMemberCode();
    } else {
      // If custom code provided, check if it already exists
      const existing = await prisma.member.findUnique({
        where: { memberCode },
      });
      if (existing) {
        // If code already taken, generate a new unique code automatically
        memberCode = await getUniqueMemberCode();
      }
    }

    const newMember = await prisma.member.create({
      data: {
        fullName: fullName.trim(),
        memberCode,
        photoBase64,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "KTA berhasil dibuat!",
        data: newMember,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error creating KTA member:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Terjadi kesalahan internal server.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const codeParam = searchParams.get("code");
    const idParam = searchParams.get("id");

    if (codeParam) {
      const member = await prisma.member.findUnique({
        where: { memberCode: codeParam.toUpperCase().trim() },
      });
      if (!member) {
        return NextResponse.json(
          { error: "Kartu KTA dengan kode tersebut tidak ditemukan." },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: member });
    }

    if (idParam) {
      const member = await prisma.member.findUnique({
        where: { id: idParam },
      });
      if (!member) {
        return NextResponse.json(
          { error: "Kartu KTA dengan ID tersebut tidak ditemukan." },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: member });
    }

    // Return latest 12 members for Wall of Fame / preview list
    const recentMembers = await prisma.member.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        fullName: true,
        memberCode: true,
        photoBase64: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: recentMembers,
    });
  } catch (error: unknown) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dari server." },
      { status: 500 }
    );
  }
}
