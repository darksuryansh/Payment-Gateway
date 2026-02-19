"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Plus,
  Trash2,
  Star,
  CheckCircle,
  AlertCircle,
  X,
  Wallet,
  Info,
  Pencil,
} from "lucide-react";

interface UpiAccount {
  id: string;
  upi_id: string;
  provider: string | null;
  is_primary: boolean;
  is_active: boolean;
  created_at: string;
}

const PROVIDERS = ["GPay", "PhonePe", "Paytm", "BHIM", "Amazon Pay", "Other"];

const providerStyles: Record<string, { bg: string; text: string; dot: string }> = {
  GPay:        { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500"  },
  PhonePe:     { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
  Paytm:       { bg: "bg-sky-50",    text: "text-sky-700",    dot: "bg-sky-500"    },
  BHIM:        { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  "Amazon Pay":{ bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-500" },
  Other:       { bg: "bg-gray-100",  text: "text-gray-600",   dot: "bg-gray-400"   },
};

type Toast = { msg: string; type: "success" | "error" };

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState<UpiAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ upi_id: "", provider: "GPay", is_primary: false });
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ upi_id: "", provider: "GPay", is_primary: false });
  const [editError, setEditError] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const showToast = (msg: string, type: Toast["type"] = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAccounts = async () => {
    try {
      const res = await api.get("/merchant/bank-accounts");
      setAccounts(res.data.data.accounts || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.upi_id.trim()) {
      setFormError("UPI ID is required.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      await api.post("/merchant/bank-accounts", form);
      showToast("UPI account added successfully");
      setForm({ upi_id: "", provider: "GPay", is_primary: false });
      setShowForm(false);
      fetchAccounts();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setFormError(e.response?.data?.message || "Failed to add account.");
    } finally {
      setSaving(false);
    }
  };

  const handleSetPrimary = async (id: string) => {
    setActionId(id);
    try {
      await api.put(`/merchant/bank-accounts/${id}`, { is_primary: true });
      showToast("Primary account updated");
      fetchAccounts();
    } catch {
      showToast("Failed to update", "error");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this UPI account?")) return;
    setActionId(id);
    try {
      await api.delete(`/merchant/bank-accounts/${id}`);
      showToast("Account removed");
      fetchAccounts();
    } catch {
      showToast("Failed to remove account", "error");
    } finally {
      setActionId(null);
    }
  };

  const startEdit = (acc: UpiAccount) => {
    setEditingId(acc.id);
    setEditForm({ upi_id: acc.upi_id, provider: acc.provider || "GPay", is_primary: acc.is_primary });
    setEditError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditError("");
  };

  const handleEditSave = async (id: string) => {
    if (!editForm.upi_id.trim()) {
      setEditError("UPI ID is required.");
      return;
    }
    setEditSaving(true);
    setEditError("");
    try {
      await api.put(`/merchant/bank-accounts/${id}`, editForm);
      showToast("Account updated successfully");
      setEditingId(null);
      fetchAccounts();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setEditError(e.response?.data?.message || "Failed to update account.");
    } finally {
      setEditSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg transition-all ${
            toast.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
          {toast.msg}
          <button onClick={() => setToast(null)} className="ml-1 opacity-60 hover:opacity-100">
            <X size={13} />
          </button>
        </div>
      )}

      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bank Accounts & UPI IDs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage UPI IDs used for QR code generation and payment settlements
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormError("");
          }}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add UPI Account
        </button>
      </div>

      {/* Info banner */}
      <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3.5">
        <Info size={17} className="mt-0.5 shrink-0 text-blue-600" />
        <p className="text-sm text-blue-800 leading-relaxed">
          Your <strong>primary UPI account</strong> is used for QR code generation. You must have
          at least one UPI account configured to accept QR payments.
        </p>
      </div>

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-5"
        >
          <h2 className="text-base font-semibold text-gray-900">Add New UPI Account</h2>

          {formError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              <AlertCircle size={15} />
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                UPI ID <span className="text-red-500">*</span>
              </label>
              <input
                value={form.upi_id}
                onChange={(e) => setForm({ ...form, upi_id: e.target.value })}
                placeholder="yourname@upi"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <p className="mt-1 text-xs text-gray-400">e.g. 9876543210@paytm</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Provider</label>
              <select
                value={form.provider}
                onChange={(e) => setForm({ ...form, provider: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              >
                {PROVIDERS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <div className="relative">
              <input
                type="checkbox"
                checked={form.is_primary}
                onChange={(e) => setForm({ ...form, is_primary: e.target.checked })}
                className="peer sr-only"
              />
              <div className="h-5 w-9 rounded-full bg-gray-200 peer-checked:bg-blue-600 transition-colors" />
              <div className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow peer-checked:translate-x-4 transition-transform" />
            </div>
            <span className="text-sm text-gray-700">Set as primary account</span>
          </label>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Adding..." : "Add Account"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormError("");
              }}
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Accounts list */}
      {accounts.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white px-8 py-14 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
            <Wallet size={28} className="text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">No UPI accounts yet</h3>
          <p className="mt-1.5 text-sm text-gray-500">
            Add your UPI ID to enable QR code and payment link collections
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Add your first UPI account
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map((acc) => {
            const style = providerStyles[acc.provider || "Other"] || providerStyles.Other;
            const isEditing = editingId === acc.id;
            return (
              <div
                key={acc.id}
                className={`rounded-2xl border bg-white shadow-sm transition-all ${
                  acc.is_primary
                    ? "border-blue-200 ring-2 ring-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Main row */}
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Icon */}
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${style.bg} ${style.text}`}
                  >
                    UPI
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{acc.upi_id}</span>
                      {acc.is_primary && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                          <Star size={9} className="fill-blue-600" />
                          Primary
                        </span>
                      )}
                      {!acc.is_active && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                          Inactive
                        </span>
                      )}
                    </div>
                    {acc.provider && (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                        <span className={`text-xs font-medium ${style.text}`}>{acc.provider}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!acc.is_primary && (
                      <button
                        onClick={() => handleSetPrimary(acc.id)}
                        disabled={actionId === acc.id || isEditing}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-colors"
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      onClick={() => (isEditing ? cancelEdit() : startEdit(acc))}
                      disabled={actionId === acc.id}
                      title={isEditing ? "Cancel edit" : "Edit account"}
                      className={`rounded-lg border p-2 transition-colors disabled:opacity-50 ${
                        isEditing
                          ? "border-gray-200 text-gray-500 hover:bg-gray-50"
                          : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      {isEditing ? <X size={15} /> : <Pencil size={15} />}
                    </button>
                    <button
                      onClick={() => handleDelete(acc.id)}
                      disabled={actionId === acc.id || isEditing}
                      title="Remove account"
                      className="rounded-lg border border-red-100 p-2 text-red-400 hover:bg-red-50 hover:border-red-200 hover:text-red-600 disabled:opacity-50 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Inline edit form */}
                {isEditing && (
                  <div className="border-t border-gray-100 px-5 py-4 space-y-4">
                    {editError && (
                      <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                        <AlertCircle size={15} />
                        {editError}
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          UPI ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={editForm.upi_id}
                          onChange={(e) => setEditForm({ ...editForm, upi_id: e.target.value })}
                          placeholder="yourname@upi"
                          className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Provider</label>
                        <select
                          value={editForm.provider}
                          onChange={(e) => setEditForm({ ...editForm, provider: e.target.value })}
                          className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                        >
                          {PROVIDERS.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <label className="flex cursor-pointer items-center gap-3">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={editForm.is_primary}
                          onChange={(e) => setEditForm({ ...editForm, is_primary: e.target.checked })}
                          className="peer sr-only"
                        />
                        <div className="h-5 w-9 rounded-full bg-gray-200 peer-checked:bg-blue-600 transition-colors" />
                        <div className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow peer-checked:translate-x-4 transition-transform" />
                      </div>
                      <span className="text-sm text-gray-700">Set as primary account</span>
                    </label>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditSave(acc.id)}
                        disabled={editSaving}
                        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        {editSaving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
