import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog - Payment Gateway Guides & Resources",
  description:
    "Learn how payment gateways work, how to integrate Node.js payment systems, and tips for accepting online payments in India. Free guides for developers and businesses.",
  keywords: [
    "payment gateway guide",
    "how payment gateways work",
    "nodejs payment integration",
    "UPI integration guide",
    "online payments India",
    "free payment gateway tutorial",
  ],
  alternates: {
    canonical: "https://nodegateway.vercel.app/blog",
  },
};

const posts = [
  {
    slug: "how-payment-gateways-work",
    title: "How Payment Gateways Work: A Complete Guide",
    description:
      "A step-by-step explanation of how payment gateways process online transactions — from the customer clicking Pay Now to money reaching your bank account.",
    date: "2025-03-20",
    readTime: "6 min read",
    category: "Fundamentals",
  },
  {
    slug: "nodejs-payment-integration-guide",
    title: "Node.js Payment Integration Guide: Accept Payments in Minutes",
    description:
      "Learn how to integrate a free payment gateway into your Node.js application. Complete guide with code examples for payment links, webhooks, and more.",
    date: "2025-03-28",
    readTime: "8 min read",
    category: "Developer Guide",
  },
];

export default function BlogPage() {
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
            <Link href="/features" className="hidden sm:inline-flex text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100">
              Features
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

      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            Payment Gateway Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-slate-400">
            Guides, tutorials, and resources for developers and businesses accepting online payments in India.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-3xl space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {post.category}
                </span>
                <span className="text-xs text-gray-500 dark:text-slate-500">{post.readTime}</span>
                <span className="text-xs text-gray-500 dark:text-slate-500">{post.date}</span>
              </div>
              <h2 className="text-xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
