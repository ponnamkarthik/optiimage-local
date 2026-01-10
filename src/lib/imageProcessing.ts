import { ImageFormat, CompressionSettings } from "./types";

type ImageDataLike = Pick<ImageData, "data" | "width" | "height">;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const toQuality100 = (quality01: number) =>
  Math.round(clamp(quality01, 0, 1) * 100);

const createIcoFromPng = async (
  pngBlob: Blob,
  width: number,
  height: number
): Promise<Blob> => {
  const pngBuffer = await pngBlob.arrayBuffer();
  const pngData = new Uint8Array(pngBuffer);

  const header = new Uint8Array(22);
  const view = new DataView(header.buffer);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true); // Type: Icon
  view.setUint16(4, 1, true); // Image count: 1

  const w = width >= 256 ? 0 : width;
  const h = height >= 256 ? 0 : height;

  view.setUint8(6, w);
  view.setUint8(7, h);
  view.setUint8(8, 0);
  view.setUint8(9, 0);
  view.setUint16(10, 1, true); // Planes
  view.setUint16(12, 32, true); // BitCount
  view.setUint32(14, pngData.length, true);
  view.setUint32(18, 22, true); // Offset

  const icoData = new Uint8Array(header.length + pngData.length);
  icoData.set(header);
  icoData.set(pngData, header.length);

  return new Blob([icoData], { type: ImageFormat.ICO });
};

const loadImageSource = async (
  file: File
): Promise<ImageBitmap | HTMLImageElement> => {
  try {
    return await createImageBitmap(file);
  } catch {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`Failed to load image: ${file.name}`));
      };
      img.src = url;
    });
  }
};

const imageDataFromRasterSource = async (
  source: ImageBitmap | HTMLImageElement,
  width: number,
  height: number
): Promise<ImageData> => {
  const useOffscreen = typeof OffscreenCanvas !== "undefined";
  const canvas = useOffscreen
    ? new OffscreenCanvas(width, height)
    : document.createElement("canvas");

  if (!useOffscreen) {
    (canvas as HTMLCanvasElement).width = width;
    (canvas as HTMLCanvasElement).height = height;
  }

  const ctx = canvas.getContext("2d") as
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D;
  if (!ctx) throw new Error("Canvas context unavailable");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, width, height);

  return (ctx as CanvasRenderingContext2D).getImageData(0, 0, width, height);
};

const decodeToImageDataWithJsquash = async (file: File): Promise<ImageData> => {
  const buffer = await file.arrayBuffer();
  const assertDecoded = (result: ImageData | null): ImageData => {
    if (!result) throw new Error("Decoding error");
    return result;
  };

  switch (file.type) {
    case ImageFormat.PNG: {
      const { default: decode } = await import("@jsquash/png/decode");
      return decode(buffer);
    }
    case ImageFormat.JPEG: {
      const { default: decode } = await import("@jsquash/jpeg/decode");
      return decode(buffer, { preserveOrientation: true });
    }
    case ImageFormat.WEBP: {
      const { default: decode } = await import("@jsquash/webp/decode");
      return decode(buffer);
    }
    case ImageFormat.AVIF: {
      const { default: decode } = await import("@jsquash/avif/decode");
      return assertDecoded(await decode(buffer, { bitDepth: 8 }));
    }
    case ImageFormat.JXL: {
      const { default: decode } = await import("@jsquash/jxl/decode");
      return decode(buffer);
    }
    case ImageFormat.QOI: {
      const { default: decode } = await import("@jsquash/qoi/decode");
      return decode(buffer);
    }
    default:
      throw new Error(`No jsquash decoder for type: ${file.type || "unknown"}`);
  }
};

const resizeImageDataIfNeeded = async (
  data: ImageData,
  settings: CompressionSettings
): Promise<ImageData> => {
  if (!settings.resizeEnabled) return data;

  const width = Math.max(1, Math.round(settings.resizeWidth));
  const height = Math.max(1, Math.round(settings.resizeHeight));
  if (width === data.width && height === data.height) return data;

  const { default: resize } = await import("@jsquash/resize");
  return resize(data, { width, height });
};

