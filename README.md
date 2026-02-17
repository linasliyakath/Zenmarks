# ZenMarks - Smart Bookmark App

A production-ready bookmark manager built with Next.js (App Router), Supabase, and Tailwind CSS.

## Features
- **Google OAuth**: One-click login with Google.
- **Private Bookmarks**: Row Level Security (RLS) ensures users only see their own data.
- **Real-Time Sync**: Updates automatically across multiple tabs using Supabase Realtime.
- **Optimistic UI**: Snappy deletion for a seamless experience.
- **Premium Design**: Modern dark theme with smooth transitions.

## Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React

## Getting Started

### 1. Clone & Install
```bash
npm install
```

### 2. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** and run the contents of `supabase_schema.sql` to set up the table and RLS policies.
3. Go to **Authentication > Providers** and enable **Google**.
   - You will need to set up a Google Cloud Project to get the Client ID and Secret.
   - Set the Redirect URI to `https://<YOUR_PROJECT_ID>.supabase.co/auth/v1/callback`.
4. Go to **Project Settings > API** and get your Project URL and Anon Key.

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run Locally
```bash
npm run dev
```

## Folder Structure
- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components.
- `lib/`: Shared utilities (Supabase browser client).
- `utils/`: Server-side and Middleware Supabase clients.
- `proxy.ts`: protects the `/dashboard` route (Next.js 16 convention).
- `supabase_schema.sql`: Database schema and RLS policies.
