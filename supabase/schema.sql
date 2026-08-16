-- ============================================================================
-- G.GORGEOUS — Supabase schema
--
-- Paste this whole file into  Supabase → SQL Editor → New query → Run.
-- Safe to run once on a fresh project. It creates:
--   · tables for products, orders, reviews, customers and addresses
--   · Row Level Security so customers only ever see their own data
--   · an admin role for the shop owner
--   · a place_order() function so stock is decremented on the server,
--     where the browser cannot tamper with it
--   · a public storage bucket for product photos
-- ============================================================================

-- ---------------------------------------------------------------- extensions
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------ profiles
-- One row per signed-up customer, linked to Supabase's auth.users table.
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  full_name   text,
  phone       text,
  role        text not null default 'customer' check (role in ('customer','admin')),
  created_at  timestamptz not null default now()
);

-- Create the profile row automatically whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'full_name', ''),
          coalesce(new.raw_user_meta_data->>'phone', new.phone, ''));
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Bypasses RLS on purpose (security definer) so admin checks cannot recurse.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- ----------------------------------------------------------------- addresses
create table if not exists public.addresses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  label       text default 'Home',
  address     text not null,
  city        text not null,
  province    text not null,
  postal      text,
  phone       text,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists addresses_user_idx on public.addresses(user_id);

-- ---------------------------------------------------------------- categories
create table if not exists public.categories (
  slug  text primary key,
  name  text not null,
  sort  int  not null default 0
);

insert into public.categories (slug, name, sort) values
  ('three-piece-suits','Three Piece Suits',1),
  ('two-piece-suits',  'Two Piece Suits',  2),
  ('dress-pants',      'Dress Pants',      3),
  ('dress-shirts',     'Dress Shirts',     4),
  ('ties',             'Ties',             5)
on conflict (slug) do nothing;

-- ------------------------------------------------------------------ products
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  sku           text unique,
  name          text not null,
  category_slug text not null references public.categories(slug),
  description   text,
  details       text,
  price         numeric(10,2) not null check (price >= 0),
  sale_price    numeric(10,2) check (sale_price is null or sale_price < price),
  fabric        text, fit text, lining text, care text, origin text,
  featured      boolean not null default false,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);
create index if not exists products_category_idx on public.products(category_slug);

create table if not exists public.product_colors (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products on delete cascade,
  name        text not null,
  hex         text not null,
  sort        int  not null default 0
);

create table if not exists public.product_sizes (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products on delete cascade,
  size        text not null,
  qty         int  not null default 0 check (qty >= 0),
  unique (product_id, size)
);

create table if not exists public.product_media (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products on delete cascade,
  url         text not null,
  kind        text not null default 'image' check (kind in ('image','video')),
  sort        int  not null default 0
);

-- ------------------------------------------------------------------- reviews
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products on delete cascade,
  user_id     uuid references auth.users on delete set null,
  name        text not null,
  rating      int  not null check (rating between 1 and 5),
  title       text,
  body        text not null,
  approved    boolean not null default true,
  created_at  timestamptz not null default now()
);
create index if not exists reviews_product_idx on public.reviews(product_id);

-- -------------------------------------------------------------------- orders
create sequence if not exists public.order_no_seq start 1000;

create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_no        text unique not null default 'GG' || lpad(nextval('public.order_no_seq')::text, 6, '0'),
  user_id         uuid references auth.users on delete set null,
  status          text not null default 'Pending'
                    check (status in ('Pending','Confirmed','Shipped','Delivered','Cancelled')),
  customer_name   text not null,
  customer_email  text not null,
  customer_phone  text not null,
  address         text not null,
  city            text not null,
  province        text not null,
  postal          text,
  notes           text,
  payment_method  text not null,
  payment_status  text not null default 'Unpaid',
  payment_ref     text,
  subtotal        numeric(10,2) not null,
  discount        numeric(10,2) not null default 0,
  promo_code      text,
  shipping        numeric(10,2) not null default 0,
  total           numeric(10,2) not null,
  created_at      timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders(user_id);

create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders on delete cascade,
  product_id  uuid references public.products on delete set null,
  name        text not null,
  sku         text,
  size        text not null,
  color       text,
  qty         int  not null check (qty > 0),
  unit_price  numeric(10,2) not null,
  line_total  numeric(10,2) not null
);
create index if not exists order_items_order_idx on public.order_items(order_id);

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.profiles       enable row level security;
alter table public.addresses      enable row level security;
alter table public.categories     enable row level security;
alter table public.products       enable row level security;
alter table public.product_colors enable row level security;
alter table public.product_sizes  enable row level security;
alter table public.product_media  enable row level security;
alter table public.reviews        enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;

-- profiles: you see and edit only yourself; admins see everyone
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select
  using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

-- A customer may change their name and phone but never their own role,
-- otherwise anyone could promote themselves to admin. Column privileges
-- are the right tool here — RLS policies cannot restrict single columns.
revoke update on public.profiles from authenticated;
grant  update (full_name, phone) on public.profiles to authenticated;

