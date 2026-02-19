"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Eye, EyeOff, RefreshCw, Copy } from "lucide-react";

interface ApiKeys {
  live: { api_key: string; api_secret: string; has_keys: boolean };
  test: { api_key: string; api_secret: string; has_keys: boolean };
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeys | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLive, setShowLive] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [regenerating, setRegenerating] = useState<string | null>(null);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await api.get("/merchant/api-keys");
      setKeys(res.data.data);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const regenerateLive = async () => {
    if (!confirm("Regenerating live API keys will invalidate your current keys. All live integrations will stop working until you update them. Continue?")) return;
    setRegenerating("live");
    try {
      await api.post("/merchant/regenerate-keys");
      fetchKeys();
    } catch {
      // handled
    } finally {
      setRegenerating(null);
    }
  };

  const regenerateTest = async () => {
    if (!confirm("Regenerate test API keys?")) return;
    setRegenerating("test");
    try {
      await api.post("/merchant/api-keys/test/regenerate");
      fetchKeys();
    } catch {
      // handled
    } finally {
      setRegenerating(null);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
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
      <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>

      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
        Keep your API keys secure. Never expose them in client-side code or public repositories. Use test keys for development and live keys for production.
      </div>

      {/* Live Keys */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Live Keys</h2>
            <p className="text-sm text-gray-500">Use these for production payments</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowLive(!showLive)} className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
              {showLive ? <EyeOff size={14} /> : <Eye size={14} />}
              {showLive ? "Hide" : "Show"}
            </button>
            <button onClick={regenerateLive} disabled={regenerating === "live"} className="flex items-center gap-1 rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50">
              <RefreshCw size={14} className={regenerating === "live" ? "animate-spin" : ""} />
              Regenerate
            </button>
          </div>
        </div>

        {keys?.live.has_keys ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">API Key</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg bg-gray-50 px-3 py-2 text-sm font-mono text-gray-700">
                  {showLive ? keys.live.api_key : "pk_live_••••••••••••••••"}
                </code>
                <button onClick={() => copy(keys.live.api_key)} className="rounded p-2 text-gray-400 hover:bg-gray-100"><Copy size={14} /></button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">API Secret</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg bg-gray-50 px-3 py-2 text-sm font-mono text-gray-700">
                  {showLive ? keys.live.api_secret : "sk_live_••••••••••••••••"}
                </code>
                <button onClick={() => copy(keys.live.api_secret)} className="rounded p-2 text-gray-400 hover:bg-gray-100"><Copy size={14} /></button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No live keys generated yet. Click regenerate to create them.</p>
        )}
      </div>

      {/* Test Keys */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Test Keys</h2>
            <p className="text-sm text-gray-500">Use these for development and testing</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowTest(!showTest)} className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
              {showTest ? <EyeOff size={14} /> : <Eye size={14} />}
              {showTest ? "Hide" : "Show"}
            </button>
            <button onClick={regenerateTest} disabled={regenerating === "test"} className="flex items-center gap-1 rounded-lg border border-orange-300 px-3 py-1.5 text-sm text-orange-600 hover:bg-orange-50 disabled:opacity-50">
              <RefreshCw size={14} className={regenerating === "test" ? "animate-spin" : ""} />
              Regenerate
            </button>
          </div>
        </div>

        {keys?.test.has_keys ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">API Key</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg bg-gray-50 px-3 py-2 text-sm font-mono text-gray-700">
                  {showTest ? keys.test.api_key : "pk_test_••••••••••••••••"}
                </code>
                <button onClick={() => copy(keys.test.api_key)} className="rounded p-2 text-gray-400 hover:bg-gray-100"><Copy size={14} /></button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">API Secret</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg bg-gray-50 px-3 py-2 text-sm font-mono text-gray-700">
                  {showTest ? keys.test.api_secret : "sk_test_••••••••••••••••"}
                </code>
                <button onClick={() => copy(keys.test.api_secret)} className="rounded p-2 text-gray-400 hover:bg-gray-100"><Copy size={14} /></button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No test keys generated yet. Click regenerate to create them.</p>
        )}
      </div>
    </div>
  );
}
