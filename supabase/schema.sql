-- CRM B2B schema for Supabase
-- This file is intended to be run through the Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid null,
  role text not null default 'member' check (role in ('admin', 'manager', 'member', 'customer')),
  display_name text not null,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_organization_id_idx
  on public.profiles (organization_id);

create index if not exists profiles_customer_id_idx
  on public.profiles (customer_id);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id text not null,
  name text not null,
  email text,
  phone text,
  document text,
  status text not null default 'active' check (status in ('active', 'inactive', 'blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, customer_id)
);

create index if not exists customers_organization_id_idx
  on public.customers (organization_id);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  name text not null,
  email text,
  phone text,
  role text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contacts_customer_id_idx
  on public.contacts (customer_id);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  number text not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'rejected', 'expired', 'cancelled')),
  expires_at timestamptz,
  subtotal numeric(18,2) not null default 0,
  discount numeric(18,2) not null default 0,
  total numeric(18,2) not null default 0,
  currency text not null default 'BRL' check (currency = any (array['BRL', 'USD', 'EUR'])),
  notes text,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, number)
);

create index if not exists quotes_customer_id_idx
  on public.quotes (customer_id);

create index if not exists quotes_status_idx
  on public.quotes (status);

create table if not exists public.quote_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  quote_id uuid not null references public.quotes (id) on delete cascade,
  description text not null,
  quantity numeric(18,3) not null check (quantity > 0),
  unit_price numeric(18,2) not null check (unit_price >= 0),
  amount numeric(18,2) not null check (amount >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists quote_items_quote_id_idx
  on public.quote_items (quote_id);

create table if not exists public.tracking_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  quote_id uuid null references public.quotes (id) on delete set null,
  event_type text not null check (event_type in ('created', 'sent', 'viewed', 'accepted', 'rejected', 'payment_received', 'cancelled')),
  status text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid null references auth.users (id),
  created_at timestamptz not null default now()
);

create index if not exists tracking_events_quote_id_idx
  on public.tracking_events (quote_id);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  quote_id uuid null references public.quotes (id) on delete set null,
  provider text not null,
  external_id text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  amount numeric(18,2) not null check (amount > 0),
  currency text not null default 'BRL' check (currency = any (array['BRL', 'USD', 'EUR'])),
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, external_id)
);

create index if not exists payments_customer_id_idx
  on public.payments (customer_id);

create table if not exists public.bot_conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  customer_id uuid not null references public.customers (id) on delete cascade,
  quote_id uuid null references public.quotes (id) on delete set null,
  status text not null default 'open' check (status in ('open', 'waiting', 'closed')),
  summary text,
  created_by uuid null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bot_conversations_customer_id_idx
  on public.bot_conversations (customer_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_organization_id()
returns uuid
language sql
stable
set search_path = public, pg_catalog
as $$
  select coalesce((auth.jwt() ->> 'organization_id')::uuid, null::uuid);
$$;

create or replace function public.current_customer_id()
returns uuid
language sql
stable
set search_path = public, pg_catalog
as $$
  select coalesce((auth.jwt() ->> 'customer_id')::uuid, null::uuid);
$$;

create or replace function public.is_organization_member()
returns boolean
language sql
stable
set search_path = public, pg_catalog
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.organization_id = public.current_organization_id()
    );
$$;

create or replace function public.is_organization_admin()
returns boolean
language sql
stable
set search_path = public, pg_catalog
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.organization_id = public.current_organization_id()
        and p.role = 'admin'
    );
$$;

create or replace function public.is_customer_portal_user()
returns boolean
language sql
stable
set search_path = public, pg_catalog
as $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.customer_id = public.current_customer_id()
    );
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at') then
    create trigger set_updated_at
      before update on public.organizations
      for each row execute function public.set_updated_at();
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'profiles_set_updated_at') then
    create trigger profiles_set_updated_at
      before update on public.profiles
      for each row execute function public.set_updated_at();
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'customers_set_updated_at') then
    create trigger customers_set_updated_at
      before update on public.customers
      for each row execute function public.set_updated_at();
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'contacts_set_updated_at') then
    create trigger contacts_set_updated_at
      before update on public.contacts
      for each row execute function public.set_updated_at();
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'quotes_set_updated_at') then
    create trigger quotes_set_updated_at
      before update on public.quotes
      for each row execute function public.set_updated_at();
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'quote_items_set_updated_at') then
    create trigger quote_items_set_updated_at
      before update on public.quote_items
      for each row execute function public.set_updated_at();
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'payments_set_updated_at') then
    create trigger payments_set_updated_at
      before update on public.payments
      for each row execute function public.set_updated_at();
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'bot_conversations_set_updated_at') then
    create trigger bot_conversations_set_updated_at
      before update on public.bot_conversations
      for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.contacts enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;
