"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  Save,
  Building2,
  Phone,
  Globe,
  FileText,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ImageIcon,
} from "lucide-react";

interface MerchantProfile {
  id: string;
  email: string;
  business_name: string;
  phone: string;
  business_type: string;
  website: string;
  logo_url: string;
  gst_number: string;
  pan_number: string;
  merchant_tier: string;
  is_verified: boolean;
  created_at: string;
}

const BUSINESS_TYPES = [
  "Freelancer / Individual",
  "Sole Proprietorship",
  "Partnership",
  "Private Limited",
  "LLP",
  "NGO / Trust",
  "Other",
];

export default function ProfilePage() {
  const { merchant } = useAuth();
  const [profile, setProfile] = useState<MerchantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    business_name: "",
    phone: "",
    business_type: "",
    website: "",
    logo_url: "",
    gst_number: "",
    pan_number: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/merchant/profile");
        const p = res.data.data.merchant;
        setProfile(p);
        setForm({
          business_name: p.business_name || "",
          phone: p.phone || "",
          business_type: p.business_type || "",
          website: p.website || "",
          logo_url: p.logo_url || "",
          gst_number: p.gst_number || "",
          pan_number: p.pan_number || "",
        });
      } catch {
        // handled by interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.put("/merchant/profile", form);
      setSuccess("Profile updated successfully.");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError("New passwords do not match.");
      return;
    }
    setChangingPw(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/merchant/change-password", {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      setSuccess("Password changed successfully.");
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
      setShowPassword(false);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Failed to change password.");
    } finally {
      setChangingPw(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  const initials = (profile?.business_name || "M")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const tierLabel = profile?.merchant_tier === "tier_2" ? "Paytm Business" : "UPI Direct";
  const tierColor =
    profile?.merchant_tier === "tier_2"
      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      : "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400";

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-400";

  const labelClass = "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1.5";

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Manage your business information and account security.
        </p>
      </div>

      {/* Toast messages */}
      {success && (
        <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle2 size={16} className="shrink-0" />
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {/* ─── Account Overview Card ─── */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
        {/* Gradient banner */}
        <div className="h-20 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600" />
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-10 mb-4 flex items-end justify-between">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-linear-to-br from-blue-500 to-indigo-600 text-white text-2xl font-extrabold shadow-lg dark:border-slate-950">
              {initials}
            </div>
            <div className="flex items-center gap-2 pb-1">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${tierColor}`}
              >
                {tierLabel}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  profile?.is_verified
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${profile?.is_verified ? "bg-emerald-500" : "bg-yellow-500"}`}
                />
                {profile?.is_verified ? "Verified" : "Unverified"}
              </span>
            </div>
          </div>

          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
            {profile?.business_name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">{profile?.email}</p>
          <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
            Member since{" "}
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "—"}
          </p>
        </div>
      </div>

      {/* ─── Business Information ─── */}
      <form onSubmit={handleUpdate} className="rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="border-b border-gray-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Building2 size={16} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Business Information</h3>
              <p className="text-xs text-gray-400 dark:text-slate-500">Your public-facing business details</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Business Name */}
            <div>
              <label className={labelClass}>Business Name</label>
              <div className="relative">
                <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                <input
                  value={form.business_name}
                  onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                  className={`${inputClass} pl-9`}
                  placeholder="Your Business Name"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass}>Phone Number</label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={`${inputClass} pl-9`}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Business Type */}
            <div>
              <label className={labelClass}>Business Type</label>
              <div className="relative">
                <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 pointer-events-none" />
                <select
                  value={form.business_type}
                  onChange={(e) => setForm({ ...form, business_type: e.target.value })}
                  className={`${inputClass} pl-9 appearance-none`}
                >
                  <option value="">Select business type</option>
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Website */}
            <div>
              <label className={labelClass}>Website</label>
              <div className="relative">
                <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                <input
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className={`${inputClass} pl-9`}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            {/* Logo URL — full width */}
            <div className="sm:col-span-2">
              <label className={labelClass}>Logo URL</label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <ImageIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                  <input
                    value={form.logo_url}
                    onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                    className={`${inputClass} pl-9`}
                    placeholder="https://cdn.example.com/logo.png"
                  />
                </div>
                {form.logo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.logo_url}
                    alt="Logo preview"
                    className="h-10 w-10 rounded-xl object-contain border border-gray-200 dark:border-slate-700 bg-white"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
              </div>
              <p className="mt-1.5 text-xs text-gray-400 dark:text-slate-500">
                Used on payment pages and invoices shown to your customers.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 pt-5 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={15} className="text-gray-400 dark:text-slate-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">Tax & Compliance</span>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>GST Number</label>
                <input
                  value={form.gst_number}
                  onChange={(e) => setForm({ ...form, gst_number: e.target.value.toUpperCase() })}
                  className={inputClass}
                  placeholder="22ABCDE1234F1Z5"
                  maxLength={15}
                />
              </div>
              <div>
                <label className={labelClass}>PAN Number</label>
                <input
                  value={form.pan_number}
                  onChange={(e) => setForm({ ...form, pan_number: e.target.value.toUpperCase() })}
                  className={inputClass}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-400 dark:text-slate-500">
              Email address cannot be changed from this page.
            </p>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-blue-500/30 disabled:opacity-60 disabled:translate-y-0"
            >
              <Save size={15} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>

      {/* ─── Security ─── */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="border-b border-gray-100 px-6 py-4 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <Lock size={16} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Security</h3>
                <p className="text-xs text-gray-400 dark:text-slate-500">Manage your account password</p>
              </div>
            </div>
            {!showPassword && (
              <button
                onClick={() => { setShowPassword(true); setError(""); setSuccess(""); }}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Change Password
              </button>
            )}
          </div>
        </div>

        {!showPassword ? (
          <div className="px-6 py-5">
            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50">
              <Lock size={14} className="text-gray-400 dark:text-slate-500" />
              <span className="text-sm text-gray-500 dark:text-slate-400">
                Password last changed — use the button above to update it.
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePasswordChange} className="p-6 space-y-5">
            <div className="grid grid-cols-1 gap-5">
              {/* Current password */}
              <div>
                <label className={labelClass}>Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    required
                    value={passwordForm.current_password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                    className={`${inputClass} pr-10`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                  >
                    {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* New password */}
                <div>
                  <label className={labelClass}>New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      required
                      minLength={8}
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                      className={`${inputClass} pr-10`}
                      placeholder="Min. 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                    >
                      {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label className={labelClass}>Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      value={passwordForm.confirm_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                      className={`${inputClass} pr-10`}
                      placeholder="Repeat new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {passwordForm.confirm_password && passwordForm.new_password !== passwordForm.confirm_password && (
                    <p className="mt-1.5 text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={changingPw}
                className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
              >
                <Lock size={15} />
                {changingPw ? "Updating..." : "Update Password"}
              </button>
              <button
                type="button"
                onClick={() => { setShowPassword(false); setError(""); setSuccess(""); setPasswordForm({ current_password: "", new_password: "", confirm_password: "" }); }}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
