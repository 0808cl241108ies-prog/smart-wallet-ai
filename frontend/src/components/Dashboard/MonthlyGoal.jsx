import { useEffect, useState } from "react";
import {
  Target,
  Pencil,
  Check,
  X,
  TrendingUp,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8001";

function MonthlyGoal({ transactions = [] }) {
  const [goal, setGoal] = useState(20000);
  const [goalInput, setGoalInput] =
    useState("20000");
  const [isEditing, setIsEditing] =
    useState(false);
  const [loading, setLoading] =
    useState(true);
  const [saving, setSaving] =
    useState(false);

  const fetchGoal = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/goals`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch goal"
        );
      }

      const data = await response.json();

      const savedGoal =
        Number(data.amount) || 20000;

      setGoal(savedGoal);
      setGoalInput(String(savedGoal));
    } catch (error) {
      console.error(
        "Goal fetch error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, []);

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

  const totalExpenses = transactions
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

  const currentSavings =
    totalIncome - totalExpenses;

  const progress =
    goal > 0
      ? Math.min(
          100,
          Math.max(
            0,
            Math.round(
              (currentSavings / goal) *
                100
            )
          )
        )
      : 0;

  const remaining = Math.max(
    0,
    goal - currentSavings
  );

  const formatCurrency = (amount) =>
    `₹${Number(amount).toLocaleString(
      "en-IN"
    )}`;

  const handleSaveGoal = async () => {
    const newGoal = Number(goalInput);

    if (!newGoal || newGoal <= 0) {
      alert(
        "Please enter a valid goal amount."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/goals`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: newGoal,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to save goal"
        );
      }

      setGoal(newGoal);
      setGoalInput(String(newGoal));
      setIsEditing(false);
    } catch (error) {
      console.error(
        "Goal save error:",
        error
      );

      alert(
        "Unable to save goal. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6 shadow-lg h-full">

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Target
              size={21}
              className="text-amber-400"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              Monthly Goal
            </h2>

            <p className="text-slate-400 text-sm mt-1">
              Your monthly savings target
            </p>
          </div>

        </div>

        {!isEditing && !loading && (
          <button
            onClick={() => {
              setGoalInput(
                String(goal)
              );
              setIsEditing(true);
            }}
            className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 text-slate-300 flex items-center justify-center transition"
            title="Edit goal"
          >
            <Pencil size={16} />
          </button>
        )}

      </div>

      {loading ? (

        <div className="py-12 text-center">

          <div className="w-8 h-8 mx-auto border-2 border-slate-700 border-t-amber-400 rounded-full animate-spin" />

          <p className="text-slate-500 text-sm mt-4">
            Loading goal...
          </p>

        </div>

      ) : isEditing ? (

        <div className="mt-7">

          <div className="flex items-center gap-2 mb-2">

            <TrendingUp
              size={16}
              className="text-amber-400"
            />

            <label className="text-sm font-medium text-slate-300">
              Set monthly savings goal
            </label>

          </div>

          <div className="flex gap-2">

            <div className="relative flex-1">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                ₹
              </span>

              <input
                type="number"
                value={goalInput}
                onChange={(e) =>
                  setGoalInput(
                    e.target.value
                  )
                }
                placeholder="Enter amount"
                min="1"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition"
              />

            </div>

            <button
              onClick={handleSaveGoal}
              disabled={saving}
              className="w-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white flex items-center justify-center transition"
            >
              <Check size={19} />
            </button>

            <button
              onClick={() => {
                setGoalInput(
                  String(goal)
                );
                setIsEditing(false);
              }}
              disabled={saving}
              className="w-12 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 border border-slate-700 flex items-center justify-center transition"
            >
              <X size={19} />
            </button>

          </div>

          {saving && (
            <p className="text-xs text-slate-500 mt-3">
              Saving your goal...
            </p>
          )}

        </div>

      ) : (

        <>

          <div className="flex items-end justify-between gap-4 mt-7">

            <div>

              <p className="text-4xl font-bold text-white">
                {progress}%
              </p>

              <p className="text-slate-400 text-sm mt-1">
                of{" "}
                <span className="text-slate-300 font-medium">
                  {formatCurrency(goal)}
                </span>
              </p>

            </div>

            <div className="text-right">

              {remaining > 0 ? (

                <>
                  <p className="text-amber-400 font-semibold text-sm">
                    {formatCurrency(
                      remaining
                    )}{" "}
                    Left
                  </p>

                  <p className="text-slate-500 text-xs mt-1">
                    Keep going!
                  </p>
                </>

              ) : (

                <>
                  <p className="text-emerald-400 font-semibold text-sm">
                    Goal Completed 🎉
                  </p>

                  <p className="text-slate-500 text-xs mt-1">
                    Great work!
                  </p>
                </>

              )}

            </div>

          </div>

          <div className="w-full h-3 bg-slate-700 rounded-full mt-6 overflow-hidden">

            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          <div className="flex items-center justify-between mt-4">

            <div className="flex items-center gap-2">

              <div className="w-2 h-2 rounded-full bg-emerald-500" />

              <span className="text-slate-400 text-xs">
                Current savings
              </span>

            </div>

            <span className="text-white font-semibold text-sm">
              {formatCurrency(
                Math.max(
                  0,
                  currentSavings
                )
              )}
            </span>

          </div>

        </>

      )}

    </div>
  );
}

export default MonthlyGoal;