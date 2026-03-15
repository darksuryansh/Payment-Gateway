"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import Link from "next/link";
import {
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Link2,
  Undo2,
  Webhook,
  TrendingUp,
  QrCode,
  Receipt,
  Plus,
  ExternalLink,
  Clock,
  ArrowRight,
} from "lucide-react";

interface DashboardStats {
  today: { transactions: number; revenue: number; successful: number };
  overall: { total_transactions: number; total_revenue: number; pending_settlements: number };
}

interface QuickStats {
  active_payment_links: number;
  pending_refunds: number;
  active_webhooks: number;
}

interface Transaction {
  id: string;
  order_id: string;
  amount: number;
  status: string;
  customer_email: string;
  created_at: string;
}

export default function DashboardPage() {
  const { merchant } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, quickRes, txnRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/dashboard/quick-stats"),
          api.get("/dashboard/recent-transactions"),
        ]);
        setStats(statsRes.data.data);
        setQuickStats(quickRes.data.data);
        setTransactions(txnRes.data.data.transactions);
      } catch {
        // Errors handled by interceptor for 401
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const statCards = [
    {
      label: "Today's Revenue",
      value: `₹${(stats?.today.revenue || 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      trend: "+12.5%",
      trendUp: true,
      gradient: "from-green-500 to-emerald-600",
      bg: "bg-green-50 dark:bg-green-900/20",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Today's Transactions",
      value: stats?.today.transactions || 0,
      icon: ArrowUpRight,
      trend: `${stats?.today.successful || 0} successful`,
      trendUp: true,
      gradient: "from-blue-500 to-cyan-600",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Total Revenue",
      value: `₹${(stats?.overall.total_revenue || 0).toLocaleString("en-IN")}`,
      icon: TrendingUp,
      trend: `${stats?.overall.total_transactions || 0} total txns`,
      trendUp: true,
      gradient: "from-purple-500 to-indigo-600",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Pending Settlements",
      value: `₹${(stats?.overall.pending_settlements || 0).toLocaleString("en-IN")}`,
      icon: ArrowDownRight,
      trend: "Awaiting settlement",
      trendUp: false,
      gradient: "from-orange-500 to-amber-600",
      bg: "bg-orange-50 dark:bg-orange-900/20",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  const quickActions = [
    { label: "Payment Link", icon: Link2, href: "/dashboard/payment-links", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30" },
    { label: "QR Code", icon: QrCode, href: "/dashboard/qr-codes", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30" },
    { label: "Invoice", icon: Receipt, href: "/dashboard/invoices", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30" },
    { label: "Refund", icon: Undo2, href: "/dashboard/refunds", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30" },
  ];

  const statusConfig: Record<string, { color: string; dot: string }> = {
    COMPLETED: { color: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400", dot: "bg-green-500" },
    PENDING: { color: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", dot: "bg-yellow-500" },
    FAILED: { color: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400", dot: "bg-red-500" },
    INITIATED: { color: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", dot: "bg-blue-500" },
    PENDING_VERIFICATION: { color: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", dot: "bg-amber-500" },
  };

  return (
    <div className="space-y-6">
      {/* ─── Welcome Banner ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 sm:p-8">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/10 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-1/2 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative">
          <p className="text-blue-100 text-sm font-medium">{greeting()}</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
            {merchant?.business_name || "Merchant"}
          </h1>
          <p className="mt-2 text-blue-200 text-sm max-w-lg">
            Here&apos;s what&apos;s happening with your payments today. Stay on top of your business.
          </p>
        </div>
      </div>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="group rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-lg hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{card.label}</p>
                <div className={`rounded-xl p-2.5 ${card.iconBg}`}>
                  <Icon size={18} className={card.iconColor} />
                </div>
              </div>
              <p className="mt-3 text-2xl font-extrabold text-gray-900 dark:text-white">{card.value}</p>
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-slate-400">
                {card.trendUp ? (
                  <ArrowUpRight size={12} className="text-green-500" />
                ) : (
                  <Clock size={12} className="text-orange-500" />
                )}
                {card.trend}
              </p>
            </div>
          );
        })}
      </div>

      {/* ─── Quick Actions ─── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className={`flex flex-col items-center gap-2.5 rounded-xl p-4 transition-all ${action.bg}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-800">
                  <Icon size={20} className={action.color} />
                </div>
                <div className="flex items-center gap-1">
                  <Plus size={12} className="text-gray-400 dark:text-slate-500" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">{action.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─── Quick Stats + Recent Transactions ─── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick stats sidebar */}
        <div className="space-y-4">
          {[
            {
              label: "Active Payment Links",
              value: quickStats?.active_payment_links || 0,
              icon: Link2,
              color: "text-blue-600 dark:text-blue-400",
              bg: "bg-blue-50 dark:bg-blue-900/20",
              href: "/dashboard/payment-links",
            },
            {
              label: "Pending Refunds",
              value: quickStats?.pending_refunds || 0,
              icon: Undo2,
              color: "text-orange-600 dark:text-orange-400",
              bg: "bg-orange-50 dark:bg-orange-900/20",
              href: "/dashboard/refunds",
            },
            {
              label: "Active Webhooks",
              value: quickStats?.active_webhooks || 0,
              icon: Webhook,
              color: "text-purple-600 dark:text-purple-400",
              bg: "bg-purple-50 dark:bg-purple-900/20",
              href: "/dashboard/settings/webhooks",
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.label}
                href={card.href}
                className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
              >
                <div className={`rounded-xl p-3 ${card.bg}`}>
                  <Icon size={20} className={card.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-500 dark:text-slate-400">{card.label}</p>
                  <p className="text-xl font-extrabold text-gray-900 dark:text-white">{card.value}</p>
                </div>
                <ArrowRight size={16} className="text-gray-300 transition-transform group-hover:translate-x-1 dark:text-slate-600" />
              </Link>
            );
          })}
        </div>

        {/* Recent transactions */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-slate-800">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Transactions</h2>
            <Link
              href="/dashboard/transactions"
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              View all
              <ExternalLink size={12} />
            </Link>
          </div>

          {transactions.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 dark:bg-slate-800">
                <IndianRupee size={24} className="text-gray-300 dark:text-slate-600" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-slate-400">No transactions yet</p>
              <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
                Start accepting payments to see activity here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-slate-800">
              {transactions.slice(0, 7).map((txn) => {
                const status = statusConfig[txn.status] || { color: "bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300", dot: "bg-gray-400" };
                return (
                  <div key={txn.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50 transition-colors dark:hover:bg-slate-800/50">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500 dark:bg-slate-800 dark:text-slate-400">
                        {(txn.customer_email || "?")[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                          {txn.customer_email || "Unknown customer"}
                        </p>
                        <p className="text-xs text-gray-400 font-mono dark:text-slate-500">{txn.order_id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        {txn.status.replace("_", " ")}
                      </span>
                      <span className="text-sm font-bold text-gray-900 tabular-nums dark:text-white">
                        ₹{Number(txn.amount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
