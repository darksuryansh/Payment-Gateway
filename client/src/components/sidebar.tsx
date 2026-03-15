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
  Settings,
  Building2,
  Webhook,
  ChevronDown,
  BarChart2,
  Wallet,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard",     href: "/dashboard",                       icon: LayoutDashboard },
  { label: "Transactions",  href: "/dashboard/transactions",          icon: ArrowLeftRight  },
  { label: "Verifications", href: "/dashboard/pending-verifications", icon: ShieldCheck     },
  { label: "Analytics",     href: "/dashboard/analytics",             icon: BarChart2       },
];

const paymentItems = [
  { label: "Payment Links",   href: "/dashboard/payment-links",   icon: Link2      },
  { label: "Payment Pages",   href: "/dashboard/payment-pages",   icon: FileText   },
  { label: "Payment Buttons", href: "/dashboard/payment-buttons", icon: CreditCard },
  { label: "QR Codes",        href: "/dashboard/qr-codes",        icon: QrCode     },
  { label: "Invoices",        href: "/dashboard/invoices",        icon: Receipt    },
];

const settingsItems = [
  { label: "Profile",       href: "/dashboard/settings/profile",        icon: Building2 },
  { label: "Paytm Config",  href: "/dashboard/settings/paytm",          icon: CreditCard},
  { label: "Bank Accounts", href: "/dashboard/settings/bank-accounts",  icon: Wallet    },
  { label: "Webhooks",      href: "/dashboard/settings/webhooks",       icon: Webhook   },
];

type NavItem = { label: string; href: string; icon: React.ElementType };

function NavLink({ item, active, indent = false }: { item: NavItem; active: boolean; indent?: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      }`}
    >
      {/* Active indicator bar */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-blue-600 dark:bg-blue-400" />
      )}
      <Icon
        size={indent ? 15 : 16}
        className={`transition-colors ${active ? "text-blue-600 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-600 dark:text-slate-500 dark:group-hover:text-slate-300"}`}
      />
      {item.label}
    </Link>
  );
}

function NavSection({
  label,
  items,
  isActive,
}: {
  label: string;
  items: NavItem[];
  isActive: (href: string) => boolean;
}) {
  return (
    <div className="space-y-0.5">
      <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-600">
        {label}
      </p>
      {items.map((item) => (
        <NavLink key={item.href} item={item} active={isActive(item.href)} />
      ))}
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(
    pathname.startsWith("/dashboard/settings")
  );

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const settingsActive = pathname.startsWith("/dashboard/settings");

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white dark:bg-slate-950 dark:border-slate-700">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-5 dark:border-slate-700">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25">
          <Zap size={17} className="text-white" />
        </div>
        <Link
          href="/dashboard"
          className="text-base font-bold text-gray-900 tracking-tight dark:text-slate-100"
        >
          Node Gateway
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {/* Core items */}
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}

        <NavSection label="Payments" items={paymentItems} isActive={isActive} />

        {/* Settings collapsible */}
        <div className="space-y-0.5">
          <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-600">
            Settings
          </p>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
              settingsActive
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            }`}
          >
            {settingsActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-blue-600 dark:bg-blue-400" />
            )}
            <span className="flex items-center gap-3">
              <Settings
                size={16}
                className={`transition-colors ${settingsActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-600 dark:text-slate-500 dark:group-hover:text-slate-300"}`}
              />
              Preferences
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${settingsActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-slate-500"} ${
                settingsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              settingsOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="ml-4 space-y-0.5 border-l-2 border-gray-100 pl-3 pt-1 dark:border-slate-800">
              {settingsItems.map((item) => (
                <NavLink key={item.href} item={item} active={isActive(item.href)} indent />
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Footer status */}
      <div className="border-t border-gray-100 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-400 dark:text-slate-600">All systems operational</span>
        </div>
      </div>
    </aside>
  );
}
