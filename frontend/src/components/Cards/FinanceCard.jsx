import {
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

function FinanceCard({
  title,
  amount,
  change,
  subtitle,
  icon,
  iconBg = "bg-blue-600",
}) {
  const displayAmount =
    amount !== undefined &&
    amount !== null &&
    String(amount).trim() !== ""
      ? String(amount)
      : "₹0";

  const isPositive =
    typeof change === "string" &&
    (change.includes("+") ||
      change.toLowerCase().includes("up"));

  const isNegative =
    typeof change === "string" &&
    (change.includes("-") ||
      change.toLowerCase().includes("down"));

  return (
    <div className="w-full h-full">

      <div className="flex items-start justify-between gap-4">

        <div className="min-w-0">

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tracking-tight">
            {displayAmount}
          </h3>

        </div>

        <div
          className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-white shadow-sm ${iconBg}`}
        >
          {icon}
        </div>

      </div>

      <div className="flex items-center justify-between gap-3 mt-5">

        <p className="text-sm text-slate-500">
          {subtitle}
        </p>

        {change && change !== "Live" && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold ${
              isPositive
                ? "text-emerald-600"
                : isNegative
                ? "text-rose-600"
                : "text-slate-500"
            }`}
          >

            {isPositive && (
              <ArrowUpRight size={14} />
            )}

            {isNegative && (
              <ArrowDownRight size={14} />
            )}

            <span>{change}</span>

          </div>
        )}

        {change === "Live" && (
          <div className="flex items-center gap-1.5 shrink-0">

            <span className="w-2 h-2 rounded-full bg-emerald-500" />

            <span className="text-xs font-medium text-emerald-600">
              Live
            </span>

          </div>
        )}

      </div>

    </div>
  );
}

export default FinanceCard;