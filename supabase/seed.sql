-- =====================================================================
-- Seed: imports the original 25 rows from Prabh.Wedding.Expenses.xlsx
-- Run this AFTER signing up your first user in Supabase Auth.
-- Replace the email below with the address you just signed up with.
-- =====================================================================

do $$
declare
  target_user uuid;
begin
  select id into target_user
  from auth.users
  where email = 'REPLACE_WITH_YOUR_EMAIL@example.com'
  limit 1;

  if target_user is null then
    raise exception 'No user found. Sign up first, then update the email above.';
  end if;

  insert into public.expenses
    (user_id, event, category, supplier, total_actual, share_type, my_share, paid_amount, is_fully_paid, status, notes)
  values
    (target_user, 'Maiyaan',          'Food',          'Maiyaan Breakfast',                       700,    'shared_50',  350,    0,     false, 'confirmed', null),
    (target_user, 'Maiyaan',          'Food',          'Maiyaan Lunch',                           1225,   'shared_50',  612.5,  0,     false, 'confirmed', null),
    (target_user, 'Maiyaan',          'Entertainment', 'Gidha Ladies — Maiyaan & Sangeet',        1800,   'shared_50',  900,    0,     false, 'confirmed', null),
    (target_user, 'Maiyaan',          'Venue',         'Canopies, Ice Boxes, Tables, Chairs',     null,   'shared_50',  null,   0,     false, 'tbc',       'Quote pending'),
    (target_user, 'Jaggo',            'Entertainment', 'DJ Sangeet',                              1000,   'shared_50',  500,    500,   true,  'confirmed', null),
    (target_user, 'Jaggo',            'Venue',         'Sangeet Hall',                            8100,   'shared_50',  4050,   0,     false, 'confirmed', null),
    (target_user, 'Jaggo',            'Entertainment', 'Dholi (2 pax) — Sangeet',                 1000,   'shared_50',  500,    0,     false, 'confirmed', null),
    (target_user, 'Jaggo',            'Entertainment', 'Gidha Ladies — Maiyaan & Sangeet',        1800,   'shared_50',  900,    0,     false, 'confirmed', null),
    (target_user, 'Jaggo',            'Food',          'Sangeet Catering',                        8620,   'shared_50',  4310,   0,     false, 'confirmed', null),
    (target_user, 'Reception Dinner', 'Entertainment', 'DJ Dinner',                               1600,   'non_shared', 1600,   1600,  true,  'confirmed', null),
    (target_user, 'Reception Dinner', 'Venue',         'Dinner Hall (280 Pax)',                   28185,  'non_shared', 28185,  18300, false, 'confirmed', null),
    (target_user, 'Reception Dinner', 'Entertainment', 'Dholi (4 pax) — Dinner',                  1800,   'non_shared', 1800,   900,   false, 'confirmed', null),
    (target_user, 'Reception Dinner', 'Entertainment', 'MC Dinner',                               1500,   'non_shared', 1500,   750,   false, 'confirmed', null),
    (target_user, 'All Events',       'Photo & Video', 'Photographer',                            15000,  'shared_50',  7500,   7500,  true,  'confirmed', null),
    (target_user, 'All Events',       'Photo & Video', 'Videographer',                            12000,  'shared_50',  6000,   6000,  true,  'confirmed', null),
    (target_user, 'All Events',       'Photo & Video', 'Content Creator',                         1800,   'shared_50',  900,    0,     false, 'confirmed', null),
    (target_user, 'All Events',       'Stay',          'Smart Home Villa',                        25000,  'shared_50',  12500,  12500, true,  'confirmed', null),
    (target_user, 'All Events',       'Décor',         'Big Tree Décor',                          28000,  'shared_50',  14000,  14000, true,  'confirmed', null),
    (target_user, 'All Events',       'Entertainment', 'Sound & System (All Events)',             5400,   'shared_50',  2700,   2700,  true,  'confirmed', null),
    (target_user, 'All Events',       'Spirits',       'Whiskey, Gin, Beer',                      19198,  'shared_50',  9599,   9599,  true,  'confirmed', null),
    (target_user, 'All Events',       'Food',          'Ladoo / Sakarpare',                       1650,   'non_shared', 1650,   1650,  true,  'confirmed', null),
    (target_user, 'Anand Karaj',      'Service',       'Northern Turbanator (Tie Turban) 4 pax',  500,    'non_shared', 500,    150,   false, 'confirmed', null),
    (target_user, 'Anand Karaj',      'Décor',         'Wedding Car Décor',                       335,    'non_shared', 335,    50,    false, 'confirmed', null),
    (target_user, 'Honeymoon',        'Flight Ticket', 'Bali Flight Ticket (2 pax)',              2950,   'non_shared', 2970,   2970,  true,  'confirmed', null),
    (target_user, 'Honeymoon',        'Stay',          'Hotels (7 Nights)',                       null,   'non_shared', null,   0,     false, 'pending',   'Booking pending');
end $$;
