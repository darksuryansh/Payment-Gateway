import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How Payment Gateways Work: A Complete Guide",
  description:
    "Step-by-step explanation of how payment gateways process transactions — from the customer clicking Pay to money reaching your bank. Free guide for developers & businesses.",
  keywords: [
    "how payment gateways work",
    "payment gateway explained",
    "online payment processing",
    "payment gateway India",
    "UPI payment process",
    "payment gateway for beginners",
    "free payment gateway",
  ],
  alternates: {
    canonical: "https://nodegateway.vercel.app/blog/how-payment-gateways-work",
  },
  openGraph: {
    type: "article",
    title: "How Payment Gateways Work: A Complete Guide",
    description:
      "Step-by-step explanation of how payment gateways process transactions — from the customer clicking Pay to money reaching your bank.",
    url: "https://nodegateway.vercel.app/blog/how-payment-gateways-work",
  },
};

export default function HowPaymentGatewaysWorkPage() {
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
          <Link
            href="/blog"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            ← Back to Blog
          </Link>
        </div>
      </nav>

      {/* Article */}
      <article className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-2xl">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-6">
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              Fundamentals
            </span>
            <span className="text-xs text-gray-500">March 20, 2025</span>
            <span className="text-xs text-gray-500">6 min read</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 leading-tight">
            How Payment Gateways Work: A Complete Guide
          </h1>

          <p className="text-lg text-gray-600 dark:text-slate-400 leading-relaxed mb-10">
            Whether you&apos;re a developer integrating payments for the first time or a business owner trying
            to understand where your money goes, this guide explains exactly how payment gateways work — from the
            moment a customer clicks &quot;Pay Now&quot; to when the funds land in your bank account.
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-3">What is a Payment Gateway?</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                A <strong>payment gateway</strong> is a technology service that authorises and processes online
                payments on behalf of merchants. Think of it as the digital equivalent of a physical point-of-sale
                terminal — it securely transmits payment data between the customer, the bank, and the merchant.
              </p>
              <p className="mt-3 text-gray-700 dark:text-slate-300 leading-relaxed">
                In India, payment gateways support UPI, credit cards, debit cards, net banking, and digital wallets.
                A <strong>free payment gateway</strong> like Node Gateway provides this infrastructure at no cost,
                making it accessible for startups, freelancers, and small businesses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">The 6 Steps of a Payment Transaction</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-4">
                Here&apos;s what happens in the 2–3 seconds between a customer clicking &quot;Pay&quot; and seeing a confirmation:
              </p>
              <ol className="space-y-4 list-none">
                {[
                  {
                    step: "1",
                    title: "Customer Initiates Payment",
                    desc: "The customer enters their payment details (UPI ID, card number, etc.) on the checkout page. The browser encrypts this data using SSL/TLS before it ever leaves their device.",
                  },
                  {
                    step: "2",
                    title: "Gateway Receives & Encrypts Data",
                    desc: "The payment gateway receives the encrypted data, tokenises the sensitive information (replacing real card numbers with tokens), and forwards it to the payment processor.",
                  },
                  {
                    step: "3",
                    title: "Bank Authorization Request",
                    desc: "The processor sends an authorization request to the customer's bank (issuing bank). The bank checks for sufficient funds, fraud signals, and card validity.",
                  },
                  {
                    step: "4",
                    title: "Approval or Decline",
                    desc: "The issuing bank responds with an approval code or a decline reason (insufficient funds, suspected fraud, etc.). This response travels back through the same chain.",
                  },
                  {
                    step: "5",
                    title: "Gateway Returns Result",
                    desc: "The payment gateway passes the bank's response to your application. Your app displays 'Payment Successful' or 'Payment Failed' to the customer.",
                  },
                  {
                    step: "6",
                    title: "Settlement",
                    desc: "Approved funds are batched and settled to your merchant account — typically within 1–3 business days. With UPI, real-time settlement is also possible.",
                  },
                ].map((item) => (
                  <li key={item.step} className="flex gap-4">
                    <span className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
                      {item.step}
                    </span>
                    <div>
                      <strong className="block mb-1">{item.title}</strong>
                      <span className="text-gray-700 dark:text-slate-300 leading-relaxed">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">UPI vs Card Payments: Key Differences</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                India&apos;s Unified Payments Interface (UPI) is unique — it bypasses traditional card networks (Visa,
                Mastercard) entirely. With UPI, funds transfer directly from the customer&apos;s bank to yours in real
                time, which is why UPI payment gateways can offer near-instant settlement with minimal fees.
              </p>
              <p className="mt-3 text-gray-700 dark:text-slate-300 leading-relaxed">
                Card payments go through additional intermediaries (card network, acquiring bank), which adds a
                small processing fee and a 1–3 day settlement period. Most free payment gateways in India support
                both methods.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">What to Look for in a Free Payment Gateway</h2>
              <ul className="space-y-2 list-none">
                {[
                  "UPI, card, and net banking support in one integration",
                  "Developer-friendly REST APIs with clear documentation",
                  "Webhooks for real-time payment notifications",
                  "Payment links and QR codes for no-code payment collection",
                  "PCI-DSS compliance and end-to-end encryption",
                  "Real-time dashboard and transaction analytics",
                  "No setup fees, no monthly charges",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-700 dark:text-slate-300">
                    <span className="mt-1 text-blue-600 font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Node Gateway: A Free Payment Gateway for India</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                Node Gateway is a free, developer-friendly payment gateway built with Node.js. It supports UPI,
                cards, net banking, and wallets — with payment links, QR codes, invoices, and webhooks included
                at no cost. Ideal for startups, freelancers, and developers who want to start accepting payments
                without upfront investment.
              </p>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Ready to accept payments for free?</h3>
            <p className="text-blue-100 mb-6 text-sm">
              Set up your free payment gateway in minutes. No credit card required.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors shadow-lg"
            >
              Create Free Account →
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
