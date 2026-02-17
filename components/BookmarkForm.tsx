'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { Plus, Link as LinkIcon, Loader2 } from 'lucide-react'

export default function BookmarkForm() {
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        // Basic URL validation
        try {
            new URL(url)
        } catch {
            setError('Please enter a valid URL (e.g., https://example.com)')
            setIsSubmitting(false)
            return
        }

        if (!title.trim()) {
            setError('Please enter a title')
            setIsSubmitting(false)
            return
        }

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            setError('You must be logged in to add bookmarks')
            setIsSubmitting(false)
            return
        }

        const { error: dbError } = await supabase
            .from('bookmarks')
            .insert([
                { title, url, user_id: user.id }
            ])

        if (dbError) {
            setError(dbError.message)
        } else {
            setTitle('')
            setUrl('')
        }

        setIsSubmitting(false)
    }

    return (
        <div className="w-full max-w-2xl mx-auto mb-12">
            <form
                onSubmit={handleSubmit}
                className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium text-zinc-400 ml-1">Title</label>
                        <input
                            id="title"
                            type="text"
                            placeholder="e.g. Next.js Documentation"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="url" className="text-sm font-medium text-zinc-400 ml-1">URL</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                            <input
                                id="url"
                                type="text"
                                placeholder="https://nextjs.org"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <p className="text-red-400 text-sm px-1">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Add Bookmark
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}
