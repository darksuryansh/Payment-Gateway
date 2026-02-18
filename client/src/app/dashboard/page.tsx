"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  Link2,
  Undo2,
  Webhook,
  TrendingUp,
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

  const statCards = [
    {
      label: "Today's Revenue",
      value: `₹${(stats?.today.revenue || 0).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Today's Transactions",
      value: stats?.today.transactions || 0,
      icon: ArrowUpRight,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Revenue",
      value: `₹${(stats?.overall.total_revenue || 0).toLocaleString("en-IN")}`,
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Pending Settlements",
      value: `₹${(stats?.overall.pending_settlements || 0).toLocaleString("en-IN")}`,
      icon: ArrowDownRight,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  const quickCards = [
    { label: "Active Payment Links", value: quickStats?.active_payment_links || 0, icon: Link2 },
    { label: "Pending Refunds", value: quickStats?.pending_refunds || 0, icon: Undo2 },
    { label: "Active Webhooks", value: quickStats?.active_webhooks || 0, icon: Webhook },
  ];

  const statusColor: Record<string, string> = {
    COMPLETED: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    FAILED: "bg-red-100 text-red-700",
    INITIATED: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Main stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{card.label}</p>
                <div className={`rounded-lg p-2 ${card.bg}`}>
                  <Icon size={18} className={card.color} />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {quickCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="rounded-lg bg-gray-50 p-2">
                <Icon size={18} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-lg font-semibold text-gray-900">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent transactions */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>

        {transactions.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            No transactions yet. Start accepting payments to see activity here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-3 font-mono text-xs text-gray-600">
                      {txn.order_id}
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      ₹{Number(txn.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          statusColor[txn.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {txn.customer_email || "—"}
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {new Date(txn.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
