import { createBrowserClient } from '@supabase/ssr'

// Use a singleton pattern for the browser client to prevent multiple 
// connections in production environments.
let client: ReturnType<typeof createBrowserClient> | undefined

export function createClient() {
  if (client) return client

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return client
}
