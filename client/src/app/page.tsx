"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import {
  Zap,
  Link2,
  FileText,
  CreditCard,
  QrCode,
  Receipt,
  RefreshCw,
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
} from "lucide-react";

/* ─── Animated counter hook ─── */
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
}

/* ─── Section wrapper with fade-in ─── */
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

  const txnCount = useCounter(50000);
  const merchantCount = useCounter(1200);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "For Who", href: "#for-who" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* ═══ NAVBAR ═══ */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Node Gateway</span>
          </Link>

          {/* Desktop links */}
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

          {/* Right */}
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

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
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
      <Section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 bg-dot-pattern opacity-50" />
        <div className="absolute top-20 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-linear-to-br from-blue-400/20 to-indigo-400/20 blur-3xl dark:from-blue-600/10 dark:to-indigo-600/10" />

        <div className="text-center">
          <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 mb-8">
            <Zap size={14} />
            Built for Indian Businesses
          </div>

          <h1 className="animate-fade-in delay-100 text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Accept Payments
            <br />
            <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Effortlessly
            </span>
          </h1>

          <p className="animate-fade-in delay-200 mt-6 mx-auto max-w-2xl text-lg sm:text-xl text-gray-600 dark:text-slate-400 leading-relaxed">
            A modern UPI payment gateway for Indian merchants. Accept payments via links,
            pages, QR codes, buttons, and APIs — with zero setup hassle.
          </p>

          <div className="animate-fade-in delay-300 mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-0.5"
            >
              Start Accepting Payments
              <ArrowRight size={16} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-2xl border border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Explore Features
            </a>
          </div>
        </div>
      </Section>

      {/* ═══ STATS STRIP ═══ */}
      {/* <Section className="py-12 border-y border-gray-100 bg-gray-50/50 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            { value: `${txnCount.toLocaleString("en-IN")}+`, label: "Transactions Processed" },
            { value: `${merchantCount.toLocaleString("en-IN")}+`, label: "Active Merchants" },
            { value: "99.9%", label: "Uptime Guarantee" },
            { value: "0%", label: "Fees on Tier 1" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </Section> */}

      {/* ═══ FEATURES ═══ */}
      <Section id="features" className="py-20 sm:py-28">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Features
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Everything You Need to Get Paid
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-gray-600 dark:text-slate-400">
            From simple payment links to advanced invoicing — we have every tool
            your business needs to collect payments seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Link2,
              title: "Payment Links",
              desc: "Generate shareable links and send them via WhatsApp, email, or SMS. Customers pay with a single tap.",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: FileText,
              title: "Payment Pages",
              desc: "Create branded checkout pages with custom slugs, colors, and logos. No coding required.",
              color: "from-indigo-500 to-purple-500",
            },
            {
              icon: CreditCard,
              title: "Payment Buttons",
              desc: "Embed beautiful pay buttons on your website with just a snippet of HTML code.",
              color: "from-purple-500 to-pink-500",
            },
            {
              icon: QrCode,
              title: "QR Codes",
              desc: "Generate static or dynamic UPI QR codes for in-store, invoice, or online payments.",
              color: "from-orange-500 to-red-500",
            },
            {
              icon: Receipt,
              title: "Invoicing",
              desc: "Create professional invoices with line items, taxes, and send them directly to customers via email.",
              color: "from-green-500 to-emerald-500",
            },
            {
              icon: RefreshCw,
              title: "Subscriptions",
              desc: "Set up recurring billing for SaaS, memberships, and subscription boxes with automatic retries.",
              color: "from-teal-500 to-blue-500",
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative rounded-2xl border border-gray-200 bg-white p-7 transition-all hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-slate-900/50"
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
      <Section id="how-it-works" className="py-20 sm:py-28 bg-gray-50 dark:bg-slate-900/50">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            How It Works
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Up and Running in Minutes
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Create Account",
              desc: "Sign up with your business details. Choose your tier — free UPI or automated Paytm integration.",
              icon: Users,
            },
            {
              step: "02",
              title: "Configure Payments",
              desc: "Add your UPI IDs or Paytm credentials. Set up payment links, pages, or buttons in minutes.",
              icon: Code2,
            },
            {
              step: "03",
              title: "Start Collecting",
              desc: "Share payment links, embed buttons, or display QR codes. Money flows directly to your account.",
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
      <Section id="pricing" className="py-20 sm:py-28">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Two Tiers, Your Choice
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-gray-600 dark:text-slate-400">
            Start free with manual UPI verification, or go automated with Paytm Business integration.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
          {/* Tier 1 */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400 mb-4">
              <Smartphone size={14} />
              Tier 1 — UPI Direct
            </div>
            <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
              Free
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
              Zero platform fees, forever
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Personal UPI QR code payments",
                "Manual UTR verification",
                "Payment links, pages & buttons",
                "Full dashboard & analytics",
                "Invoice generation",
                "No transaction limits",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-slate-400">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="mt-8 block w-full rounded-xl border border-gray-300 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Get Started Free
            </Link>
          </div>

          {/* Tier 2 */}
          <div className="relative rounded-2xl border-2 border-blue-500 bg-white p-8 shadow-xl shadow-blue-500/10 dark:bg-slate-900">
            <div className="absolute -top-3 right-6 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 px-3 py-1 text-xs font-bold text-white">
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
            <ul className="mt-6 space-y-3">
              {[
                "Everything in Tier 1",
                "Automated payment verification",
                "UPI, Wallet, Cards & Net Banking",
                "Real-time webhook callbacks",
                "Subscription & recurring billing",
                "Split payments & settlements",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-slate-400">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-blue-500" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="mt-8 block w-full rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
            >
              Start with Paytm Business
            </Link>
          </div>
        </div>
      </Section>

      {/* ═══ EXTRA FEATURES ═══ */}
      <Section className="py-20 sm:py-28 bg-gray-50 dark:bg-slate-900/50">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            And More
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Built for Serious Businesses
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BarChart2, title: "Real-time Analytics", desc: "Revenue trends, peak hours, payment modes, top customers" },
            { icon: Shield, title: "Secure & Verified", desc: "Checksum verification, API key auth, encrypted transactions" },
            { icon: Webhook, title: "Webhook Events", desc: "Get real-time notifications for payment success, failure, refunds" },
            { icon: Globe, title: "API Access", desc: "Initiate payments programmatically with our REST API" },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
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
      <Section id="for-who" className="py-20 sm:py-28">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Use Cases
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight">
            Built for Everyone Who Gets Paid
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Briefcase, title: "Freelancers", desc: "Send invoices and payment links to clients. Get paid directly to your UPI." },
            { icon: Store, title: "Small Businesses", desc: "Display QR codes at your counter. Create branded payment pages." },
            { icon: Globe, title: "E-commerce", desc: "Embed pay buttons, use APIs, or create checkout pages for your store." },
            { icon: Code2, title: "SaaS & Startups", desc: "Set up recurring subscriptions, split payments, and webhook integrations." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 transition-colors group-hover:bg-blue-50 dark:bg-slate-800 dark:group-hover:bg-blue-900/30">
                  <Icon size={24} className="text-gray-500 transition-colors group-hover:text-blue-600 dark:text-slate-400 dark:group-hover:text-blue-400" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ═══ CTA ═══ */}
      <Section className="py-20 sm:py-28">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 px-8 py-16 sm:px-16 sm:py-20 text-center">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 h-40 w-40 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3" />

          <h2 className="relative text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Start Accepting Payments?
          </h2>
          <p className="relative mt-4 mx-auto max-w-xl text-lg text-blue-100">
            Join thousands of Indian merchants using Node Gateway. Set up in under 5 minutes.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-base font-bold text-blue-700 shadow-xl hover:bg-blue-50 transition-all hover:-translate-y-0.5"
            >
              Create Free Account
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </Section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-gray-100 bg-gray-50 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-600 to-indigo-600">
                <Zap size={14} className="text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">Node Gateway</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-slate-400">
              <a href="#features" className="hover:text-gray-700 dark:hover:text-slate-200 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-gray-700 dark:hover:text-slate-200 transition-colors">Pricing</a>
              <Link href="/login" className="hover:text-gray-700 dark:hover:text-slate-200 transition-colors">Login</Link>
              <Link href="/register" className="hover:text-gray-700 dark:hover:text-slate-200 transition-colors">Sign Up</Link>
            </div>

            <p className="text-xs text-gray-400 dark:text-slate-500">
              &copy; {new Date().getFullYear()} Node Gateway. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
