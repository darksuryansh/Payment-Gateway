"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import Link from "next/link";
import {
  Zap,
  Mail,
  Lock,
  ArrowRight,
  Link2,
  QrCode,
  Receipt,
  BarChart2,
  Sun,
  Moon,
} from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ─── Left Panel — Branding ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-white/5 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-white/5 -translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Top — logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">Node Gateway</span>
          </Link>

          {/* Center — Tagline */}
          <div className="space-y-6">
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Your complete<br />payment solution
            </h2>
            <p className="text-lg text-blue-100 max-w-md leading-relaxed">
              Accept UPI, card, and wallet payments with a single dashboard.
              Built for Indian businesses of all sizes.
            </p>

            {/* Feature highlights */}
            <div className="space-y-4 mt-8">
              {[
                { icon: Link2, text: "Shareable payment links" },
                { icon: QrCode, text: "Dynamic & static QR codes" },
                { icon: Receipt, text: "Professional invoicing" },
                { icon: BarChart2, text: "Real-time analytics" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                      <Icon size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-blue-50">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom */}
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
        <div className="flex flex-1 items-center justify-center px-6 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Welcome back
              </h1>
              <p className="mt-2 text-gray-500 dark:text-slate-400">
                Sign in to your merchant dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl bg-red-50 p-3.5 text-sm text-red-600 border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5 dark:text-slate-300">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                    placeholder="you@business.com"
                  />
                </div>
              </div>

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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
                    placeholder="Enter your password"
                  />
                </div>
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
                    Sign In
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500 dark:text-slate-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
