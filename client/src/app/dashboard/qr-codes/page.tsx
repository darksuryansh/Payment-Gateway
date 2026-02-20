"use client";

import { useState } from "react";
import api from "@/lib/api";
import { QrCode, Download, AlertCircle } from "lucide-react";

export default function QRCodesPage() {
  const [mode, setMode] = useState<"static" | "dynamic">("static");
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [qrData, setQrData] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ amount: "", note: "", format: "png" });

  const generateStaticQR = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/qrcodes/static", {
        amount: form.amount ? parseFloat(form.amount) : undefined,
        note: form.note || undefined,
        format: form.format,
      });
      setQrImage(res.data.data.qr_image);
      setQrData(res.data.data.qr_data);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Failed to generate QR code.");
    } finally {
      setLoading(false);
    }
  };

  const generateDynamicQR = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/qrcodes/generate", {
        amount: form.amount ? parseFloat(form.amount) : undefined,
        note: form.note || undefined,
        format: form.format,
      });
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
    a.download = `qr-code.${form.format}`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">QR Codes</h1>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        QR code generation requires a primary UPI account to be set up. Go to{" "}
        <a href="/dashboard/settings/profile" className="font-medium underline">Settings → Profile → Bank Accounts</a>{" "}
        to add your UPI ID first.
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Generator */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => { setMode("static"); setError(null); setQrImage(null); }}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === "static" ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
            >
              Static QR
            </button>
            <button
              onClick={() => { setMode("dynamic"); setError(null); setQrImage(null); }}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${mode === "dynamic" ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
            >
              Dynamic QR
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === "static" ? (
            <form onSubmit={generateStaticQR} className="space-y-3">
              <p className="text-sm text-gray-500">Generate a QR code for a specific amount. Payment is tracked automatically on your dashboard.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="Enter amount"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <input
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Payment for..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !form.amount}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <QrCode size={16} />
                {loading ? "Generating..." : "Generate QR Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={generateDynamicQR} className="space-y-3">
              <p className="text-sm text-gray-500">Generate a QR code with a fixed amount. Requires a primary UPI account.</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
                <input
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Payment for..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <QrCode size={16} />
                {loading ? "Generating..." : "Generate QR Code"}
              </button>
            </form>
          )}
        </div>

        {/* Preview */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col items-center justify-center space-y-4">
          {qrImage ? (
            <>
              <img
                src={qrImage.startsWith("data:") ? qrImage : `data:image/png;base64,${qrImage}`}
                alt="QR Code"
                className="h-64 w-64"
              />
              {qrData && <p className="text-xs text-gray-400 break-all text-center max-w-xs">{qrData}</p>}
              <button
                onClick={downloadQR}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Download size={16} />
                Download QR
              </button>
            </>
          ) : (
            <div className="text-center text-gray-400">
              <QrCode size={64} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Generate a QR code to preview it here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
