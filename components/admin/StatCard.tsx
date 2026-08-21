import {
  ArrowDownRight,
  ArrowUpRight,
  LucideIcon,
} from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: string;
  positive?: boolean;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  positive = true,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-extrabold text-slate-800">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Icon size={22} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {trend && (
          <span
            className={`
              flex items-center gap-1 text-xs font-bold
              ${positive ? "text-emerald-600" : "text-red-500"}
            `}
          >
            {positive ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}

            {trend}
          </span>
        )}

        <span className="text-xs text-slate-400">
          {description}
        </span>
      </div>
    </div>
  );
}