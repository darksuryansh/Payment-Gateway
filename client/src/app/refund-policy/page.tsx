"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { Zap, ArrowLeft, Sun, Moon } from "lucide-react";

export default function RefundPolicyPage() {
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
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="mt-4 text-sm text-gray-500 dark:text-slate-400">
            Last updated: March 15, 2026
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Overview</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              This Refund and Cancellation Policy outlines how refunds and cancellations are
              handled for transactions processed through Node Gateway. As a payment gateway,
              we facilitate transactions between merchants and their customers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">2. Merchant Responsibility</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              Individual refund and cancellation policies are determined by the merchant
              (business) from whom you made the purchase. Merchants using Node Gateway are
              responsible for setting and communicating their own refund policies to their
              customers. Customers should contact the merchant directly for refund requests
              related to goods or services purchased.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">3. Refund Process for Merchants</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-3">
              Merchants can initiate refunds through the Node Gateway dashboard:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-slate-400">
              <li>
                <strong className="text-gray-900 dark:text-white">Tier 1 (UPI Direct):</strong>{" "}
                Since payments are received directly to the merchant&apos;s UPI account, refunds
                must be processed directly by the merchant to the customer through UPI or other
                means. Node Gateway provides transaction records to assist with this process.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Tier 2 (Paytm Business):</strong>{" "}
                Merchants can initiate refunds through the Node Gateway dashboard. Refunds are
                processed via Paytm and are subject to Paytm&apos;s refund processing timelines,
                typically 5-7 business days.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">4. Refund Timelines</h2>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-200 dark:border-slate-700">
                  <span className="font-semibold text-gray-900 dark:text-white">UPI Refunds (Tier 1)</span>
                  <span className="text-sm text-gray-600 dark:text-slate-400">Processed directly by merchant</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-200 dark:border-slate-700">
                  <span className="font-semibold text-gray-900 dark:text-white">Paytm Refunds (Tier 2)</span>
                  <span className="text-sm text-gray-600 dark:text-slate-400">5–7 business days</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">Bank Account Credit</span>
                  <span className="text-sm text-gray-600 dark:text-slate-400">Additional 2–3 business days after processing</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">5. Cancellation of Payments</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-slate-400">
              <li>
                Payments that are in a &quot;pending&quot; state may be cancelled by the
                merchant before verification or settlement.
              </li>
              <li>
                Once a payment is marked as &quot;completed&quot; or &quot;settled&quot;, it
                cannot be cancelled — only refunded.
              </li>
              <li>
                Payment links and payment pages can be deactivated by the merchant at any time
                to prevent further transactions.
              </li>
              <li>
                Subscriptions can be cancelled by the merchant through the dashboard. Any
                payments already processed will not be automatically refunded upon cancellation.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">6. Platform Fee Refunds</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              Node Gateway does not charge platform fees for Tier 1 merchants. For Tier 2
              merchants, any processing fees charged by Paytm on refunded transactions are
              subject to Paytm&apos;s refund fee policy. Node Gateway itself does not charge
              any additional fees for processing refunds.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">7. Disputes</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              If you are a customer and have a dispute with a merchant regarding a refund,
              we recommend first contacting the merchant directly. If the issue remains
              unresolved, you may contact us and we will attempt to mediate. However, the
              final responsibility for refunds lies with the merchant.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">8. Contact Us</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              For questions about refunds or cancellations, contact us:
            </p>
            <ul className="list-none mt-3 space-y-2 text-gray-600 dark:text-slate-400">
              <li>
                Email:{" "}
                <a
                  href="mailto:surynashbhardwaj04@gmail.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  surynashbhardwaj04@gmail.com
                </a>
              </li>
              <li>
                Phone:{" "}
                <a
                  href="tel:+917876801968"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  +91 7876801968
                </a>
              </li>
            </ul>
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
