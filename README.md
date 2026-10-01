# Trade Seekerz

Trade Seekerz is a New Zealand marketplace for homeowners and tradespeople. This single Next.js application contains the public website, homeowner workflow, tradesperson workflow, and role-protected admin workspace.

## Included

- Marketing pages, trade discovery, pricing, legal, privacy, and support
- Email/password and Google authentication through Supabase Auth
- Homeowner project posting, R2 media uploads, quote/application data model, and messaging
- Tradesperson profiles, memberships, lead credits, project discovery, and billing portal
- Admin operations UI for moderation, users, projects, and billing health
- Stripe Checkout, Billing Portal, signed webhooks, and idempotent credit allocation
- Supabase Postgres with row-level security, role-safe registration, and audit-friendly billing tables
- Private Cloudflare R2 media storage using short-lived signed PUT/GET URLs

## Local setup

Use Node.js 20 or later.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The following preview URLs work without seeded accounts:

- `/dashboard?demo=homeowner`
- `/dashboard?demo=tradesperson`
- `/admin?demo=1`

## Environment variables

### Supabase

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` — server-only secret used by Stripe webhooks

### Stripe

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_STARTER_MONTHLY_PRICE_ID`
- `STRIPE_STARTER_ANNUAL_PRICE_ID`
- `STRIPE_PRO_MONTHLY_PRICE_ID`
- `STRIPE_PRO_ANNUAL_PRICE_ID`

Send these Stripe events to `/api/stripe/webhook`:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`

### Cloudflare R2

- `CLOUDFLARE_R2_ACCOUNT_ID`
- `CLOUDFLARE_R2_ACCESS_KEY_ID`
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY`
- `CLOUDFLARE_R2_BUCKET`

Create one private R2 bucket and an Object Read & Write API token scoped only to that bucket. Configure bucket CORS for direct browser uploads:

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://your-production-domain.co.nz"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["Content-Type"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

Do not make the bucket public. The app grants access using short-lived signed URLs after checking Supabase row-level permissions.

## Database

Migrations are in `supabase/migrations`. They have been applied to the connected Trade Seekerz Supabase project. For another project, run them in filename order with the Supabase CLI.

## Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
```

