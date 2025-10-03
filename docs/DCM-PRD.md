# Daily Coding Mentor (DCM) — Product Requirements Document

Owner: Brie  
Sprint window: 1 week  
Goal: Ship a deployed app that delivers one problem per day with adaptive help and spaced review; zero $ run cost; smooth 60s demo.

## 1) Summary
Daily Coding Mentor (DCM) is a local-first web app that serves one coding problem per day with adaptive AI help and spaced review. It targets beginner/intermediate learners and emphasizes fast, low-friction practice, playful tone, and a zero-cost runtime. V0 ships the full Today flow with a JS-only in-browser runner, assistance guardrails, spaced review scheduling, favorites, Two-minute Start, mini-lesson chip, and a 60-second demo path.

## 2) Users & JTBD
- **Primary user**: Beginner/intermediate learner (Brie).
- **JTBD**: “Give me one problem, the right help level, quick review, and surface my weak spots so I improve steadily.”

## 3) Scope

### 3.1 In-Scope (MVP)
- Today flow with Instructions tabs, Assistance toggle (Review/Guidance/Total Help), Editor (CodeMirror 6), in-browser JS Run/Stop, Output/Console, Tests table (✓/✗; failing first), footer actions (Stars 1–5, Favorite with reason tags), Side-Quest chip, Mini-lesson chip (when relevant).
- Review queue driven by spaced review schedule; cap 3–5/day; Snooze 7 days.
- Favorites (Pinboard): Active cap 20 grouped by pattern, reason tags, auto-decay to Archive after 30 days, bi-weekly prune nudge.
- Add Problem flow: paste URL/text → extract fields → confirm → save.
- Two-minute Start (default ON; skippable; auto-min after 3 skips): time, energy, pattern focus, 1-line recall.
- Error Bank: 8 categories, failing test, 1-line root-cause, 1-line fix insight; slip chip; 5-sec checklist before related problems; weekly theme stub.
- Mini-lessons (3–5 min): optional chip; concept snap, pattern spotter, micro-drill, checklist, reflection.
- Source selection: AI random • NeetCode (in order) • My problem.
- Theme: dark default; global light/dark toggle (top-right); Focus Mode toggle OFF by default.
- Tone: playful, current slang; one-liners > paragraphs.
- Identity: energetic palette (Violet + Lime pops).
- Local-only AI at launch for extraction, hints, concise help, error classification, and mini-lesson templates.
- Deployment to Vercel with CSP; sandboxed runner; IndexedDB storage.

### 3.2 Out of Scope (v1)
- Auth, multi-user, multi-language execution, paid APIs/BYOK, heavy analytics.

## 4) Core Flows

### 4.1 Today
- **Instructions**: Tabs for Prompt, Constraints, Examples.
- **Assistance toggle**: Review / Guidance / Total Help; always visible; switch anytime.
- **Editor**: CodeMirror 6 (JS).
- **Runner**: JS in-browser sandbox (Web Worker/iframe) with Run/Stop, per-test timeout, capture console.
- **Output**: Console output panel + Tests table (failing tests pinned on top).
- **Footer**:
  - **Stars**: 1–5, shows “Next due: Xd” inline; long-press shows schedule explainer.
  - **Favorite**: reason tags; adds to Pinboard (Active up to 20).
  - **Side-Quest chip**: optional daily quests.
  - **Mini-lesson chip**: appears when relevant.

### 4.2 Review
- Resurface due problems by spaced schedule.
- Cap due list to 3–5/day.
- Snooze one item for 7 days.

### 4.3 Favorites (Pinboard)
- Active cap 20, grouped by pattern; reason tags.
- Auto-decay to Archive after 30 days.
- Bi-weekly prune nudge.

### 4.4 Add Problem
- Paste URL/text → local AI extraction → {title, prompt, constraints, examples, tags} → user confirms → save.

### 4.5 Two-minute Start
- ON by default; user can skip; auto-minimize after 3 skips.
- Collect time, energy, pattern focus, 1-line recall.

### 4.6 Error Bank
- 8 categories: (1) Off-by-one (2) Boundary/empty input (3) Wrong DS choice (4) Complexity blow-up (5) Duplicate handling (6) Index mix-up (7) Recursion base/loop condition (8) Graph visitation/state.
- Entry includes: problem, date, assistance level, ≤2 categories, failing test/evidence, root-cause (1 line), fix insight (1 line), tags.
- Slip chip at start when error patterns match.
- 5-sec checklist before related problems; weekly theme stub.

### 4.7 Mini-lessons (3–5 min)
- Optional chip: concept snap, pattern spotter, micro-drill, checklist, reflection.

### 4.8 Source Selection
- AI random • NeetCode (in order) • My problem.

### 4.9 AI Chat (Today)
- Purpose: user can ask questions about the current problem, get assistance-aware responses.
- Placement: Chat tab near Console/Output or bottom drawer toggle.
- Guardrails (respect Assistance Levels):
  - Review: no code; brief analysis, complexity notes, edge cases, extra tests.
  - Guidance: 1–3 hints; Nudge → Strategy → Specific; no full solutions.
  - Total Help: concise ELI5 → Practical → Technical; 3 edge cases + minimal tests.
