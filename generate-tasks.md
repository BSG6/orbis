# DCM v0 Task List (derived from docs/DCM-PRD.md)

Constraints: UI first (v0), then light logic, then runner shell. No backend, no paid APIs/BYOK. Local-first, offline after first load. Include Firecrawl dev-time ingestion tasks. Terse, testable acceptance criteria (AC). Playful microcopy where noted.

## V0 UI — Screens and Shell (start here)

1) App shell, theme, focus mode
   - 1.1 Top bar with app title, Theme toggle, Focus Mode toggle, Source selector button
     - AC: Theme toggles dark/light; Focus Mode hides nav/right-rail; keyboard accessible; selection persisted in session storage.
     - Microcopy: "Eyes on the code."
   - 1.2 Right rail "Coach" panel scaffold (collapsible)
     - AC: Collapses/expands; state persists for session; aria-controls/expanded set; responsive layout keeps min 320px when open.
     - Microcopy: "Coach is in."
   - 1.3 Global layout and responsive breakpoints
     - AC: Right rail stacks below content on small screens; content max-width suits code; no horizontal overflow on common breakpoints (sm/md/lg).

2) Today page shell
   - 2.1 Header with problem title, source tag, optional Side-Quest chip
     - AC: Title truncates; source tag visible; optional chip renders when provided.
     - Microcopy: "Side quest unlocked."
   - 2.2 Instructions Tabs: Prompt, Constraints, Examples
     - AC: Tabs are keyboard-accessible (arrow keys); proper roles/aria; content scrolls; lazy-mount inactive panels.
   - 2.3 Assistance toggle (Review | Guidance | Total Help)
     - AC: Segmented control updates selected state; emits assistanceMode change event; persists for session.
   - 2.4 Editor pane placeholder with tinted border by assistance mode
     - AC: Neutral/teal/violet borders by mode; resizable vertical layout; monospace theme; placeholder labeled "CodeMirror 6 here".
   - 2.5 Output panes: Console panel + Tests table placeholder
     - AC: Console scrollback; Clear and Copy buttons; Tests table with columns (Test, Status, Message) and failing rows visually pinned (UI only).
   - 2.6 Footer actions: Stars (1–5) with inline "Next due: Xd", Favorite with reason tags
     - AC: Star selection states; long-press opens schedule explainer; Favorite opens tags selector and reflects chosen tags.
     - Microcopy: "Heart it, pin it."
   - 2.7 Source selection modal (AI random • NeetCode • My problem)
     - AC: Modal opens from top bar; persists selection; info hint links to Settings.
     - Microcopy: "Pick your poison."

3) Two-minute Start sheet
   - 3.1 Drawer shown by default on Today
     - AC: Inputs: time, energy, pattern focus, 1-line recall; Skip; Minimize; auto-min after 3 skips (UI-only counter).
     - Microcopy: "Two minutes, big vibes."
   - 3.2 A11y and persistence
     - AC: ESC closes; focus trap; remembers minimized/open in session.

4) Guidance UI: Hint Ladder + Panic Token
   - 4.1 Hint ladder (Nudge → Strategy → Specific) with checkpoint after Hint 2
     - AC: Step 1→2→3 progression; after 2, require 1-line checkpoint input to show 3; hints are concise and scroll within Coach rail.
     - Microcopy: "Pitch me your plan in one line."
   - 4.2 Panic Token dialog (1/day) gated by 1-line reflection
     - AC: If unused today, button enabled; dialog requires reflection before "Reveal"; after use, shows disabled "1/day" state; compact solution placeholder displays.
     - Microcopy: "Break glass wisely."

5) Review view
   - 5.1 Due list (cap banner 3–5/day)
     - AC: Banner shows cap and remaining; each card shows title, last stars, due date; actions: Start (primary), Snooze 7d (ghost); toast on Snooze.
     - Microcopy: "Small bites, steady gains."
   - 5.2 Empty state
     - AC: Shows "All clear!" with confetti-friendly icon and a Mini-lesson suggestion chip.

