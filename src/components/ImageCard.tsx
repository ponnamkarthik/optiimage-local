import {
  AlertCircle,
  ArrowRight,
  Download,
  Lock,
  LockOpen,
  RefreshCw,
  Scaling,
  Settings2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { EXTENSIONS, SUPPORTED_FORMATS } from "@/lib/constants";
import { formatBytes, processImage } from "@/lib/imageProcessing";
import { CompressionSettings, ImageFile, ImageFormat } from "@/lib/types";

interface ImageCardProps {
  item: ImageFile;
  onRemove: (id: string) => void;
  onUpdateSettings: (
    id: string,
    settings: Partial<CompressionSettings>
  ) => void;
  onProcessComplete: (id: string, result: ImageFile["result"]) => void;
  onError: (id: string, error: string) => void;
}

export default function ImageCard({
  item,
  onRemove,
  onUpdateSettings,
  onProcessComplete,
  onError,
}: ImageCardProps) {
  const [localQuality, setLocalQuality] = useState(item.settings.quality);
  const [widthInput, setWidthInput] = useState(
    item.settings.resizeWidth.toString()
  );
  const [heightInput, setHeightInput] = useState(
    item.settings.resizeHeight.toString()
  );

  useEffect(() => {
    setLocalQuality(item.settings.quality);
  }, [item.settings.quality]);

  useEffect(() => {
    setWidthInput(item.settings.resizeWidth.toString());
    setHeightInput(item.settings.resizeHeight.toString());
  }, [item.settings.resizeWidth, item.settings.resizeHeight]);

  useEffect(() => {
    if (item.status !== "processing") return;

    let mounted = true;
    const process = async () => {
      try {
        const start = performance.now();
        const blob = await processImage(item.file, item.settings);

        if (!mounted) return;

        onProcessComplete(item.id, {
          blob,
          url: URL.createObjectURL(blob),
          size: blob.size,
          reduction:
            ((item.originalSize - blob.size) / item.originalSize) * 100,
          timeTaken: performance.now() - start,
        });
      } catch {
        if (mounted) onError(item.id, "Processing failed");
      }
    };

    process();
    return () => {
      mounted = false;
    };
  }, [
    item.status,
    item.settings,
    item.file,
    item.id,
    onProcessComplete,
    onError,
  ]);

  const handleDownload = () => {
    if (!item.result) return;

    const link = document.createElement("a");
    link.href = item.result.url;

    let ext = EXTENSIONS[item.settings.format];
    if (item.settings.format === ImageFormat.ORIGINAL) {
      ext = item.file.name.split(".").pop() || "jpg";
    }

    const namePart =
      item.file.name.substring(0, item.file.name.lastIndexOf(".")) ||
      item.file.name;
    link.download = `${namePart}-opt.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDimensionChange = (
    dimension: "width" | "height",
    value: string
  ) => {
    const numVal = parseInt(value, 10);
    if (dimension === "width") setWidthInput(value);
    if (dimension === "height") setHeightInput(value);

    if (!isNaN(numVal) && numVal > 0 && item.settings.maintainAspectRatio) {
      const ratio = item.dimensions.width / item.dimensions.height;
      if (dimension === "width") {
        setHeightInput(Math.round(numVal / ratio).toString());
      } else {
        setWidthInput(Math.round(numVal * ratio).toString());
      }
    }
  };

  const commitDimensions = () => {
    const w = parseInt(widthInput, 10);
    const h = parseInt(heightInput, 10);

    if (isNaN(w) || w <= 0 || isNaN(h) || h <= 0) {
      setWidthInput(item.settings.resizeWidth.toString());
      setHeightInput(item.settings.resizeHeight.toString());
      return;
    }

    if (w !== item.settings.resizeWidth || h !== item.settings.resizeHeight) {
      onUpdateSettings(item.id, { resizeWidth: w, resizeHeight: h });
    }
  };

  const isDone = item.status === "done";
  const hasSaved = item.result && item.result.reduction > 0;
  const isLarger = item.result && item.result.reduction < 0;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-surface2/50 shadow-sm transition-all hover:border-border/80 hover:bg-surface2">
      <div className="flex flex-col sm:flex-row p-4 gap-4 items-center">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface shadow-inner">
          <img
            src={item.previewUrl}
            alt="Preview"
            className="h-full w-full object-cover"
          />
          {item.settings.format !== ImageFormat.ORIGINAL && (
            <div className="absolute bottom-0 right-0 bg-background/80 px-1.5 py-0.5 text-[10px] font-bold text-foreground/80 rounded-tl-md">
              {item.settings.format.split("/")[1].toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h4
            className="truncate font-medium text-foreground"
            title={item.file.name}
          >
            {item.file.name}
          </h4>
          <p className="text-xs text-muted mt-1 flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span>{formatBytes(item.originalSize)}</span>
            <span className="hidden sm:inline text-muted2">•</span>
            <span>
              {item.dimensions.width} x {item.dimensions.height} px
            </span>
          </p>
          {item.error && (
            <div className="mt-2 flex items-center justify-center sm:justify-start gap-1 text-xs text-dangerText">
              <AlertCircle size={12} />
              <span>{item.error}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-start items-center gap-2">
            <select
              className="h-8 rounded-md border border-border2 bg-surface3 px-2 text-xs font-medium text-foreground focus:border-accent outline-none"
              value={item.settings.format}
              onChange={(e) =>
                onUpdateSettings(item.id, {
                  format: e.target.value as ImageFormat,
                })
              }
              disabled={item.status === "processing"}
            >
              {SUPPORTED_FORMATS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>

            <div className="relative flex items-center bg-surface3/50 rounded-md px-2 h-8 border border-border">
              <Settings2 size={14} className="text-muted mr-2" />
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={localQuality}
                onChange={(e) => setLocalQuality(parseFloat(e.target.value))}
                onMouseUp={() =>
                  localQuality !== item.settings.quality &&
                  onUpdateSettings(item.id, { quality: localQuality })
                }
                onTouchEnd={() =>
                  localQuality !== item.settings.quality &&
                  onUpdateSettings(item.id, { quality: localQuality })
                }
                disabled={item.status === "processing"}
                className="w-16 sm:w-20 h-1 bg-border2 rounded-lg appearance-none cursor-pointer accent-accent"
                title={`Quality: ${Math.round(localQuality * 100)}%`}
              />
              <span className="ml-2 text-[11px] font-semibold tabular-nums text-muted">
                {Math.round(localQuality * 100)}%
              </span>
            </div>

            <button
              onClick={() =>
                onUpdateSettings(item.id, {
                  resizeEnabled: !item.settings.resizeEnabled,
                })
              }
              title="Resize"
              aria-label="Resize"
              className={`h-8 w-8 flex items-center justify-center rounded-md border transition-colors ${
                item.settings.resizeEnabled
                  ? "bg-accent/20 border-accent/50 text-accentText"
                  : "bg-surface3 border-border2 text-muted hover:text-foreground"
              }`}
              disabled={item.status === "processing"}
            >
              <Scaling size={16} />
            </button>
          </div>

          {item.settings.resizeEnabled && (
            <div className="flex items-center justify-center sm:justify-start gap-2 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center bg-surface/50 rounded-md border border-border px-2 py-1">
                <input
                  type="number"
                  className="w-12 bg-transparent text-xs text-right focus:outline-none text-foreground"
                  value={widthInput}
                  onChange={(e) =>
                    handleDimensionChange("width", e.target.value)
                  }
                  onBlur={commitDimensions}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.target as HTMLInputElement).blur()
                  }
                  disabled={item.status === "processing"}
                />
                <span className="text-muted2 mx-1 text-xs">x</span>
                <input
                  type="number"
                  className="w-12 bg-transparent text-xs text-left focus:outline-none text-foreground"
                  value={heightInput}
                  onChange={(e) =>
                    handleDimensionChange("height", e.target.value)
                  }
                  onBlur={commitDimensions}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.target as HTMLInputElement).blur()
                  }
                  disabled={item.status === "processing"}
                />
                <span className="text-muted2 ml-1 text-[10px]">px</span>
              </div>

              <button
                onClick={() =>
                  onUpdateSettings(item.id, {
                    maintainAspectRatio: !item.settings.maintainAspectRatio,
                  })
                }
                className="p-1.5 text-muted2 hover:text-foreground transition-colors"
              >
                {item.settings.maintainAspectRatio ? (
                  <Lock size={12} />
                ) : (
                  <LockOpen size={12} />
                )}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end min-w-35 gap-3">
          {item.status === "processing" ? (
            <div className="flex items-center gap-2 text-accentText text-sm animate-pulse">
              <RefreshCw size={16} className="animate-spin" />
              <span>Processing</span>
            </div>
          ) : isDone && item.result ? (
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-muted line-through decoration-muted2">
                  {formatBytes(item.originalSize)}
                </span>
                <ArrowRight size={12} className="text-muted2" />
                <span
                  className={`text-sm font-bold ${
                    hasSaved
                      ? "text-accentText"
                      : isLarger
                        ? "text-dangerText"
                        : "text-foreground"
                  }`}
                >
                  {formatBytes(item.result.size)}
                </span>
              </div>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  hasSaved
                    ? "text-accent bg-accent/10"
                    : isLarger
                      ? "text-dangerText bg-danger/10"
                      : "text-muted2 bg-surface3/50"
                }`}
              >
                {hasSaved
                  ? `-${item.result.reduction.toFixed(1)}%`
                  : isLarger
                    ? `+${Math.abs(item.result.reduction).toFixed(1)}%`
                    : "No change"}
              </span>
            </div>
          ) : null}

          {isDone && (
            <button
              onClick={handleDownload}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white shadow-lg shadow-accent/20 transition hover:bg-accentText hover:scale-105 active:scale-95"
            >
              <Download size={18} />
            </button>
          )}
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="absolute right-2 top-2 p-1 text-muted2 opacity-0 transition hover:text-dangerText group-hover:opacity-100"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
