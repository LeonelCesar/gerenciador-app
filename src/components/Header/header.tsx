import React from "react";
import { FiCalendar, FiBell, FiSearch, FiUser, FiChevronDown } from "react-icons/fi";

type HeaderProps = {
  userName?: string;
  locale?: string;
  showSearch?: boolean;
};

export default function Header({
  userName = "Leonel Helder da Costa César",
  locale = "pt-PT",
  showSearch = true,
}: HeaderProps) {
  const now = new Date();
  const date = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  return (
    <header className="sticky top-0 z-20 bg-stone-100 border-b border-stone-200 py-4">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* left: greeting + date */}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-stone-800">
              Olá, <span className="font-bold">{userName}</span>
            </p>
            <p className="mt-0.5 text-xs text-stone-500 capitalize">{date}</p>
          </div>

          {/* center: search (optional) */}
          {showSearch ? (
            <div className="flex-1 px-4">
              <label htmlFor="global-search" className="sr-only">
                Pesquisar
              </label>
              <div className="relative">
                <input
                  id="global-search"
                  type="search"
                  placeholder="Pesquisar transações, clientes ou relatórios..."
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm placeholder:text-stone-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <FiSearch className="text-stone-400" />
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1" />
          )}

          {/* right: actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              title="Selecionar período"
              className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-violet-50 hover:text-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
              <FiCalendar />
              <span className="hidden sm:inline">Últimos 6 meses</span>
            </button>

            <button
              type="button"
              aria-label="Notificações"
              className="relative rounded-md p-2 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
              <FiBell />
              <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                3
              </span>
            </button>

            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-300 to-violet-500 flex items-center justify-center text-white text-sm font-semibold">
                {/* initials as fallback avatar */}
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>

          {/*     <button
                type="button"
                aria-haspopup="true"
                aria-expanded="false"
                className="flex items-center gap-1 rounded-md px-2 py-1 text-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
                title="Conta"
              >
                <span className="hidden sm:inline text-sm text-stone-700">Conta</span>
                <FiChevronDown />
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
