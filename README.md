# ZenMarks - Smart Bookmark App

A production-ready bookmark manager built with Next.js 16, Supabase, and Tailwind CSS.

[![Live Demo](https://img.shields.io/badge/Live-Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://zenmarks-ecru.vercel.app/)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Auth-Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Production Ready](https://img.shields.io/badge/Status-Production_Ready-00C853?style=for-the-badge)

---

## Live Demo

https://zenmarks-ecru.vercel.app/

---

## 🚀 Key Features

- **One-Tap Google Auth** – Secure login via Google OAuth only
- **Private Vault** – Row Level Security (RLS) ensures users only see their own bookmarks
- **Real-Time Sync** – Instant updates across all open tabs without refreshing
- **Next.js 16 Proxy Architecture** – Implemented using `proxy.ts`
- **Optimistic UI** – Snappy deletion for a premium user experience

---

## 🛠 Troubleshooting & Dev Log (Challenges & Solutions)

During development and deployment, several advanced technical hurdles were encountered and resolved.

### 1. Next.js 16 Middleware Deprecation (`proxy.ts`)

**Problem:**  
Next.js 16 deprecated `middleware.ts`.

**Solution:**  
Migrated to the new `proxy.ts` architecture:

```ts
export default async function proxy(request: NextRequest)
```

---

### 2. OAuth "Unsupported Provider" & Redirect Mismatches

**Problem:**  
Google login initially failed with 400 errors and redirect URI mismatches.

**Solution:**
- Enabled Google provider in Supabase dashboard
- Correctly configured Authorized Redirect URI in Google Cloud Console
- Ensured `auth/callback` properly exchanged the code for a session

---

### 3. Production Real-Time Sync Lag (The “Refresh” Issue)

**Problem:**  
Real-time worked locally but required refresh in production.

**Solution:**
- Implemented a Supabase client **singleton pattern**
- Refactored to ensure **session-first subscription**
- Set database to `REPLICA IDENTITY FULL` for complete change payloads

---

### 4. Database Schema Cache Errors

**Problem:**  
`Could not find table public.bookmarks`

**Solution:**  
Created a complete `supabase_schema.sql` file to initialize:
- Table structure
- RLS policies
- Required database configuration

---

## 🛠 Getting Started

### 1. Supabase Setup

- Create a project on Supabase
- Run `supabase_schema.sql` in the SQL Editor
- Enable **Google Auth** under Providers
- Set Site URL to:

```
https://zenmarks-ecru.vercel.app/
```

- Add redirect URI in Google Cloud Console:

```
https://omyegkwwnchesvnbcyjw.supabase.co/auth/v1/callback
```

---

### 2. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://omyegkwwnchesvnbcyjw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

### 3. Install & Run

```bash
npm install
npm run dev
```

---

## 📂 Folder Structure

```
app/                # Next.js 16 App Router & API routes
components/         # UI logic (Forms, List, Real-time)
lib/                # Supabase browser client (Singleton)
utils/              # Server-side & Middleware logic
proxy.ts            # Global route protection
supabase_schema.sql # Database initialization script
```

---

## 📌 Architecture Overview

```
Client (Next.js 16 App Router)
        ↓
Supabase Auth (Google OAuth)
        ↓
PostgreSQL (RLS Enforced)
        ↓
Realtime WebSocket Channel
```

Security is enforced at the **database level**, not just the frontend.

---

## 👨‍💻 Author

Linas Liyakath  
Full-Stack Developer  
Focused on authentication systems, scalable architecture, and real-time applications.
