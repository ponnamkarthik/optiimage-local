import { Github } from "lucide-react";
import logo from "@/app/logo.svg";

const logoSrc = typeof logo === "string" ? logo : logo.src;

interface HeaderProps {
  onNavigateHome: () => void;
}

export default function Header({ onNavigateHome }: HeaderProps) {
  return (
    <header className="border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={onNavigateHome}
        >
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-accent to-accentTo text-white shadow-lg shadow-accent/20 group-hover:scale-105 transition-transform">
            <img
              src={logoSrc}
              alt="OptiImage Local"
              width={18}
              height={18}
              className="h-4.5 w-4.5"
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            OptiImage <span className="text-muted2 font-medium">Local</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium text-muted">
          <a
            href="https://github.com/ponnamkarthik/optiimage-local/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-accentText transition-colors"
          >
            <Github size={18} />
            <span className="hidden sm:inline">Report an Issue</span>
          </a>
        </div>
      </div>
    </header>
  );
}
