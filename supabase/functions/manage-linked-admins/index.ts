import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

function respond(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return respond({ error: 'Method not allowed.' }, 405);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const hostEmail = Deno.env.get('HOST_ADMIN_EMAIL')?.trim().toLowerCase();
  const siteUrl = Deno.env.get('SITE_URL')?.trim().replace(/\/+$/, '');
  const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');

  if (!supabaseUrl || !serviceRoleKey || !hostEmail || !siteUrl) {
    return respond({ error: 'Admin invitation service is not configured.' }, 503);
  }
  if (!token) return respond({ error: 'Authentication is required.' }, 401);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  const caller = userData.user;
  if (authError || !caller) return respond({ error: 'Your session is invalid or expired.' }, 401);
  if (caller.email?.trim().toLowerCase() !== hostEmail) {
    return respond({ error: 'Only the configured host email can manage linked admins.' }, 403);
  }

  let body: { action?: string; email?: string; displayName?: string; userId?: string; active?: boolean };
  try {
    body = await request.json();
  } catch {
    return respond({ error: 'A valid request body is required.' }, 400);
  }

  if (body.action === 'list') {
    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id, email, display_name, active, created_at')
      .order('created_at', { ascending: true });
    if (error) return respond({ error: 'Could not load linked admin accounts.' }, 500);
    return respond({ admins: data || [] });
  }

  if (body.action === 'invite') {
    const email = body.email?.trim().toLowerCase();
    const displayName = body.displayName?.trim() || '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return respond({ error: 'Enter a valid email address.' }, 400);
    }
    if (email === hostEmail) return respond({ error: 'The host email is already authorized.' }, 409);

    const { data: existingAdmin, error: existingAdminError } = await supabase
      .from('admin_users')
      .select('user_id, active')
      .eq('email', email)
      .maybeSingle();
    if (existingAdminError) return respond({ error: 'Could not check existing admin access.' }, 500);
    if (existingAdmin?.active) return respond({ invitationSent: false, alreadyAuthorized: true });

    let existingUser = null;
    for (let page = 1; !existingUser; page += 1) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) return respond({ error: 'Could not check the authentication account.' }, 500);
      existingUser = data.users.find((user) => user.email?.toLowerCase() === email) || null;
      if (existingUser || data.users.length < 1000) break;
    }

    let userId = existingUser?.id;
    let invitationSent = false;
    const anonKey = Deno.env.get('PUBLIC_SUPABASE_KEY');
    if (existingUser && !anonKey) {
      return respond({ error: 'Password setup email is not configured for existing accounts.' }, 503);
    }

    if (!userId) {
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
        data: { display_name: displayName },
        redirectTo: `${siteUrl}/?set-password=1`
      });
      if (error || !data.user) return respond({ error: 'Supabase could not send the invitation email.' }, 400);
      userId = data.user.id;
      invitationSent = true;
    }

    const { error: saveError } = await supabase
      .from('admin_users')
      .upsert({ user_id: userId, email, display_name: displayName, active: true }, { onConflict: 'email' });
    if (saveError) {
      if (invitationSent) await supabase.auth.admin.deleteUser(userId);
      return respond({ error: 'The account invitation was created, but access could not be recorded.' }, 500);
    }

    let passwordSetupSent = invitationSent;
    if (existingUser) {
      const publicClient = createClient(supabaseUrl, anonKey!, {
        auth: { autoRefreshToken: false, persistSession: false }
      });
      const { error } = await publicClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/?set-password=1`
      });
      if (error) {
        await supabase.from('admin_users').update({ active: existingAdmin?.active || false }).eq('email', email);
        return respond({ error: 'The email was found, but Supabase could not send its password setup link.' }, 400);
      }
      passwordSetupSent = true;
    }

    return respond({ invitationSent, passwordSetupSent, alreadyAuthorized: false });
  }

  if (body.action === 'set-active') {
    if (!body.userId || typeof body.active !== 'boolean') {
      return respond({ error: 'A user and access status are required.' }, 400);
    }
    const { data: target, error: targetError } = await supabase
      .from('admin_users')
      .select('email')
      .eq('user_id', body.userId)
      .maybeSingle();
    if (targetError || !target) return respond({ error: 'The linked admin account was not found.' }, 404);
    if (!body.active && target.email.toLowerCase() === hostEmail) {
      return respond({ error: 'The host account cannot be disabled here.' }, 403);
    }

    const { error } = await supabase
      .from('admin_users')
      .update({ active: body.active })
      .eq('user_id', body.userId);
    if (error) return respond({ error: 'Could not update admin access.' }, 500);
    return respond({ success: true });
  }

  return respond({ error: 'Unknown admin management action.' }, 400);
});