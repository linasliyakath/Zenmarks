-- Create bookmarks table
create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  url text not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.bookmarks enable row level security;

-- Create policies
create policy "Users can select their own bookmarks"
on public.bookmarks for select
using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks"
on public.bookmarks for insert
with check (auth.uid() = user_id);

create policy "Users can update their own bookmarks"
on public.bookmarks for update
using (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
on public.bookmarks for delete
using (auth.uid() = user_id);

-- Enable realtime for the table
alter publication supabase_realtime add table bookmarks;
