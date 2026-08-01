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
  await new Promise((resolve) => setTimeout(resolve, 100));
}

/**
 * Sanitizes any modern CSS color functions (LAB, OKLCH, color-mix) from cloned DOM nodes,
 * AND enforces letter-spacing / anti-ligature rules to permanently prevent HTML2Canvas
 * from squishing, overlapping, or clipping words on Windows Chrome/Edge.
 */
function prepareClonedDOMForCanvas(rootEl: HTMLElement, clonedDoc: Document): void {
  // Ensure web fonts from main document are available inside the cloned document
  if (typeof document !== "undefined" && document.fonts && clonedDoc.fonts) {
    document.fonts.forEach((font) => {
      try {
        clonedDoc.fonts.add(font);
      } catch (e) {
        // Ignore unsupported font handle errors
      }
    });
  }

  const allNodes = [rootEl, ...Array.from(rootEl.querySelectorAll("*"))];
  allNodes.forEach((node) => {
    if (node instanceof HTMLElement || node instanceof SVGElement) {
      const computed = window.getComputedStyle(node);

      const color = computed.getPropertyValue("color");
      const bg = computed.getPropertyValue("background-color");
      const border = computed.getPropertyValue("border-color");

      if (
        color &&
        (color.includes("lab(") ||
          color.includes("oklch(") ||
          color.includes("color-mix("))
      ) {
        node.style.setProperty("color", "#004080", "important");
      }
      if (
        bg &&
        (bg.includes("lab(") ||
          bg.includes("oklch(") ||
          bg.includes("color-mix("))
      ) {
        node.style.setProperty("background-color", "#F4EBD0", "important");
      }
      if (
        border &&
        (border.includes("lab(") ||
          border.includes("oklch(") ||
          border.includes("color-mix("))
      ) {
        node.style.setProperty("border-color", "#004080", "important");
      }
    }

    // Apply Magic CSS Fix for HTML2Canvas text squishing and clipping on Windows
    if (node instanceof HTMLElement) {
      node.style.fontVariantLigatures = "none";
      node.style.fontFeatureSettings = '"liga" 0';
      node.style.textRendering = "geometricPrecision";
      
      // Ensure letter-spacing is slightly positive so characters never collide
      const currentSpacing = node.style.letterSpacing;
      if (!currentSpacing || currentSpacing === "normal" || currentSpacing === "0px") {
        node.style.letterSpacing = "0.25px";
      }
    }
  });
}

/**
 * Captures the KTACard element and exports it as a ready-to-print CR-80 standard ID Card PDF
 * CR-80 Dimension: 85.60 mm x 53.98 mm
 * Resolution: scale 3 (~300 DPI high resolution print quality)
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
    onclone: (clonedDoc, clonedEl) => {
      // Ensure the cloned card has no scaling or transformations that could clip text
      clonedEl.style.transform = "none";
      clonedEl.style.width = "428px";
      clonedEl.style.height = "270px";
      clonedEl.style.margin = "0";
      clonedEl.style.position = "relative";
      clonedEl.style.overflow = "hidden";

      // Sanitize LAB/OKLCH color functions and apply anti-squish typography rules
      prepareClonedDOMForCanvas(clonedEl, clonedDoc);
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
    onclone: (clonedDoc, clonedEl) => {
      // Ensure the cloned card has no scaling or transformations that could clip text
      clonedEl.style.transform = "none";
      clonedEl.style.width = "428px";
      clonedEl.style.height = "270px";
      clonedEl.style.margin = "0";
      clonedEl.style.position = "relative";
      clonedEl.style.overflow = "hidden";

      // Sanitize LAB/OKLCH color functions and apply anti-squish typography rules
      prepareClonedDOMForCanvas(clonedEl, clonedDoc);
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
