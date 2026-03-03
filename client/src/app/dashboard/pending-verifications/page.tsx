"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { ChevronLeft, ChevronRight, Check, X, AlertTriangle } from "lucide-react";

interface Transaction {
  id: string;
  order_id: string;
  amount: number;
  utr_number: string;
  sender_note?: string;
  created_at: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export default function PendingVerificationsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get("/payment/pending-verifications", {
        params: { page, limit: 20 },
      });
      setTransactions(res.data.data.transactions);
      setPagination(res.data.data.pagination);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, [page]);

  const handleVerify = async (orderId: string, action: "approve" | "reject") => {
    setActionLoading(orderId);
    setMessage(null);
    try {
      const res = await api.post("/payment/verify-utr", { order_id: orderId, action });
      setMessage({
        type: "success",
        text: res.data.message || `Transaction ${action}d successfully.`,
      });
      fetchPending();
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || `Failed to ${action} transaction.`,
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pending Verifications</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and verify UTR numbers submitted by customers for UPI payments.
        </p>
      </div>

      {/* Warning banner */}
      <div className="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
        <AlertTriangle size={20} className="mt-0.5 shrink-0 text-yellow-600" />
        <div className="text-sm text-yellow-800">
          <strong>Important:</strong> Always verify the UTR against your bank SMS or UPI app payment history
          before approving. Personal UPI accounts have a recommended limit of ~20 transactions/day.
        </div>
      </div>

      {message && (
        <div
          className={`rounded-lg p-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No pending verifications. All caught up!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">UTR Number</th>
                  <th className="px-6 py-3 font-medium">Note</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
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
                    <td className="px-6 py-3 font-mono text-sm font-semibold text-blue-700">
                      {txn.utr_number}
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {txn.sender_note || "—"}
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {new Date(txn.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleVerify(txn.order_id, "approve")}
                          disabled={actionLoading === txn.order_id}
                          className="flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          <Check size={14} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerify(txn.order_id, "reject")}
                          disabled={actionLoading === txn.order_id}
                          className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          <X size={14} />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3">
            <p className="text-sm text-gray-500">
              Showing page {pagination.page} of {pagination.total_pages} ({pagination.total} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
                disabled={page === pagination.total_pages}
                className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
