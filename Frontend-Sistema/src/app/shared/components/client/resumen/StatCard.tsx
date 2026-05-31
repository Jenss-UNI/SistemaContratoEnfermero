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
  iconClassName = "bg-teal-50 text-teal-600",
}: StatCardProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 lg:p-6 shadow-sm transition-all duration-300">
      <div className="flex flex-col">   
        <span className="text-xs sm:text-sm font-medium text-slate-500">{label}</span>
 
        <span className="mt-1 sm:mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 transition-all">
          {value}
        </span>
      </div>
      <div
        className={`flex h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 shrink-0 items-center justify-center rounded-xl transition-all ${iconClassName}`}
      >
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
      </div>
    </div>
  );
}