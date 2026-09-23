-- 1. Create a function to automatically insert a user into the public.User table
-- when a new user signs up via Supabase Auth.
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public."User" (id, email, full_name, role)
  values (
    new.id,
    new.email,
    -- Extract full_name from auth metadata (if provided during signup) or fallback to 'User'
    coalesce(new.raw_user_meta_data->>'full_name', 'User'),
    -- Default everyone to 'customer'. Admins can be upgraded manually in DB.
    'customer'
  );
  return new;
end;
$$ language plpgsql security definer;

-- 2. Create the trigger to fire after an INSERT on auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
