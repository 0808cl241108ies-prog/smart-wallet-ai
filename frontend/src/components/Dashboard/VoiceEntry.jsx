import { useState } from "react";
import {
  Mic,
  X,
  Check,
  MicOff,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8001";

function VoiceEntry({ onClose, onExpenseAdded }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const [formData, setFormData] = useState({
    amount: "",
    category: "Other",
    description: "",
  });

  const [saving, setSaving] = useState(false);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice recognition is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const text =
        event.results[0][0].transcript;

      setTranscript(text);

      const lowerText = text.toLowerCase();

      const amountMatch = lowerText.match(
        /(?:₹|rs\.?|rupees?)?\s*(\d+(?:\.\d+)?)/i
      );

      if (amountMatch) {
        setFormData((previous) => ({
          ...previous,
          amount: amountMatch[1],
        }));
      }

      let category = "Other";

      if (
        lowerText.includes("food") ||
        lowerText.includes("dinner") ||
        lowerText.includes("lunch") ||
        lowerText.includes("restaurant")
      ) {
        category = "Food";
      } else if (
        lowerText.includes("shopping") ||
        lowerText.includes("clothes")
      ) {
        category = "Shopping";
      } else if (
        lowerText.includes("travel") ||
        lowerText.includes("transport") ||
        lowerText.includes("uber") ||
        lowerText.includes("auto")
      ) {
        category = "Transport";
      } else if (
        lowerText.includes("bill") ||
        lowerText.includes("electricity")
      ) {
        category = "Bills";
      } else if (
        lowerText.includes("medicine") ||
        lowerText.includes("doctor")
      ) {
        category = "Health";
      } else if (
        lowerText.includes("college") ||
        lowerText.includes("course") ||
        lowerText.includes("education")
      ) {
        category = "Education";
      } else if (
        lowerText.includes("movie") ||
        lowerText.includes("entertainment")
      ) {
        category = "Entertainment";
      }

      setFormData((previous) => ({
        ...previous,
        category,
        description: text,
      }));
    };

    recognition.onerror = (event) => {
      console.error(
        "Voice recognition error:",
        event.error
      );

      setListening(false);

      if (event.error === "not-allowed") {
        alert(
          "Please allow microphone permission."
        );
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const saveExpense = async (event) => {
    event.preventDefault();

    if (!formData.amount) {
      alert("Please enter an amount.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "expense",
            amount: Number(formData.amount),
            category: formData.category,
            description:
              formData.description ||
              "Voice Expense",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Failed to save expense"
        );
      }

      alert("Voice expense added successfully! ✅");

      if (onExpenseAdded) {
        onExpenseAdded();
      }

      onClose();
    } catch (error) {
      console.error(
        "Voice expense error:",
        error
      );

      alert(
        "Unable to save expense."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#111827] border border-white/10 rounded-3xl shadow-2xl p-6">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Voice Entry
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Speak your expense naturally
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col items-center py-6">

          <button
            onClick={startListening}
            disabled={listening}
            className={`w-28 h-28 rounded-full flex items-center justify-center transition ${
              listening
                ? "bg-red-500 animate-pulse"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {listening ? (
              <MicOff size={42} />
            ) : (
              <Mic size={42} />
            )}
          </button>

          <p className="text-gray-400 text-sm mt-5">
            {listening
              ? "Listening..."
              : "Tap the microphone and speak"}
          </p>

          <p className="text-gray-600 text-xs mt-2 text-center">
            Example: "500 rupees food expense"
          </p>
        </div>

        {transcript && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-5">
            <p className="text-xs text-gray-500 mb-1">
              You said
            </p>

            <p className="text-blue-300">
              "{transcript}"
            </p>
          </div>
        )}

        <form
          onSubmit={saveExpense}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Amount
            </label>

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              min="1"
              step="0.01"
              required
              className="w-full bg-[#0B1220] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-[#0B1220] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
            >
              <option value="Food">Food</option>
              <option value="Shopping">Shopping</option>
              <option value="Transport">Transport</option>
              <option value="Bills">Bills</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Entertainment">
                Entertainment
              </option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Description
            </label>

            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Voice description"
              className="w-full bg-[#0B1220] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl py-3 transition"
          >
            <Check size={19} />

            {saving
              ? "Saving..."
              : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VoiceEntry;