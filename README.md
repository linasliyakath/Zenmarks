# ZenMarks - Smart Bookmark App

A production-ready bookmark manager built with Next.js 16, Supabase, and Tailwind CSS.

## 🚀 Key Features
- **One-Tap Google Auth**: Secure login via Google OAuth only.
- **Private Vault**: Row Level Security (RLS) ensures users only see their own bookmarks.
- **Real-Time Sync**: Instant updates across all open tabs without refreshing.
- **Next.js 16 'Proxy' Architecture**: Correctly implemented for the latest Next.js conventions.
- **Optimistic UI**: Snappy deletion for a premium user experience.

---

## 🛠️ Troubleshooting & Dev Log (Challenges & Solutions)

During development and deployment, several advanced technical hurdles were encountered. Here is how I solved them:

### 1. Next.js 16 Middleware Deprecation (`proxy.ts`)
- **Problem**: Next.js 16 threw warnings that `middleware.ts` is deprecated.
- **Solution**: I shifted to the new **`proxy.ts`** architecture. I renamed the file and updated the export to `export default async function proxy(request: NextRequest)` to comply with the latest framework standards.

### 2. OAuth "Unsupported Provider" & Redirect Mismatches
- **Problem**: Google login failed initially with 400 errors or "Redirect URI Mismatch".
- **Solution**: 
  - Verified that Google Provider was enabled in the Supabase Dashboard.
  - Corrected the **Authorized Redirect URI** in the Google Cloud Console to point to the Supabase Auth URL (not the application URL).
  - Ensured the `auth/callback` route was correctly exchanging the code for a session.

### 3. Production Real-Time Sync Lag (The "Refresh" Issue)
- **Problem**: Bookmarks worked on localhost but required a manual refresh in production (Vercel).
- **Solution**: 
  - **Singleton Pattern**: I updated `lib/supabaseClient.ts` to use a singleton pattern, preventing multiple 'zombie' websocket connections from being created in a production environment.
  - **Session-First Subscription**: I refactored `BookmarkList.tsx` to ensure the application waits for the initial data fetch (which verifies the user session) before initiating the Real-Time channel. This prevents Supabase from seeing the connection as "Anonymous" and blocking the stream.
  - **Replication Identity**: I modified the database to use `REPLICA IDENTITY FULL`, ensuring that every data change (Update/Delete) transmits the full object to the client.

### 4. Database Schema Cache Errors
- **Problem**: "Could not find table public.bookmarks".
- **Solution**: Created a comprehensive `supabase_schema.sql` to initialize the table and RLS policies correctly in a single run.

---

## 🛠️ Getting Started

### 1. Supabase Setup
- Create a project on [Supabase](https://supabase.com).
- Run the code in `supabase_schema.sql` in your SQL Editor.
- Enable **Google Auth** in Providers.
- Set **Site URL** to your deployment URL and add `https://your-project.supabase.co/auth/v1/callback` to Google Cloud Redirect URIs.

### 2. Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Install & Run
```bash
npm install
npm run dev
```

---

## 📂 Folder Structure
- `app/`: Next.js 16 App Router & API routes.
- `components/`: UI logic (Forms, List, Real-time).
- `lib/`: Supabase browser client (Singleton).
- `utils/`: Server-side & Middleware logic.
- `proxy.ts`: Global route protection.
- `supabase_schema.sql`: Database initialization script.