- Context Tiers (fallbacks):
  1) DB: Structured problem fields from IndexedDB
  2) Imported/extracted: URL/paste extraction (immediately persisted to DB)
  3) Firecrawl (dev-time): normalized object seeded locally
  4) Minimal: prompt user for problem text; else generic templates (labeled “Generic – limited context”)
- Persistence: message history per problemId in IndexedDB; snapshot caching for context.
- API: server-only `/api/gemini/chat` with streaming and strict clamps; fallback to local templates when unavailable.
- UX: presets; keyboard submit; copy/insert (insert only in Total Help); cancel in-flight.

## 5) Assistance Levels (rules & guardrails)

### 5.1 Review
- Never reveal code.
- Provide: correctness snapshot, time/space, 1 alternate strategy, 1 extra test.
- If user asks “give me the answer” → suggest switching assistance level.

### 5.2 Guidance
- Up to 3 hints (Nudge → Strategy → Specific).
- Checkpoint after Hint 2 (e.g., “Show me your approach in a sentence.”).
- Panic Token: 1/day to reveal a compact solution after a one-line reflection.

### 5.3 Total Help (concise)
- ELI5 → practical → technical progression.
- Include 3 edge cases + minimal tests.

## 6) Spaced Review Scheduling

### 6.1 Stars → Next Due
- ⭐ Bombed → repeat Day 1, 3, 7. Leech rule: two ⭐ in a row → trigger mini-lesson prompt.
- ⭐⭐ Meh → tomorrow (≤36h)
- ⭐⭐⭐ Got it but slow → 4 days
- ⭐⭐⭐⭐ Comfortable → 14 days
- ⭐⭐⭐⭐⭐ Confident/teach it → 30 days
- Cap due = 3–5/day; Snooze 7d.

### 6.2 Pseudocode
```text
onRate(problemId, stars):
  now = Date.now()
  switch stars:
    case 1: nextDue = now + 1d; scheduleTrail = [1d, 3d, 7d]   // re-add at next step when completed
    case 2: nextDue = now + 1d
    case 3: nextDue = now + 4d
    case 4: nextDue = now + 14d
    case 5: nextDue = now + 30d
  applyLeechRuleIfNeeded(problemId, stars)
  upsertSchedule(problemId, nextDue)
  enforceDailyCap(3..5)
```

## 7) Daily Quests & Badges

### 7.1 Side Quest (1 optional/day)
- Hintless Solve, Edge-Case Hunt, Alt Pattern, Complexity Brief, Test-First, Refactor Pass.
- Rewards: small XP + Hint Peek token.

### 7.2 Badges
- Streak 7/21/50, No-Hint Day, Edge-Case Slayer, Back-to-Back 5s, Leech Tamer, Alt-Thinker, Speed Run, Coach’s Note.
- Streak Freeze: 1–2 tokens/month.

## 8) UX & Identity

### 8.1 Layout & Interactions
- Right rail = Coach (hints, checkpoints, checklists).
- Mode-tinted editor border: Review (neutral) / Guidance (subtle teal) / Total Help (gentle violet).
- Iteration dots under Run → expandable drawer for run history.
- Long-press on Stars shows schedule explainer.
- Pinboard (Favorites) grouped by pattern; Active (20) on top; Archive below.

### 8.2 Theme & Tone
- Dark by default; global light/dark toggle top-right.
- Focus Mode toggle OFF by default (hides nav/expands editor).
- Playful, current slang; one-liners > paragraphs.
- Palette: energetic Violet + Lime pops.

## 9) Tech & Architecture

### 9.1 Stack
- **UI**: Next.js (App Router) or Vite+React; TailwindCSS + Radix UI/shadcn; Framer Motion.
- **Editor**: CodeMirror 6.
- **Runner**: In-browser JS sandbox via Web Worker or iframe, Run/Stop, per-test timeout, capture console, pass/fail table.
- **State**: Lightweight client store (e.g., Zustand or Context) + IndexedDB (Dexie/idb).
- **AI (local-only)**: Small in-browser model for:
  - Problem field extraction
  - Hint ladder generation
  - Concise Total Help
  - Error classification
  - Mini-lesson templates
- **Ingestion (dev-time)**: Fetch + Firecrawl in Cursor to pre-cache 5–10 NeetCode prompts (clean fields only); respect TOS.
- **Deploy**: Vercel; CSP; sandboxed runner.

### 9.2 Data Model (IndexedDB)
- **Problem**: id, title, prompt, constraints, examples, tags[], source, createdAt.
- **Schedule**: problemId, nextDueAt, lastStars, leechCount, snoozedUntil.
- **Session**: id, problemId, date, assistanceLevel, durationSec, stars, favoriteReasonTags[], sideQuest?, miniLessonUsed?, panicUsed?, codeSnapshot?.
- **ErrorBankEntry**: id, problemId, date, assistanceLevel, categories[≤2], failingEvidence, rootCause, fixInsight, tags[].
- **Favorites**: problemId, reasonTags[], activeUntil, archivedAt?.
- **Settings**: theme, focusMode, sourceSelection, tokens{panicDaily:int, hintPeek:int, streakFreeze:int}, streak{current:int, best:int}.
- **MiniLesson**: id, problemId?, type, contentTemplateRef, lastOfferedAt, lastCompletedAt.

