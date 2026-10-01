import React, { useEffect, useState } from 'react';
import { MailPlus, RefreshCw, ShieldCheck, UserRoundX } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

const hostEmail = (import.meta.env.VITE_HOST_ADMIN_EMAIL || '').trim().toLowerCase();

async function callAdminFunction(body) {
  const { data, error } = await supabase.functions.invoke('manage-linked-admins', { body });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

export default function LinkedAdminsPanel({ email }) {
  const [admins, setAdmins] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isHost = Boolean(hostEmail && email?.trim().toLowerCase() === hostEmail);

  useEffect(() => {
    if (!isSupabaseConfigured || !isHost) return undefined;
    let isMounted = true;

    callAdminFunction({ action: 'list' })
      .then((data) => {
        if (isMounted) setAdmins(data.admins || []);
      })
      .catch(() => {
        if (isMounted) setMessage('Could not load linked email access. Check the Supabase function deployment.');
      });

    return () => {
      isMounted = false;
    };
  }, [isHost]);

  if (!isSupabaseConfigured) return null;

  if (!hostEmail) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <h3 className="text-base font-semibold text-slate-900">Linked Admin Emails</h3>
        <p className="mt-2 text-sm text-slate-600">Set VITE_HOST_ADMIN_EMAIL to enable host-only account authorization.</p>
      </section>
    );
  }

  if (!isHost) return null;

  const refreshAdmins = async () => {
    setIsLoading(true);
    try {
      const data = await callAdminFunction({ action: 'list' });
      setAdmins(data.admins || []);
    } catch {
      setMessage('Could not load linked email access. Check the Supabase function deployment.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    try {
      const data = await callAdminFunction({ action: 'invite', email: inviteEmail, displayName });
      setMessage(data.alreadyAuthorized
        ? `${inviteEmail} is already authorized.`
        : data.passwordSetupSent
          ? `Password setup link sent to ${inviteEmail}. They can choose their own password from the email.`
          : `${inviteEmail} has been authorized to sign in.`);
      setInviteEmail('');
      setDisplayName('');
      await refreshAdmins();
    } catch {
      setMessage('Could not authorize this email. Check the address and Supabase function configuration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActiveChange = async (admin, active) => {
    setMessage('');
    try {
      await callAdminFunction({ action: 'set-active', userId: admin.user_id, active });
      await refreshAdmins();
      setMessage(`${admin.email} access ${active ? 'restored' : 'revoked'}.`);
    } catch {
      setMessage('Could not update this account. The host account cannot be disabled.');
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0C3440]" />
            <h3 className="text-base font-semibold text-slate-900">Linked Admin Emails</h3>
          </div>
          <p className="mt-1 text-sm text-slate-500">Authorize staff by email. Invitees set their own password using a secure email link.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setMessage('');
            refreshAdmins();
          }}
          disabled={isLoading}
          title="Refresh linked emails"
          aria-label="Refresh linked emails"
          className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-600">Staff name</span>
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            required
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-semibold text-slate-600">Email address</span>
          <input
            type="email"
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
            required
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0C3440]"
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-10 px-4 py-2.5 bg-[#0C3440] text-white text-sm font-semibold rounded-lg hover:bg-[#164957] disabled:opacity-60 inline-flex items-center justify-center gap-2"
        >
          <MailPlus className="w-4 h-4" /> {isSubmitting ? 'Sending...' : 'Authorize & invite'}
        </button>
      </form>

      {message && <p role="status" className="text-sm text-slate-600">{message}</p>}

      <div className="divide-y divide-slate-100 border-y border-slate-100">
        {admins.map((admin) => (
          <div key={admin.user_id} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900">{admin.display_name || admin.email}</p>
              <p className="text-xs text-slate-500">{admin.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium ${admin.active ? 'text-emerald-700' : 'text-slate-500'}`}>
                {admin.active ? 'Authorized' : 'Access paused'}
              </span>
              {admin.email.toLowerCase() !== hostEmail && (
                <button
                  type="button"
                  onClick={() => handleActiveChange(admin, !admin.active)}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                  title={admin.active ? 'Revoke access' : 'Restore access'}
                  aria-label={`${admin.active ? 'Revoke' : 'Restore'} access for ${admin.email}`}
                >
                  <UserRoundX className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        {!admins.length && !isLoading && <p className="py-4 text-sm text-slate-500">No linked admin emails found.</p>}
      </div>
    </section>
  );
}