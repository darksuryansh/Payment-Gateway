"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, Copy, Trash2, Pencil } from "lucide-react";

interface PaymentButton {
  id: string;
  label: string;
  amount: number;
  style: Record<string, string>;
  redirect_url: string;
  button_code: string;
  is_active: boolean;
  created_at: string;
}

export default function PaymentButtonsPage() {
  const [buttons, setButtons] = useState<PaymentButton[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    label: "Pay Now",
    amount: "",
    redirect_url: "",
    bg_color: "#3B82F6",
    text_color: "#FFFFFF",
  });

  const fetchButtons = async () => {
    setLoading(true);
    try {
      const res = await api.get("/payment-buttons");
      setButtons(res.data.data.payment_buttons);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchButtons();
  }, []);

  const resetForm = () => {
    setForm({ label: "Pay Now", amount: "", redirect_url: "", bg_color: "#3B82F6", text_color: "#FFFFFF" });
    setEditId(null);
    setShowCreate(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = {
        label: form.label,
        amount: parseFloat(form.amount),
        redirect_url: form.redirect_url || undefined,
        style: { bg_color: form.bg_color, text_color: form.text_color },
      };
      if (editId) {
        await api.put(`/payment-buttons/${editId}`, payload);
      } else {
        await api.post("/payment-buttons", payload);
      }
      resetForm();
      fetchButtons();
    } catch {
      // handled
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (btn: PaymentButton) => {
    setForm({
      label: btn.label,
      amount: String(btn.amount),
      redirect_url: btn.redirect_url || "",
      bg_color: btn.style?.bg_color || "#3B82F6",
      text_color: btn.style?.text_color || "#FFFFFF",
    });
    setEditId(btn.id);
    setShowCreate(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this payment button?")) return;
    try {
      await api.delete(`/payment-buttons/${id}`);
      fetchButtons();
    } catch {
      // handled
    }
  };

  const copyCode = async (id: string) => {
    try {
      const res = await api.get(`/payment-buttons/${id}/embed`);
      navigator.clipboard.writeText(res.data.data.embed_code || res.data.data.button_code || "");
    } catch {
      // handled
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Payment Buttons</h1>
        <button
          onClick={() => { resetForm(); setShowCreate(true); }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={16} />
          Create Button
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
              <input required value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
              <input required type="number" step="0.01" min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Redirect URL</label>
              <input value={form.redirect_url} onChange={(e) => setForm({ ...form, redirect_url: e.target.value })} placeholder="https://..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Button Colors</label>
              <div className="flex gap-3">
                <div className="flex items-center gap-1">
                  <input type="color" value={form.bg_color} onChange={(e) => setForm({ ...form, bg_color: e.target.value })} className="h-9 w-10 cursor-pointer rounded border border-gray-300" />
                  <span className="text-xs text-gray-500">BG</span>
                </div>
                <div className="flex items-center gap-1">
                  <input type="color" value={form.text_color} onChange={(e) => setForm({ ...form, text_color: e.target.value })} className="h-9 w-10 cursor-pointer rounded border border-gray-300" />
                  <span className="text-xs text-gray-500">Text</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
            <button type="button" className="rounded-lg px-6 py-2.5 text-sm font-medium" style={{ backgroundColor: form.bg_color, color: form.text_color }}>
              {form.label} {form.amount ? `- ₹${form.amount}` : ""}
            </button>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={creating} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {creating ? "Saving..." : editId ? "Update Button" : "Create Button"}
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
        ) : buttons.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500">No payment buttons yet.</div>
        ) : (
          buttons.map((btn) => (
            <div key={btn.id} className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{btn.label}</h3>
                  <p className="text-sm text-gray-500">₹{Number(btn.amount).toLocaleString("en-IN")}</p>
                </div>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${btn.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                  {btn.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <button type="button" className="rounded-lg px-4 py-2 text-sm font-medium" style={{ backgroundColor: btn.style?.bg_color || "#3B82F6", color: btn.style?.text_color || "#fff" }}>
                {btn.label}
              </button>
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button onClick={() => copyCode(btn.id)} title="Copy embed code" className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100">
                  <Copy size={14} /> Embed Code
                </button>
                <button onClick={() => handleEdit(btn)} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(btn.id)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
