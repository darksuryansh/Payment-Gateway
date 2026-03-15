"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import {
  Zap,
  ArrowLeft,
  Sun,
  Moon,
  Shield,
  Users,
  Globe,
  Target,
} from "lucide-react";

export default function AboutPage() {
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
            About Us
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-400">
            Learn more about Node Gateway and our mission.
          </p>
        </div>

        <div className="space-y-12">
          {/* Who We Are */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              <strong className="text-gray-900 dark:text-white">Node Gateway</strong> is
              a modern UPI payment gateway built for Indian businesses. We provide
              merchants with a simple, reliable, and affordable way to accept payments
              online — through payment links, pages, QR codes, buttons, and APIs.
            </p>
            <p className="mt-4 text-gray-600 dark:text-slate-400 leading-relaxed">
              Our platform is operated by <strong className="text-gray-900 dark:text-white">Node Gateway</strong>,
              committed to empowering businesses of all sizes with seamless payment
              collection tools.
            </p>
          </section>

          {/* Our Mission */}
          <section className="rounded-2xl border border-gray-200 bg-gray-50 p-8 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600">
                <Target size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              To make payment collection effortless for every Indian merchant — from
              freelancers and small shops to growing startups and e-commerce businesses.
              We believe accepting money should be as simple as sending a link.
            </p>
          </section>

          {/* Values */}
          <section>
            <h2 className="text-2xl font-bold mb-6">What We Stand For</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Security First",
                  desc: "Every transaction is verified with checksum validation, API key authentication, and encrypted data handling.",
                },
                {
                  icon: Users,
                  title: "Merchant Focused",
                  desc: "Built by developers who understand merchant needs. Our Tier 1 plan is free forever with zero platform fees.",
                },
                {
                  icon: Globe,
                  title: "Open & Accessible",
                  desc: "Full REST API access, webhook integrations, and developer-friendly tools for any business size.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
                      <Icon size={20} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Contact CTA */}
          <section className="text-center rounded-2xl bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 px-8 py-12">
            <h2 className="text-2xl font-bold text-white">Have Questions?</h2>
            <p className="mt-2 text-blue-100">
              We&apos;d love to hear from you. Reach out anytime.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition-colors"
            >
              Contact Us
            </Link>
          </section>
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
