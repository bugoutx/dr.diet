# Dr.Diet Full-Stack Setup

## Project Structure

```
app/
├── admin/                 # Admin dashboard (protected)
│   ├── login/             # Login page
│   ├── settings/          # Main settings
│   ├── categories/        # Menu categories CRUD
│   ├── meals/             # Meals CRUD
│   ├── hero/              # Hero section (3 slots)
│   ├── plates/            # Our Most-Loved Plates
│   ├── videos/            # Videos (max 5)
│   ├── testimonials/      # Testimonials
│   └── plans/             # Subscription plans
├── api/
│   ├── auth/[...nextauth] # NextAuth handlers
│   └── admin/             # Protected API routes
│       ├── settings/
│       ├── categories/
│       ├── meals/
│       ├── upload/        # Vercel Blob upload
│       └── ...
lib/
├── auth.ts                # NextAuth config
├── auth-utils.ts
└── prisma.ts
prisma/
├── schema.prisma
└── seed.ts
```

## Setup Steps

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
DATABASE_URL="postgresql://..."   # Neon or Supabase
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."            # Run: npx auth secret
BLOB_READ_WRITE_TOKEN="..."      # From Vercel Blob dashboard
```

### 2. Database

```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
```

#### “Can’t reach database server” (Supabase / Prisma)

This is a **network or connection string** issue, not an app bug.

1. **Unpause the project** in [Supabase Dashboard](https://supabase.com/dashboard) → your project (free tier pauses after inactivity).
2. **Use the URI from the dashboard** — Settings → Database → **Connection string** (do not invent `pooler` hostnames or ports).
3. **Local development:** prefer the **Direct connection** string (`db.<ref>.supabase.co`, port `5432`). The pooler on `:5432` or `:6543` can fail from some networks or when the URI mode does not match (session vs transaction pooler).
4. **Transaction pooler** (usually port `6543`, `pgbouncer=true`) is intended for serverless; if you use it for Prisma, follow [Prisma + Supabase](https://www.prisma.io/docs/orm/overview/databases/supabase) and consider a separate `directUrl` for migrations.
5. **Firewall / VPN:** ensure outbound access to Postgres (often `5432` or `6543`) is allowed.
6. **Quick check:** run `npx prisma db pull` — if it cannot connect, the problem is `DATABASE_URL` or network, not the Next.js app.

See `.env.example` for example `DATABASE_URL` shapes.

Default admin: `admin@drdiet.sy` / `admin123` — **change password in production**.

### 3. Static Fallback Assets

Place fallback images/videos in:
- `public/images/` — hero, menu, plates images
- `public/reels/` — video files (reel-1.mp4, etc.)

Primary method: upload via admin to Vercel Blob; URLs stored in DB.

### 4. Run Development

```bash
npm run dev
```

- Landing: http://localhost:3000
- Admin: http://localhost:3000/admin

## Tech Stack

- Next.js 16 App Router + TypeScript + Tailwind
- Prisma + PostgreSQL (Neon/Supabase)
- NextAuth v5 (Credentials provider)
- Vercel Blob for file uploads
