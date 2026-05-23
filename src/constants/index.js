// Name shown on the "view this person's expenses" button. Cosmetic only —
// real access is gated by the PIN check on Supabase.
export const ADMIN_NAME = 'Prabhdeep'

// Email of the account allowed to add / edit / import expenses.
// Everyone else who signs up gets a read-only view (they still need the
// PIN to see the admin's data). Compared case-insensitively against
// `auth.uid()`'s email.
export const ADMIN_EMAIL = 'prabhdeep_singh95@yahoo.com'

export const EVENTS = [
  'Maiyaan',
  'Jaggo',
  'Reception Dinner',
  'Anand Karaj',
  'Honeymoon',
  'All Events',
]

export const CATEGORIES = [
  'Food',
  'Entertainment',
  'Venue',
  'Photo & Video',
  'Stay',
  'Décor',
  'Spirits',
  'Service',
  'Flight Ticket',
  'Other',
]

export const SHARE_TYPES = [
  { value: 'shared_50', label: 'Shared (50/50)' },
  { value: 'non_shared', label: 'Non-Shared (me only)' },
]

export const STATUSES = [
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'tbc',       label: 'TBC' },
  { value: 'pending',   label: 'Pending' },
]

export const EVENT_COLORS = {
  'Maiyaan':          '#f59e0b',
  'Jaggo':            '#8b5cf6',
  'Reception Dinner': '#ef4444',
  'Anand Karaj':      '#10b981',
  'Honeymoon':        '#0ea5e9',
  'All Events':       '#f43f5e',
}
