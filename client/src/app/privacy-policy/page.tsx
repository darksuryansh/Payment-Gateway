"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { Zap, ArrowLeft, Sun, Moon } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-gray-500 dark:text-slate-400">
            Last updated: March 15, 2026
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              Node Gateway (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed
              to protecting the privacy of our users. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you use our payment
              gateway platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">2. Information We Collect</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-3">
              We collect the following types of information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-slate-400">
              <li>
                <strong className="text-gray-900 dark:text-white">Account Information:</strong>{" "}
                Business name, email address, phone number, and business type when you register.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Payment Information:</strong>{" "}
                UPI IDs, Paytm Merchant IDs, and bank account details for processing payments.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Transaction Data:</strong>{" "}
                Payment amounts, order IDs, transaction statuses, timestamps, and customer
                details (name and email provided during checkout).
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Usage Data:</strong>{" "}
                Log data, browser type, IP address, and pages visited on our platform.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-slate-400">
              <li>To provide and maintain our payment gateway services.</li>
              <li>To process and verify payment transactions.</li>
              <li>To send transaction receipts and notifications.</li>
              <li>To provide customer support and respond to inquiries.</li>
              <li>To detect and prevent fraud or unauthorized activity.</li>
              <li>To improve our platform and develop new features.</li>
              <li>To comply with legal obligations and regulatory requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">4. Information Sharing</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-slate-400 mt-3">
              <li>
                <strong className="text-gray-900 dark:text-white">Payment Processors:</strong>{" "}
                Such as Paytm, to process transactions on your behalf.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Legal Authorities:</strong>{" "}
                When required by law, regulation, or legal process.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Service Providers:</strong>{" "}
                Third-party services that help us operate our platform (hosting, analytics).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">5. Data Security</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your
              data, including encrypted communications (HTTPS/TLS), secure API key authentication,
              checksum verification for payment transactions, and secure password hashing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">6. Data Retention</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              We retain your information for as long as your account is active or as needed to
              provide you services. Transaction records are retained as required by applicable
              financial regulations. You may request deletion of your account by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">7. Your Rights</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              You have the right to access, correct, or delete your personal information.
              You may also request a copy of the data we hold about you. To exercise these
              rights, please contact us at{" "}
              <a
                href="mailto:surynashbhardwaj04@gmail.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                surynashbhardwaj04@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">8. Changes to This Policy</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any
              changes by posting the new policy on this page and updating the &quot;Last
              updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">9. Contact Us</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us:
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
