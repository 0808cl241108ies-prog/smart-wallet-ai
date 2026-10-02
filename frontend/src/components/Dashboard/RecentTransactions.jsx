import {
  ShoppingBag,
  Landmark,
  Car,
  Utensils,
  HeartPulse,
  GraduationCap,
  Receipt,
  Briefcase,
  Wallet,
} from "lucide-react";

function getCategoryIcon(category) {
  switch (category) {
    case "Shopping":
      return <ShoppingBag size={19} />;

    case "Food":
      return <Utensils size={19} />;

    case "Transport":
      return <Car size={19} />;

    case "Salary":
      return <Landmark size={19} />;

    case "Business":
      return <Briefcase size={19} />;

    case "Health":
      return <HeartPulse size={19} />;

    case "Education":
      return <GraduationCap size={19} />;

    case "Bills":
      return <Receipt size={19} />;

    default:
      return <Wallet size={19} />;
  }
}

function RecentTransactions({
  transactions = [],
}) {
  const recentTransactions = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    )
    .slice(0, 5);

  const formatCurrency = (amount) => {
    return Number(amount || 0).toLocaleString(
      "en-IN"
    );
  };

  return (
    <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6 shadow-lg">

      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-2xl font-bold text-white">
            Recent Transactions
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Your latest financial activity
          </p>
        </div>

        <span className="text-xs font-medium text-slate-400 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-full">
          Latest 5
        </span>

      </div>

      <div className="space-y-3">

        {recentTransactions.length === 0 ? (

          <div className="text-center py-10">

            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center">
              <Wallet
                size={22}
                className="text-slate-500"
              />
            </div>

            <p className="text-slate-400 mt-4">
              No transactions yet.
            </p>

          </div>

        ) : (

          recentTransactions.map((item) => {

            const isIncome =
              item.type === "income";

            const amount = formatCurrency(
              item.amount
            );

            const date = item.date
              ? new Date(
                  item.date
                ).toLocaleDateString(
                  "en-IN",
                  {
                    day: "2-digit",
                    month: "short",
                  }
                )
              : "";

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3.5 hover:bg-slate-800 transition"
              >

                <div className="flex items-center gap-3 min-w-0">

                  <div
                    className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
                      isIncome
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {getCategoryIcon(
                      item.category
                    )}
                  </div>

                  <div className="min-w-0">

                    <h3 className="text-white font-semibold text-sm truncate">
                      {item.description ||
                        item.category ||
                        "Transaction"}
                    </h3>

                    <p className="text-slate-400 text-xs mt-1">
                      {item.category ||
                        "Other"}

                      {date
                        ? ` • ${date}`
                        : ""}
                    </p>

                  </div>

                </div>

                <span
                  className={`shrink-0 text-sm sm:text-base font-bold ${
                    isIncome
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {isIncome ? "+" : "-"}₹
                  {amount}
                </span>

              </div>
            );
          })

        )}

      </div>

    </div>
  );
}

export default RecentTransactions;