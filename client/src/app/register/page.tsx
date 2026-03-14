"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import Link from "next/link";
import {
  Zap,
  Building2,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Smartphone,
  CreditCard,
  CheckCircle2,
  Sun,
  Moon,
  AlertTriangle,
} from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({
    business_name: "",
    email: "",
    password: "",
    phone: "",
    business_type: "individual",
    merchant_tier: "tier_1",
    upi_id: "",
    paytm_mid: "",
    paytm_merchant_key: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(form);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const businessTypes = [
    { value: "individual", label: "Individual" },
    { value: "proprietorship", label: "Proprietorship" },
    { value: "partnership", label: "Partnership" },
    { value: "pvt_ltd", label: "Private Limited" },
    { value: "llp", label: "LLP" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* ─── Left Panel — Branding ─── */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700">
        <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-white/5 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-white/5 -translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">Node Gateway</span>
          </Link>

          <div className="space-y-6">
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Start accepting<br />payments today
            </h2>
            <p className="text-lg text-blue-100 max-w-md leading-relaxed">
              Set up your merchant account in under 5 minutes. No paperwork, no hidden fees.
            </p>

            <div className="space-y-4 mt-8">
              {[
                "Zero platform fees on Tier 1",
                "Accept UPI, cards & wallets",
                "Real-time analytics dashboard",
                "Invoicing & subscriptions",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-green-300 shrink-0" />
                  <span className="text-sm font-medium text-blue-50">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-blue-200">
            &copy; {new Date().getFullYear()} Node Gateway
          </p>
        </div>
      </div>

      {/* ─── Right Panel — Form ─── */}
      <div className="flex flex-1 flex-col bg-white dark:bg-slate-950">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 sm:px-10">
          <Link href="/" className="flex items-center gap-2 lg:invisible">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-indigo-600">
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">Node Gateway</span>
          </Link>
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>

        {/* Form area */}
        <div className="flex flex-1 items-center justify-center px-6 sm:px-10 py-8">
          <div className="w-full max-w-lg">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Create your account
              </h1>
              <p className="mt-2 text-gray-500 dark:text-slate-400">
                Set up your merchant dashboard in minutes
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl bg-red-50 p-3.5 text-sm text-red-600 border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Business Name */}
              <div>
                <label htmlFor="business_name" className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-slate-300">
                  Business Name
                </label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                  <input
                    id="business_name"
                    type="text"
                    required
                    value={form.business_name}
                    onChange={(e) => updateField("business_name", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                    placeholder="Your Business Name"
                  />
                </div>
              </div>

              {/* Email & Phone row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-slate-300">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                      placeholder="you@business.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-slate-300">
                    Phone <span className="text-gray-400 dark:text-slate-500">(optional)</span>
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                    placeholder="Minimum 8 characters"
                  />
                </div>
              </div>

              {/* Business Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">
                  Business Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {businessTypes.map((bt) => (
                    <button
                      key={bt.value}
                      type="button"
                      onClick={() => updateField("business_type", bt.value)}
                      className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-all ${
                        form.business_type === bt.value
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-600"
                          : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                      }`}
                    >
                      {bt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Account Tier */}
              <div className="border-t border-gray-200 pt-5 dark:border-slate-800">
                <label className="block text-sm font-medium text-gray-700 mb-3 dark:text-slate-300">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Tier 1 */}
                  <button
                    type="button"
                    onClick={() => updateField("merchant_tier", "tier_1")}
                    className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                      form.merchant_tier === "tier_1"
                        ? "border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10 dark:bg-blue-900/20 dark:border-blue-500"
                        : "border-gray-200 hover:border-gray-300 dark:border-slate-700 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone size={18} className={form.merchant_tier === "tier_1" ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-slate-500"} />
                      <span className={`text-sm font-bold ${form.merchant_tier === "tier_1" ? "text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-slate-300"}`}>
                        Personal UPI
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Free forever, manual verification</p>
                    {form.merchant_tier === "tier_1" && (
                      <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <CheckCircle2 size={12} className="text-white" />
                      </div>
                    )}
                  </button>

                  {/* Tier 2 */}
                  <button
                    type="button"
                    onClick={() => updateField("merchant_tier", "tier_2")}
                    className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                      form.merchant_tier === "tier_2"
                        ? "border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10 dark:bg-blue-900/20 dark:border-blue-500"
                        : "border-gray-200 hover:border-gray-300 dark:border-slate-700 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard size={18} className={form.merchant_tier === "tier_2" ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-slate-500"} />
                      <span className={`text-sm font-bold ${form.merchant_tier === "tier_2" ? "text-blue-700 dark:text-blue-400" : "text-gray-700 dark:text-slate-300"}`}>
                        Paytm Business
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">Automated, multi-mode payments</p>
                    {form.merchant_tier === "tier_2" && (
                      <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <CheckCircle2 size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                </div>

                {/* Tier 1 fields */}
                {form.merchant_tier === "tier_1" && (
                  <div className="mt-4 space-y-3 rounded-xl bg-blue-50/50 p-4 border border-blue-200 dark:bg-blue-900/10 dark:border-blue-800">
                    <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                      <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        Personal savings accounts often have ~20 UPI transactions/day limit.
                      </p>
                    </div>
                    <div>
                      <label htmlFor="upi_id" className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-slate-300">
                        UPI ID
                      </label>
                      <input
                        id="upi_id"
                        type="text"
                        value={form.upi_id}
                        onChange={(e) => updateField("upi_id", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 bg-white py-2.5 px-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                        placeholder="yourname@okaxis"
                      />
                      <p className="text-xs text-gray-400 mt-1 dark:text-slate-500">You can also add this later in settings.</p>
                    </div>
                  </div>
                )}

                {/* Tier 2 fields */}
                {form.merchant_tier === "tier_2" && (
                  <div className="mt-4 space-y-3 rounded-xl bg-gray-50 p-4 border border-gray-200 dark:bg-slate-900 dark:border-slate-700">
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Connect your Paytm Business account. You can also configure this later.
                    </p>
                    <div>
                      <label htmlFor="paytm_mid" className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-slate-300">
                        Paytm Merchant ID
                      </label>
                      <input
                        id="paytm_mid"
                        type="text"
                        value={form.paytm_mid}
                        onChange={(e) => updateField("paytm_mid", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 bg-white py-2.5 px-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                        placeholder="e.g. MERCHANT12345678"
                      />
                    </div>
                    <div>
                      <label htmlFor="paytm_merchant_key" className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-slate-300">
                        Merchant Key
                      </label>
                      <input
                        id="paytm_merchant_key"
                        type="password"
                        value={form.paytm_merchant_key}
                        onChange={(e) => updateField("paytm_merchant_key", e.target.value)}
                        className="w-full rounded-xl border border-gray-300 bg-white py-2.5 px-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                        placeholder="Your Paytm secret key"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
