"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  is_active: boolean;
  created_at: string;
}

const AVAILABLE_EVENTS = [
  "payment.success",
  "payment.failed",
  "payment.pending",
  "invoice.paid",
];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ url: "" });
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["payment.success", "payment.failed"]);

  const fetchWebhooks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/webhooks");
      setWebhooks(res.data.data.webhooks);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post("/webhooks", {
        url: form.url,
        events: selectedEvents,
      });
      setShowCreate(false);
      setForm({ url: "" });
      setSelectedEvents(["payment.success", "payment.failed"]);
      fetchWebhooks();
    } catch {
      // handled
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this webhook endpoint?")) return;
    try {
      await api.delete(`/webhooks/${id}`);
      fetchWebhooks();
    } catch {
      // handled
    }
  };

  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Webhooks</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Endpoint
        </button>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        Webhooks allow your server to receive real-time notifications when events happen in your account. Configure an HTTPS endpoint and select the events you want to listen for.
      </div>

      {showCreate && (
        <form onSubmit={handleCreate} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL *</label>
            <input
              required
              type="url"
              value={form.url}
              onChange={(e) => setForm({ url: e.target.value })}
              placeholder="https://your-server.com/webhooks"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Events</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_EVENTS.map((event) => (
                <button
                  key={event}
                  type="button"
                  onClick={() => toggleEvent(event)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedEvents.includes(event)
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {event}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={creating} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {creating ? "Creating..." : "Create Webhook"}
            </button>
            <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          </div>
        ) : webhooks.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white py-12 text-center text-gray-500">
            No webhook endpoints configured.
          </div>
        ) : (
          webhooks.map((wh) => (
            <div key={wh.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {wh.is_active ? (
                      <ToggleRight size={18} className="text-green-600" />
                    ) : (
                      <ToggleLeft size={18} className="text-gray-400" />
                    )}
                    <code className="text-sm font-mono text-gray-700">{wh.url}</code>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {wh.events?.map((event) => (
                      <span key={event} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        {event}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    Created {new Date(wh.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <button onClick={() => handleDelete(wh.id)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
