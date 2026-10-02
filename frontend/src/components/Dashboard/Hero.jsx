import { ShieldCheck, Target } from "lucide-react";
import MonthlyGoal from "./MonthlyGoal";

function Hero({ transactions = [] }) {
  const totalIncome = transactions
    .filter(
      (transaction) =>
        transaction.type === "income"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  const totalExpenses = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  const balance = totalIncome - totalExpenses;

  let healthScore = 50;

  if (totalIncome > 0) {
    const savingsRate =
      (balance / totalIncome) * 100;

    healthScore = Math.round(
      Math.min(
        100,
        Math.max(
          20,
          50 + savingsRate * 0.5
        )
      )
    );
  }

  let healthStatus = "Needs Attention";

  if (healthScore >= 70) {
    healthStatus = "Excellent";
  } else if (healthScore >= 50) {
    healthStatus = "Good";
  }

  const formattedDate = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Welcome back, Manohar 👋
          </h1>

          <p className="text-slate-700 text-base sm:text-lg mt-2">
            Your financial overview is ready.
          </p>

          <p className="text-slate-700 mt-1">
            {formattedDate}
          </p>
        </div>

        <div className="self-start flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

          <span className="text-emerald-700 font-semibold">
            FRIDAY Online
          </span>
        </div>

      </div>

      {/* HEALTH + GOAL */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-9">

        {/* FINANCIAL HEALTH */}

        <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6 shadow-lg">

          <div className="flex items-center gap-3">

            <div className="p-2.5 bg-blue-500/10 rounded-xl">
              <ShieldCheck
                size={22}
                className="text-blue-400"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Financial Health
              </h2>
            </div>

          </div>

          <div className="flex items-end justify-between mt-5">

            <div>
              <p className="text-4xl font-bold text-white">
                {healthScore}
              </p>
            </div>

            <p
              className={`font-semibold ${
                healthStatus === "Excellent"
                  ? "text-emerald-400"
                  : healthStatus === "Good"
                  ? "text-amber-400"
                  : "text-rose-400"
              }`}
            >
              {healthStatus}
            </p>

          </div>

          {/* PROGRESS */}

          <div className="w-full h-3 bg-slate-700 rounded-full mt-5 overflow-hidden">

            <div
              className={`h-full rounded-full transition-all duration-700 ${
                healthStatus === "Excellent"
                  ? "bg-emerald-500"
                  : healthStatus === "Good"
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
              style={{
                width: `${healthScore}%`,
              }}
            />

          </div>

          <p className="text-slate-400 mt-4">
            Based on your current income and expenses
          </p>

        </div>

        {/* MONTHLY GOAL */}

        <MonthlyGoal
          transactions={transactions}
        />

      </div>

    </section>
  );
}

export default Hero;