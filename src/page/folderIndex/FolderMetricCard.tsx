interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

export function FolderMetricCard({
  title,
  value,
  subtitle,
}: MetricCardProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>
      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-xs text-green-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}