const encodeWithJsquash = async (
  data: ImageDataLike,
  targetFormat: ImageFormat,
  settings: CompressionSettings
): Promise<Blob> => {
  const quality = toQuality100(settings.quality);

  switch (targetFormat) {
    case ImageFormat.JPEG: {
      const { default: encode } = await import("@jsquash/jpeg/encode");
      const out = await encode(data as ImageData, { quality });
      return new Blob([out], { type: ImageFormat.JPEG });
    }
    case ImageFormat.WEBP: {
      const { default: encode } = await import("@jsquash/webp/encode");
      const out = await encode(data as ImageData, { quality });
      return new Blob([out], { type: ImageFormat.WEBP });
    }
    case ImageFormat.AVIF: {
      const { default: encode } = await import("@jsquash/avif/encode");
      const out = await encode(data as ImageData, { quality });
      return new Blob([out], { type: ImageFormat.AVIF });
    }
    case ImageFormat.JXL: {
      const { default: encode } = await import("@jsquash/jxl/encode");
      const out = await encode(data as ImageData, { quality });
      return new Blob([out], { type: ImageFormat.JXL });
    }
    case ImageFormat.QOI: {
      const { default: encode } = await import("@jsquash/qoi/encode");
      const out = await encode(data as ImageData);
      return new Blob([out], { type: ImageFormat.QOI });
    }
    case ImageFormat.PNG: {
      const { default: encode } = await import("@jsquash/png/encode");
      const png = await encode(data as ImageData, { bitDepth: 8 });
      const { default: optimise } = await import("@jsquash/oxipng/optimise");
      // PNG is lossless and can be slow on large images; keep optimisation fast by default.
      // If we later expose a UI toggle for autoMode, this can be used to switch presets.
      const optimised = await optimise(png, {
        level: settings.autoMode ? 1 : 3,
      });
      return new Blob([optimised], { type: ImageFormat.PNG });
    }
    default:
      throw new Error(`No jsquash encoder for format: ${targetFormat}`);
  }
};

export const processImage = async (
  file: File,
  settings: CompressionSettings
): Promise<Blob> => {
  let targetFormat = settings.format;
  const isIco = targetFormat === ImageFormat.ICO;

  if (targetFormat === ImageFormat.ORIGINAL) {
    if (file.type === "image/svg+xml") {
      targetFormat = ImageFormat.PNG;
    } else {
      targetFormat = file.type as ImageFormat;
      if (
        ![
          ImageFormat.JPEG,
          ImageFormat.PNG,
          ImageFormat.WEBP,
          ImageFormat.AVIF,
          ImageFormat.JXL,
          ImageFormat.QOI,
        ].includes(targetFormat)
      ) {
        targetFormat = ImageFormat.JPEG;
      }
    }
  }

  try {
    const exportFormat = isIco ? ImageFormat.PNG : targetFormat;

    let imageData: ImageData;
    let finalWidth: number;
    let finalHeight: number;

    // SVG must be rasterized by the browser first.
    if (file.type === "image/svg+xml") {
      const source = await loadImageSource(file);
      const width = settings.resizeEnabled
        ? Math.max(1, Math.round(settings.resizeWidth))
        : source.width;
      const height = settings.resizeEnabled
        ? Math.max(1, Math.round(settings.resizeHeight))
        : source.height;
      imageData = await imageDataFromRasterSource(source, width, height);
      finalWidth = width;
      finalHeight = height;
      if ("close" in source) source.close();
    } else {
      // Prefer browser decode when possible; fall back to jsquash decode for formats
      // the browser can't natively decode (e.g. JXL/QOI).
      try {
        const source = await loadImageSource(file);
        const width = settings.resizeEnabled
          ? Math.max(1, Math.round(settings.resizeWidth))
          : source.width;
        const height = settings.resizeEnabled
          ? Math.max(1, Math.round(settings.resizeHeight))
          : source.height;
        imageData = await imageDataFromRasterSource(source, width, height);
        finalWidth = width;
        finalHeight = height;
        if ("close" in source) source.close();
      } catch {
        const decoded = await decodeToImageDataWithJsquash(file);
        const resized = await resizeImageDataIfNeeded(decoded, settings);
        imageData = resized;
        finalWidth = resized.width;
        finalHeight = resized.height;
      }
    }

    let blob = await encodeWithJsquash(imageData, exportFormat, settings);

    if (isIco) {
      blob = await createIcoFromPng(blob, finalWidth, finalHeight);
    }

    return blob;
  } catch (error) {
    console.error("Processing pipeline failed:", error);
    throw error;
  }
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(Math.max(0, decimals))) +
    " " +
    sizes[i]
  );
};

export const getImageDimensions = async (
  file: File
): Promise<{ width: number; height: number }> => {
  try {
    const source = await loadImageSource(file);
    const dims = { width: source.width, height: source.height };
    if ("close" in source) source.close();
    return dims;
  } catch (e) {
    try {
      const decoded = await decodeToImageDataWithJsquash(file);
      return { width: decoded.width, height: decoded.height };
    } catch (e2) {
      console.warn("Dimension check failed:", e, e2);
      return { width: 0, height: 0 };
    }
  }
};
