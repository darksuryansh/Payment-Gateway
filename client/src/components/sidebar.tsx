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
  { label: "Subscriptions",   href: "/dashboard/subscriptions",   icon: RefreshCw  },
];

const financeItems = [
  { label: "Refunds",        href: "/dashboard/refunds",        icon: Undo2    },
  { label: "Split Payments", href: "/dashboard/split-payments", icon: Split    },
  { label: "Settlements",    href: "/dashboard/settlements",    icon: Landmark },
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
      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
        active
          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      }`}
    >
      <Icon
        size={indent ? 15 : 16}
        className={active ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-slate-500"}
      />
      {item.label}
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />}
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
      <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-600">
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
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-700">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-gray-200 px-5 dark:border-slate-700">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
          <Zap size={16} className="text-white" />
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
        <NavSection label="Finance"  items={financeItems}  isActive={isActive} />

        {/* Settings collapsible */}
        <div className="space-y-0.5">
          <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-600">
            Settings
          </p>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-all ${
              settingsActive
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            }`}
          >
            <span className="flex items-center gap-3">
              <Settings
                size={16}
                className={settingsActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-slate-500"}
              />
              Preferences
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${settingsActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-slate-500"} ${
                settingsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {settingsOpen && (
            <div className="ml-4 space-y-0.5 border-l border-gray-200 pl-3 dark:border-slate-700">
              {settingsItems.map((item) => (
                <NavLink key={item.href} item={item} active={isActive(item.href)} indent />
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Footer status */}
      <div className="border-t border-gray-100 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-xs text-gray-400 dark:text-slate-600">All systems operational</span>
        </div>
      </div>
    </aside>
  );
}
