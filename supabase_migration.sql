-- 1. Create the dedicated table for this app's profiles
create table public.shame_alarm_profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.shame_alarm_profiles enable row level security;

-- 3. Create policies (Optional but recommended: Allow users to view their own profile)
create policy "Users can view own profile" 
on public.shame_alarm_profiles for select 
using ( auth.uid() = id );

-- 4. Create the function that will run on every new user sign up
create or replace function public.handle_shame_alarm_user() 
returns trigger as $$
begin
  -- Check if the user has the 'shame_alarm' metadata tag
  if new.raw_user_meta_data->>'app_name' = 'shame_alarm' then
    insert into public.shame_alarm_profiles (id, email, full_name)
    values (
      new.id, 
      new.email, 
      new.raw_user_meta_data->>'full_name'
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- 5. Create the trigger to fire the function
-- This will run AFTER any user is inserted into auth.users
drop trigger if exists on_auth_user_created_shame_alarm on auth.users;
create trigger on_auth_user_created_shame_alarm
  after insert on auth.users
  for each row execute procedure public.handle_shame_alarm_user();