alter table public.tracking_events enable row level security;
alter table public.payments enable row level security;
alter table public.bot_conversations enable row level security;

create policy "Organizations can be read by organization members"
on public.organizations
for select
using (public.is_organization_member());

create policy "Organizations can be managed by admins"
on public.organizations
for all
using (public.is_organization_admin())
with check (public.is_organization_admin());

create policy "Profiles are visible to organization members"
on public.profiles
for select
using (
  auth.uid() = id
  or (
    organization_id = public.current_organization_id()
    and role in ('admin', 'manager', 'member')
  )
);

create policy "Users manage their own profile"
on public.profiles
for all
using (auth.uid() = id)
with check (auth.uid() = id and organization_id = public.current_organization_id());

create policy "Customers are visible to organization members"
on public.customers
for select
using (
  organization_id = public.current_organization_id()
  or (
    public.is_customer_portal_user()
    and id = public.current_customer_id()
  )
);

create policy "Customers are managed by organization admins"
on public.customers
for all
using (
  organization_id = public.current_organization_id()
  and public.is_organization_admin()
)
with check (
  organization_id = public.current_organization_id()
  and public.is_organization_admin()
);

create policy "Contacts are visible to organization members and own customer"
on public.contacts
for select
using (
  organization_id = public.current_organization_id()
  or (
    customer_id = public.current_customer_id()
    and public.is_customer_portal_user()
  )
);

create policy "Contacts are managed by organization members"
on public.contacts
for all
using (
  organization_id = public.current_organization_id()
  and public.is_organization_member()
)
with check (
  organization_id = public.current_organization_id()
  and public.is_organization_member()
);

create policy "Quotes are visible to organization members and own customer"
on public.quotes
for select
using (
  organization_id = public.current_organization_id()
  or (
    customer_id = public.current_customer_id()
    and public.is_customer_portal_user()
  )
);

create policy "Quotes are managed by organization members"
on public.quotes
for all
using (
  organization_id = public.current_organization_id()
  and public.is_organization_member()
)
with check (
  organization_id = public.current_organization_id()
  and public.is_organization_member()
);

create policy "Quote items are visible to organization members and own customer"
on public.quote_items
for select
using (
  organization_id = public.current_organization_id()
  or (
    quote_id in (
      select id from public.quotes
      where customer_id = public.current_customer_id()
    )
    and public.is_customer_portal_user()
  )
);

create policy "Quote items are managed by organization members"
on public.quote_items
for all
using (
  organization_id = public.current_organization_id()
  and public.is_organization_member()
)
with check (
  organization_id = public.current_organization_id()
  and quote_id in (
    select id from public.quotes
    where organization_id = public.current_organization_id()
  )
  and public.is_organization_member()
);

create policy "Tracking events are visible to organization members and own customer"
on public.tracking_events
for select
using (
  organization_id = public.current_organization_id()
  or (
    customer_id = public.current_customer_id()
    and public.is_customer_portal_user()
  )
);

create policy "Tracking events are created by organization members"
on public.tracking_events
for insert
with check (
  organization_id = public.current_organization_id()
  and public.is_organization_member()
);

create policy "Tracking events are managed by organization members"
on public.tracking_events
for update
using (
  organization_id = public.current_organization_id()
  and public.is_organization_member()
)
with check (
  organization_id = public.current_organization_id()
  and public.is_organization_member()
);

create policy "Payments are visible to organization members and own customer"
on public.payments
for select
using (
  organization_id = public.current_organization_id()
  or (
    customer_id = public.current_customer_id()
    and public.is_customer_portal_user()
  )
);

create policy "Payments are managed by organization members"
on public.payments
for all
using (
  organization_id = public.current_organization_id()
  and public.is_organization_member()
)
with check (
  organization_id = public.current_organization_id()
  and public.is_organization_member()
);

create policy "Bot conversations are visible to organization members and own customer"
on public.bot_conversations
for select
using (
  organization_id = public.current_organization_id()
  or (
    customer_id = public.current_customer_id()
    and public.is_customer_portal_user()
  )
);

create policy "Bot conversations are managed by organization members"
on public.bot_conversations
for all
using (
  organization_id = public.current_organization_id()
  and public.is_organization_member()
)
with check (
  organization_id = public.current_organization_id()
  and public.is_organization_member()
);

create policy "Organization member can insert profile after account creation"
on public.profiles
for insert
with check (auth.uid() = id and organization_id = public.current_organization_id());

create policy "Customer users can read their own customer"
on public.customers
for select
using (public.is_customer_portal_user() and id = public.current_customer_id());

create policy "Customer users can read their own quote items"
on public.quote_items
for select
using (
  public.is_customer_portal_user()
  and quote_id in (
    select id from public.quotes
    where customer_id = public.current_customer_id()
  )
);
