import { useRef, useState } from "react";
import {
  Camera,
  Upload,
  X,
  Receipt,
  Check,
  ScanLine,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8001";
  

function ReceiptScanner({ onClose, onExpenseAdded }) {
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [ocrText, setOcrText] = useState("");

  const [formData, setFormData] = useState({
    amount: "",
    category: "Other",
    description: "",
  });

  const [saving, setSaving] = useState(false);

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);

    setScanning(true);
    setOcrText("");

    try {
      const data = new FormData();
      data.append("file", file);

      const response = await fetch(
        `${API_URL}/api/scan-receipt`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "OCR scanning failed"
        );
      }

      setOcrText(result.text || "");

      if (result.amount && result.amount > 0) {
        setFormData((previous) => ({
          ...previous,
          amount: String(result.amount),
        }));
      }
    } catch (error) {
      console.error("OCR error:", error);
      alert(
        "Receipt scan failed. Please enter the amount manually."
      );
    } finally {
      setScanning(false);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSaveExpense = async (event) => {
    event.preventDefault();

    if (!formData.amount) {
      alert("Please enter the amount.");
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
              "Receipt Expense",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to save expense"
        );
      }

      alert("Expense added successfully! ✅");

      if (onExpenseAdded) {
        onExpenseAdded();
      }

      onClose();
    } catch (error) {
      console.error(
        "Receipt expense error:",
        error
      );

      alert(
        "Unable to save expense. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#111827] border border-white/10 rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/10 rounded-xl">
              <Receipt
                className="text-yellow-400"
                size={24}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Scan Receipt
              </h2>

              <p className="text-sm text-gray-400">
                AI-powered receipt scanning
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* UPLOAD */}
        {!image ? (
          <div
            onClick={() =>
              fileInputRef.current?.click()
            }
            className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center cursor-pointer hover:border-yellow-400/50 hover:bg-white/[0.02] transition"
          >
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-yellow-500/10 rounded-full">
                <Camera
                  size={32}
                  className="text-yellow-400"
                />
              </div>
            </div>

            <h3 className="text-white font-semibold">
              Upload Receipt
            </h3>

            <p className="text-gray-400 text-sm mt-2">
              Click to choose an image
            </p>

            <p className="text-gray-600 text-xs mt-1">
              JPG, PNG or WEBP
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">

            {/* IMAGE */}
            <div className="relative rounded-2xl overflow-hidden bg-black">
              <img
                src={image}
                alt="Receipt preview"
                className="w-full max-h-72 object-contain"
              />

              <button
                onClick={() => {
                  setImage(null);
                  setOcrText("");
                  setFormData({
                    amount: "",
                    category: "Other",
                    description: "",
                  });
                }}
                className="absolute top-3 right-3 p-2 bg-black/70 rounded-full hover:bg-black transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* SCANNING STATUS */}
            {scanning && (
              <div className="flex items-center justify-center gap-3 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <ScanLine
                  size={20}
                  className="text-blue-400 animate-pulse"
                />

                <span className="text-blue-300 text-sm">
                  Scanning receipt...
                </span>
              </div>
            )}

            {!scanning && ocrText && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <p className="text-green-400 text-sm font-semibold">
                  ✓ Receipt scanned successfully
                </p>

                <p className="text-gray-500 text-xs mt-1">
                  Amount detected automatically
                </p>
              </div>
            )}

            {/* CHANGE IMAGE */}
            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="w-full flex items-center justify-center gap-2 bg-[#1F2937] hover:bg-[#293548] text-white rounded-xl py-3 transition"
            >
              <Upload size={18} />
              Choose Another Receipt
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* FORM */}
            <form
              onSubmit={handleSaveExpense}
              className="space-y-4"
            >

              {/* AMOUNT */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Detected amount"
                  min="1"
                  step="0.01"
                  required
                  className="w-full bg-[#0B1220] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400"
                />

                {ocrText && formData.amount && (
                  <p className="text-xs text-green-400 mt-2">
                    ✓ Amount detected by OCR
                  </p>
                )}
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-[#0B1220] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400"
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

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Description
                </label>

                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g. Grocery shopping"
                  className="w-full bg-[#0B1220] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-400"
                />
              </div>

              {/* SAVE */}
              <button
                type="submit"
                disabled={saving || scanning}
                className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-semibold rounded-xl py-3 transition"
              >
                <Check size={19} />

                {saving
                  ? "Saving..."
                  : scanning
                  ? "Scanning..."
                  : "Add Expense"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReceiptScanner;