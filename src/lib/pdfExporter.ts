import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Ensures all webfonts are ready before capturing canvas
 */
async function waitForFonts(): Promise<void> {
  if (typeof document !== "undefined" && document.fonts) {
    try {
      await document.fonts.ready;
    } catch (e) {
      // Ignore font loading errors
    }
  }
}

/**
 * Captures the KTACard element and exports it as a ready-to-print CR-80 standard ID Card PDF
 * CR-80 Dimension: 85.60 mm x 53.98 mm
 * Resolution: scale 3 (~300 DPI high resolution print quality)
 */
export async function exportToPDF(
  element: HTMLElement,
  memberCode: string,
  fullName: string
): Promise<void> {
  await waitForFonts();

  // Capture card with scale 3 for high-res crisp typography and pixel art
  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#F4EBD0",
    logging: false,
    onclone: (clonedDoc, clonedEl) => {
      // Ensure the cloned card has no scaling or transformations that could clip text
      clonedEl.style.transform = "none";
      clonedEl.style.width = "428px";
      clonedEl.style.height = "270px";
      clonedEl.style.margin = "0";
    },
  });

  const imgData = canvas.toDataURL("image/png");

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
  const fileName = `KTA-${memberCode}-${safeName}.pdf`;

  pdf.save(fileName);
}

/**
 * Captures the KTACard element and exports as a crisp PNG image for digital sharing
 */
export async function exportToPNG(
  element: HTMLElement,
  memberCode: string,
  fullName: string
): Promise<void> {
  await waitForFonts();

  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#F4EBD0",
    logging: false,
    onclone: (clonedDoc, clonedEl) => {
      // Ensure the cloned card has no scaling or transformations that could clip text
      clonedEl.style.transform = "none";
      clonedEl.style.width = "428px";
      clonedEl.style.height = "270px";
      clonedEl.style.margin = "0";
    },
  });

  const imgData = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  const safeName = fullName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 20);
  link.download = `KTA-${memberCode}-${safeName}.png`;
  link.href = imgData;
  link.click();
}
