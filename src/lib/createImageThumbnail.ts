type CreateThumbnailOptions = {
  /** Max width or height in pixels */
  maxSize?: number;
  /** Compression quality from 0 to 1 */
  quality?: number;
};

/**
 * Resize and compress an image in the browser for use as a product thumbnail.
 */
export async function createImageThumbnail(
  file: File,
  { maxSize = 400, quality = 0.82 }: CreateThumbnailOptions = {}
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Could not create thumbnail canvas.");
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await canvasToBlob(canvas, "image/webp", quality);
  if (blob) return blob;

  const jpegBlob = await canvasToBlob(canvas, "image/jpeg", quality);
  if (jpegBlob) return jpegBlob;

  throw new Error("Could not encode thumbnail.");
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}
