"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Link2,
  FileText,
  CreditCard,
  QrCode,
  Receipt,
  RefreshCw,
  Undo2,
  Split,
  Landmark,
  Settings,
  Key,
  Building2,
  Webhook,
  Users,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
  { label: "Payment Links", href: "/dashboard/payment-links", icon: Link2 },
  { label: "Payment Pages", href: "/dashboard/payment-pages", icon: FileText },
  { label: "Payment Buttons", href: "/dashboard/payment-buttons", icon: CreditCard },
  { label: "QR Codes", href: "/dashboard/qr-codes", icon: QrCode },
  { label: "Invoices", href: "/dashboard/invoices", icon: Receipt },
  { label: "Subscriptions", href: "/dashboard/subscriptions", icon: RefreshCw },
  { label: "Refunds", href: "/dashboard/refunds", icon: Undo2 },
  { label: "Split Payments", href: "/dashboard/split-payments", icon: Split },
  { label: "Settlements", href: "/dashboard/settlements", icon: Landmark },
];

const settingsItems = [
  { label: "Profile", href: "/dashboard/settings/profile", icon: Building2 },
  { label: "API Keys", href: "/dashboard/settings/api-keys", icon: Key },
  { label: "Webhooks", href: "/dashboard/settings/webhooks", icon: Webhook },
  { label: "Team", href: "/dashboard/settings/team", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(
    pathname.startsWith("/dashboard/settings")
  );

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <Link href="/dashboard" className="text-xl font-bold text-gray-900">
          Payment Gateway
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}

        {/* Settings section */}
        <div className="pt-2">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname.startsWith("/dashboard/settings")
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="flex items-center gap-3">
              <Settings size={18} />
              Settings
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${settingsOpen ? "rotate-180" : ""}`}
            />
          </button>

          {settingsOpen && (
            <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-3">
              {settingsItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
