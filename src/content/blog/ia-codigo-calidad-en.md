---
title: 'Practical checklist for using AI without filling your repo with garbage'
lang: en
excerpt:
  'Concrete workflows for AI-assisted development: debugging, tests, refactors,
  and design. All without handing over the wheel to the model.'
publishDate: 2025-11-21
tags: [ai, productivity, development, typescript, debugging]
readTime: 14 min read
draft: false
category: Productivity
image: ./_images/portfolio-design.jpg
series:
  id: ia-and-development
  name: 'AI for Development'
  part: 2
---

I use **Claude Code** and **ChatGPT** almost every day. They help me a lot, but
with strict rules to prevent them from dumping junk code into the repo.

In [Part 1](/en/blog/claude-code-chatgpt-productividad) I talked about the
general philosophy and which tasks I delegate or not. Here I dive into the
**day-to-day**:

- The mental pattern I always follow
- How I use them for debugging
- How I use them for tests
- How I use them for architecture ideas
- How I give them context without handing over the repo
- A quick daily routine checklist

_The idea isn't for AI to program for you, but to take away what distracts you
from thinking._

---

## Base pattern: you think first, then AI complements

My mental pattern is simple:

1. You understand and reformulate the problem
2. You write your solution or at least your approach
3. Only then do you bring in AI to refine, question, or automate

```mermaid
flowchart LR
  P["Problem"] --> H1["Human thinks"]
  H1 --> Draft["Code draft"]
  Draft --> IA["AI suggests improvements"]
  IA --> H2["Human reviews and decides"]
  H2 --> Repo["Final code"]
```

### Step 1: formulate the problem in your head

Before opening Claude or ChatGPT, I try to make my brain do the basic work:

- What exactly am I trying to solve?
- Where's the difficult edge? (algorithms, API, performance, DX)
- What constrains the solution? (current stack, business constraints)

If you can't explain it in 3 or 4 sentences, it's not ready for AI yet. It's a
filter to prevent it from using you as a mental eraser.

### Step 2: write your version first

Even if it's pseudo-code, I always write something of my own before asking for
help. Real example from my [Hospeda](/en/projects/hospeda) project:

```ts
// Hook to filter destinations - I write it functionally first
export function useFilteredDestinations(
  destinations: Destination[],
  filters: DestinationFilters
) {
  return useMemo(() => {
    let result = destinations;

    if (filters.region) {
      result = result.filter((d) => d.region === filters.region);
    }

    if (filters.minRating != null) {
      result = result.filter((d) => d.rating >= filters.minRating);
    }

    if (filters.hasAccommodations) {
      result = result.filter((d) => d.accommodationCount > 0);
    }

    return result;
  }, [
    destinations,
    filters.region,
    filters.minRating,
    filters.hasAccommodations,
  ]);
}
```

Can it be improved? Sure. Does it work? Yes. I get it working first, then ask
for help to polish it.

### Step 3: AI as reviewer and alternative generator

Only here do I say something like:

```text
This React hook works, but I want it:
- More readable
- Easier to extend if I add new filters
- Maintaining the same behavior

Propose 2 refactor alternatives, explaining pros and cons.
```

If it proposes something better, I compare. If it adds weird stuff, I discard
it. The key: I don't ask _"how do I do this?"_. I ask _"how do you improve what
already works?"_.

---

## Debugging: AI as a second pair of eyes

```mermaid
flowchart TD
  Bug[Weird bug] --> Repro[Reproduce the error]
  Repro --> Q1{Clear stack trace?}

  Q1 -- "Yes" --> Inspect[Inspect code]
  Q1 -- "No" --> IAContext[Give context to AI]

  Inspect --> Q2{Found the cause?}
  IAContext --> Hyp[AI proposes hypotheses]
  Hyp --> Q2

  Q2 -- "Yes" --> Fix[Apply the fix]
  Q2 -- "No" --> DeepDive[Deeper debugging]
  DeepDive --> IARefine[Return to AI with findings]
  IARefine --> Hyp

  Fix --> Tests[Run tests]
  Tests --> Done[Merge]
```

I use AI when:

