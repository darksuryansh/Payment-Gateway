"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, Trash2, Pencil } from "lucide-react";

interface SplitRule {
  id: string;
  name: string;
  split_type: string;
  recipients: { account: string; share: number }[];
  is_active: boolean;
  created_at: string;
}

export default function SplitPaymentsPage() {
  const [rules, setRules] = useState<SplitRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    split_type: "percentage",
  });
  const [recipients, setRecipients] = useState<{ account: string; share: string }[]>([
    { account: "", share: "" },
  ]);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await api.get("/splits/rules");
      setRules(res.data.data.split_rules);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const resetForm = () => {
    setForm({ name: "", split_type: "percentage" });
    setRecipients([{ account: "", share: "" }]);
    setEditId(null);
    setShowCreate(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = {
        name: form.name,
        split_type: form.split_type,
        recipients: recipients.map((r) => ({
          account: r.account,
          share: parseFloat(r.share),
        })),
      };
      if (editId) {
        await api.put(`/splits/rules/${editId}`, payload);
      } else {
        await api.post("/splits/rules", payload);
      }
      resetForm();
      fetchRules();
    } catch {
      // handled
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (rule: SplitRule) => {
    setForm({ name: rule.name, split_type: rule.split_type });
    setRecipients(
      rule.recipients.map((r) => ({ account: r.account, share: String(r.share) }))
    );
    setEditId(rule.id);
    setShowCreate(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this split rule?")) return;
    try {
      await api.delete(`/splits/rules/${id}`);
      fetchRules();
    } catch {
      // handled
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Split Payments</h1>
        <button
          onClick={() => { resetForm(); setShowCreate(true); }}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={16} />
          Create Rule
        </button>
      </div>

      {showCreate && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name *</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Split Type *</label>
              <select value={form.split_type} onChange={(e) => setForm({ ...form, split_type: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Recipients</label>
              <button type="button" onClick={() => setRecipients([...recipients, { account: "", share: "" }])} className="text-sm text-blue-600 hover:text-blue-700">+ Add Recipient</button>
            </div>
            <div className="space-y-2">
              {recipients.map((r, i) => (
                <div key={i} className="flex gap-2 items-end">
                  <input placeholder="Account / VPA" value={r.account} onChange={(e) => { const upd = [...recipients]; upd[i] = { ...upd[i], account: e.target.value }; setRecipients(upd); }} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                  <input type="number" placeholder={form.split_type === "percentage" ? "%" : "₹"} value={r.share} onChange={(e) => { const upd = [...recipients]; upd[i] = { ...upd[i], share: e.target.value }; setRecipients(upd); }} className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
                  {recipients.length > 1 && (
                    <button type="button" onClick={() => setRecipients(recipients.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 px-2 py-2">×</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={creating} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {creating ? "Saving..." : editId ? "Update Rule" : "Create Rule"}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      {/* Rules List */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : rules.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500">No split rules yet.</div>
        ) : (
          rules.map((rule) => (
            <div key={rule.id} className="rounded-xl border border-gray-200 bg-white p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{rule.split_type} split</p>
                </div>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${rule.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                  {rule.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="space-y-1">
                {rule.recipients?.map((r, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">{r.account}</span>
                    <span className="font-medium text-gray-900">
                      {rule.split_type === "percentage" ? `${r.share}%` : `₹${r.share}`}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button onClick={() => handleEdit(rule)} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(rule.id)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600">
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
