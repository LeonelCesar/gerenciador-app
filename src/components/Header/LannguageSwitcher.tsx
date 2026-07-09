import { useState } from "react";
import { Languages, ChevronDown } from "lucide-react";
import { languages } from "../../config/languages";

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-lg p-2 hover:bg-stone-200 transition"
      >
        <Languages className="w-5 h-5" />
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border bg-white shadow-xl overflow-hidden">
          {languages.map((language) => (
            <button
              key={language.code}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-100"
              onClick={() => {
                console.log(language.code);
                setOpen(false);
              }}
            >
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}