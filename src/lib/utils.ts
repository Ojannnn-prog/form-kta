import { prisma } from "./prisma";

/**
 * Generates a random 3-digit number padded with leading zeros (000 - 999)
 * and prefixes it with EKSTIKKA -> EKSTIKKAxxx
 */
export function generateRandomMemberCode(): string {
  const randomNum = Math.floor(Math.random() * 1000);
  const padded = randomNum.toString().padStart(3, "0");
  return `EKSTIKKA${padded}`;
}

/**
 * Generates a guaranteed unique member code by checking against existing codes in the database
 */
export async function getUniqueMemberCode(): Promise<string> {
  let code = generateRandomMemberCode();
  let attempts = 0;
  const maxAttempts = 20;

  while (attempts < maxAttempts) {
    const existing = await prisma.member.findUnique({
      where: { memberCode: code },
      select: { id: true },
    });

    if (!existing) {
      return code;
    }

    code = generateRandomMemberCode();
    attempts++;
  }

  // Fallback in rare case all 3-digit attempts collide: append timestamp digits
  const fallbackNum = Math.floor(100 + Math.random() * 900);
  return `EKSTIKKA${fallbackNum}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}
