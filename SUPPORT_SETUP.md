# COKELAT MANIS Support Setup

## Supabase

Run `supabase-support.sql` in the Supabase SQL Editor for the same project used by the site.

## Vercel Environment Variables

Use the same Midtrans/Supabase variables as UAS, plus:

```env
SUPPORT_ADMIN_PASSWORD=ganti-password-support
SUPPORT_RESEND_FROM_EMAIL=COKELAT MANIS <admin@domainmu.com>
```

If `SUPPORT_ADMIN_PASSWORD` is empty, the dashboard falls back to `UAS_ADMIN_PASSWORD`.

## Midtrans

You do not have to replace the global Midtrans notification URL if the same Midtrans account is also used by UAS or another site. Each support checkout sends this per-transaction override:

```text
https://zkaofldk.vercel.app/api/support-midtrans-webhook
```

The override is sent through `X-Override-Notification` when `SITE_URL` is set. If you later want one global Midtrans notification URL for every product, make a small webhook router first.

## Pages

- Public support page: `/support/`
- Dashboard: `/support/dashboard/`
- Alert overlay: `/support/overlay/alert/`
- Milestone overlay: `/support/overlay/milestone/`
- Leaderboard overlay: `/support/overlay/leaderboard/`