-- addresses: strictly your own
drop policy if exists addresses_all on public.addresses;
create policy addresses_all on public.addresses for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- catalogue: anyone may read, only admins may write
drop policy if exists categories_read on public.categories;
create policy categories_read on public.categories for select using (true);
drop policy if exists categories_write on public.categories;
create policy categories_write on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists products_read on public.products;
create policy products_read on public.products for select using (active or public.is_admin());
drop policy if exists products_write on public.products;
create policy products_write on public.products for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists colors_read on public.product_colors;
create policy colors_read on public.product_colors for select using (true);
drop policy if exists colors_write on public.product_colors;
create policy colors_write on public.product_colors for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists sizes_read on public.product_sizes;
create policy sizes_read on public.product_sizes for select using (true);
drop policy if exists sizes_write on public.product_sizes;
create policy sizes_write on public.product_sizes for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists media_read on public.product_media;
create policy media_read on public.product_media for select using (true);
drop policy if exists media_write on public.product_media;
create policy media_write on public.product_media for all
  using (public.is_admin()) with check (public.is_admin());

-- reviews: anyone reads approved ones, signed-in customers add their own
drop policy if exists reviews_read on public.reviews;
create policy reviews_read on public.reviews for select
  using (approved or public.is_admin() or user_id = auth.uid());
drop policy if exists reviews_insert on public.reviews;
create policy reviews_insert on public.reviews for insert
  with check (auth.uid() is not null and user_id = auth.uid());
drop policy if exists reviews_admin on public.reviews;
create policy reviews_admin on public.reviews for all
  using (public.is_admin()) with check (public.is_admin());

-- orders: customers see only their own, admins see all
drop policy if exists orders_select on public.orders;
create policy orders_select on public.orders for select
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists orders_admin on public.orders;
create policy orders_admin on public.orders for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists order_items_select on public.order_items;
create policy order_items_select on public.order_items for select
  using (exists (select 1 from public.orders o
                 where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));
drop policy if exists order_items_admin on public.order_items;
create policy order_items_admin on public.order_items for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- place_order() — the only way an order is created.
-- Prices and stock are read from the database, never trusted from the browser,
-- so a customer cannot edit the price in dev tools or oversell a size.
-- ============================================================================

create or replace function public.place_order(
  p_items    jsonb,   -- [{product_id, size, color, qty}, ...]
  p_customer jsonb,   -- {name, email, phone, address, city, province, postal, notes}
  p_payment  jsonb,   -- {method, status, ref}
  p_promo    text default null
) returns public.orders
language plpgsql security definer set search_path = public as $$
declare
  v_order     public.orders;
  v_item      jsonb;
  v_product   public.products;
  v_stock     int;
  v_unit      numeric(10,2);
  v_subtotal  numeric(10,2) := 0;
  v_discount  numeric(10,2) := 0;
  v_shipping  numeric(10,2) := 0;
  v_off       numeric := 0;
begin
  if jsonb_array_length(p_items) = 0 then
    raise exception 'Your cart is empty';
  end if;

  -- validate everything first
  for v_item in select * from jsonb_array_elements(p_items) loop
    select * into v_product from public.products
      where id = (v_item->>'product_id')::uuid and active;
    if not found then raise exception 'A product in your cart is no longer available'; end if;

    select qty into v_stock from public.product_sizes
      where product_id = v_product.id and size = v_item->>'size';
    if v_stock is null or v_stock < (v_item->>'qty')::int then
      raise exception 'Not enough stock for % (size %)', v_product.name, v_item->>'size';
    end if;

    v_unit := coalesce(v_product.sale_price, v_product.price);
    v_subtotal := v_subtotal + v_unit * (v_item->>'qty')::int;
  end loop;

  -- promo codes live server-side too
  v_off := case upper(coalesce(p_promo,''))
             when 'GG10' then 0.10 when 'GORGEOUS' then 0.15 when 'SHADI25' then 0.25 else 0 end;
  v_discount := round(v_subtotal * v_off);
  v_shipping := case when (v_subtotal - v_discount) >= 15000 then 0 else 350 end;

  insert into public.orders (
    user_id, customer_name, customer_email, customer_phone,
    address, city, province, postal, notes,
    payment_method, payment_status, payment_ref,
    subtotal, discount, promo_code, shipping, total)
  values (
    auth.uid(),
    p_customer->>'name', p_customer->>'email', p_customer->>'phone',
    p_customer->>'address', p_customer->>'city', p_customer->>'province',
    p_customer->>'postal', p_customer->>'notes',
    p_payment->>'method', coalesce(p_payment->>'status','Unpaid'), p_payment->>'ref',
    v_subtotal, v_discount, nullif(p_promo,''), v_shipping,
    v_subtotal - v_discount + v_shipping)
  returning * into v_order;

  -- write the lines and take the stock down
  for v_item in select * from jsonb_array_elements(p_items) loop
    select * into v_product from public.products where id = (v_item->>'product_id')::uuid;
    v_unit := coalesce(v_product.sale_price, v_product.price);

    insert into public.order_items (order_id, product_id, name, sku, size, color, qty, unit_price, line_total)
    values (v_order.id, v_product.id, v_product.name, v_product.sku,
            v_item->>'size', v_item->>'color', (v_item->>'qty')::int,
            v_unit, v_unit * (v_item->>'qty')::int);

    update public.product_sizes
       set qty = qty - (v_item->>'qty')::int
     where product_id = v_product.id and size = v_item->>'size';
  end loop;

  return v_order;
end $$;

grant execute on function public.place_order(jsonb, jsonb, jsonb, text) to anon, authenticated;

-- ============================================================================
-- Storage bucket for product photos
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists product_images_read on storage.objects;
create policy product_images_read on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists product_images_write on storage.objects;
create policy product_images_write on storage.objects for all
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

-- ============================================================================
-- LAST STEP — make yourself the admin.
-- Sign up on the live site first, then run this with your own email:
--
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'you@example.com');
-- ============================================================================
