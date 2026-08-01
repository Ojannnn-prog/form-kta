import html2canvas from "html2canvas";
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
 * Resolution: scale 3 (~300 DPI high resolution print quality)
 *
 * Guarantees zero extra whitespace/background by pinning clonedEl to absolute (0,0)
 * with exact 428x270 dimensions and scrollX/scrollY reset to 0.
 */
export async function exportToPDF(
  element: HTMLElement,
  memberCode: string | undefined = "",
  fullName: string
): Promise<void> {
  await waitForFontsAndDOM();

  // Capture card with scale 3 for high-res crisp typography and pixel art
  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#F4EBD0",
    logging: false,
    width: 428,
    height: 270,
    windowWidth: 428,
    windowHeight: 270,
    x: 0,
    y: 0,
    scrollX: 0,
    scrollY: 0,
    onclone: (clonedDoc, clonedEl) => {
      // 1. Reset document/body margins and scrollbar padding in the cloned iframe
      clonedDoc.documentElement.style.margin = "0px";
      clonedDoc.documentElement.style.padding = "0px";
      clonedDoc.documentElement.style.overflow = "hidden";
      clonedDoc.body.style.margin = "0px";
      clonedDoc.body.style.padding = "0px";
      clonedDoc.body.style.overflow = "hidden";

      // 2. Position the cloned card at exact coordinate (0, 0) to prevent any cream background border
      clonedEl.style.position = "absolute";
      clonedEl.style.left = "0px";
      clonedEl.style.top = "0px";
      clonedEl.style.margin = "0px";
      clonedEl.style.padding = "0px";
      clonedEl.style.transform = "none";
      clonedEl.style.width = "428px";
      clonedEl.style.height = "270px";
      clonedEl.style.overflow = "hidden";
    },
  });

  const imgData = canvas.toDataURL("image/png", 1.0);

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

  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#F4EBD0",
    logging: false,
    width: 428,
    height: 270,
    windowWidth: 428,
    windowHeight: 270,
    x: 0,
    y: 0,
    scrollX: 0,
    scrollY: 0,
    onclone: (clonedDoc, clonedEl) => {
      // 1. Reset document/body margins and scrollbar padding in the cloned iframe
      clonedDoc.documentElement.style.margin = "0px";
      clonedDoc.documentElement.style.padding = "0px";
      clonedDoc.documentElement.style.overflow = "hidden";
      clonedDoc.body.style.margin = "0px";
      clonedDoc.body.style.padding = "0px";
      clonedDoc.body.style.overflow = "hidden";

      // 2. Position the cloned card at exact coordinate (0, 0) to prevent any cream background border
      clonedEl.style.position = "absolute";
      clonedEl.style.left = "0px";
      clonedEl.style.top = "0px";
      clonedEl.style.margin = "0px";
      clonedEl.style.padding = "0px";
      clonedEl.style.transform = "none";
      clonedEl.style.width = "428px";
      clonedEl.style.height = "270px";
      clonedEl.style.overflow = "hidden";
    },
  });

  const imgData = canvas.toDataURL("image/png", 1.0);
  const link = document.createElement("a");
  const safeName = fullName.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 20);
  const codeSuffix = memberCode ? `-${memberCode}` : "";
  link.download = `KTA${codeSuffix}-${safeName}.png`;
  link.href = imgData;
  link.click();
}
