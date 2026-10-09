# Arcadia - game portal (Next.js + Supabase + Cloudflare)

Follow the step-by-step setup guide in the chat. Folder layout:

```
arcadia/
├─ .github/workflows/keepalive.yml   keeps free Supabase awake
├─ supabase/schema.sql  seed.sql     run in Supabase SQL Editor
├─ src/app/ (layout, page, search, game/[slug], api/report)
├─ src/components/ (GameCard, GameGrid, GamePlayer, ContinuePlaying, RecommendedList)
├─ src/lib/ (supabase.ts, queries.ts, format.ts, recent.ts)
├─ wrangler.jsonc  open-next.config.ts  next.config.ts  tailwind.config.ts
└─ .env.example
```

package.json scripts to add:
```json
"preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
"deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"
```
