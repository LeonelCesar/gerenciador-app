import { useState } from "react";
import { Menu, X, Languages, Moon } from "lucide-react";
import { languages } from "../../config/languages";
import LanguageSwitcher from "../../components/Header/LannguageSwitcher";
import ThemeToggle from "../../components/Header/ThemeToggle";

type HeaderProps = {
  locale?: string;
  onLanguageClick?: () => void;
  onThemeClick?: () => void;
};

export default function Header({
  locale = "pt-PT",
  onLanguageClick,
  onThemeClick,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const now = new Date();

  const date = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  return (
    <header className="sticky top-0 z-30 bg-stone-100 border-b border-stone-200 shadow-sm">
      <div className="flex items-center justify-between py-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-200 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">LC</span>
            </div>

            <div className="hidden sm:flex flex-col">
              <span className="font-semibold text-stone-700 text-lg">
                Gestão de Faturas
              </span>

              <span className="text-xs text-stone-500 capitalize">{date}</span>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-64 bg-stone-100 border-r border-stone-200 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-stone-800 text-lg">FlowBank</span>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-stone-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
