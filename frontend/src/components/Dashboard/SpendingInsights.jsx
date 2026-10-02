import {
  Utensils,
  ShoppingBag,
  Car,
  Receipt,
  TrendingUp,
  TrendingDown,
  HeartPulse,
  GraduationCap,
  Briefcase,
  Wallet,
} from "lucide-react";

function getCategoryIcon(category) {
  switch (category) {
    case "Food":
      return <Utensils size={18} />;

    case "Shopping":
      return <ShoppingBag size={18} />;

    case "Transport":
      return <Car size={18} />;

    case "Bills":
      return <Receipt size={18} />;

    case "Health":
      return <HeartPulse size={18} />;

    case "Education":
      return <GraduationCap size={18} />;

    case "Business":
      return <Briefcase size={18} />;

    default:
      return <Wallet size={18} />;
  }
}

function SpendingInsights({
  transactions = [],
}) {
  const expenses = transactions.filter(
    (transaction) =>
      transaction.type === "expense"
  );

  const categoryTotals = {};

  expenses.forEach((transaction) => {
    const category =
      transaction.category || "Other";

    const amount =
      Number(transaction.amount) || 0;

    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }

    categoryTotals[category] += amount;
  });

  const totalExpense = expenses.reduce(
    (total, transaction) =>
      total +
      Number(transaction.amount || 0),
    0
  );

  const spendingData = Object.entries(
    categoryTotals
  )
    .map(([category, amount]) => ({
      title: category,
      amount,
      percent:
        totalExpense > 0
          ? Math.round(
              (amount / totalExpense) * 100
            )
          : 0,
    }))
    .sort(
      (a, b) => b.amount - a.amount
    )
    .slice(0, 5);

  const highestCategory =
    spendingData.length > 0
      ? spendingData[0]
      : null;

  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString(
      "en-IN"
    )}`;
  };

  return (
    <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6 shadow-lg">

      <div className="flex items-center justify-between mb-7">

        <div>
          <h2 className="text-2xl font-bold text-white">
            Spending Insights
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            AI Expense Breakdown
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full text-sm font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          AI
        </div>

      </div>

      <div className="space-y-6">

        {spendingData.length === 0 ? (

          <div className="text-center py-10">

            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center">
              <Wallet
                size={22}
                className="text-slate-500"
              />
            </div>

            <p className="text-slate-400 mt-4">
              No expense data available yet.
            </p>

            <p className="text-slate-600 text-xs mt-1">
              Add an expense to see your insights.
            </p>

          </div>

        ) : (

          spendingData.map((item, index) => {

            const isHighest =
              index === 0;

            return (
              <div key={item.title}>

                <div className="flex justify-between items-center mb-2.5">

                  <div className="flex items-center gap-3 min-w-0">

                    <div className="w-10 h-10 shrink-0 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-slate-300">
                      {getCategoryIcon(
                        item.title
                      )}
                    </div>

                    <div className="min-w-0">

                      <p className="font-semibold text-white truncate">
                        {item.title}
                      </p>

                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatCurrency(
                          item.amount
                        )}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-2 ml-3">

                    <span className="text-sm font-semibold text-white">
                      {item.percent}%
                    </span>

                    {isHighest ? (
                      <TrendingUp
                        size={16}
                        className="text-red-400"
                      />
                    ) : (
                      <TrendingDown
                        size={16}
                        className="text-emerald-400"
                      />
                    )}

                  </div>

                </div>

                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">

                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isHighest
                        ? "bg-blue-500"
                        : "bg-blue-500/70"
                    }`}
                    style={{
                      width: `${item.percent}%`,
                    }}
                  />

                </div>

              </div>
            );
          })
        )}

      </div>

      <div className="mt-8 rounded-2xl bg-slate-800/80 p-5 border border-blue-500/20">

        <div className="flex items-center gap-2 mb-3">

          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <span className="text-sm">
              💡
            </span>
          </div>

          <p className="text-blue-400 font-semibold">
            FRIDAY Insight
          </p>

        </div>

        {highestCategory ? (

          <p className="text-slate-300 text-sm leading-6">

            Your highest spending category is{" "}

            <span className="text-white font-semibold">
              {highestCategory.title}
            </span>

            , accounting for{" "}

            <span className="text-blue-400 font-semibold">
              {highestCategory.percent}%
            </span>{" "}

            of your total expenses.

            {totalExpense > 0 && (
              <>
                {" "}Total expenses are{" "}

                <span className="text-red-400 font-semibold">
                  {formatCurrency(
                    totalExpense
                  )}
                </span>
                .
              </>
            )}

          </p>

        ) : (

          <p className="text-slate-400 text-sm leading-6">
            Add some expenses to generate
            personalized spending insights.
          </p>

        )}

      </div>

    </div>
  );
}

export default SpendingInsights;