- The error isn't obvious
- The stack trace is cryptic
- You've already tried 2-3 things and you're still stuck

### Example debugging prompt

```text
Context:
- Front: React 19 + TanStack Query
- API: Hono
- DB: Drizzle + PostgreSQL

Console error:
TypeError: Cannot read properties of undefined (reading 'items')

Component that crashes:

function DestinationsList() {
  const { data, isLoading } = useQuery({
    queryKey: ["destinations"],
    queryFn: () => destinationService.list({ page: 1, pageSize: 20 }),
  });

  if (isLoading) return <Spinner />;

  return (
    <ul>
      {data.items.map((d) => <li key={d.id}>{d.name}</li>)}
    </ul>
  );
}

What would you suspect and what things would you check step by step.
Don't invent new code, focus on possible causes.
```

AI doesn't "magic" the bug away, but it organizes hypotheses, reminds you of
edge cases you missed, and acts as a checklist when you're already tired.

### When the stack trace isn't enough

I also use it to understand Drizzle or PostgreSQL errors:

```text
I have this Drizzle error:

Error: Column "destinations.slug" must appear in the GROUP BY clause
or be used in an aggregate function

With this query:

const rows = await db
  .select({
    slug: destinations.slug,
    count: sql<number>`count(*)`.as("count"),
  })
  .from(destinations)
  .groupBy(destinations.region);

Explain to me:
1) What exactly is the error saying
2) Why does it happen with this query
3) Two correct ways to rewrite it
```

What I ask: that it explains. What I do: choose the solution and adapt it.

---

## Tests: human intention, AI skeleton

```mermaid
flowchart TD
  Regla[Business rule] --> Coment[Write intention as comment]
  Coment --> Prompt[Prompt AI with the pattern]
  Prompt --> Skeleton[AI generates skeleton]
  Skeleton --> Review[Adjust mocks and asserts]
  Review --> RunTests[Run tests]
  RunTests --> Q{Passing?}
  Q -- "Yes" --> Commit[Commit]
  Q -- "No" --> Fix[Fix]
  Fix --> RunTests
```

For unit or integration tests:

1. I manually write the test **intention**
2. I leave it as a comment in the file
3. I ask AI to transform it into a test with my stack

Example comment:

```ts
// I want to test:
// - That DestinationService.list() returns paginated correctly
// - That it respects search filters
// - That if the actor doesn't have permissions, it returns FORBIDDEN
```

Typical prompt:

```text
With this comment as a guide and using the test pattern from my project
(Vitest + factories), generate the complete tests.

Pattern I use:

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createActor } from '../../factories/actorFactory';
import { createModelMock } from '../../utils/modelMockFactory';

describe('DestinationService.list', () => {
  let service: DestinationService;
  let model: ReturnType<typeof createModelMock>;

  beforeEach(() => {
    model = createModelMock();
    service = new DestinationService({ logger: mockLogger }, model);
    vi.restoreAllMocks();
  });

  it('should return paginated list', async () => {
    // ...
  });
});
```

AI builds the skeleton. You adjust mocks, assertions, and edge cases you know
from the business.

### Example with simple function

Function to generate slugs:

```ts
export function generateSlug(name: string, existingSlugs: string[]): string {
  const base = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  let slug = base;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }

  return slug;
}
```

Prompt:

```text
Generate tests with Vitest for this function, covering:
- Base case with simple name
- Name with accents and special characters
- Name that already exists (should add numeric suffix)
- Multiple collisions (should increment the counter)

Don't use weird magic values, keep it simple.
```

AI makes the draft, you keep the criteria.

---

## Architecture: AI as an annoying colleague

When I'm deciding something about architecture, I use AI as that colleague who
always has an opinion, sometimes says nonsense, but forces you to justify what
you do.

Real example:

```text
Project context:
- Monorepo with apps/web (Astro), apps/admin (TanStack Start), apps/api (Hono)
- packages: @repo/db (Drizzle), @repo/service-core, @repo/schemas (Zod)

I want to decide where the logic for "featured destinations" lives that:
- Reads accommodations from each destination
- Calculates a score based on reviews and bookings
- Returns a sorted list

Propose two options:
1) Custom method in DestinationService
2) Direct query in the route handler

In each case: advantages, disadvantages, impact on testing and reuse.
```

