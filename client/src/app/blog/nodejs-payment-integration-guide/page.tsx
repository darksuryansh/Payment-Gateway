import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Node.js Payment Integration Guide: Accept Payments in Minutes",
  description:
    "Complete guide to integrating a free payment gateway in your Node.js app. Step-by-step setup for payment links, webhooks, and UPI payments with code examples.",
  keywords: [
    "nodejs payment integration",
    "node.js payment gateway",
    "nodejs payment gateway free",
    "payment gateway API nodejs",
    "UPI integration nodejs",
    "payment links nodejs",
    "webhook payment nodejs",
    "accept payments nodejs",
  ],
  alternates: {
    canonical:
      "https://nodegateway.vercel.app/blog/nodejs-payment-integration-guide",
  },
  openGraph: {
    type: "article",
    title: "Node.js Payment Integration Guide: Accept Payments in Minutes",
    description:
      "Step-by-step guide to integrating a free payment gateway in your Node.js application with UPI, payment links, and webhooks.",
    url: "https://nodegateway.vercel.app/blog/nodejs-payment-integration-guide",
  },
};

export default function NodejsPaymentIntegrationGuidePage() {
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
              Developer Guide
            </span>
            <span className="text-xs text-gray-500">March 28, 2025</span>
            <span className="text-xs text-gray-500">8 min read</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 leading-tight">
            Node.js Payment Integration Guide: Accept Payments in Minutes
          </h1>

          <p className="text-lg text-gray-600 dark:text-slate-400 leading-relaxed mb-10">
            This guide walks you through integrating a free payment gateway into your Node.js application.
            You&apos;ll learn how to create payment links, handle webhooks, and accept UPI & card payments with
            minimal code.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-3">Prerequisites</h2>
              <ul className="space-y-1 list-none text-gray-700 dark:text-slate-300">
                {[
                  "Node.js 18+ installed",
                  "A free Node Gateway account (sign up at nodegateway.vercel.app)",
                  "Your API key from the Node Gateway dashboard",
                  "Basic knowledge of Express.js",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 text-blue-600 font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Step 1: Install Dependencies</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-3">
                Create a new Node.js project and install the required packages:
              </p>
              <pre className="rounded-xl bg-slate-900 text-slate-100 p-4 text-sm overflow-x-auto">
                <code>{`npm init -y
npm install express axios dotenv`}</code>
              </pre>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Step 2: Configure Your API Key</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-3">
                Create a <code className="bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm">.env</code> file
                at the root of your project:
              </p>
              <pre className="rounded-xl bg-slate-900 text-slate-100 p-4 text-sm overflow-x-auto">
                <code>{`NODE_GATEWAY_API_KEY=your_api_key_here
NODE_GATEWAY_BASE_URL=https://nodegateway.vercel.app/api`}</code>
              </pre>
              <p className="mt-3 text-gray-700 dark:text-slate-300 leading-relaxed">
                Find your API key in the Node Gateway dashboard under Settings → API Keys.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Step 3: Create a Payment Link</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-3">
                Payment links are the fastest way to collect payments. Create one with a simple API call:
              </p>
              <pre className="rounded-xl bg-slate-900 text-slate-100 p-4 text-sm overflow-x-auto">
                <code>{`const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/create-payment-link', async (req, res) => {
  const { amount, description, customerName, customerEmail } = req.body;

  try {
    const response = await axios.post(
      \`\${process.env.NODE_GATEWAY_BASE_URL}/payment-links\`,
      {
        amount,          // Amount in paise (₹100 = 10000)
        description,
        customer: {
          name: customerName,
          email: customerEmail,
        },
        callback_url: 'https://yoursite.com/payment-success',
      },
      {
        headers: {
          Authorization: \`Bearer \${process.env.NODE_GATEWAY_API_KEY}\`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ paymentUrl: response.data.short_url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment link' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));`}</code>
              </pre>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Step 4: Handle Payment Webhooks</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-3">
                Webhooks notify your server instantly when a payment is completed. Set up a webhook endpoint
                and configure the URL in your Node Gateway dashboard:
              </p>
              <pre className="rounded-xl bg-slate-900 text-slate-100 p-4 text-sm overflow-x-auto">
                <code>{`const crypto = require('crypto');

app.post('/webhook/payment', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-gateway-signature'];
  const webhookSecret = process.env.NODE_GATEWAY_WEBHOOK_SECRET;

  // Verify webhook signature
  const expectedSig = crypto
    .createHmac('sha256', webhookSecret)
    .update(req.body)
    .digest('hex');

  if (signature !== expectedSig) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const event = JSON.parse(req.body);

  switch (event.type) {
    case 'payment.captured':
      console.log('Payment successful:', event.payload.payment.entity.id);
      // Fulfill order, send receipt, update database...
      break;

    case 'payment.failed':
      console.log('Payment failed:', event.payload.payment.entity.id);
      // Notify customer, retry logic...
      break;
  }

  res.json({ status: 'ok' });
});`}</code>
              </pre>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Step 5: Check Payment Status</h2>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-3">
                You can always query the status of any payment by its ID:
              </p>
              <pre className="rounded-xl bg-slate-900 text-slate-100 p-4 text-sm overflow-x-auto">
                <code>{`app.get('/payment-status/:paymentId', async (req, res) => {
  const { paymentId } = req.params;

  const response = await axios.get(
    \`\${process.env.NODE_GATEWAY_BASE_URL}/payments/\${paymentId}\`,
    {
      headers: {
        Authorization: \`Bearer \${process.env.NODE_GATEWAY_API_KEY}\`,
      },
    }
  );

  res.json({
    id: response.data.id,
    status: response.data.status, // 'captured' | 'failed' | 'pending'
    amount: response.data.amount,
    method: response.data.method,
  });
});`}</code>
              </pre>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Why Node Gateway for Node.js Projects?</h2>
              <ul className="space-y-2 list-none">
                {[
                  "100% free — no setup fees, no monthly charges",
                  "REST API designed for developers — clean, consistent, well-documented",
                  "UPI, cards, net banking & wallets in a single integration",
                  "Real-time webhooks with signature verification",
                  "Payment links & QR codes for no-code payment collection",
                  "Dashboard with live analytics, transaction history & exports",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-700 dark:text-slate-300">
                    <span className="mt-1 text-blue-600 font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Start accepting payments for free
            </h3>
            <p className="text-blue-100 mb-6 text-sm">
              Create your free Node Gateway account and get your API key in minutes.
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
