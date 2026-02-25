"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Save, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

interface PaytmConfig {
  paytm_mid: string | null;
  paytm_merchant_key: string | null;
  paytm_website: string;
  paytm_configured: boolean;
}

export default function PaytmSettingsPage() {
  const [config, setConfig] = useState<PaytmConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [form, setForm] = useState({
    paytm_mid: "",
    paytm_merchant_key: "",
    paytm_website: "DEFAULT",
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await api.get("/merchant/paytm-config");
      const data = res.data.data;
      setConfig(data);
      setForm({
        paytm_mid: data.paytm_mid || "",
        paytm_merchant_key: "",
        paytm_website: data.paytm_website || "DEFAULT",
      });
    } catch {
      setError("Failed to load Paytm configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.paytm_mid.trim()) {
      setError("Merchant ID is required.");
      return;
    }

    if (!form.paytm_merchant_key.trim() && !config?.paytm_configured) {
      setError("Merchant Key is required.");
      return;
    }

    setSaving(true);
    try {
      const payload: Record<string, string> = {
        paytm_mid: form.paytm_mid,
        paytm_website: form.paytm_website,
      };

      if (form.paytm_merchant_key.trim()) {
        payload.paytm_merchant_key = form.paytm_merchant_key;
      } else if (config?.paytm_merchant_key) {
        // Keep the existing key (send masked value as signal to backend)
        // Actually we need to always send the key for update
        setError("Please enter your Merchant Key to update configuration.");
        setSaving(false);
        return;
      }

      await api.put("/merchant/paytm-config", payload);
      setSuccess("Paytm configuration updated successfully.");
      setForm((prev) => ({ ...prev, paytm_merchant_key: "" }));
      await fetchConfig();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update configuration.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Paytm Configuration</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Connect your Paytm Business account to accept payments through UPI, cards, and wallets.
        </p>
      </div>

      {/* Status Card */}
      <div className={`flex items-center gap-3 rounded-lg border p-4 ${
        config?.paytm_configured
          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
          : "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20"
      }`}>
        {config?.paytm_configured ? (
          <>
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-300">Paytm Connected</p>
              <p className="text-xs text-green-600 dark:text-green-400">
                MID: {config.paytm_mid} &bull; Key: {config.paytm_merchant_key}
              </p>
            </div>
          </>
        ) : (
          <>
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Paytm Not Configured</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                Add your Paytm Business credentials below to start accepting payments.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Config Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 border border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
              {success}
            </div>
          )}

          <div>
            <label htmlFor="paytm_mid" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Merchant ID (MID)
            </label>
            <input
              id="paytm_mid"
              type="text"
              value={form.paytm_mid}
              onChange={(e) => setForm({ ...form, paytm_mid: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
              placeholder="e.g. MERCHANT12345678"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Find this in your Paytm Business dashboard under Developer Settings.
            </p>
          </div>

          <div>
            <label htmlFor="paytm_merchant_key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Merchant Key
              {config?.paytm_configured && (
                <span className="ml-2 text-xs text-gray-400">(enter new key to update)</span>
              )}
            </label>
            <div className="relative">
              <input
                id="paytm_merchant_key"
                type={showKey ? "text" : "password"}
                value={form.paytm_merchant_key}
                onChange={(e) => setForm({ ...form, paytm_merchant_key: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                placeholder={config?.paytm_configured ? "Enter new key to update" : "Your Paytm secret key"}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="paytm_website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Website Parameter
            </label>
            <select
              id="paytm_website"
              value={form.paytm_website}
              onChange={(e) => setForm({ ...form, paytm_website: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="DEFAULT">DEFAULT (Production)</option>
              <option value="WEBSTAGING">WEBSTAGING (Testing)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Configuration"}
          </button>
        </form>
      </div>
    </div>
  );
}
