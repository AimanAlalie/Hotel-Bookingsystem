# API Authentication

Protected routes check auth before processing:

```js
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

**When to require auth:**
- POST, PUT, DELETE operations (mutations)
- User-specific data (e.g., my-bookings)

**Public endpoints (no auth):**
- GET for public listings (hotels, rooms)

**Admin check:** Handled in middleware via `ADMIN_EMAILS` env var
