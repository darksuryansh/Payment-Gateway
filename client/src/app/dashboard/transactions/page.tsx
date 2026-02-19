"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";

interface Transaction {
  id: string;
  order_id: string;
  txn_id: string;
  amount: number;
  fees: number;
  settle_amount: number;
  status: string;
  payment_mode: string;
  customer_email?: string;
  sender_vpa?: string;
  utr?: string;
  created_at: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

const statusColor: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  FAILED: "bg-red-100 text-red-700",
  INITIATED: "bg-blue-100 text-blue-700",
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 20 };
      if (status) params.status = status;
      if (search) params.search = search;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;

      const res = await api.get("/payment/transactions", { params });
      setTransactions(res.data.data.transactions);
      setPagination(res.data.data.pagination);
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions();
  };

  const handleExport = async () => {
    try {
      const res = await api.get("/payment/transactions/export", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "transactions.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-gray-200 bg-white p-4">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search order ID, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Search
          </button>
        </form>

        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="COMPLETED">Completed</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="INITIATED">Initiated</option>
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No transactions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Fees</th>
                  <th className="px-6 py-3 font-medium">Settle Amt</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Mode</th>
                  <th className="px-6 py-3 font-medium">UTR</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-3 font-mono text-xs text-gray-600">{txn.order_id}</td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      ₹{Number(txn.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      ₹{Number(txn.fees || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      ₹{Number(txn.settle_amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[txn.status] || "bg-gray-100 text-gray-700"}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{txn.payment_mode || "—"}</td>
                    <td className="px-6 py-3 font-mono text-xs text-gray-500">{txn.utr || "—"}</td>
                    <td className="px-6 py-3 text-gray-500">
                      {new Date(txn.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
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
