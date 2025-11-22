-- Enable RLS
alter table public.categoriasmenu enable row level security;

-- Policy for SELECT, UPDATE, DELETE, INSERT
-- We use a single policy for simplicity, or split if needed.
-- For simplicity in this context, let's create a policy that covers all operations
-- where the user owns the restaurant associated with the category.

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
