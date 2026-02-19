"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { TrendingUp, CheckCircle, Clock, Users } from "lucide-react";

interface RevenueEntry {
  period: string;
  total_revenue: number;
  total_fees: number;
  total_settled: number;
  transaction_count: number;
}

interface SuccessRate {
  total: number;
  completed: number;
  failed: number;
  success_rate: string;
  breakdown: { status: string; count: number }[];
}

interface PeakHour {
  hour: number;
  transaction_count: number;
  total_amount: number;
}

interface PaymentMode {
  payment_mode: string;
  count: number;
  total_amount: number;
}

interface Customer {
  sender_vpa: string;
  transaction_count: number;
  total_amount: number;
}

export default function AnalyticsPage() {
  const [revenue, setRevenue] = useState<RevenueEntry[]>([]);
  const [successRate, setSuccessRate] = useState<SuccessRate | null>(null);
  const [peakHours, setPeakHours] = useState<PeakHour[]>([]);
  const [paymentModes, setPaymentModes] = useState<PaymentMode[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState<"day" | "week" | "month">("day");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [revRes, srRes, phRes, pmRes, custRes] = await Promise.all([
        api.get("/analytics/revenue", { params: { group_by: groupBy } }),
        api.get("/analytics/success-rate"),
        api.get("/analytics/peak-hours"),
        api.get("/analytics/payment-modes"),
        api.get("/analytics/customers", { params: { limit: 10 } }),
      ]);
      setRevenue(revRes.data.data.revenue || []);
      setSuccessRate(srRes.data.data || null);
      setPeakHours(phRes.data.data.peak_hours || []);
      setPaymentModes(pmRes.data.data.payment_modes || []);
      setCustomers(custRes.data.data.customers || []);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [groupBy]);

  const maxRevenue = revenue.length > 0 ? Math.max(...revenue.map((r) => Number(r.total_revenue))) : 1;
  const maxTxnCount = peakHours.length > 0 ? Math.max(...peakHours.map((h) => Number(h.transaction_count))) : 1;

  const formatPeriod = (p: string) => {
    try {
      return new Date(p).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    } catch {
      return p;
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <div className="flex gap-2">
          {(["day", "week", "month"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGroupBy(g)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                groupBy === g
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {g === "day" ? "Daily" : g === "week" ? "Weekly" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      {/* Success Rate Summary */}
      {successRate && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Transactions", value: successRate.total, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Successful", value: successRate.completed, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
            { label: "Failed", value: successRate.failed, icon: Clock, color: "text-red-600", bg: "bg-red-50" },
            { label: "Success Rate", value: `${successRate.success_rate}%`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <div className={`rounded-lg p-2 ${card.bg}`}>
                    <Icon size={16} className={card.color} />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Revenue Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Revenue Trend</h2>
        {revenue.length === 0 ? (
          <div className="py-8 text-center text-gray-500">No revenue data available.</div>
        ) : (
          <div className="space-y-2">
            {revenue.slice(-14).map((entry, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-xs text-gray-500">{formatPeriod(entry.period)}</span>
                <div className="flex-1 h-6 bg-gray-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded transition-all"
                    style={{ width: `${Math.max(2, (Number(entry.total_revenue) / maxRevenue) * 100)}%` }}
                  />
                </div>
                <span className="w-24 shrink-0 text-right text-sm font-medium text-gray-700">
                  ₹{Number(entry.total_revenue).toLocaleString("en-IN")}
                </span>
                <span className="w-16 shrink-0 text-right text-xs text-gray-500">
                  {entry.transaction_count} txns
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Peak Hours */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Peak Transaction Hours</h2>
          {peakHours.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No data available.</div>
          ) : (
            <div className="space-y-2">
              {peakHours.slice(0, 10).map((h, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-12 shrink-0 text-xs text-gray-500">
                    {String(Math.floor(Number(h.hour))).padStart(2, "0")}:00
                  </span>
                  <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-orange-400 rounded"
                      style={{ width: `${Math.max(2, (Number(h.transaction_count) / maxTxnCount) * 100)}%` }}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right text-xs text-gray-600">
                    {h.transaction_count} txns
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Modes */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Payment Mode Breakdown</h2>
          {paymentModes.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No data available.</div>
          ) : (
            <div className="space-y-3">
              {paymentModes.map((pm, i) => {
                const total = paymentModes.reduce((sum, p) => sum + Number(p.count), 0);
                const pct = total > 0 ? ((Number(pm.count) / total) * 100).toFixed(1) : "0";
                const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-red-500"];
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${colors[i % colors.length]}`} />
                    <span className="flex-1 text-sm text-gray-700 capitalize">
                      {pm.payment_mode || "Unknown"}
                    </span>
                    <span className="text-sm text-gray-500">{pm.count} txns</span>
                    <span className="w-14 text-right text-sm font-medium text-gray-900">{pct}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top Customers */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-2">
          <Users size={18} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Top Customers</h2>
        </div>
        {customers.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No customer data available.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-6 py-3 font-medium">#</th>
                  <th className="px-6 py-3 font-medium">VPA / Customer</th>
                  <th className="px-6 py-3 font-medium">Transactions</th>
                  <th className="px-6 py-3 font-medium">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-6 py-3 font-mono text-sm text-gray-700">{c.sender_vpa}</td>
                    <td className="px-6 py-3 text-gray-600">{c.transaction_count}</td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      ₹{Number(c.total_amount).toLocaleString("en-IN")}
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
