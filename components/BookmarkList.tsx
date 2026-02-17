'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { Trash2, ExternalLink, Bookmark as BookmarkIcon, Loader2 } from 'lucide-react'

type Bookmark = {
    id: string
    title: string
    url: string
    created_at: string
}

export default function BookmarkList() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchBookmarks()

        // Subscribe to realtime changes
        const channel = supabase
            .channel('bookmarks-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((prev) => [payload.new as Bookmark, ...prev])
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
                    } else if (payload.eventType === 'UPDATE') {
                        setBookmarks((prev) =>
                            prev.map((b) => (b.id === payload.new.id ? (payload.new as Bookmark) : b))
                        )
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const fetchBookmarks = async () => {
        const { data, error } = await supabase
            .from('bookmarks')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching bookmarks:', error)
        } else {
            setBookmarks(data || [])
        }
        setIsLoading(false)
    }

    const handleDelete = async (id: string) => {
        // Optimistic update
        const previousBookmarks = [...bookmarks]
        setBookmarks((prev) => prev.filter((b) => b.id !== id))

        const { error } = await supabase.from('bookmarks').delete().eq('id', id)

        if (error) {
            console.error('Error deleting bookmark:', error)
            // Rollback on error
            setBookmarks(previousBookmarks)
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <p className="text-zinc-500 animate-pulse">Loading your bookmarks...</p>
            </div>
        )
    }

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800/50 rounded-3xl border-dashed">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4">
                    <BookmarkIcon className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-300">No bookmarks yet</h3>
                <p className="text-zinc-500 mt-2">Add your first bookmark to get started!</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
                <div
                    key={bookmark.id}
                    className="group bg-zinc-950 border border-zinc-900 hover:border-blue-500/50 hover:bg-zinc-900/50 transition-all rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-lg"
                >
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    <div className="relative z-10 flex-1">
                        <h3 className="text-lg font-bold text-zinc-100 group-hover:text-blue-400 transition-colors line-clamp-1 mb-2">
                            {bookmark.title}
                        </h3>
                        <p className="text-sm text-zinc-500 line-clamp-2 break-all mb-4">
                            {bookmark.url}
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center justify-between pt-4 border-t border-zinc-800/50 mt-4">
                        <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                        >
                            Visit Secret <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                            onClick={() => handleDelete(bookmark.id)}
                            className="p-2 rounded-lg text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
                            title="Delete Bookmark"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