I don't delegate the decision. I use it to see angles I might be missing.

---

## Context without giving away the repo

### Minimal but sufficient context

No need to paste 2000 lines of code. I prefer:

- 1 key file
- A short description of the architecture
- The relevant types

My rule:

- If the answer depends on a specific detail → paste relevant code
- If it's a design question → describe, don't paste

### Example with real handler

```ts
export const destinationListRoute = createListRoute({
  method: 'get',
  path: '/',
  handler: async (ctx, _params, _body, query) => {
    const actor = getActorFromContext(ctx);
    const result = await destinationService.list(actor, query || {});

    if (result.error) throw result.error;

    return {
      items: result.data?.items || [],
      pagination: getPaginationResponse(result.data?.total || 0, query),
    };
  },
});
```

Prompt:

```text
My service architecture:
- All extend BaseCrudService
- Each service has permission hooks and normalizers
- Call pattern: service.list(actor, filters)

With this handler, what refactors seem reasonable to:
- Handle the error more cleanly
- Avoid repeated optional chaining

Don't invent new services, work with what's there.
```

---

## Limits I set no matter what

### No credentials or sensitive data

In a rush you can make a mistake. Rules I set for myself:

- Never paste API tokens
- Never paste production secrets
- Never paste real connection strings
- Never paste real user data

Instead of the real connection string, I send:
`postgres://USER:PASS@HOST:PORT/DB_NAME` and clarify it's a placeholder.

### No final business decisions

Things I don't delegate:

- Pricing criteria
- Permission rules by role
- Legal or compliance things

AI can help me express it in code, but I define the rule.

---

## Cases where it really saved me time

### Big refactor without dying in diffs

I had to move all imports from `@repo/db/schema/*` to `@repo/db` without
breaking anything in the monorepo.

Flow:

1. I asked Claude Code to detect old imports, replace them, and show me diffs
   per file
2. I reviewed each diff carefully

Work that would've been 3-4 hours by hand went to ~1 hour with human control.

### Tests I was never going to write "out of laziness"

I had services with custom methods (`getSummary`, `getStats`, `getFeatured`)
that I "knew" I had to test, but never got around to.

I used AI to generate the test skeleton following my pattern. I adjusted logic,
names, and added edge cases.

Result: went from "someday" to "today".

### Cross bug debugging

Search filters weren't being applied the same in the service and in the route
handler.

I used AI to:

1. Map the filter flow: query params → handler → `service.list()` →
   `model.findAll()`
2. Build a debugging checklist

It organized my head more than the code. Just that alone saves you time.

---

## Daily routine checklist

1. **I understand it first** — If you can't explain it in 3 sentences, it's not
   ready for AI
2. **You write something of your own** — Code draft, idea, test comment
3. **AI complements, doesn't create from scratch** — Refactors, tests, docs,
   explanations
4. **Always review diffs** — Nothing enters the repo without passing through
   your eyes
5. **Run tests** — If you touch tested code, tests must pass
6. **Be careful what you paste** — No secrets, no real data
7. **Don't let it decide for you** — Architecture, business, and security are
   your responsibility

---

## Closing

Claude and ChatGPT can be part of your daily routine without turning your repo
into a Frankenstein.

The key is in three things:

- **Clear mental pattern:** you think first, then AI helps
- **Concrete flows:** debugging, tests, refactors, and assisted (not outsourced)
  design
- **Healthy boundaries:** no secrets, no delegated business decisions, no blind
  commits

If you treat them as tools and not as oracles, they're like having a hyper-fast
junior next to you... but the senior who signs the commits is still you.

---

## References

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — Integrated
  assistant to work on the repo
- [ChatGPT](https://chat.openai.com) — For long text, examples, and guided
  debugging
- [Part 1: AI as copilot, not as suicide pilot](/en/blog/claude-code-chatgpt-productividad)
  — The general philosophy
- [Configuring Claude Code for large monorepos](/en/blog/configurando-claude-code-para-trabajar-con-monorepos-grandes)
  — Setup for complex projects
