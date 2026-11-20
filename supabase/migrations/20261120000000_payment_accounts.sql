-- Төлбөрийн данс (QPay холбогдох хүртэл админ гараар оруулна)
create table if not exists public.payment_accounts (
  id uuid primary key default gen_random_uuid(),
  bank_name text not null check (char_length(bank_name) between 1 and 200),
  account_holder text not null check (char_length(account_holder) between 1 and 200),
  account_number text not null check (char_length(account_number) between 1 and 64),
  iban text check (iban is null or char_length(iban) <= 64),
  description text check (description is null or char_length(description) <= 1000),
  qr_image_url text check (qr_image_url is null or char_length(qr_image_url) <= 2048),
  is_active boolean not null default true,
  sort_order integer not null default 9999,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_accounts_active_sort_idx
  on public.payment_accounts (is_active, sort_order);

alter table public.payment_accounts enable row level security;

-- Вебсайт: зөвхөн идэвхтэй дансыг харна
drop policy if exists "payment_accounts public read" on public.payment_accounts;
create policy "payment_accounts public read"
  on public.payment_accounts for select
  to anon, authenticated
  using (is_active = true);

-- Админ: бүх үйлдэл
drop policy if exists "payment_accounts admin all" on public.payment_accounts;
create policy "payment_accounts admin all"
  on public.payment_accounts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.payment_accounts to anon, authenticated;
grant insert, update, delete on public.payment_accounts to authenticated;

-- QR зургийг одоо байгаа "site-assets" bucket-ийн "payment-qr/" хавтсанд хадгална.
-- Хэрэв site-assets bucket-ийн storage policy зөвхөн тодорхой хавтас (logos/, hero/)
-- зөвшөөрдөг бол "payment-qr/" хавтсыг нэмж зөвшөөрнө үү.
