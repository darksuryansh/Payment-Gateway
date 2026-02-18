"use client";

import { useAuth } from "@/lib/auth-context";
import { LogOut } from "lucide-react";

export default function Header() {
  const { merchant, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <h2 className="text-sm font-medium text-gray-500">Welcome back</h2>
        <p className="text-sm font-semibold text-gray-900">
          {merchant?.business_name || "Merchant"}
        </p>
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
      >
        <LogOut size={16} />
        Logout
      </button>
    </header>
  );
}
