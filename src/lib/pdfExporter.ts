import { toPng } from "html-to-image";
import jsPDF from "jspdf";

/**
 * Ensures all webfonts and images are ready before capturing canvas
 */
async function waitForFontsAndDOM(): Promise<void> {
  if (typeof document !== "undefined" && document.fonts) {
    try {
      await document.fonts.ready;
    } catch (e) {
      // Ignore font loading errors
    }
  }
  // Short yield to allow any DOM relayouts
  await new Promise((resolve) => setTimeout(resolve, 80));
}

/**
 * Captures the KTACard element and exports it as a ready-to-print CR-80 standard ID Card PDF
 * CR-80 Dimension: 85.60 mm x 53.98 mm
 * Resolution: pixelRatio 3 (~300 DPI high resolution print quality)
 *
 * Uses html-to-image instead of html2canvas so the exported image is 100% pixel-for-pixel
 * identical to the Live Preview in the browser — zero squished text, zero cream background border.
 */
export async function exportToPDF(
  element: HTMLElement,
  memberCode: string | undefined = "",
  fullName: string
): Promise<void> {
  await waitForFontsAndDOM();

  // Capture card with pixelRatio 3 for crisp 300 DPI typography and pixel art
  const imgData = await toPng(element, {
    pixelRatio: 3,
    backgroundColor: "#F4EBD0",
    width: 428,
    height: 270,
    style: {
      transform: "none",
      margin: "0",
    },
    cacheBust: true,
  });

  // Initialize jsPDF in landscape with exact CR-80 millimeters
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [85.6, 53.98],
  });

  // Add the high-resolution image covering the entire 85.6 x 53.98 mm surface
  pdf.addImage(imgData, "PNG", 0, 0, 85.6, 53.98, undefined, "FAST");

  // Generate safe filename
  const safeName = fullName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 20);
  const codeSuffix = memberCode ? `-${memberCode}` : "";
  const fileName = `KTA${codeSuffix}-${safeName}.pdf`;

  pdf.save(fileName);
}

/**
 * Captures the KTACard element and exports as a crisp PNG image for digital sharing
 */
export async function exportToPNG(
  element: HTMLElement,
  memberCode: string | undefined = "",
  fullName: string
): Promise<void> {
  await waitForFontsAndDOM();

  const imgData = await toPng(element, {
    pixelRatio: 3,
    backgroundColor: "#F4EBD0",
    width: 428,
    height: 270,
    style: {
      transform: "none",
      margin: "0",
    },
    cacheBust: true,
  });

  const link = document.createElement("a");
  const safeName = fullName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 20);
  const codeSuffix = memberCode ? `-${memberCode}` : "";
  link.download = `KTA${codeSuffix}-${safeName}.png`;
  link.href = imgData;
  link.click();
}
