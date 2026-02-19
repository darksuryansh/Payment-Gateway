"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, Pause, Play, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface Subscription {
  id: string;
  plan_name: string;
  description: string;
  amount: number;
  currency: string;
  interval: string;
  interval_count: number;
  customer_name: string;
  customer_email: string;
  status: string;
  next_billing: string;
  start_date: string;
  created_at: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

const statusColor: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  PAUSED: "bg-yellow-100 text-yellow-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    plan_name: "",
    description: "",
    amount: "",
    interval: "monthly",
    interval_count: "1",
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    start_date: "",
  });

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/subscriptions", { params: { page, limit: 20 } });
      setSubscriptions(res.data.data.subscriptions);
      setPagination(res.data.data.pagination);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [page]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post("/subscriptions", {
        ...form,
        amount: parseFloat(form.amount),
        interval_count: parseInt(form.interval_count),
      });
      setShowCreate(false);
      setForm({ plan_name: "", description: "", amount: "", interval: "monthly", interval_count: "1", customer_name: "", customer_email: "", customer_phone: "", start_date: "" });
      fetchSubscriptions();
    } catch {
      // handled
    } finally {
      setCreating(false);
    }
  };

  const handleAction = async (id: string, action: "pause" | "resume" | "cancel") => {
    try {
      await api.post(`/subscriptions/${id}/${action}`);
      fetchSubscriptions();
    } catch {
      // handled
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={16} />
          Create Subscription
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
              <input required value={form.plan_name} onChange={(e) => setForm({ ...form, plan_name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
              <input required type="number" step="0.01" min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interval *</label>
              <select value={form.interval} onChange={(e) => setForm({ ...form, interval: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <input required value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email *</label>
              <input required type="email" value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={creating} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {creating ? "Creating..." : "Create Subscription"}
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No subscriptions yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-6 py-3 font-medium">Plan</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Interval</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Next Billing</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{sub.plan_name}</td>
                    <td className="px-6 py-3">
                      <div className="text-gray-900">{sub.customer_name}</div>
                      <div className="text-xs text-gray-500">{sub.customer_email}</div>
                    </td>
                    <td className="px-6 py-3 text-gray-900">₹{Number(sub.amount).toLocaleString("en-IN")}</td>
                    <td className="px-6 py-3 text-gray-600 capitalize">{sub.interval}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[sub.status] || "bg-gray-100 text-gray-700"}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {sub.next_billing ? new Date(sub.next_billing).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-1">
                        {sub.status === "ACTIVE" && (
                          <button onClick={() => handleAction(sub.id, "pause")} title="Pause" className="rounded p-1 text-gray-400 hover:bg-yellow-50 hover:text-yellow-600">
                            <Pause size={16} />
                          </button>
                        )}
                        {sub.status === "PAUSED" && (
                          <button onClick={() => handleAction(sub.id, "resume")} title="Resume" className="rounded p-1 text-gray-400 hover:bg-green-50 hover:text-green-600">
                            <Play size={16} />
                          </button>
                        )}
                        {(sub.status === "ACTIVE" || sub.status === "PAUSED") && (
                          <button onClick={() => handleAction(sub.id, "cancel")} title="Cancel" className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600">
                            <XCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3">
            <p className="text-sm text-gray-500">Page {pagination.page} of {pagination.total_pages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={16} /></button>
              <button onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))} disabled={page === pagination.total_pages} className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