6) Favorites Pinboard
   - 6.1 Active (cap 20) grouped by pattern; Archive below
     - AC: Group headers with counts; reason tag chips; Move to Archive control; Archive accordion expands/collapses.
     - Microcopy: "Pinned and winning."
   - 6.2 Bi-weekly prune nudge
     - AC: Dismissible banner; reappears via dev time-travel toggle.

7) Badges & Side-Quest UI (visible-only)
   - 7.1 Side-Quest card
     - AC: Title, blurb, XP pill, Accept button (UI only).
     - Microcopy: "Go on, be a hero."
   - 7.2 Badges shelf
     - AC: Grid of badge chips with tooltips (Streak 7/21/50, No-Hint Day, etc.).

8) Error Bank surfaces
   - 8.1 Error Bank page (list + filters)
     - AC: Cards show problem, date, assistance level, ≤2 categories, evidence snippet, 1-line root-cause, 1-line fix insight.
   - 8.2 New Entry modal
     - AC: Category multi-select capped at 2; save is UI-only; validation messages for missing fields.
     - Microcopy: "Name it to tame it."
   - 8.3 Slip chip + 5-sec checklist banner on Today
     - AC: Slip chip appears when categories match (mocked state); checklist banner appears before run and can be dismissed; dismissal persists for session.

9) Settings page
   - 9.1 Theme, Focus Mode, Source selection, Token counters, Streak info (read-only)
     - AC: Toggles function and persist; counters display read-only values; link to Source modal.
     - Microcopy: "You run this dojo."

10) A11y, skeletons, empty states
   - 10.1 Keyboard navigation and ARIA
     - AC: Tabs, tables, toggles, stars are keyboard navigable with proper roles/labels; focus rings visible.
   - 10.2 Skeletons and empties
     - AC: Skeletons for tabs/editor/tests/cards; friendly empty states per page (Today, Review, Pinboard).

## Light Logic — Local-first only

11) Stars → schedule engine
   - 11.1 Implement rating → nextDue rules
     - AC: 1★ trail (1d→3d→7d), 2★ ≤36h, 3★ 4d, 4★ 14d, 5★ 30d; leech rule: two 1★ in a row sets mini-lesson flag; unit tests cover all stars.
   - 11.2 Review cap + Snooze 7d
     - AC: Daily due cap 3–5 enforced; Snooze moves due date by 7 days; unit tests cover cap and snooze.

12) Local Problem Index/cache
   - 12.1 IndexedDB (idb/Dexie) stores Problem records
     - AC: Schema per PRD; CRUD ops; search by tags/pattern; smoke tests.
   - 12.2 Seed 5–10 cleaned NeetCode prompts (dev-time)
     - AC: Preloaded store on first run or dev script; no network at runtime; demo uses cache only.

## Runner Shell — In-browser JS (UI + scaffolded logic)

13) JS sandbox runner scaffold
   - 13.1 Worker or iframe sandbox with Run/Stop (no network)
     - AC: Run executes provided harness; Stop cancels; per-test timeout stub respected.
   - 13.2 Console capture and Tests table wiring
     - AC: Console lines streamed with levels; tests report pass/fail; failing rows pinned on top.
   - 13.3 Iterations drawer
     - AC: Dots increment per run; drawer shows timestamp, pass/fail counts, duration; keeps last N runs.

## Firecrawl + Ingestion (dev-time only)

14) MCP setup & smoke test
   - 14.1 Configure Firecrawl MCP client in dev
     - AC: Local MCP callable; health check passes; setup steps documented.
   - 14.2 Smoke test a static page and a simple SPA
     - AC: Two example invocations return DOM/HTML; logs captured and saved.

15) Firecrawl → clean parse to normalized object
   - 15.1 Parser extracts {title, prompt, constraints, examples, tags, source}
     - AC: Deterministic output on sample inputs; unit tests (≥3) including missing-field cases.
   - 15.2 Normalization rules doc
     - AC: Rules cover trimming, code fences, bullets, constraint detection; doc committed.

16) Pre-cache 5–10 NeetCode problems for demo
   - 16.1 Fetch/Firecrawl at dev-time, not runtime
     - AC: Stored in JSON/seed script; IndexedDB seeded on first load; zero runtime network.
   - 16.2 Field cleanliness check
     - AC: Validation passes (non-empty title/prompt; examples when available); script prints summary.

