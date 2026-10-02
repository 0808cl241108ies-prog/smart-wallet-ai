import { useEffect, useState } from "react";

import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Dashboard/Hero";
import FinanceCard from "../components/Cards/FinanceCard";
import FinancialOverview from "../components/Charts/FinancialOverview";
import SpendingInsights from "../components/Dashboard/SpendingInsights";
import FridayPanel from "../components/ai/FridayPanel";
import RecentTransactions from "../components/Dashboard/RecentTransactions";
import ReceiptScanner from "../components/Dashboard/ReceiptScanner";
import VoiceEntry from "../components/Dashboard/VoiceEntry";

import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  X,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8001";
  

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] =
    useState(true);

  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] =
    useState("expense");

  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [showReceiptScanner, setShowReceiptScanner] =
    useState(false);

  const [showVoiceEntry, setShowVoiceEntry] =
    useState(false);

  const fetchTransactions = async () => {
    try {
      setLoadingTransactions(true);

      const response = await fetch(
        `${API_URL}/api/transactions`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch transactions"
        );
      }

      const data = await response.json();

      setTransactions(data);
    } catch (error) {
      console.error(
        "Transaction fetch error:",
        error
      );
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
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

  const totalBalance =
    totalIncome - totalExpenses;

  const totalSavings = totalBalance;

  const openTransactionModal = (type) => {
    setTransactionType(type);

    setFormData({
      amount: "",
      category: "",
      description: "",
    });

    setMessage("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (!loading) {
      setShowModal(false);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.amount ||
      !formData.category
    ) {
      setMessage(
        "Please enter amount and category."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: transactionType,
            amount: Number(formData.amount),
            category: formData.category,
            description:
              formData.description || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to save transaction"
        );
      }

      setMessage(
        "Transaction added successfully!"
      );

      setFormData({
        amount: "",
        category: "",
        description: "",
      });

      await fetchTransactions();

      setTimeout(() => {
        setShowModal(false);
        setMessage("");
      }, 1000);
    } catch (error) {
      console.error(
        "Transaction error:",
        error
      );

      setMessage(
        error.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    `₹${Number(amount).toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        <Hero transactions={transactions} />

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          <div className="bg-white border border-black rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <FinanceCard
              title="Total Balance"
              amount={formatCurrency(totalBalance)}
              change="Live"
              subtitle="Current balance"
              icon={<Wallet size={28} />}
              iconBg="bg-blue-600"
            />
          </div>

          <div className="bg-white border border-black rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <FinanceCard
              title="Income"
              amount={formatCurrency(totalIncome)}
              change="Live"
              subtitle="Total income"
              icon={<TrendingUp size={28} />}
              iconBg="bg-emerald-600"
            />
          </div>

          <div className="bg-white border border-black rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <FinanceCard
              title="Expenses"
              amount={formatCurrency(totalExpenses)}
              change="Live"
              subtitle="Total expenses"
              icon={<TrendingDown size={28} />}
              iconBg="bg-rose-600"
            />
          </div>

          <div className="bg-white border border-black rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <FinanceCard
              title="Savings"
              amount={formatCurrency(totalSavings)}
              change="Live"
              subtitle="Income minus expenses"
              icon={<PiggyBank size={28} />}
              iconBg="bg-amber-500"
            />
          </div>

        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          <div className="xl:col-span-2 space-y-6">

            <FinancialOverview
              transactions={transactions}
            />

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <SpendingInsights
                transactions={transactions}
              />
            </div>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <FridayPanel
              transactions={transactions}
            />
          </div>

        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <RecentTransactions
              transactions={transactions}
            />
          </div>

         <div className="bg-white border border-black rounded-2xl p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                Quick Actions
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Manage your finances quickly
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <button
                onClick={() =>
                  openTransactionModal("expense")
                }
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 font-medium shadow-sm hover:shadow-md transition"
              >
                ➕ Add Expense
              </button>

              <button
                onClick={() =>
                  openTransactionModal("income")
                }
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-4 font-medium shadow-sm hover:shadow-md transition"
              >
                💰 Add Income
              </button>

              <button
                onClick={() =>
                  setShowReceiptScanner(true)
                }
                className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl p-4 font-medium shadow-sm hover:shadow-md transition"
              >
                📷 Scan Receipt
              </button>

              <button
                onClick={() =>
                  setShowVoiceEntry(true)
                }
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl p-4 font-medium shadow-sm hover:shadow-md transition"
              >
                🎤 Voice Entry
              </button>

            </div>

          </div>

        </section>

      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">

          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {transactionType === "expense"
                    ? "Add Expense"
                    : "Add Income"}
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  Add your financial transaction
                </p>
              </div>

              <button
                onClick={closeModal}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition"
              >
                <X size={22} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select category
                  </option>

                  {transactionType === "expense" ? (
                    <>
                      <option value="Food">
                        Food
                      </option>

                      <option value="Transport">
                        Transport
                      </option>

                      <option value="Shopping">
                        Shopping
                      </option>

                      <option value="Bills">
                        Bills
                      </option>

                      <option value="Entertainment">
                        Entertainment
                      </option>

                      <option value="Health">
                        Health
                      </option>

                      <option value="Education">
                        Education
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </>
                  ) : (
                    <>
                      <option value="Salary">
                        Salary
                      </option>

                      <option value="Business">
                        Business
                      </option>

                      <option value="Freelance">
                        Freelance
                      </option>

                      <option value="Investment">
                        Investment
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>

                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. Dinner, Salary, Shopping..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {message && (
                <div
                  className={`text-sm text-center py-2 ${
                    message.includes(
                      "successfully"
                    )
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl py-3 font-semibold text-white transition ${
                  transactionType === "expense"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                } ${
                  loading
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
              >
                {loading
                  ? "Saving..."
                  : transactionType === "expense"
                  ? "Save Expense"
                  : "Save Income"}
              </button>

            </form>

          </div>

        </div>
      )}

      {showReceiptScanner && (
        <ReceiptScanner
          onClose={() =>
            setShowReceiptScanner(false)
          }
          onExpenseAdded={fetchTransactions}
        />
      )}

      {showVoiceEntry && (
        <VoiceEntry
          onClose={() =>
            setShowVoiceEntry(false)
          }
          onExpenseAdded={fetchTransactions}
        />
      )}

    </div>
  );
}

export default Dashboard;