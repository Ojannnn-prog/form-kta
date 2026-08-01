/**
 * Converts an uploaded image File to a resized Base64 JPEG string using HTML5 Canvas.
 * Keeps file size small (~30-80KB) to prevent Neon PostgreSQL database bloat.
 */
export function resizeImageToBase64(
  file: File,
  maxDimension = 600,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Basic file validation
    if (!file.type.startsWith("image/")) {
      reject(new Error("File yang dipilih harus berupa file gambar (JPG, PNG, WEBP)."));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect ratio
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Gagal menginisialisasi canvas untuk kompresi foto."));
          return;
        }

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Draw white background for transparent PNGs before JPEG export
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);

        const base64Data = canvas.toDataURL("image/jpeg", quality);
        resolve(base64Data);
      };

      img.onerror = () => {
        reject(new Error("Gagal memuat file gambar untuk diproses."));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Gagal membaca file gambar dari perangkat."));
    };

    reader.readAsDataURL(file);
  });
}
