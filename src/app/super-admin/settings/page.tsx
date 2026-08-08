'use client';

import { useEffect, useState } from 'react';
import {
  Settings,
  User,
  Construction,
  Loader2,
  CheckCircle2,
  Shield,
  Mail,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfilePhotoPicker } from '@/components/shared/ProfilePhotoPicker';
import { AdminContentSkeleton } from '@/components/admin/AdminSkeletons';

type MeUser = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  avatar_url: string | null;
};

export default function SuperAdminSettingsPage() {
  const [user, setUser] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setFullName(data.user.full_name || '');
        setPhone(data.user.phone || '');
        setAvatarUrl(data.user.avatar_url || '');
      }
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          avatar_url: avatarUrl,
          full_name: fullName,
          phone,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage({ type: 'err', text: data.error || 'Failed to save profile' });
        return;
      }
      setUser((prev) =>
        prev
          ? {
              ...prev,
              full_name: data.user?.full_name ?? fullName,
              phone: data.user?.phone ?? phone,
              avatar_url: data.avatar_url ?? avatarUrl,
            }
          : prev
      );
      setMessage({ type: 'ok', text: 'Profile updated successfully' });
    } catch {
      setMessage({ type: 'err', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <AdminContentSkeleton />;

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Settings className="h-7 w-7 text-cyan-700" />
          Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your admin profile. Platform-wide options are still being built.
        </p>
      </div>

      {/* Under development notice */}
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 sm:p-6">
        <div className="flex gap-3">
          <div className="h-11 w-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Construction className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-amber-950">
              Platform settings — under development
            </h2>
            <p className="text-sm text-amber-900/80 mt-1 leading-relaxed">
              Clinic branding, notification defaults, payment keys, and security policies will
              live here soon. We&apos;re actively building this section — thanks for your patience.
            </p>
            <p className="text-xs font-medium text-amber-800 mt-3 uppercase tracking-wide">
              Coming soon
            </p>
          </div>
        </div>
      </div>

      {/* Profile */}
      <form
        onSubmit={saveProfile}
        className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/80 flex items-center gap-2">
          <User className="h-4 w-4 text-cyan-700" />
          <h2 className="text-sm font-semibold text-gray-900">Your profile</h2>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          <ProfilePhotoPicker
            value={avatarUrl}
            onChange={setAvatarUrl}
            name={fullName || user?.email || 'Admin'}
            email={user?.email}
            userId={user?.id}
            description="Upload a photo or generate an avatar for your admin account."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                Email
              </label>
              <Input value={user?.email || ''} disabled className="bg-gray-50 text-gray-600" />
              <p className="text-[11px] text-gray-400 mt-1">Managed by Google sign-in</p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">Full name</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                Phone
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 …"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                Role
              </label>
              <div className="inline-flex items-center px-3 py-2 rounded-lg bg-cyan-50 border border-cyan-100 text-sm font-medium text-cyan-800 capitalize">
                {(user?.role || '').replace(/_/g, ' ')}
              </div>
            </div>
          </div>

          {message && (
            <div
              className={`flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm ${
                message.type === 'ok'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                  : 'bg-red-50 text-red-700 border border-red-100'
              }`}
            >
              {message.type === 'ok' ? (
                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
              ) : null}
              {message.text}
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/80 flex justify-end">
          <Button type="submit" disabled={saving} className="bg-cyan-700 hover:bg-cyan-800">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save profile
          </Button>
        </div>
      </form>
    </div>
  );
}