17) Troubleshooting notes (no scraping during demo)
   - 17.1 Playbook
     - AC: Notes on waitFor usage, SPA vs static, fallback to Fetch; selectors vs content extraction; rate limits; reproducible snippets.
   - 17.2 Demo path uses cache only
     - AC: Feature flag blocks network on demo; UI badge shows "Offline-friendly".

## Non-functional and Demo Helpers

18) Demo Mode overlay
   - 18.1 Guided callouts for 60s script
     - AC: Steps: set Guidance → Hint 1 & 2 → Panic Token → Run tests → rate 3★ → Favorite with tag → open Review → mini-lesson chip; dev toggle only.

19) CSP and sandbox settings
   - 19.1 Strict CSP; sandboxed runner
     - AC: No external calls allowed; runner isolated origin; app works offline after first visit.

20) Perf and offline
   - 20.1 Pre-cache initial content; fast first paint
     - AC: First problem visible from cache on initial load; simulated offline run retains core flows.


## Deployment, Quality, and Local Assistance Templates

21) Vercel deployment-ready configuration
   - 21.1 vercel.json with security headers and caching
     - AC: Headers set for CSP, Referrer-Policy, X-Content-Type-Options, Permissions-Policy; static assets get long cache; HTML no-store.
   - 21.2 Build configuration for selected stack (Next.js App Router or Vite)
     - AC: Project builds on Vercel; no server functions; runtime is client-only; health page `/ok` returns 200.
   - 21.3 CSP staged rollout
     - AC: Report-only CSP first (local console log), then enforce; runner supports Worker/iframe via `worker-src blob:` and `script-src 'self'` allowances.

22) CI quality gates (no backend)
   - 22.1 GitHub Actions: build, typecheck, lint, unit tests
     - AC: Workflow on PR and main passes build, `tsc --noEmit`, ESLint, and unit tests.
   - 22.2 Basic Playwright/Cypress smoke of core flows (local)
     - AC: Headless run clicks through Today → Guidance hints → Panic Token dialog → Run (stub) → Stars selection; runs in CI.
   - 22.3 Pre-commit hooks
     - AC: lint-staged runs ESLint/Prettier on changed files; commits blocked on failure.

23) TypeScript strict and linting baseline
   - 23.1 Enable TS strict mode and path aliases
     - AC: `strict: true`; no implicit any; path aliases for `@ui`, `@state`, `@runner` compile.
   - 23.2 ESLint + Prettier config aligned to project
     - AC: Lint passes on fresh clone; formatting consistent.

24) Local assistance templates (no paid AI)
   - 24.1 Deterministic templates for Review/Guidance/Total Help
     - AC: Template engine fills Nudge/Strategy/Specific from problem fields; Total Help concise with 3 edge cases + minimal tests; unit tests ensure deterministic output.
   - 24.2 Guardrails enforcement at UI boundary
     - AC: Review never shows code; Guidance max 3 hints with checkpoint; Panic Token reveals compact solution only.

25) Mini-lesson templates and selection
   - 25.1 Mini-lesson content templates (concept snap, spotter, drill, checklist, reflection)
     - AC: Templated content renders; respects "leech" trigger and manual chip.
   - 25.2 Selection rules
     - AC: Rule chooses lesson when leech flag or concept tag present; unit-tested selection.

26) Error classification heuristics (local)
   - 26.1 Map failing evidence to 8 categories
     - AC: Simple heuristics map common messages/patterns to categories; fallback to manual pick; unit tests cover mappings.

27) Offline and PWA basics (optional but recommended)
   - 27.1 Service Worker for pre-cache and offline
     - AC: Static assets and seed JSON pre-cached; app works offline after first visit; SW update flow documented.
   - 27.2 Manifest and icons
     - AC: `manifest.json`, icons, theme color set; installable in Chrome.

28) Demo content and flags
   - 28.1 Pre-seeded "60s demo" path data
     - AC: Seed ensures the demo steps always have visible effects; toggled by dev flag.
   - 28.2 Network hard-block during demo
     - AC: Feature flag blocks fetch; UI badge "Offline-friendly" visible during demo.


