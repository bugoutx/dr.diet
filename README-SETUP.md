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
