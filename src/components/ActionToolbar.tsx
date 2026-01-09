import { DownloadCloud, Image as ImageIcon, Trash2 } from "lucide-react";

import { SUPPORTED_FORMATS } from "@/lib/constants";
import { ImageFormat } from "@/lib/types";

interface ActionToolbarProps {
  imageCount: number;
  globalFormat: ImageFormat;
  onGlobalFormatChange: (format: ImageFormat) => void;
  totalSavedMB: number;
  onClearAll: () => void;
  onDownloadAll: () => void;
  canDownload: boolean;
}

export default function ActionToolbar({
  imageCount,
  globalFormat,
  onGlobalFormatChange,
  totalSavedMB,
  onClearAll,
  onDownloadAll,
  canDownload,
}: ActionToolbarProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 sticky top-20 z-40 bg-background/90 p-4 rounded-xl border border-border shadow-xl backdrop-blur-sm transition-all animate-in fade-in slide-in-from-top-4">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-surface2 rounded-lg border border-border">
          <ImageIcon size={16} className="text-muted" />
          <span className="text-sm font-semibold text-foreground">
            {imageCount} Images
          </span>
        </div>

        <div className="h-6 w-px bg-border hidden md:block" />

        <div className="flex items-center gap-2 flex-1 md:flex-initial">
          <span className="text-xs font-medium text-muted whitespace-nowrap">
            Output All:
          </span>
          <select
            className="h-9 rounded-lg border border-border2 bg-surface3 px-3 text-sm font-medium text-foreground focus:border-accent focus:outline-none flex-1 md:flex-initial"
            value={globalFormat}
            onChange={(e) =>
              onGlobalFormatChange(e.target.value as ImageFormat)
            }
          >
            {SUPPORTED_FORMATS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        {totalSavedMB > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-lg border border-accent/20">
            <span className="text-sm font-bold text-accentText">
              Saved {totalSavedMB.toFixed(2)} MB
            </span>
          </div>
        )}

        <button
          onClick={onClearAll}
          className="p-2 text-muted hover:text-dangerText hover:bg-danger/10 rounded-lg transition-colors"
          title="Clear All"
        >
          <Trash2 size={18} />
        </button>

        <button
          onClick={onDownloadAll}
          disabled={!canDownload}
          className="flex items-center gap-2 px-4 py-2 bg-invert text-invertForeground rounded-lg font-semibold hover:bg-invertHover hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <DownloadCloud size={18} />
          <span className="hidden sm:inline">Download All</span>
        </button>
      </div>
    </div>
  );
}
