# Tree of Support (Дерево Опоры)

Личная карта самоопоры: на чём стою, что у меня есть, куда иду.

**Source of truth for product, design, and architecture decisions is [`CLAUDE.md`](./CLAUDE.md).** Read it before making changes.

## Stack

Next.js (App Router) + Tailwind CSS + Supabase + Vercel + PostHog. See `CLAUDE.md` §9 for the full rationale.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Prototype reference

`/prototype/` contains the original single-file HTML/React prototype (`index.html`, `tree.png`). It's a **reference for UX, copy, and coordinates** — not production code. See `CLAUDE.md` §18 (Lessons Learned) for why it isn't the basis for the rebuild.
