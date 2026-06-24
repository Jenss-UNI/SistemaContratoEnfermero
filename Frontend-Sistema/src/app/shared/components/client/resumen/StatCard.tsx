import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName?: string;
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName = "bg-teal-50 text-teal-500",
}: StatCardProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
      <div className="flex flex-col">
        <span className="text-sm text-slate-400">{label}</span>
        <span className="mt-1 text-4xl font-black tracking-tight text-slate-900">
          {value}
        </span>
      </div>
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}