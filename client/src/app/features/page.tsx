import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Features - Node Gateway Free Payment Gateway",
  description:
    "Explore all Node Gateway features: UPI payments, payment links, QR codes, invoices, payment buttons, webhooks, real-time analytics & a developer-friendly API — all 100% free.",
  keywords: [
    "free payment gateway features",
    "UPI payment gateway features",
    "payment links free",
    "QR code payments India",
    "payment gateway API",
    "invoice payment",
    "webhook payment gateway",
  ],
  alternates: {
    canonical: "https://nodegateway.vercel.app/features",
  },
};

const features = [
  {
    title: "Payment Links",
    description:
      "Create shareable payment links in seconds. Send via WhatsApp, email, or SMS. No website needed — your customers pay with a single click.",
    icon: "🔗",
  },
  {
    title: "UPI Payments",
    description:
      "Accept instant UPI payments from any app — GPay, PhonePe, Paytm, BHIM, and more. Real-time confirmation, zero waiting.",
    icon: "📱",
  },
  {
    title: "QR Code Payments",
    description:
      "Generate dynamic QR codes for in-person or online payments. Customers scan and pay in seconds from any UPI app.",
    icon: "📷",
  },
  {
    title: "Invoices",
    description:
      "Create professional invoices with built-in payment collection. Track paid and unpaid invoices from your dashboard.",
    icon: "🧾",
  },
  {
    title: "Payment Buttons",
    description:
      "Embed a payment button on any website with a single line of code. No backend required — perfect for static sites and blogs.",
    icon: "🖱️",
  },
  {
    title: "Payment Pages",
    description:
      "Build beautiful, custom payment pages for your products or services. No design skills needed — live in minutes.",
    icon: "🌐",
  },
  {
    title: "Developer API",
    description:
      "Powerful REST APIs with detailed documentation. Integrate Node Gateway into your app in minutes with our SDKs and code samples.",
    icon: "⚡",
  },
  {
    title: "Webhooks",
    description:
      "Get real-time payment notifications via webhooks. Build automated workflows — trigger fulfillment, send receipts, update your database.",
    icon: "🔔",
  },
  {
    title: "Real-time Analytics",
    description:
      "Monitor revenue, transaction volume, success rates, and customer behaviour from one dashboard. Make data-driven decisions.",
    icon: "📊",
  },
  {
    title: "Bank Account Payouts",
    description:
      "Transfer collected funds directly to your verified bank account. Fast, secure settlements with full audit trails.",
    icon: "🏦",
  },
  {
    title: "Multi-currency Support",
    description:
      "Accept payments in INR with full support for all Indian payment methods — UPI, cards, net banking, and wallets.",
    icon: "💰",
  },
  {
    title: "Secure & Compliant",
    description:
      "PCI-DSS compliant infrastructure, end-to-end encryption, and fraud detection — your transactions are always safe.",
    icon: "🔒",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <span className="text-lg font-bold tracking-tight">Node Gateway</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors dark:text-slate-300 dark:hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mb-6">
            100% Free — No hidden fees
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              accept payments
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-slate-400 leading-relaxed">
            Node Gateway is a free payment gateway with all the tools modern businesses and developers
            need — UPI, payment links, QR codes, invoices, APIs, and more. No setup fees, no monthly
            charges, ever.
          </p>
        </div>
      </section>

      {/* Features grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h2 className="text-lg font-bold mb-2">{feature.title}</h2>
                <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-2xl text-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 p-12 shadow-2xl shadow-blue-500/25">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Start accepting payments for free
          </h2>
          <p className="text-blue-100 mb-8 leading-relaxed">
            Sign up in minutes. No credit card required. Node Gateway is completely free to use — start
            collecting payments today.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-base font-semibold text-blue-600 hover:bg-blue-50 transition-colors shadow-lg"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
