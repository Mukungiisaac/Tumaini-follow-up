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
      .catch((error) => {
        console.error('Failed to load linked admins:', error);
        if (isMounted) {
          setMessage('Could not load linked email access. The Supabase Edge Function may not be deployed. See deployment instructions below.');
        }
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
    setMessage('');
    try {
      const data = await callAdminFunction({ action: 'list' });
      setAdmins(data.admins || []);
      if ((data.admins || []).length === 0) {
        setMessage('No linked admin emails found yet. Use the form above to authorize staff members.');
      }
    } catch (error) {
      console.error('Failed to refresh admins:', error);
      setMessage('Could not load linked email access. The Supabase Edge Function may not be deployed. See deployment instructions below.');
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
    } catch (error) {
      console.error('Failed to invite admin:', error);
      setMessage('Could not authorize this email. Check the Supabase Edge Function deployment and configuration.');
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
    } catch (error) {
      console.error('Failed to update admin status:', error);
      setMessage('Could not update this account. The host account cannot be disabled, or the function is not deployed.');
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

      {message && (
        <div className={`text-sm p-4 rounded-lg border ${message.includes('Could not') ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
          <p role="status" className="font-medium">{message}</p>
          {message.includes('Could not') && (
            <details className="mt-3 text-xs space-y-2">
              <summary className="cursor-pointer font-semibold text-amber-900 hover:text-amber-700">Show deployment instructions</summary>
              <div className="mt-2 p-3 bg-white rounded border border-amber-200 space-y-2">
                <p className="font-semibold">Deploy the Edge Function:</p>
                <pre className="bg-slate-900 text-slate-100 p-2 rounded overflow-x-auto">
                  supabase functions deploy manage-linked-admins --project-ref YOUR_PROJECT_REF
                </pre>
                <p className="font-semibold mt-3">Configure secrets:</p>
                <pre className="bg-slate-900 text-slate-100 p-2 rounded overflow-x-auto text-xs">
{`supabase secrets set \\
  HOST_ADMIN_EMAIL=tumainicomprehensive@gmail.com \\
  SITE_URL=http://localhost:5174 \\
  PUBLIC_SUPABASE_KEY=YOUR_ANON_KEY \\
  SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY \\
  --project-ref YOUR_PROJECT_REF`}
                </pre>
                <p className="mt-2 text-amber-800">
                  <strong>Note:</strong> Replace YOUR_PROJECT_REF with your Supabase project reference (found in Project Settings).
                  For production, use your actual site URL instead of localhost.
                </p>
              </div>
            </details>
          )}
        </div>
      )}

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