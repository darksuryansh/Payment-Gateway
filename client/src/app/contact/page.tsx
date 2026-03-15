"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import {
  Zap,
  ArrowLeft,
  Sun,
  Moon,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function ContactPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Node Gateway</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft size={14} />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-400">
            Have questions or need help? We&apos;re here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Contact Cards */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
              <Mail size={22} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Email</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
              Drop us an email and we&apos;ll get back to you within 24 hours.
            </p>
            <a
              href="mailto:surynashbhardwaj04@gmail.com"
              className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              surynashbhardwaj04@gmail.com
            </a>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/30">
              <Phone size={22} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Phone</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
              Call us during business hours (Mon–Sat, 10 AM – 6 PM IST).
            </p>
            <a
              href="tel:+917876801968"
              className="mt-4 inline-block text-sm font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
            >
              +91 7876801968
            </a>
          </div>

          <div className="sm:col-span-2 rounded-2xl border border-gray-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/30">
              <MapPin size={22} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Registered Address
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
              Address will be updated soon.
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 rounded-2xl bg-gray-50 border border-gray-200 p-8 dark:border-slate-800 dark:bg-slate-900/50">
          <h2 className="text-xl font-bold mb-4">Business Information</h2>
          <div className="space-y-3 text-sm text-gray-600 dark:text-slate-400">
            <p>
              <strong className="text-gray-900 dark:text-white">Legal Entity:</strong>{" "}
              Node Gateway
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">Email:</strong>{" "}
              <a href="mailto:surynashbhardwaj04@gmail.com" className="text-blue-600 dark:text-blue-400">
                surynashbhardwaj04@gmail.com
              </a>
            </p>
            <p>
              <strong className="text-gray-900 dark:text-white">Phone:</strong>{" "}
              <a href="tel:+917876801968" className="text-blue-600 dark:text-blue-400">
                +91 7876801968
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 dark:border-slate-800 dark:bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-indigo-600">
                <Zap size={14} className="text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">Node Gateway</span>
            </Link>
            <p className="text-xs text-gray-400 dark:text-slate-500">
              &copy; {new Date().getFullYear()} Node Gateway. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
