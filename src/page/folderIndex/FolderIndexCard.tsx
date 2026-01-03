import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
}

export function Card({ title, children }: CardProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm flex flex-col">
      <h3 className="mb-3 text-sm font-semibold">
        {title}
      </h3>

      {/* garante altura para Recharts */}
      <div className="flex-1 min-h-[180px]">
        {children}
      </div>
    </div>
  );
}


