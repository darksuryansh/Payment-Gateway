"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, ChevronLeft, ChevronRight, Send, Bell, XCircle, ExternalLink } from "lucide-react";

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total_amount: number;
  due_date: string;
  status: string;
  notes: string;
  created_at: string;
  paymentLink?: { short_url: string; status: string } | null;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

const statusColor: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SENT: "bg-blue-100 text-blue-700",
  PAID: "bg-green-100 text-green-700",
  PARTIALLY_PAID: "bg-yellow-100 text-yellow-700",
  OVERDUE: "bg-red-100 text-red-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    due_date: "",
    notes: "",
  });
  const [items, setItems] = useState<{ description: string; quantity: string; rate: string }[]>([
    { description: "", quantity: "1", rate: "" },
  ]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.get("/invoices", { params: { page, limit: 20 } });
      setInvoices(res.data.data.invoices);
      setPagination(res.data.data.pagination);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [page]);

  const addItem = () => setItems([...items, { description: "", quantity: "1", rate: "" }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: string, val: string) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: val };
    setItems(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0), 0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const parsedItems = items.map((item) => ({
        description: item.description,
        quantity: parseFloat(item.quantity) || 1,
        rate: parseFloat(item.rate) || 0,
        amount: (parseFloat(item.quantity) || 1) * (parseFloat(item.rate) || 0),
      }));
      await api.post("/invoices", {
        ...form,
        items: parsedItems,
        subtotal,
        tax: 0,
        total_amount: subtotal,
      });
      setShowCreate(false);
      setForm({ customer_name: "", customer_email: "", customer_phone: "", due_date: "", notes: "" });
      setItems([{ description: "", quantity: "1", rate: "" }]);
      fetchInvoices();
      showToast("success", "Invoice created successfully.");
    } catch {
      showToast("error", "Failed to create invoice.");
    } finally {
      setCreating(false);
    }
  };

  const handleSend = async (id: string) => {
    setActionLoading(id + "_send");
    try {
      const res = await api.post(`/invoices/${id}/send`);
      const paymentUrl = res.data.data?.payment_url;
      showToast("success", paymentUrl ? `Invoice sent. Payment link ready.` : "Invoice sent.");
      fetchInvoices();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      showToast("error", axiosErr.response?.data?.message || "Failed to send invoice.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemind = async (id: string) => {
    setActionLoading(id + "_remind");
    try {
      await api.post(`/invoices/${id}/remind`);
      showToast("success", "Payment reminder sent.");
    } catch {
      showToast("error", "Failed to send reminder.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this invoice?")) return;
    setActionLoading(id + "_cancel");
    try {
      await api.post(`/invoices/${id}/cancel`);
      showToast("success", "Invoice cancelled.");
      fetchInvoices();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      showToast("error", axiosErr.response?.data?.message || "Failed to cancel invoice.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${toast.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={16} />
          Create Invoice
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <input required value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Email *</label>
              <input required type="email" value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Line Items</label>
              <button type="button" onClick={addItem} className="text-sm text-blue-600 hover:text-blue-700">+ Add Item</button>
            </div>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex gap-2 items-end">
                  <input placeholder="Description" value={item.description} onChange={(e) => updateItem(i, "description", e.target.value)} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                  <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(i, "quantity", e.target.value)} className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                  <input type="number" placeholder="Rate" value={item.rate} onChange={(e) => updateItem(i, "rate", e.target.value)} className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                  <span className="w-28 py-2 text-sm text-gray-600 text-right">₹{((parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0)).toLocaleString("en-IN")}</span>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 text-sm px-2 py-2">×</button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 text-right text-sm font-semibold text-gray-900">
              Total: ₹{subtotal.toLocaleString("en-IN")}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={creating} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {creating ? "Creating..." : "Create Invoice"}
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
        ) : invoices.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No invoices yet. Create one to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-6 py-3 font-medium">Invoice #</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Due Date</th>
                  <th className="px-6 py-3 font-medium">Created</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-3 font-mono text-xs text-gray-600">{inv.invoice_number}</td>
                    <td className="px-6 py-3">
                      <div className="text-gray-900">{inv.customer_name}</div>
                      <div className="text-xs text-gray-500">{inv.customer_email}</div>
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-900">₹{Number(inv.total_amount).toLocaleString("en-IN")}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[inv.status] || "bg-gray-100 text-gray-700"}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {new Date(inv.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-1">
                        {/* Send — DRAFT only */}
                        {inv.status === "DRAFT" && (
                          <button onClick={() => handleSend(inv.id)} disabled={actionLoading === inv.id + "_send"} title="Send invoice" className="rounded p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50">
                            <Send size={15} />
                          </button>
                        )}
                        {/* View payment link — SENT */}
                        {inv.status === "SENT" && inv.paymentLink?.short_url && (
                          <a href={inv.paymentLink.short_url} target="_blank" rel="noreferrer" title="View payment link" className="rounded p-1.5 text-gray-400 hover:bg-green-50 hover:text-green-600">
                            <ExternalLink size={15} />
                          </a>
                        )}
                        {/* Remind — SENT or OVERDUE */}
                        {(inv.status === "SENT" || inv.status === "OVERDUE") && (
                          <button onClick={() => handleRemind(inv.id)} disabled={actionLoading === inv.id + "_remind"} title="Send reminder" className="rounded p-1.5 text-gray-400 hover:bg-yellow-50 hover:text-yellow-600 disabled:opacity-50">
                            <Bell size={15} />
                          </button>
                        )}
                        {/* Cancel — DRAFT, SENT, OVERDUE */}
                        {["DRAFT", "SENT", "OVERDUE"].includes(inv.status) && (
                          <button onClick={() => handleCancel(inv.id)} disabled={actionLoading === inv.id + "_cancel"} title="Cancel invoice" className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
                            <XCircle size={15} />
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
