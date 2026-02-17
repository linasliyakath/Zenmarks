import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import { LogOut, LayoutDashboard, User } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Navigation Header */}
      <nav className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                ZenMarks
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
                <User className="w-4 h-4 text-zinc-500" />
                <span className="text-xs font-medium text-zinc-400">
                  {user.email}
                </span>
              </div>

              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all border border-transparent hover:border-zinc-800"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-white">
            Your Digital Vault
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            Organize your online life with ZenMarks. Simple, private, and always
            in sync.
          </p>
        </header>

        <BookmarkForm />

        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Saved Bookmarks</h2>
            <div className="h-px flex-1 bg-zinc-900 mx-6 hidden md:block" />
          </div>
          <BookmarkList />
        </div>
      </main>

      <footer className="py-12 border-t border-zinc-900 mt-20 text-center">
        <p className="text-zinc-600 text-sm">
          Built with Next.js, Supabase & Tailwind CSS
        </p>
      </footer>
    </div>
  );
}
