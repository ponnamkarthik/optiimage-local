import { ShieldCheck, Upload } from "lucide-react";
import { useCallback, useState } from "react";

interface DropzoneProps {
  onFilesDropped: (files: File[]) => void;
}

export default function Dropzone({ onFilesDropped }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent, active: boolean) => {
    e.preventDefault();
    setIsDragging(active);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files).filter((file: File) =>
        file.type.startsWith("image/")
      );

      if (files.length > 0) onFilesDropped(files);
    },
    [onFilesDropped]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        onFilesDropped(Array.from(e.target.files));
      }
    },
    [onFilesDropped]
  );

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ease-out
        ${
          isDragging
            ? "border-accent bg-accent/10 scale-[1.01]"
            : "border-border bg-surface2/50 hover:bg-surface2 hover:border-border/80"
        }
      `}
      onDragOver={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
      />

      <div className="flex flex-col items-center justify-center py-8 px-6 text-center">
        <div
          className={`
          mb-6 rounded-full p-4 transition-colors duration-300
          ${
            isDragging
              ? "bg-accent text-white"
              : "bg-surface3 text-foreground/80"
          }
        `}
        >
          <Upload size={32} />
        </div>

        <h3 className="mb-2 text-xl font-semibold text-foreground">
          Drop your images here
        </h3>
        <p className="mb-6 text-muted max-w-sm">
          Supports JPG, PNG, WebP, SVG, and more.
          <br />
          <span className="text-sm opacity-75">
            Processing is done instantly in your browser.
          </span>
        </p>

        <div className="flex items-center gap-2 text-xs font-medium text-accent bg-accent/10 px-3 py-1.5 rounded-full">
          <ShieldCheck size={14} />
          <span>100% Client-Side • No Uploads</span>
        </div>
      </div>
    </div>
  );
}
