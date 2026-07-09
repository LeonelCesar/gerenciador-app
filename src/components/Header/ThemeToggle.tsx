import { Moon } from "lucide-react";

export default function ThemeToggle() {
  return (
    <button
      className="rounded-lg p-2 hover:bg-stone-200 transition"
      aria-label="Alternar tema"
    >
      <Moon className="w-5 h-5" />
    </button>
  );
}