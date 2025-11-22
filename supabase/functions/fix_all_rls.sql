-- 1. Fix RESTAURANTES table
alter table public.restaurantes enable row level security;

-- Allow users to select/insert/update/delete their own restaurant
create policy "Users can manage their own restaurant"
on public.restaurantes
for all
using (auth.uid() = usuario_id)
with check (auth.uid() = usuario_id);

-- 2. Fix CATEGORIASMENU table
alter table public.categoriasmenu enable row level security;

-- Drop existing policy to avoid conflicts/duplication
drop policy if exists "Owners can manage their categories" on public.categoriasmenu;

-- Allow owners to manage categories linked to their restaurant
create policy "Owners can manage their categories"
on public.categoriasmenu
for all
using (
  exists (
    select 1 from public.restaurantes
    where restaurante_id = categoriasmenu.restaurante_id
    and usuario_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.restaurantes
    where restaurante_id = categoriasmenu.restaurante_id
    and usuario_id = auth.uid()
  )
);
