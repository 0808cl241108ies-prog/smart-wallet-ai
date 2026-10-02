import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function FinancialOverview({ transactions = [] }) {
  const now = new Date();

  const months = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    months.push({
      year: date.getFullYear(),
      monthIndex: date.getMonth(),
      month: date.toLocaleString("en-US", {
        month: "short",
      }),
      income: 0,
      expense: 0,
    });
  }

  transactions.forEach((transaction) => {
    if (!transaction.date) return;

    const transactionDate = new Date(
      transaction.date
    );

    const transactionYear =
      transactionDate.getFullYear();

    const transactionMonth =
      transactionDate.getMonth();

    const matchingMonth = months.find(
      (item) =>
        item.year === transactionYear &&
        item.monthIndex === transactionMonth
    );

    if (!matchingMonth) return;

    const amount =
      Number(transaction.amount) || 0;

    if (transaction.type === "income") {
      matchingMonth.income += amount;
    }

    if (transaction.type === "expense") {
      matchingMonth.expense += amount;
    }
  });

  const chartData = months.map((item) => ({
    month: item.month,
    income: item.income,
    expense: item.expense,
  }));

  const highestIncome = months.reduce(
    (highest, current) =>
      current.income > highest.income
        ? current
        : highest,
    months[0] || {
      income: 0,
      month: "",
      year: "",
    }
  );

  const highestExpense = months.reduce(
    (highest, current) =>
      current.expense > highest.expense
        ? current
        : highest,
    months[0] || {
      expense: 0,
      month: "",
      year: "",
    }
  );

  const totalIncome = transactions
    .filter(
      (transaction) =>
        transaction.type === "income"
    )
    .reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount || 0),
      0
    );

  const totalExpense = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense"
    )
    .reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount || 0),
      0
    );

  const netSavings =
    totalIncome - totalExpense;

  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString(
      "en-IN"
    )}`;
  };

  const formatMonth = (item) => {
    if (!item || !item.month) return "-";

    return `${item.month} ${item.year}`;
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }) => {
    if (
      !active ||
      !payload ||
      payload.length === 0
    ) {
      return null;
    }

    const income =
      payload.find(
        (item) =>
          item.dataKey === "income"
      )?.value || 0;

    const expense =
      payload.find(
        (item) =>
          item.dataKey === "expense"
      )?.value || 0;

    return (
      <div className="bg-black border border-slate-700 rounded-xl p-4 shadow-2xl">
        <p className="text-white font-semibold mb-2">
          {label}
        </p>

        <p className="text-blue-400">
          Income : {formatCurrency(income)}
        </p>

        <p className="text-red-400">
          Expense : {formatCurrency(expense)}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6 shadow-lg">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h2 className="text-2xl font-bold text-white">
            Financial Overview
          </h2>

          <p className="text-slate-400 mt-1">
            Income vs Expense
          </p>
        </div>

        <div className="bg-slate-800 px-4 py-2 rounded-xl text-sm text-white border border-slate-700">
          Last 6 Months
        </div>

      </div>

      <div className="h-[340px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={chartData}>

            <defs>

              <linearGradient
                id="incomeGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#3B82F6"
                  stopOpacity={0.45}
                />

                <stop
                  offset="95%"
                  stopColor="#3B82F6"
                  stopOpacity={0}
                />
              </linearGradient>

              <linearGradient
                id="expenseGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#EF4444"
                  stopOpacity={0.35}
                />

                <stop
                  offset="95%"
                  stopColor="#EF4444"
                  stopOpacity={0}
                />
              </linearGradient>

            </defs>

            <CartesianGrid
              stroke="#334155"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              stroke="#FFFFFF"
              tick={{
                fill: "#FFFFFF",
                fontSize: 13,
              }}
              tickLine={false}
              axisLine={{
                stroke: "#475569",
              }}
            />

            <YAxis
              stroke="#FFFFFF"
              tick={{
                fill: "#FFFFFF",
                fontSize: 13,
              }}
              tickLine={false}
              axisLine={{
                stroke: "#475569",
              }}
              tickFormatter={(value) =>
                `₹${value / 1000}k`
              }
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#64748B",
                strokeWidth: 1,
                strokeDasharray: "5 5",
              }}
            />

            <Area
              type="monotone"
              dataKey="income"
              stroke="#3B82F6"
              strokeWidth={3}
              fill="url(#incomeGradient)"
              animationDuration={1500}
            />

            <Area
              type="monotone"
              dataKey="expense"
              stroke="#EF4444"
              strokeWidth={3}
              fill="url(#expenseGradient)"
              animationDuration={1500}
            />

          </AreaChart>
        </ResponsiveContainer>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">

        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">

          <p className="text-slate-400 text-sm">
            Highest Income
          </p>

          <h3 className="text-2xl font-bold text-blue-400 mt-2">
            {formatCurrency(
              highestIncome?.income || 0
            )}
          </h3>

          <p className="text-white mt-1">
            {formatMonth(highestIncome)}
          </p>

        </div>

        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">

          <p className="text-slate-400 text-sm">
            Highest Expense
          </p>

          <h3 className="text-2xl font-bold text-red-400 mt-2">
            {formatCurrency(
              highestExpense?.expense || 0
            )}
          </h3>

          <p className="text-white mt-1">
            {formatMonth(highestExpense)}
          </p>

        </div>

        <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700">

          <p className="text-slate-400 text-sm">
            Net Savings
          </p>

          <h3 className="text-2xl font-bold text-emerald-400 mt-2">
            {formatCurrency(netSavings)}
          </h3>

          <p className="text-white mt-1">
            Current Balance
          </p>

        </div>

      </div>

    </div>
  );
}

export default FinancialOverview;