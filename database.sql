-- =====================================================================
-- 0. LIMPIEZA DE TABLAS Y CONFIGURACIONES PREVIAS (DROP)
-- =====================================================================

-- Eliminar tablas existentes en cascada (para reiniciar esquemas y columnas)
drop table if exists public.properties cascade;
drop table if exists public.profiles cascade;

-- Eliminar trigger y funciones asociadas
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user cascade;


-- =====================================================================
-- 1. TABLA DE PERFILES (profiles) Y TRIGGERS DE AUTH
-- =====================================================================

create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text,
  role text not null default 'CLIENT' check (role in ('ADMIN', 'AGENT', 'CLIENT')),
  is_active boolean not null default true,
  created_at timestamptz default now()
);

-- Trigger para crear perfil automáticamente al registrar un usuario nuevo
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Usuario'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'CLIENT')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Crear el trigger en auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Habilitar seguridad a nivel de fila (Row Level Security) en profiles
alter table public.profiles enable row level security;

-- Políticas RLS para profiles
create policy "Usuarios ven su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Solo ADMIN ve todos los perfiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'ADMIN'
    )
  );

create policy "Solo ADMIN actualiza perfiles"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'ADMIN'
    )
  );


-- =====================================================================
-- 2. TABLA DE PROPIEDADES (properties) Y POLÍTICAS RLS
-- =====================================================================

-- Tabla de propiedades protegida con RLS
create table public.properties (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric not null,
  type text check (type in ('APARTAESTUDIO','APARTAMENTO','CASA','LOCAL')),
  operation text check (operation in ('VENTA','ARRIENDO')),
  zone text,
  bedrooms int,
  bathrooms int,
  area numeric,
  is_active boolean default true,
  images text[] default '{}',
  agent_id uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- Habilitar seguridad a nivel de fila (Row Level Security) en properties
alter table public.properties enable row level security;

-- 1. Cualquiera puede VER propiedades activas (incluye usuarios no autenticados)
create policy "Propiedades activas son públicas"
  on public.properties for select
  using (is_active = true);

-- 2. Solo ADMIN y AGENT pueden CREAR propiedades
create policy "ADMIN y AGENT crean propiedades"
  on public.properties for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('ADMIN', 'AGENT')
    )
  );

-- 3. AGENT solo edita SUS propiedades, ADMIN edita todas
create policy "AGENT edita sus propiedades, ADMIN edita todas"
  on public.properties for update
  using (
    auth.uid() = agent_id
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'ADMIN'
    )
  );

-- 4. Solo ADMIN puede eliminar propiedades
create policy "Solo ADMIN elimina propiedades"
  on public.properties for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'ADMIN'
    )
  );
