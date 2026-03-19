"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/lib/theme-context";
import {
  Zap,
  Link2,
  FileText,
  CreditCard,
  QrCode,
  Receipt,
  ArrowRight,
  CheckCircle2,
  Shield,
  BarChart2,
  Globe,
  Users,
  Store,
  Code2,
  Briefcase,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  IndianRupee,
  Smartphone,
  Webhook,
  Lock,
  Banknote,
  Wallet,
  Building2,
  Clock,
  BadgeCheck,
  Layers,
  Sparkles,
} from "lucide-react";

/* ─── Section wrapper ─── */
function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Payment Methods", href: "#payment-methods" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* ═══ NAVBAR ═══ */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Node Gateway</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors dark:text-slate-400 dark:hover:text-slate-100"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors dark:text-slate-300 dark:hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight size={14} />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white dark:border-slate-800 dark:bg-slate-950 px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Log in
            </Link>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <Section className="relative overflow-hidden pt-20 pb-28 sm:pt-32 sm:pb-36">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10 bg-grid-pattern" />
        <div className="absolute top-10 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-linear-to-br from-blue-400/20 via-indigo-400/15 to-purple-400/20 blur-3xl dark:from-blue-600/10 dark:via-indigo-600/8 dark:to-purple-600/10" />
        <div className="absolute top-40 -left-20 -z-10 h-[300px] w-[300px] rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-600/5" />
        <div className="absolute top-60 -right-20 -z-10 h-[300px] w-[300px] rounded-full bg-purple-400/10 blur-3xl dark:bg-purple-600/5" />

        <div className="text-center">
          <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mb-8">
            <Sparkles size={14} />
            India&apos;s Modern Payment Infrastructure
          </div>

          <h1 className="animate-fade-in delay-100 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
            Accept Payments
            <br />
            <span className="text-gradient">
              Effortlessly
            </span>
          </h1>

          <p className="animate-fade-in delay-200 mt-6 mx-auto max-w-2xl text-lg sm:text-xl text-gray-600 dark:text-slate-400 leading-relaxed">
            UPI, credit & debit cards, net banking, wallets, EMI — all from one dashboard.
            Built for Indian businesses that want to get paid faster, smarter, and with zero friction.
          </p>

          <div className="animate-fade-in delay-300 mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5"
            >
              Start Accepting Payments
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-all dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              See How It Works
            </a>
          </div>

          {/* Payment method pills */}
          <div className="animate-fade-in delay-500 mt-12 flex flex-wrap items-center justify-center gap-3">
            {[
              { label: "UPI", icon: Smartphone },
              { label: "Cards", icon: CreditCard },
              { label: "Net Banking", icon: Building2 },
              { label: "Wallets", icon: Wallet },
              { label: "EMI", icon: Banknote },
              { label: "QR Codes", icon: QrCode },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <span
                  key={m.label}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                >
                  <Icon size={15} className="text-blue-500" />
                  {m.label}
                </span>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ═══ STATS STRIP ═══ */}
      <Section className="py-16 border-y border-gray-100 bg-gray-50/80 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            { value: "₹0", label: "Platform Fee ", icon: IndianRupee },
            { value: "99.9%", label: "Uptime Guarantee", icon: Clock },
            { value: "6+", label: "Payment Methods", icon: CreditCard },
            { value: "< 5 min", label: "Setup Time", icon: Zap },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
                  <Icon size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ═══ PAYMENT METHODS ═══ */}
      <Section id="payment-methods" className="py-20 sm:py-28">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Payment Methods
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Accept Every Way Your Customers Pay
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-gray-600 dark:text-slate-400">
            From UPI to international cards — powered by Paytm Business integration,
            your customers can pay however they prefer.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Smartphone,
              title: "UPI Payments",
              desc: "Accept payments from Google Pay, PhonePe, Paytm, BHIM, and all UPI apps. Instant settlement with zero friction.",
              badge: "Most Popular",
              color: "from-green-500 to-emerald-600",
              badgeColor: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            },
            {
              icon: CreditCard,
              title: "Credit & Debit Cards",
              desc: "Visa, Mastercard, RuPay, American Express — accept all major card networks with 3D Secure authentication.",
              badge: "Tier 2",
              color: "from-blue-500 to-indigo-600",
              badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            },
            {
              icon: Building2,
              title: "Net Banking",
              desc: "Support for 50+ Indian banks including SBI, HDFC, ICICI, Axis, and more. Customers pay directly from their bank.",
              badge: "Tier 2",
              color: "from-indigo-500 to-purple-600",
              badgeColor: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
            },
            {
              icon: Wallet,
              title: "Digital Wallets",
              desc: "Paytm Wallet, Paytm Postpaid (BNPL), and other wallet-based payments for quick one-tap checkout experiences.",
              badge: "Tier 2",
              color: "from-orange-500 to-amber-600",
              badgeColor: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
            },
            {
              icon: Banknote,
              title: "EMI Options",
              desc: "Let customers split payments into easy monthly installments on credit cards. Increase conversion on high-value orders.",
              badge: "Tier 2",
              color: "from-purple-500 to-pink-600",
              badgeColor: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
            },
            {
              icon: QrCode,
              title: "QR Code Payments",
              desc: "Generate static or dynamic QR codes for in-store, invoices, or online payments. Customers scan and pay instantly.",
              badge: "Both Tiers",
              color: "from-teal-500 to-cyan-600",
              badgeColor: "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
            },
          ].map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.title}
                className="group relative rounded-2xl border border-gray-200 bg-white p-7 transition-all hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:shadow-slate-900/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${method.color} shadow-lg`}
                  >
                    <Icon size={22} className="text-white" />
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${method.badgeColor}`}>
                    {method.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {method.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
                  {method.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ═══ FEATURES ═══ */}
      <Section id="features" className="py-20 sm:py-28 bg-gray-50 dark:bg-slate-950/50">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Features
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Everything You Need to Get Paid
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-gray-600 dark:text-slate-400">
            From simple payment links to professional invoicing — powerful tools
            that make collecting payments effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Link2,
              title: "Payment Links",
              desc: "Generate one-time or reusable payment links. Share via WhatsApp, email, or SMS — customers pay with a single tap.",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: FileText,
              title: "Payment Pages",
              desc: "Create branded, no-code checkout pages with custom slugs, your logo, and colors. Perfect for campaigns and product launches.",
              color: "from-indigo-500 to-purple-500",
            },
            {
              icon: CreditCard,
              title: "Payment Buttons",
              desc: "Drop a pay button on any website with a single HTML snippet. Customizable styles that match your brand.",
              color: "from-purple-500 to-pink-500",
            },
            {
              icon: QrCode,
              title: "QR Codes",
              desc: "Generate static UPI QR or dynamic Paytm QR codes. Perfect for retail counters, restaurants, and event stalls.",
              color: "from-orange-500 to-red-500",
            },
            {
              icon: Receipt,
              title: "Professional Invoicing",
              desc: "Create itemized invoices with taxes, send via email, and auto-generate payment links. Track paid, overdue, and draft states.",
              color: "from-green-500 to-emerald-500",
            },
            {
              icon: Webhook,
              title: "Real-time Webhooks",
              desc: "Get instant notifications on payment success, failure, or refund events. Build automated workflows with reliable delivery.",
              color: "from-teal-500 to-blue-500",
            },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-gray-200 bg-white p-7 transition-all hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:shadow-slate-900/50"
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${feature.color} shadow-lg`}
                >
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
                  {feature.desc}
                </p>
                <ChevronRight
                  size={16}
                  className="absolute top-7 right-7 text-gray-300 transition-transform group-hover:translate-x-1 dark:text-slate-600"
                />
              </div>
            );
          })}
        </div>
      </Section>

      {/* ═══ HOW IT WORKS ═══ */}
      <Section id="how-it-works" className="py-20 sm:py-28">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            How It Works
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Go Live in Under 5 Minutes
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-gray-600 dark:text-slate-400">
            No complex integrations. No waiting for approvals. Start collecting payments right away.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Create Your Account",
              desc: "Sign up for free with your business details. Pick your tier — Personal UPI for instant start, or Paytm Business for full automation.",
              icon: Users,
            },
            {
              step: "02",
              title: "Configure Payments",
              desc: "Add your UPI ID for Tier 1, or connect Paytm credentials for Tier 2. Set up payment links, pages, buttons, or invoices.",
              icon: Code2,
            },
            {
              step: "03",
              title: "Start Collecting Money",
              desc: "Share links, display QR codes, embed buttons, or send invoices. Funds flow directly to your account. Track everything from your dashboard.",
              icon: IndianRupee,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/25">
                  <Icon size={28} className="text-white" />
                </div>
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[80px] font-black text-gray-100 -z-10 select-none dark:text-slate-800/50">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-3 text-sm text-gray-600 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ═══ PRICING / TWO-TIER ═══ */}
      <Section id="pricing" className="py-20 sm:py-28 bg-gray-50 dark:bg-slate-950/50">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Choose the Right Plan for Your Business
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-gray-600 dark:text-slate-400">
            Start free with personal UPI payments, or unlock the full power of
            multi-method checkout with Paytm Business.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 max-w-5xl mx-auto">
          {/* Tier 1 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/50 transition-all hover:shadow-lg">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400 mb-4">
              <Smartphone size={14} />
              Tier 1 — Personal UPI
            </div>
            <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
              Free
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              Zero platform fees, forever
            </p>
            <div className="mt-6 h-px bg-gray-100 dark:bg-slate-800" />
            <ul className="mt-6 space-y-3">
              {[
                "UPI QR code payments",
                "Payment links, pages & buttons",
                "QR code generation",
                "Manual UTR verification",
                "Full dashboard & analytics",
                "Webhook event notifications",
                "REST API access",
                "No transaction limits",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-slate-400">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-gray-400 dark:text-slate-500">
              Best for freelancers, small sellers, and personal use
            </p>
            <Link
              href="/register"
              className="mt-6 block w-full rounded-xl border border-gray-300 py-3.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Get Started Free
            </Link>
          </div>

          {/* Tier 2 */}
          <div className="relative rounded-2xl border-2 border-blue-500 bg-white p-8 shadow-xl shadow-blue-500/10 dark:bg-slate-900/50">
            <div className="absolute -top-3.5 right-6 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-1 text-xs font-bold text-white shadow-lg">
              RECOMMENDED
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 mb-4">
              <CreditCard size={14} />
              Tier 2 — Paytm Business
            </div>
            <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
              Automated
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              Standard Paytm processing fees apply
            </p>
            <div className="mt-6 h-px bg-blue-100 dark:bg-slate-800" />
            <ul className="mt-6 space-y-3">
              {[
                "Everything in Tier 1",
                "UPI — all apps (GPay, PhonePe, Paytm, BHIM)",
                "Credit & Debit Cards (Visa, MC, RuPay, Amex)",
                "Net Banking — 50+ banks",
                "Paytm Wallet & Postpaid (BNPL)",
                "EMI on credit cards",
                "Automatic payment verification",
                "Real-time webhook callbacks",
                "Professional invoicing with email delivery",
                "Paytm-hosted secure checkout page",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-slate-400">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-blue-500" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-gray-400 dark:text-slate-500">
              Best for growing businesses, e-commerce, and SaaS companies
            </p>
            <Link
              href="/register"
              className="mt-6 block w-full rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
            >
              Start with Paytm Business
            </Link>
          </div>
        </div>
      </Section>

      {/* ═══ TRUST & SECURITY ═══ */}
      <Section className="py-20 sm:py-28">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Security & Reliability
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Enterprise-Grade Security. Built-In.
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-gray-600 dark:text-slate-400">
            Every transaction is protected by multiple layers of security. Your money and your customers&apos; data are always safe.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Shield, title: "Checksum Verification", desc: "Every Paytm callback is cryptographically verified to prevent tampering" },
            { icon: Lock, title: "API Key Authentication", desc: "Secure API key-based auth with per-merchant isolated credentials" },
            { icon: BarChart2, title: "Real-time Analytics", desc: "Revenue trends, payment modes, peak hours, and customer insights" },
            { icon: Globe, title: "REST API Access", desc: "Full API to initiate payments, check status, and manage transactions programmatically" },
            { icon: BadgeCheck, title: "PCI DSS Compliant", desc: "Paytm&apos;s hosted checkout handles card data — you never touch sensitive info" },
            { icon: Clock, title: "99.9% Uptime", desc: "Built on reliable infrastructure with automatic failover and monitoring" },
            { icon: Layers, title: "Webhook Events", desc: "Get real-time push notifications for every payment event to automate your workflow" },
            { icon: Banknote, title: "Direct Settlements", desc: "Payments settle directly to your bank account — no intermediary holding your funds" },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900/50"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
                  <Icon size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500 dark:text-slate-400">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ═══ WHO IT'S FOR ═══ */}
      <Section className="py-20 sm:py-28 bg-gray-50 dark:bg-slate-950/50">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Use Cases
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Built for Everyone Who Gets Paid
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-gray-600 dark:text-slate-400">
            Whether you&apos;re a solo freelancer or a growing startup — Node Gateway scales with you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Briefcase, title: "Freelancers", desc: "Send payment links and invoices to clients. Get paid directly to your UPI — no chasing payments.", tier: "Tier 1" },
            { icon: Store, title: "Retail & Restaurants", desc: "Display QR codes at your counter or tableside. Accept UPI, cards, and wallets in-store.", tier: "Both Tiers" },
            { icon: Globe, title: "E-commerce Stores", desc: "Embed payment buttons, use the REST API, or create checkout pages. Accept cards, UPI, net banking, EMI.", tier: "Tier 2" },
            { icon: Code2, title: "SaaS & Startups", desc: "Automate payments with webhooks, APIs, and invoicing. Scale from day one with zero infrastructure overhead.", tier: "Tier 2" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-blue-700"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 transition-colors group-hover:bg-blue-50 dark:bg-slate-800 dark:group-hover:bg-blue-900/30">
                  <Icon size={24} className="text-gray-500 transition-colors group-hover:text-blue-600 dark:text-slate-400 dark:group-hover:text-blue-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
                <span className="mt-3 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:bg-slate-800 dark:text-slate-400">
                  {item.tier}
                </span>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ═══ CTA ═══ */}
      <Section className="py-20 sm:py-28">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 px-8 py-16 sm:px-16 sm:py-20 text-center">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 h-40 w-40 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/4 h-20 w-20 rounded-full bg-white/5" />

          <div className="relative">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Zap size={28} className="text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Grow Your Business?
            </h2>
            <p className="mt-4 mx-auto max-w-xl text-lg text-blue-100">
              Join merchants across India who trust Node Gateway for their payments.
              Set up in under 5 minutes — no integration hassle, no monthly fees.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-base font-bold text-blue-700 shadow-xl hover:bg-blue-50 transition-all hover:-translate-y-0.5"
              >
                Create Free Account
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
            </div>
            <p className="mt-6 text-sm text-blue-200">
              No credit card required. Start with Tier 1 for free.
            </p>
          </div>
        </div>
      </Section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-gray-100 bg-gray-50 dark:border-slate-800 dark:bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-indigo-600">
                  <Zap size={14} className="text-white" />
                </div>
                <span className="font-bold text-gray-900 dark:text-white">Node Gateway</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                India&apos;s modern payment gateway. Accept UPI, cards, net banking, wallets & more.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <div className="flex flex-col gap-2.5 text-sm text-gray-500 dark:text-slate-400">
                <a href="#features" className="hover:text-gray-700 dark:hover:text-slate-200 transition-colors">Features</a>
                <a href="#payment-methods" className="hover:text-gray-700 dark:hover:text-slate-200 transition-colors">Payment Methods</a>
                <a href="#pricing" className="hover:text-gray-700 dark:hover:text-slate-200 transition-colors">Pricing</a>
                <a href="#how-it-works" className="hover:text-gray-700 dark:hover:text-slate-200 transition-colors">How It Works</a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
              <div className="flex flex-col gap-2.5 text-sm text-gray-500 dark:text-slate-400">
                <Link href="/about" className="hover:text-gray-700 dark:hover:text-slate-200 transition-colors">About Us</Link>
                <Link href="/contact" className="hover:text-gray-700 dark:hover:text-slate-200 transition-colors">Contact Us</Link>
                <Link href="/login" className="hover:text-gray-700 dark:hover:text-slate-200 transition-colors">Login</Link>
                <Link href="/register" className="hover:text-gray-700 dark:hover:text-slate-200 transition-colors">Sign Up</Link>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
              <div className="flex flex-col gap-2.5 text-sm text-gray-500 dark:text-slate-400">
                <Link href="/privacy-policy" className="hover:text-gray-700 dark:hover:text-slate-200 transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-gray-700 dark:hover:text-slate-200 transition-colors">Terms &amp; Conditions</Link>
                <Link href="/refund-policy" className="hover:text-gray-700 dark:hover:text-slate-200 transition-colors">Refund &amp; Cancellation</Link>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400 dark:text-slate-500">
              &copy; {new Date().getFullYear()} Node Gateway. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
