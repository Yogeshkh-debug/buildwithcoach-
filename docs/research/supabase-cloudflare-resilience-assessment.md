# Supabase and Cloudflare resilience assessment

## Current finding

Supabase uses PostgreSQL for its database. Cloudflare D1 uses SQLite semantics. They are not interchangeable retry targets for the current buyer, delivery, and entitlement queries.

Cloudflare D1 can be accessed from Supabase using a foreign-data wrapper, but the official wrapper documentation requires compatible column types and has limits such as no `TRUNCATE` support and no data modification through foreign tables created from a subquery. This does not provide automatic transactional failover for the application.

## Safe options

1. Keep Supabase as the single writer and create a Cloudflare backup copy for recovery or read-only reporting. This preserves one source of truth.
2. Use a controlled application outbox to replicate only completed buyer events to Cloudflare D1. Do not retry failed Supabase writes directly into D1; queue and replay them after Supabase recovery to prevent divergent records.

## Security and consistency boundary

PDF delivery requests and buyer program entitlements must be idempotent. No database failover design should make a Cloudflare write visible as a completed buyer purchase or entitlement before Supabase confirms it, because that could create duplicate emails or mismatched My Programs access.

## Sources

- Supabase: Cloudflare D1 wrapper documentation, retrieved 27 August 2026.
- Cloudflare: D1 documentation overview, retrieved 27 August 2026.
