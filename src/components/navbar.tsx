import { Plus, BarChart2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface NavbarProps {
  onCreateClick: () => void;
  isLoggedIn: boolean;
  onAuthClick: () => void;
}

export function Navbar({ onCreateClick, isLoggedIn, onAuthClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuthClickWithLoading = async () => {
    setIsLoading(true);
    try {
      await onAuthClick();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className={`sticky top-0 z-50 border-b transition-all duration-500 ease-in-out ${
      isScrolled ? "bg-background/80 backdrop-blur-md border-border" : "border-transparent"
    }`}>
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BarChart2 className="w-5 h-5 text-foreground" strokeWidth={2.5} />
          <h1 className="text-foreground font-serif-display font-semibold">uwpolls.</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onCreateClick}
            disabled={!isLoggedIn}
            className={`px-4 py-2 rounded-lg transition-all shadow-sm flex items-center gap-2 ${
              isLoggedIn 
                ? "bg-white text-foreground hover:bg-white/90 cursor-pointer" 
                : "bg-white/40 text-foreground/40 cursor-not-allowed"
            }`}
          >
            <Plus className="w-5 h-5" />
            Create
          </button>
          
          <button
            onClick={handleAuthClickWithLoading}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-black text-white hover:bg-black/90 transition-all cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5" style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              isLoggedIn ? "Logout" : "Login"
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}