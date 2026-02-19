"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, ExternalLink, Trash2, Pencil } from "lucide-react";

interface PaymentPage {
  id: string;
  title: string;
  description: string;
  slug: string;
  amount: number;
  theme_color: string;
  is_active: boolean;
  created_at: string;
}

export default function PaymentPagesPage() {
  const [pages, setPages] = useState<PaymentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    slug: "",
    amount: "",
    theme_color: "#3B82F6",
    success_url: "",
    cancel_url: "",
  });

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/payment-pages");
      setPages(res.data.data.payment_pages);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", slug: "", amount: "", theme_color: "#3B82F6", success_url: "", cancel_url: "" });
    setEditId(null);
    setShowCreate(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = { ...form, amount: form.amount ? parseFloat(form.amount) : undefined };
      if (editId) {
        await api.put(`/payment-pages/${editId}`, payload);
      } else {
        await api.post("/payment-pages", payload);
      }
      resetForm();
      fetchPages();
    } catch {
      // handled
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (pg: PaymentPage) => {
    setForm({
      title: pg.title,
      description: pg.description || "",
      slug: pg.slug,
      amount: pg.amount ? String(pg.amount) : "",
      theme_color: pg.theme_color || "#3B82F6",
      success_url: "",
      cancel_url: "",
    });
    setEditId(pg.id);
    setShowCreate(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this payment page?")) return;
    try {
      await api.delete(`/payment-pages/${id}`);
      fetchPages();
    } catch {
      // handled
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Payment Pages</h1>
        <button
          onClick={() => { resetForm(); setShowCreate(true); }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={16} />
          Create Page
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="my-payment-page" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <input type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme Color</label>
              <div className="flex gap-2">
                <input type="color" value={form.theme_color} onChange={(e) => setForm({ ...form, theme_color: e.target.value })} className="h-9 w-12 cursor-pointer rounded border border-gray-300" />
                <input value={form.theme_color} onChange={(e) => setForm({ ...form, theme_color: e.target.value })} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Success URL</label>
              <input value={form.success_url} onChange={(e) => setForm({ ...form, success_url: e.target.value })} placeholder="https://..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cancel URL</label>
              <input value={form.cancel_url} onChange={(e) => setForm({ ...form, cancel_url: e.target.value })} placeholder="https://..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={creating} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {creating ? "Saving..." : editId ? "Update Page" : "Create Page"}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : pages.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500">No payment pages yet.</div>
        ) : (
          pages.map((pg) => (
            <div key={pg.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{pg.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{pg.description || "No description"}</p>
                </div>
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: pg.theme_color || "#3B82F6" }} />
              </div>
              <div className="mt-3 text-sm text-gray-600">
                <p>Slug: <span className="font-mono">{pg.slug}</span></p>
                {pg.amount && <p>Amount: ₹{Number(pg.amount).toLocaleString("en-IN")}</p>}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${pg.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                  {pg.is_active ? "Active" : "Inactive"}
                </span>
                <div className="flex gap-2">
                  <a href={`/pay/${pg.slug}`} target="_blank" rel="noreferrer" className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <ExternalLink size={16} />
                  </a>
                  <button onClick={() => handleEdit(pg)} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(pg.id)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
