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
    <header className="sticky top-0 z-20 bg-stone-100 border-b border-stone-200 py-4 px-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-stone-800">
          Olá, <span className="font-bold">{userName}</span>
        </p>
        <p className="mt-0.5 text-xs text-stone-500 capitalize">{date}</p>
      </div>
    </header>
  );
}
