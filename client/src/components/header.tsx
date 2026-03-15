"use client";

import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  LogOut,
  User,
  Wallet,
  ChevronRight,
  LayoutDashboard,
  Sun,
  Moon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const BREADCRUMB_MAP: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/transactions": "Transactions",
  "/dashboard/analytics": "Analytics",
  "/dashboard/payment-links": "Payment Links",
  "/dashboard/payment-pages": "Payment Pages",
  "/dashboard/payment-buttons": "Payment Buttons",
  "/dashboard/qr-codes": "QR Codes",
  "/dashboard/invoices": "Invoices",
  "/dashboard/settings/profile": "Profile",
  "/dashboard/settings/api-keys": "API Keys",
  "/dashboard/settings/webhooks": "Webhooks",
  "/dashboard/settings/team": "Team",
  "/dashboard/settings/bank-accounts": "Bank Accounts",
};

function getBreadcrumbs(pathname: string) {
  const crumbs: { label: string; href: string }[] = [
    { label: "Dashboard", href: "/dashboard" },
  ];
  if (pathname === "/dashboard") return crumbs;
  if (pathname.startsWith("/dashboard/settings/")) {
    crumbs.push({ label: "Settings", href: "/dashboard/settings/profile" });
    const label = BREADCRUMB_MAP[pathname];
    if (label) crumbs.push({ label, href: pathname });
  } else {
    const label = BREADCRUMB_MAP[pathname];
    if (label) crumbs.push({ label, href: pathname });
  }
  return crumbs;
}

export default function Header() {
  const { merchant, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const crumbs = getBreadcrumbs(pathname);
  const initials = (merchant?.business_name || "M")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 gap-4 dark:bg-slate-950 dark:border-slate-700">
      {/* Left — breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm min-w-0">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={crumb.href} className="flex items-center gap-1.5 min-w-0">
              {i === 0 && (
                <LayoutDashboard size={14} className="shrink-0 text-gray-400 dark:text-slate-500" />
              )}
              {isLast ? (
                <span className="font-semibold text-gray-900 truncate dark:text-slate-100">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-gray-500 hover:text-gray-700 transition-colors truncate dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {crumb.label}
                </Link>
              )}
              {!isLast && (
                <ChevronRight size={13} className="shrink-0 text-gray-300 dark:text-slate-600" />
              )}
            </span>
          );
        })}
      </nav>

      {/* Right — actions */}
      <div className="flex items-center gap-1.5">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors dark:text-slate-400 dark:hover:bg-slate-800"
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notification bell */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors dark:text-slate-400 dark:hover:bg-slate-800"
          title="Notifications"
        >
          <Bell size={17} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-900" />
        </button>

        <div className="h-6 w-px bg-gray-200 mx-1 dark:bg-slate-700" />

        {/* Profile dropdown */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 hover:bg-gray-50 transition-colors dark:hover:bg-slate-800"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold shadow-sm">
              {initials}
            </div>
            <div className="hidden sm:block text-left leading-tight max-w-32.5">
              <p className="text-sm font-semibold text-gray-900 truncate dark:text-slate-100">
                {merchant?.business_name || "Merchant"}
              </p>
              <p className="text-xs text-gray-400 truncate dark:text-slate-500">{merchant?.email}</p>
            </div>
            <ChevronDown
              size={14}
              className={`shrink-0 text-gray-400 transition-transform duration-150 dark:text-slate-500 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown panel */}
          {open && (
            <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-gray-200 bg-white shadow-xl z-50 overflow-hidden dark:bg-slate-800 dark:border-slate-700 dark:shadow-black/40">
              {/* Account info */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-slate-700">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate dark:text-slate-100">
                    {merchant?.business_name}
                  </p>
                  <p className="text-xs text-gray-500 truncate dark:text-slate-400">{merchant?.email}</p>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-1.5 space-y-0.5">
                <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500">
                  Account
                </p>
                {[
                  { href: "/dashboard/settings/profile",       icon: User,   label: "Profile & Business Info" },
                  { href: "/dashboard/settings/bank-accounts", icon: Wallet, label: "Bank Accounts & UPI"     },
                ].map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <Icon size={15} className="text-gray-500 dark:text-slate-400" />
                    {label}
                  </Link>
                ))}
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100 p-1.5 dark:border-slate-700">
                <button
                  onClick={() => { setOpen(false); logout(); }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
