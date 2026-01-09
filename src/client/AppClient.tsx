"use client";

import { Image as ImageIcon, ShieldCheck, Zap } from "lucide-react";
import { useCallback, useState } from "react";

import ActionToolbar from "@/components/ActionToolbar";
import Dropzone from "@/components/Dropzone";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ImageCard from "@/components/ImageCard";
import { PrivacyView, TermsView } from "@/components/LegalViews";
import { DEFAULT_QUALITY } from "@/lib/constants";
import { getImageDimensions } from "@/lib/imageProcessing";
import { CompressionSettings, ImageFile, ImageFormat } from "@/lib/types";

type ViewState = "home" | "privacy" | "terms";

export default function AppClient() {
  const [view, setView] = useState<ViewState>("home");
  const [images, setImages] = useState<ImageFile[]>([]);
  const [globalQuality] = useState(DEFAULT_QUALITY);
  const [globalFormat, setGlobalFormat] = useState<ImageFormat>(
    ImageFormat.ORIGINAL
  );

  const handleFilesDropped = useCallback(
    async (files: File[]) => {
      const newImages = await Promise.all(
        files.map(async (file) => {
          let dimensions = { width: 0, height: 0 };
          try {
            dimensions = await getImageDimensions(file);
          } catch (e) {
            console.error("Metadata extraction failed", e);
          }

          const initialFormat =
            file.type === "image/svg+xml" &&
            globalFormat === ImageFormat.ORIGINAL
              ? ImageFormat.PNG
              : globalFormat;

          return {
            id: crypto.randomUUID(),
            file,
            previewUrl: URL.createObjectURL(file),
            originalSize: file.size,
            dimensions,
            status: "processing",
            settings: {
              format: initialFormat,
              quality: globalQuality,
              autoMode: true,
              resizeEnabled: false,
              resizeWidth: dimensions.width,
              resizeHeight: dimensions.height,
              maintainAspectRatio: true,
            },
          } as ImageFile;
        })
      );

      setImages((prev) => [...prev, ...newImages]);
    },
    [globalQuality, globalFormat]
  );

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        if (target.result) URL.revokeObjectURL(target.result.url);
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    images.forEach((img) => {
      URL.revokeObjectURL(img.previewUrl);
      if (img.result) URL.revokeObjectURL(img.result.url);
    });
    setImages([]);
  }, [images]);

  const updateImageSettings = useCallback(
    (id: string, newSettings: Partial<CompressionSettings>) => {
      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? {
                ...img,
                status: (() => {
                  const nextSettings = { ...img.settings, ...newSettings };

                  const baseWidth =
                    img.dimensions.width || img.settings.resizeWidth;
                  const baseHeight =
                    img.dimensions.height || img.settings.resizeHeight;

                  const currentOutWidth = img.settings.resizeEnabled
                    ? img.settings.resizeWidth
                    : baseWidth;
                  const currentOutHeight = img.settings.resizeEnabled
                    ? img.settings.resizeHeight
                    : baseHeight;

                  const nextOutWidth = nextSettings.resizeEnabled
                    ? nextSettings.resizeWidth
                    : baseWidth;
                  const nextOutHeight = nextSettings.resizeEnabled
                    ? nextSettings.resizeHeight
                    : baseHeight;

                  const shouldReprocess =
                    img.settings.format !== nextSettings.format ||
                    img.settings.quality !== nextSettings.quality ||
                    currentOutWidth !== nextOutWidth ||
                    currentOutHeight !== nextOutHeight;

                  return shouldReprocess ? "processing" : img.status;
                })(),
                settings: { ...img.settings, ...newSettings },
              }
            : img
        )
      );
    },
    []
  );

  const handleProcessComplete = useCallback(
    (id: string, result: ImageFile["result"]) => {
      setImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, status: "done", result } : img
        )
      );
    },
    []
  );

  const handleError = useCallback((id: string, error: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, status: "error", error } : img
      )
    );
  }, []);

  const handleGlobalFormatChange = useCallback((newFormat: ImageFormat) => {
    setGlobalFormat(newFormat);
    setImages((prev) =>
      prev.map((img) => {
        const nextFormat =
          img.file.type === "image/svg+xml" &&
          newFormat === ImageFormat.ORIGINAL
            ? ImageFormat.PNG
            : newFormat;

        return {
          ...img,
          status: "processing",
          settings: { ...img.settings, format: nextFormat },
        };
      })
    );
  }, []);

  const handleDownloadAll = useCallback(() => {
    const anchor = document.createElement("a");
    document.body.appendChild(anchor);

    images.forEach((img) => {
      if (img.status === "done" && img.result) {
        anchor.href = img.result.url;
        anchor.download = `opt-${img.file.name}`;
        anchor.click();
      }
    });

    document.body.removeChild(anchor);
  }, [images]);

  const totalSaved = images.reduce(
    (acc, img) =>
      img.result ? acc + (img.originalSize - img.result.size) : acc,
    0
  );
  const totalSavedMB = totalSaved / 1024 / 1024;
  const processedCount = images.filter((i) => i.status === "done").length;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header onNavigateHome={() => setView("home")} />

      <main className="container mx-auto px-4 py-8 flex-grow">
        {view === "home" ? (
          <>
            <div className="mb-8">
              <div className="mb-8 text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Compress, Resize &amp; Optimize Images
                  <br className="hidden sm:block" />
                  <span className="text-accentText">
                    Securely in Your Browser
                  </span>
                </h1>
                <p className="text-muted max-w-3xl mx-auto text-lg">
                  Reduce file size by up to 90%, resize photos, and convert
                  between JPG, PNG, WebP, AVIF, JXL, SVG, and ICO. Free,
                  unlimited, and runs 100% offline.
                </p>
              </div>
              <Dropzone onFilesDropped={handleFilesDropped} />
            </div>

            {images.length > 0 && (
              <ActionToolbar
                imageCount={images.length}
                globalFormat={globalFormat}
                onGlobalFormatChange={handleGlobalFormatChange}
                totalSavedMB={totalSavedMB}
                onClearAll={clearAll}
                onDownloadAll={handleDownloadAll}
                canDownload={processedCount > 0}
              />
            )}

            <div className="space-y-4">
              {images.map((img) => (
                <ImageCard
                  key={img.id}
                  item={img}
                  onRemove={removeImage}
                  onUpdateSettings={updateImageSettings}
                  onProcessComplete={handleProcessComplete}
                  onError={handleError}
                />
              ))}
            </div>

            {images.length === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-center">
                <div className="p-6 rounded-2xl bg-surface/50 border border-border">
                  <div className="w-12 h-12 bg-info/10 text-infoText rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Bulk Compression
                  </h3>
                  <p className="text-sm text-muted">
                    Process hundreds of photos instantly using WebAssembly
                    technology.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-surface/50 border border-border">
                  <div className="w-12 h-12 bg-accent/10 text-accentText rounded-xl flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Secure &amp; Private
                  </h3>
                  <p className="text-sm text-muted">
                    Your images never leave your computer. All processing
                    happens locally.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-surface/50 border border-border">
                  <div className="w-12 h-12 bg-highlight/10 text-highlightText rounded-xl flex items-center justify-center mx-auto mb-4">
                    <ImageIcon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Convert Formats
                  </h3>
                  <p className="text-sm text-muted">
                    Convert JPG to WebP, PNG to JPG, or create ICO files
                    efficiently.
                  </p>
                </div>
              </div>
            )}
          </>
        ) : view === "privacy" ? (
          <PrivacyView onBack={() => setView("home")} />
        ) : (
          <TermsView onBack={() => setView("home")} />
        )}
      </main>

      <Footer
        onNavigatePrivacy={() => setView("privacy")}
        onNavigateTerms={() => setView("terms")}
      />
    </div>
  );
}
