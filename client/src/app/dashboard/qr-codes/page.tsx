"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import {
  QrCode,
  Download,
  AlertCircle,
  Smartphone,
  IndianRupee,
  StickyNote,
  CheckCircle2,
  Info,
  CreditCard,
} from "lucide-react";

type Mode = "static" | "dynamic" | "paytm_dynamic";

export default function QRCodesPage() {
  const { merchant } = useAuth();
  const tier = merchant?.merchant_tier || "tier_1";
  const [mode, setMode] = useState<Mode>("static");
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [qrData, setQrData] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
    setQrImage(null);
    setQrData("");
    setAmount("");
    setNote("");
  };

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setQrImage(null);
    setQrData("");
    try {
      const payload: Record<string, unknown> = { format: "png" };
      if (mode === "dynamic" || mode === "paytm_dynamic") payload.amount = parseFloat(amount);
      if (note) payload.note = note;

      const endpoint = mode === "paytm_dynamic" ? "/qrcodes/dynamic" : "/qrcodes/generate";
      const res = await api.post(endpoint, payload);
      setQrImage(res.data.data.qr_image);
      setQrData(res.data.data.qr_data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Failed to generate QR code.");
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrImage) return;
    const a = document.createElement("a");
    a.href = qrImage.startsWith("data:") ? qrImage : `data:image/png;base64,${qrImage}`;
    a.download = mode === "static" ? "static-upi-qr.png" : mode === "paytm_dynamic" ? `paytm-qr-rs${amount}.png` : `dynamic-qr-rs${amount}.png`;
    a.click();
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">QR Codes</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          {tier === "tier_1"
            ? "Generate UPI QR codes linked to your primary UPI account."
            : "Generate UPI or Paytm-powered QR codes for payments."}
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3.5 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
        <Info size={16} className="mt-0.5 shrink-0" />
        <span>
          Make sure you have a primary UPI account set up under{" "}
          <a href="/dashboard/settings/bank-accounts" className="font-semibold underline">
            Settings → Bank Accounts & UPI
          </a>{" "}
          before generating QR codes.
        </span>
      </div>

      {/* Mode explainer cards */}
      <div className={`grid grid-cols-1 gap-4 ${tier === "tier_2" ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        <button
          onClick={() => switchMode("static")}
          className={`text-left rounded-2xl border-2 p-5 transition-all ${
            mode === "static"
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-200 bg-white hover:border-gray-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${mode === "static" ? "bg-blue-100 dark:bg-blue-900/40" : "bg-gray-100 dark:bg-slate-800"}`}>
              <Smartphone size={18} className={mode === "static" ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-slate-400"} />
            </div>
            <div>
              <p className={`font-semibold text-sm ${mode === "static" ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-white"}`}>
                Static QR
              </p>
              {mode === "static" && (
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Selected</span>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
            No amount embedded. Customer scans and enters any amount they want.
            Print once and reuse — perfect for a shop counter or business card.
          </p>
        </button>

        <button
          onClick={() => switchMode("dynamic")}
          className={`text-left rounded-2xl border-2 p-5 transition-all ${
            mode === "dynamic"
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
              : "border-gray-200 bg-white hover:border-gray-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${mode === "dynamic" ? "bg-indigo-100 dark:bg-indigo-900/40" : "bg-gray-100 dark:bg-slate-800"}`}>
              <IndianRupee size={18} className={mode === "dynamic" ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-slate-400"} />
            </div>
            <div>
              <p className={`font-semibold text-sm ${mode === "dynamic" ? "text-indigo-700 dark:text-indigo-300" : "text-gray-900 dark:text-white"}`}>
                Dynamic QR
              </p>
              {mode === "dynamic" && (
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Selected</span>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
            Amount is pre-filled in the QR. Customer scans and just confirms the
            exact amount. Generate a fresh one for each specific transaction.
          </p>
        </button>

        {/* Paytm Dynamic QR — Tier 2 only */}
        {tier === "tier_2" && (
          <button
            onClick={() => switchMode("paytm_dynamic")}
            className={`text-left rounded-2xl border-2 p-5 transition-all ${
              mode === "paytm_dynamic"
                ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
                : "border-gray-200 bg-white hover:border-gray-300 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${mode === "paytm_dynamic" ? "bg-cyan-100 dark:bg-cyan-900/40" : "bg-gray-100 dark:bg-slate-800"}`}>
                <CreditCard size={18} className={mode === "paytm_dynamic" ? "text-cyan-600 dark:text-cyan-400" : "text-gray-500 dark:text-slate-400"} />
              </div>
              <div>
                <p className={`font-semibold text-sm ${mode === "paytm_dynamic" ? "text-cyan-700 dark:text-cyan-300" : "text-gray-900 dark:text-white"}`}>
                  Paytm Dynamic QR
                </p>
                {mode === "paytm_dynamic" && (
                  <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">Selected</span>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
              Paytm API-powered QR with auto-verification. Supports UPI, cards,
              and wallets. Creates a tracked transaction automatically.
            </p>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Generator form */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="border-b border-gray-100 px-6 py-4 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                mode === "static" ? "bg-blue-50 dark:bg-blue-900/20" : mode === "paytm_dynamic" ? "bg-cyan-50 dark:bg-cyan-900/20" : "bg-indigo-50 dark:bg-indigo-900/20"
              }`}>
                <QrCode size={16} className={mode === "static" ? "text-blue-600 dark:text-blue-400" : mode === "paytm_dynamic" ? "text-cyan-600 dark:text-cyan-400" : "text-indigo-600 dark:text-indigo-400"} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {mode === "static" ? "Static QR — No Amount" : mode === "paytm_dynamic" ? "Paytm Dynamic QR — Tracked" : "Dynamic QR — Fixed Amount"}
              </h3>
            </div>
          </div>

          <form onSubmit={generate} className="p-6 space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            {/* Amount — for Dynamic and Paytm Dynamic */}
            {mode !== "static" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <IndianRupee size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={`${inputClass} pl-9`}
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-400 dark:text-slate-500">
                  This amount will be pre-filled when the customer scans.
                </p>
              </div>
            )}

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5">
                Note <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <StickyNote size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={mode === "static" ? "e.g. Payment to My Store" : "e.g. Order #1234"}
                  className={`${inputClass} pl-9`}
                />
              </div>
            </div>

            {/* Static info note */}
            {mode === "static" && (
              <div className="flex items-start gap-2.5 rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500 dark:bg-slate-900 dark:text-slate-400">
                <Info size={13} className="mt-0.5 shrink-0" />
                Your UPI ID will be embedded in the QR. No amount is set — the customer decides.
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (mode !== "static" && !amount)}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 ${
                mode === "static"
                  ? "bg-linear-to-r from-blue-600 to-indigo-600 shadow-blue-500/20 hover:shadow-blue-500/30"
                  : mode === "paytm_dynamic"
                    ? "bg-linear-to-r from-cyan-600 to-teal-600 shadow-cyan-500/20 hover:shadow-cyan-500/30"
                    : "bg-linear-to-r from-indigo-600 to-purple-600 shadow-indigo-500/20 hover:shadow-indigo-500/30"
              }`}
            >
              <QrCode size={16} />
              {loading ? "Generating..." : `Generate ${mode === "static" ? "Static" : mode === "paytm_dynamic" ? "Paytm" : "Dynamic"} QR`}
            </button>
          </form>
        </div>

        {/* Preview */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950 flex flex-col items-center justify-center p-6 min-h-72">
          {qrImage ? (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                <img
                  src={qrImage.startsWith("data:") ? qrImage : `data:image/png;base64,${qrImage}`}
                  alt="Generated QR Code"
                  className="h-56 w-56"
                />
              </div>

              {/* Amount badge for dynamic */}
              {mode === "dynamic" && amount && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <IndianRupee size={13} />
                  {parseFloat(amount).toLocaleString("en-IN")} pre-filled
                </div>
              )}
              {mode === "paytm_dynamic" && amount && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
                  <CreditCard size={13} />
                  Paytm QR — ₹{parseFloat(amount).toLocaleString("en-IN")}
                </div>
              )}
              {mode === "static" && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <CheckCircle2 size={13} />
                  Open amount — reusable
                </div>
              )}

              {qrData && (
                <p className="text-xs text-gray-400 dark:text-slate-500 break-all text-center max-w-xs font-mono">
                  {qrData.length > 80 ? qrData.slice(0, 80) + "…" : qrData}
                </p>
              )}

              <button
                onClick={downloadQR}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Download size={15} />
                Download QR
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-50 dark:bg-slate-900">
                <QrCode size={36} className="text-gray-200 dark:text-slate-700" />
              </div>
              <p className="text-sm font-medium text-gray-400 dark:text-slate-500">
                QR preview will appear here
              </p>
              <p className="mt-1 text-xs text-gray-300 dark:text-slate-600">
                {mode === "static"
                  ? "Fill in the note and click Generate"
                  : "Enter an amount and click Generate"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
