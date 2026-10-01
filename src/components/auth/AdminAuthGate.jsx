import { useEffect, useState } from 'react';
import { Eye, EyeOff, LogOut } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { AdminAuthContext } from '../../lib/adminAuthContext';

function SetupRequired() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Supabase setup required</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the project-root .env.local file, then restart the development server.
        </p>
      </section>
    </main>
  );
}

export default function AdminAuthGate({ children }) {
  const [session, setSession] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [status, setStatus] = useState('loading');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [requiresPasswordSetup, setRequiresPasswordSetup] = useState(() => new URLSearchParams(window.location.search).get('set-password') === '1');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    let isMounted = true;
    const checkAdmin = async (nextSession) => {
      if (!nextSession) {
        if (isMounted) {
          setSession(null);
          setAdmin(null);
          setStatus('signed-out');
        }
        return;
      }

      if (isMounted) {
        setSession(nextSession);
        setStatus('checking-admin');
      }

      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id, email, display_name, active')
        .eq('user_id', nextSession.user.id)
        .maybeSingle();

      if (!isMounted) return;
      if (error) {
        setAdmin(null);
        setStatus('access-error');
        setMessage('Could not verify admin access. Check the database migration and connection, then try again.');
      } else if (!data?.active) {
        setAdmin(null);
        setStatus('denied');
      } else {
        setAdmin(data);
        setStatus('authorized');
      }
    };

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setStatus('access-error');
        setMessage('Could not connect to Supabase. Check the project URL and publishable key.');
      } else {
        checkAdmin(data.session);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      window.setTimeout(() => checkAdmin(nextSession), 0);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setIsSubmitting(false);

    if (error) {
      setMessage('Sign-in failed. Check your email and password, then try again.');
      return;
    }

    setSession(data.session);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setAdmin(null);
    setSession(null);
    setStatus('signed-out');
  };

  const handleSetPassword = async (event) => {
    event.preventDefault();
    setMessage('');
    if (password.length < 12) {
      setMessage('Use at least 12 characters for your password.');
      return;
    }
    if (password !== passwordConfirmation) {
      setMessage('The passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsSubmitting(false);
    if (error) {
      setMessage('Could not set your password. Reopen the invitation link and try again.');
      return;
    }

    window.history.replaceState({}, document.title, window.location.pathname);
    setPassword('');
    setPasswordConfirmation('');
    setRequiresPasswordSetup(false);
  };

  const updateAdminProfile = async (profile) => {
    const { error } = await supabase.auth.updateUser({ data: profile });
    if (error) throw error;
  };

  if (!isSupabaseConfigured) return <SetupRequired />;

  if (status === 'loading' || status === 'checking-admin') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div role="status" aria-label="Connecting securely" className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600" />
      </main>
    );
  }

  if (status === 'authorized') {
    if (requiresPasswordSetup) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#f4f8f7] p-6">
          <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-900/5">
            <div className="mb-6 flex items-center gap-3">
              <img src="/tumaini-logo.svg" alt="Tumaini Children's Village" className="h-12 w-12 shrink-0" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#0C3440]">Children's Home Portal</p>
                <h1 className="mt-0.5 text-lg font-semibold text-slate-900">Create your password</h1>
                <p className="text-sm text-slate-500">Set a password for your Tumaini account.</p>
              </div>
            </div>
            <form onSubmit={handleSetPassword} className="space-y-4">
              <label className="block space-y-1.5 text-sm font-medium text-slate-700">
                New password
                <span className="relative block">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    minLength={12}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-11 w-full rounded-lg border border-slate-300 pl-3 pr-11 font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                  />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-1 flex w-9 items-center justify-center text-slate-500 hover:text-[#0C3440]">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>
              <label className="block space-y-1.5 text-sm font-medium text-slate-700">
                Confirm password
                <span className="relative block">
                  <input
                    type={showPasswordConfirmation ? 'text' : 'password'}
                    autoComplete="new-password"
                    minLength={12}
                    required
                    value={passwordConfirmation}
                    onChange={(event) => setPasswordConfirmation(event.target.value)}
                    className="h-11 w-full rounded-lg border border-slate-300 pl-3 pr-11 font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                  />
                  <button type="button" onClick={() => setShowPasswordConfirmation((visible) => !visible)} aria-label={showPasswordConfirmation ? 'Hide confirmation password' : 'Show confirmation password'} className="absolute inset-y-0 right-1 flex w-9 items-center justify-center text-slate-500 hover:text-[#0C3440]">
                    {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>
              {message && <p role="alert" className="text-sm text-rose-700">{message}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-10 w-full rounded-md bg-brand-primary px-4 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
              >
                {isSubmitting ? 'Saving password...' : 'Create password'}
              </button>
            </form>
          </section>
        </main>
      );
    }

    return (
      <AdminAuthContext.Provider value={{ user: session.user, admin, updateAdminProfile }}>
        <div>
          <div className="flex items-center justify-end gap-3 border-b border-slate-200 bg-white px-4 py-2 text-xs text-slate-600">
            <span>{session.user.user_metadata?.display_name || admin.display_name || admin.email}</span>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded px-2 py-1 font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
          {children}
        </div>
      </AdminAuthContext.Provider>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-900/5">
        <div className="mb-6 flex items-center gap-3">
          <img src="/tumaini-logo.svg" alt="Tumaini Children's Village" className="h-12 w-12 shrink-0" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#0C3440]">Children's Home Portal</p>
            <h1 className="mt-0.5 text-lg font-semibold text-slate-900">Admin sign in</h1>
            <p className="text-sm text-slate-500">Secure access for authorized staff</p>
          </div>
        </div>

        {status === 'denied' ? (
          <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            This account is not an active admin. Ask the project owner to grant access.
          </p>
        ) : (
          <form onSubmit={handleSignIn} className="space-y-4">
            <label className="block space-y-1.5 text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 w-full rounded-lg border border-slate-300 px-3 font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
              />
            </label>
            <label className="block space-y-1.5 text-sm font-medium text-slate-700">
              Password
              <span className="relative block">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-300 pl-3 pr-11 font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-1 flex w-9 items-center justify-center text-slate-500 hover:text-[#0C3440]">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </label>
            {message && <p role="alert" className="text-sm text-rose-700">{message}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        )}

        {status === 'access-error' && !message && (
          <p role="alert" className="mt-4 text-sm text-rose-700">
            Unable to verify account access.
          </p>
        )}

        {status === 'access-error' && session && (
          <button onClick={handleSignOut} className="mt-4 text-sm font-semibold text-slate-600 hover:text-slate-900">
            Sign out and try another account
          </button>
        )}
      </section>
    </main>
  );
}