### 9.3 Security & Privacy
- Strict CSP, no external API calls at runtime.
- Sandboxed runner (no network), Worker/iframe isolation.
- Local-only storage; export/import optional later (not in MVP).

## 10) Requirements

### 10.1 Functional
- Serve one “Today” problem based on source selection.
- Assistance toggle enforces rules per level.
- Panic Token: limited to 1/day; requires 1-line reflection before reveal.
- Run/Stop with per-test timeout; console capture; tests results table (failing first).
- Star rating updates schedule per rules; Review queue respects cap and Snooze.
- Favorites Pinboard with Active cap 20; auto-archive after 30 days; prune nudge bi-weekly.
- Add Problem with local AI extraction and user confirmation.
- Two-minute Start collector (default ON, skippable, auto-min after 3 skips).
- Error Bank entry creation when tests fail or user logs an error.
- Mini-lesson chip appears when relevant (leech, concept flag, or guidance checkpoint).

### 10.2 Non-Functional
- Zero $ run cost.
- Smooth 60s demo path; first content available on initial load (pre-cached).
- App loads quickly, works offline after first visit (client-only).
- Accessibility: keyboard-first basic flows, sufficient contrast in dark mode.

## 11) Acceptance Criteria (Demo-Ready)
- Deployed link on Vercel.
- Today flow end-to-end with assistance + guardrails + panic token.
- Runner executes JS code with Run/Stop, per-test timeout, console capture; Tests table shows failing first.
- Stars immediately schedule next due; Review queue reflects changes; cap enforced; Snooze works.
- Favorites supports reason tags; Active cap 20; auto-archives items after 30 days (time-travel dev toggle acceptable).
- Two-minute Start visible by default; mini-lesson chip can appear based on rules.
- Smooth 60s demo path works without network calls beyond initial app load.

## 12) Risks & Mitigations
- **SPA scraping slow for ingestion**: Pre-cache; maintain local index fallback.
- **Over-help reduces learning**: Strict assistance rules + reflection gates.
- **Motivation dips**: Side Quests, streak freeze tokens, playful microcopy.
- **Sandbox reliability**: Prefer Worker; fallback to iframe; strict timeouts.
- **Local model quality**: Template-driven prompts, concise outputs, deterministic constraints.

## 13) Rollout Plan (Week)
- Day 1–2: UI skeleton (Today, Review, Pinboard), theme/toggles, CodeMirror.
- Day 2–3: Runner (Worker), Tests table, Output/Console.
- Day 3–4: Assistance logic + Panic Token + reflection.
- Day 4: Spaced schedule engine + Stars UI + Review cap/snooze.
- Day 5: Favorites caps/Archive + Two-minute Start + mini-lesson chip.
- Day 6: Error Bank + Side Quests + badges MVP (visible, simple).
- Day 7: Polish, CSP, deploy, demo script rehearsal.

## 14) Demo Script (60s)
- Skip Two-minute Start → NeetCode (in order) loads → set Guidance → Hint 1 & 2 → Panic Token + reflection → Run tests → rate ⭐⭐⭐ → Favorite with reason tag → open Review (1 due) → mini-lesson chip appears.

## 15) Critical Implementation Fixes Required

### 15.1 File Structure Issues (URGENT)
- **Folder Name Typo**: ✅ FIXED - `componenets/` renamed to `components/`
- **Import Path Mismatch**: ✅ FIXED - All import paths now correct
- **Missing Utility File**: ✅ FIXED - `lib/utils.ts` created with `cn()` function

### 15.2 Missing Dependencies
- **shadcn/ui Components**: ✅ FIXED - All required components added
- **TypeScript Configuration**: May need path aliases setup for `@/components` imports

### 15.3 UI Implementation Status (as of current review)
**✅ COMPLETED:**
- Complete UI shell with all major screens (Today, Review, Favorites)
- Dark mode + Focus mode implementation
- Violet + Lime theme with gradients
- Two-minute Start drawer
- Coach right rail with hint system
- Source selection modal
- Responsive design and accessibility
- Loading skeletons for all components

**❌ PENDING FUNCTIONALITY:**
- CodeMirror 6 editor integration
- JavaScript sandbox runner (Web Worker/iframe)
- IndexedDB storage layer
- Spaced repetition scheduling engine
- Problem management and parsing
- Error Bank system
- Mini-lesson templates

## 16) Open Questions
- Which local model/runtime for hint ladders and extraction (size/latency tradeoff)?
- Which specific JS test harness shape (simple assert vs. minimal jest-like)?
- How to seed 5–10 NeetCode prompts within TOS boundaries; exact fields allowed.
- Export/import of local data in a later release—what format?