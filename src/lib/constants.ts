import { ImageFormat } from "./types";

export const SUPPORTED_FORMATS = [
  { label: "Original Format", value: ImageFormat.ORIGINAL },
  { label: "JPEG", value: ImageFormat.JPEG },
  { label: "PNG", value: ImageFormat.PNG },
  { label: "WebP", value: ImageFormat.WEBP },
  { label: "AVIF", value: ImageFormat.AVIF },
  { label: "JPEG XL (JXL)", value: ImageFormat.JXL },
  { label: "QOI", value: ImageFormat.QOI },
  { label: "ICO", value: ImageFormat.ICO },
];

export const DEFAULT_QUALITY = 0.8;

export const FORMAT_LABELS: Record<string, string> = {
  [ImageFormat.ORIGINAL]: "Original",
  [ImageFormat.JPEG]: "JPEG",
  [ImageFormat.PNG]: "PNG",
  [ImageFormat.WEBP]: "WebP",
  [ImageFormat.AVIF]: "AVIF",
  [ImageFormat.JXL]: "JXL",
  [ImageFormat.QOI]: "QOI",
  [ImageFormat.ICO]: "ICO",
};

export const EXTENSIONS: Record<string, string> = {
  [ImageFormat.JPEG]: "jpg",
  [ImageFormat.PNG]: "png",
  [ImageFormat.WEBP]: "webp",
  [ImageFormat.AVIF]: "avif",
  [ImageFormat.JXL]: "jxl",
  [ImageFormat.QOI]: "qoi",
  [ImageFormat.ICO]: "ico",
};
