import { Github } from "lucide-react";

interface FooterProps {
  onNavigatePrivacy: () => void;
  onNavigateTerms: () => void;
}

export default function Footer({
  onNavigatePrivacy,
  onNavigateTerms,
}: FooterProps) {
  return (
    <footer className="border-t border-border py-8 mt-12 bg-surface/30">
      <div className="container mx-auto px-4 text-center text-muted2 text-sm">
        <p className="mb-4">
          &copy; {new Date().getFullYear()} OptiImage Local. Open Source &amp;
          Privacy First.
        </p>
        <div className="flex justify-center items-center gap-6">
          <a
            href="https://github.com/your-username/optiimage"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accentText transition-colors flex items-center gap-2"
          >
            <Github size={16} />
            <span>GitHub</span>
          </a>
          <button
            onClick={onNavigatePrivacy}
            className="hover:text-accentText transition-colors"
          >
            Privacy Policy
          </button>
          <button
            onClick={onNavigateTerms}
            className="hover:text-accentText transition-colors"
          >
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  );
}
