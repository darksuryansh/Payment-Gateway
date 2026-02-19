"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Save } from "lucide-react";

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
  is_verified: boolean;
  created_at: string;
}

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
    gst_number: "",
    pan_number: "",
  });

  // Password change
  const [showPassword, setShowPassword] = useState(false);
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
          gst_number: p.gst_number || "",
          pan_number: p.pan_number || "",
        });
      } catch {
        // handled
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
      setSuccess("Profile updated successfully");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError("Passwords do not match");
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
      setSuccess("Password changed successfully");
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
      setShowPassword(false);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr.response?.data?.message || "Failed to change password");
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>

      {success && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</p>}
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {/* Account info */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
            {(merchant?.business_name || "M")[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{profile?.business_name}</p>
            <p className="text-sm text-gray-500">{profile?.email}</p>
          </div>
          <span className={`ml-auto inline-block rounded-full px-3 py-1 text-xs font-medium ${profile?.is_verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            {profile?.is_verified ? "Verified" : "Unverified"}
          </span>
        </div>
        <p className="text-xs text-gray-400">Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}</p>
      </div>

      {/* Edit profile */}
      <form onSubmit={handleUpdate} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
            <input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
            <input value={form.business_type} onChange={(e) => setForm({ ...form, business_type: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
            <input value={form.gst_number} onChange={(e) => setForm({ ...form, gst_number: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
            <input value={form.pan_number} onChange={(e) => setForm({ ...form, pan_number: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
          </div>
        </div>
        <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
          <Save size={16} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {/* Password change */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          <button onClick={() => setShowPassword(!showPassword)} className="text-sm text-blue-600 hover:text-blue-700">
            {showPassword ? "Cancel" : "Change Password"}
          </button>
        </div>
        {showPassword && (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input type="password" required value={passwordForm.current_password} onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input type="password" required minLength={8} value={passwordForm.new_password} onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input type="password" required value={passwordForm.confirm_password} onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
            <button type="submit" disabled={changingPw} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {changingPw ? "Changing..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
