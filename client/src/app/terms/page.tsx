"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { Zap, ArrowLeft, Sun, Moon } from "lucide-react";

export default function TermsPage() {
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
            Terms and Conditions
          </h1>
          <p className="mt-4 text-sm text-gray-500 dark:text-slate-400">
            Last updated: March 15, 2026
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              By accessing or using Node Gateway (&quot;the Platform&quot;), you agree to be
              bound by these Terms and Conditions. If you do not agree to these terms, please
              do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">2. Description of Services</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              Node Gateway provides a payment gateway platform that enables merchants to accept
              payments through UPI, Paytm Business, and other payment methods. Our services
              include payment links, payment pages, payment buttons, QR codes, invoicing,
              subscriptions, and related payment processing tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">3. Account Registration</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-slate-400">
              <li>You must provide accurate and complete business information during registration.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You must be at least 18 years old to create an account.</li>
              <li>One business entity may maintain only one account on the platform.</li>
              <li>You must notify us immediately of any unauthorized use of your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">4. Merchant Tiers</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-3">
              We offer two merchant tiers:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-slate-400">
              <li>
                <strong className="text-gray-900 dark:text-white">Tier 1 (UPI Direct):</strong>{" "}
                Free to use with zero platform fees. Payments are collected via personal UPI
                and require manual UTR verification by the merchant.
              </li>
              <li>
                <strong className="text-gray-900 dark:text-white">Tier 2 (Paytm Business):</strong>{" "}
                Automated payment processing via Paytm Business. Standard Paytm processing
                fees apply as determined by Paytm.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">5. Payment Processing</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-slate-400">
              <li>We act as a technology intermediary and do not hold customer funds.</li>
              <li>
                For Tier 1, payments go directly to the merchant&apos;s UPI account. Merchants
                are responsible for verifying payment authenticity.
              </li>
              <li>
                For Tier 2, payments are processed through Paytm Business and are subject to
                Paytm&apos;s terms and settlement schedules.
              </li>
              <li>We are not liable for payment failures caused by third-party payment processors or banks.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">6. Prohibited Activities</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-3">
              You agree not to use Node Gateway for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-slate-400">
              <li>Any illegal or fraudulent activities.</li>
              <li>Selling prohibited goods or services under Indian law.</li>
              <li>Money laundering or terrorist financing.</li>
              <li>Misrepresenting your business or products to customers.</li>
              <li>Attempting to compromise the security of the platform.</li>
              <li>Reverse engineering or copying any part of our platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">7. Intellectual Property</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              All content, features, and functionality of the platform (including the code,
              design, logos, and documentation) are owned by Node Gateway and are protected
              by intellectual property laws. You are granted a limited, non-exclusive license
              to use the platform for its intended purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">8. Limitation of Liability</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              To the maximum extent permitted by law, Node Gateway shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages arising from
              your use of the platform. Our total liability shall not exceed the fees paid by
              you to us in the preceding 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">9. Termination</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              We reserve the right to suspend or terminate your account at any time if you
              violate these terms, engage in fraudulent activity, or if required by law. You
              may also close your account at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">10. Governing Law</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of
              India. Any disputes arising from these terms shall be subject to the exclusive
              jurisdiction of the courts in India.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">11. Changes to Terms</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              We may update these Terms and Conditions from time to time. Continued use of the
              platform after changes constitutes acceptance of the revised terms. We will notify
              registered users of material changes via email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">12. Contact</h2>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              For questions about these Terms and Conditions, contact us:
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
