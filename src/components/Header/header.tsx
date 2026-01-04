type HeaderProps = {
  userName: string;
  formattedDate: string;
};

export function formatCurrentDate(locale: string) {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export function Header({ userName, formattedDate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-stone-100 py-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-stone-800">
          Olá, <span className="font-bold">{userName}</span>
        </p>

        <p className="mt-0.5 text-xs capitalize text-stone-500">
          {formattedDate}
        </p>
      </div>
    </header>
  );
}
