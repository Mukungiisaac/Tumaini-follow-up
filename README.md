# React + Vite

## Host-Managed Admin Access

The configured host email can authorize staff accounts from **Settings → Linked Admin Emails**. New addresses receive a Supabase invitation link and create their own password; passwords are never created or sent by the host.

Configure `VITE_HOST_ADMIN_EMAIL` in the app's `.env.local` to match the active host admin account. Deploy the invitation function and set its server-side secrets:

```sh
supabase functions deploy manage-linked-admins --project-ref <project-ref>
supabase secrets set HOST_ADMIN_EMAIL=<host-email> SITE_URL=<portal-origin> PUBLIC_SUPABASE_KEY=<publishable-key> SUPABASE_SERVICE_ROLE_KEY=<service-role-key> --project-ref <project-ref>
```

Keep the service-role key only in Supabase secrets. Never add it to a `VITE_` variable or commit it to the repository. Configure Supabase Auth's allowed redirect URLs to include `<portal-origin>/?set-password=1`. The host email must already have an active row in `public.admin_users`.

For local use, set `SITE_URL` to the Vite origin, such as `http://localhost:5173`, and add that callback URL to Supabase Auth's redirect allowlist.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
