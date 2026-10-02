import { useMemo, useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Activity,
} from "lucide-react";

function FridayPanel({ transactions = [] }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const analysis = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce(
        (sum, t) =>
          sum + Number(t.amount || 0),
        0
      );

    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce(
        (sum, t) =>
          sum + Number(t.amount || 0),
        0
      );

    const balance = income - expenses;

    const categories = {};

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const category =
          t.category || "Other";

        categories[category] =
          (categories[category] || 0) +
          Number(t.amount || 0);
      });

    const sortedCategories = Object.entries(
      categories
    ).sort((a, b) => b[1] - a[1]);

    const topCategory =
      sortedCategories.length > 0
        ? sortedCategories[0][0]
        : "None";

    const topCategoryAmount =
      sortedCategories.length > 0
        ? sortedCategories[0][1]
        : 0;

    const healthScore =
      income > 0
        ? Math.max(
            0,
            Math.min(
              100,
              Math.round(
                ((income - expenses) /
                  income) *
                  100
              )
            )
          )
        : 0;

    return {
      income,
      expenses,
      balance,
      topCategory,
      topCategoryAmount,
      healthScore,
    };
  }, [transactions]);

  const formatCurrency = (amount) =>
    `₹${Number(amount).toLocaleString(
      "en-IN"
    )}`;

  const generateAnswer = () => {
    const text =
      question.toLowerCase().trim();

    if (!text) {
      setAnswer(
        "Ask me anything about your finances."
      );
      return;
    }

    if (
      text.includes("balance") ||
      text.includes("money left") ||
      text.includes("how much left")
    ) {
      setAnswer(
        `Your current balance is ${formatCurrency(
          analysis.balance
        )}.`
      );
      return;
    }

    if (
      text.includes("income") ||
      text.includes("earned")
    ) {
      setAnswer(
        `Your total recorded income is ${formatCurrency(
          analysis.income
        )}.`
      );
      return;
    }

    if (
      text.includes("expense") ||
      text.includes("spending") ||
      text.includes("spent")
    ) {
      setAnswer(
        `Your total recorded expenses are ${formatCurrency(
          analysis.expenses
        )}.`
      );
      return;
    }

    if (
      text.includes("highest") ||
      text.includes("most") ||
      text.includes("category")
    ) {
      if (analysis.topCategory === "None") {
        setAnswer(
          "You don't have any expense data yet."
        );
      } else {
        setAnswer(
          `Your highest spending category is ${analysis.topCategory} with ${formatCurrency(
            analysis.topCategoryAmount
          )} spent.`
        );
      }

      return;
    }

    if (
      text.includes("health") ||
      text.includes("score")
    ) {
      setAnswer(
        `Your current financial health score is ${analysis.healthScore}/100.`
      );
      return;
    }

    if (
      text.includes("save") ||
      text.includes("saving")
    ) {
      if (analysis.balance > 0) {
        setAnswer(
          `You currently have ${formatCurrency(
            analysis.balance
          )} remaining after recorded expenses.`
        );
      } else {
        setAnswer(
          "Your recorded expenses are currently equal to or higher than your income."
        );
      }

      return;
    }

    setAnswer(
      `Based on your current data, you have ${formatCurrency(
        analysis.balance
      )} balance, ${formatCurrency(
        analysis.income
      )} income, and ${formatCurrency(
        analysis.expenses
      )} expenses.`
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    generateAnswer();
  };

  const askQuickQuestion = (text) => {
    setQuestion(text);

    setTimeout(() => {
      const lowerText =
        text.toLowerCase();

      if (lowerText.includes("balance")) {
        setAnswer(
          `Your current balance is ${formatCurrency(
            analysis.balance
          )}.`
        );
      } else if (
        lowerText.includes("spending")
      ) {
        if (
          analysis.topCategory === "None"
        ) {
          setAnswer(
            "You don't have any expense data yet."
          );
        } else {
          setAnswer(
            `Your highest spending category is ${analysis.topCategory} with ${formatCurrency(
              analysis.topCategoryAmount
            )} spent.`
          );
        }
      } else {
        setAnswer(
          `Your current financial health score is ${analysis.healthScore}/100.`
        );
      }
    }, 0);
  };

  return (
    <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6 shadow-lg h-full">

      <div className="flex items-start justify-between gap-4 mb-6">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Bot
              size={23}
              className="text-blue-400"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">

              <h2 className="text-2xl font-bold text-white">
                FRIDAY AI
              </h2>

              <Sparkles
                size={17}
                className="text-blue-400"
              />

            </div>

            <p className="text-sm text-slate-400 mt-1">
              Your personal financial assistant
            </p>
          </div>

        </div>

        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">

          <Activity
            size={13}
            className="text-emerald-400"
          />

          <span className="text-xs font-semibold text-emerald-400">
            Online
          </span>

        </div>

      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4">

        <div className="flex items-center gap-2 mb-3">

          <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">

            <Sparkles
              size={15}
              className="text-blue-400"
            />

          </div>

          <span className="text-sm font-semibold text-slate-300">
            Current Insight
          </span>

        </div>

        <p className="text-white text-sm leading-6">

          {analysis.topCategory !==
          "None"
            ? `Your highest spending category is ${analysis.topCategory} at ${formatCurrency(
                analysis.topCategoryAmount
              )}.`
            : "Add some expenses and I will start analyzing your spending."}

        </p>

      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">

        <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-3">

          <p className="text-xs text-slate-500">
            Income
          </p>

          <p className="text-sm font-bold text-emerald-400 mt-1 truncate">
            {formatCurrency(
              analysis.income
            )}
          </p>

        </div>

        <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-3">

          <p className="text-xs text-slate-500">
            Expenses
          </p>

          <p className="text-sm font-bold text-rose-400 mt-1 truncate">
            {formatCurrency(
              analysis.expenses
            )}
          </p>

        </div>

        <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-3">

          <p className="text-xs text-slate-500">
            Health
          </p>

          <p className="text-sm font-bold text-blue-400 mt-1">
            {analysis.healthScore}/100
          </p>

        </div>

      </div>

      {answer && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-4">

          <div className="flex items-center gap-2 mb-2">

            <Bot
              size={15}
              className="text-blue-400"
            />

            <span className="text-xs font-semibold text-blue-400">
              FRIDAY
            </span>

          </div>

          <p className="text-blue-100 text-sm leading-6">
            {answer}
          </p>

        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex gap-2"
      >

        <input
          type="text"
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          placeholder="Ask FRIDAY..."
          className="flex-1 min-w-0 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"
        />

        <button
          type="submit"
          className="w-11 h-11 shrink-0 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center transition shadow-sm"
        >
          <Send size={18} />
        </button>

      </form>

      <div className="flex flex-wrap gap-2 mt-4">

        <button
          onClick={() =>
            askQuickQuestion(
              "What is my balance?"
            )
          }
          className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-lg transition"
        >
          My balance
        </button>

        <button
          onClick={() =>
            askQuickQuestion(
              "Where am I spending most?"
            )
          }
          className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-lg transition"
        >
          Top spending
        </button>

        <button
          onClick={() =>
            askQuickQuestion(
              "What is my financial health?"
            )
          }
          className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-lg transition"
        >
          Health score
        </button>

      </div>

    </div>
  );
}

export default FridayPanel;