export enum ImageFormat {
  ORIGINAL = "original",
  JPEG = "image/jpeg",
  PNG = "image/png",
  WEBP = "image/webp",
  AVIF = "image/avif",
  JXL = "image/jxl",
  QOI = "image/qoi",
  ICO = "image/x-icon",
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageFile {
  id: string;
  file: File;
  previewUrl: string;
  originalSize: number;
  dimensions: ImageDimensions;
  status: "pending" | "processing" | "done" | "error";
  settings: CompressionSettings;
  result?: {
    blob: Blob;
    url: string;
    size: number;
    reduction: number;
    timeTaken: number;
  };
  error?: string;
}

export interface CompressionSettings {
  format: ImageFormat;
  quality: number; // 0.0 to 1.0
  autoMode: boolean;
  resizeEnabled: boolean;
  resizeWidth: number;
  resizeHeight: number;
  maintainAspectRatio: boolean;
}

export interface GlobalSettings {
  defaultFormat: ImageFormat;
  defaultQuality: number;
}
