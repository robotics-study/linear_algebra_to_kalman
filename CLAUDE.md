# CLAUDE.md

Guidance for working in this repo. See `README.md` for the full overview, tech stack, and
project structure.

## What this is

Interactive study notes for Jessy W. Grizzle's *ROB 501: Mathematics for Robotics*. Two parts:

- `document/` — the deployed web app (React 18 + Vite 6 + TypeScript). All app work happens here.
- `sample_code/` — standalone Python / MATLAB reference implementations, grouped by chapter.

Chapters are pages at path routes: `…/chapter/<N>/`. Korean adds `?lang=ko`.

The repo name traces the course spine (proofs → linear algebra → least squares → factorizations →
Kalman filter), but the notes cover **all seven chapters**, real analysis and optimization
included. Never write copy that implies the site stops at the Kalman filter.

## Statements and proofs are the spine

This is a proof course, not a survey. Definitions, theorems, and proofs are **structural blocks**,
not paragraphs of prose.

- Use `components/math/Statement`: `Definition`, `Theorem`, `Lemma`, `Proposition`, `Corollary`,
  `Example`, `Remark`, and `Proof`.
- Pass the **original notes' numbering** as `n` (e.g. `<Theorem n="3.4">`) so a reader can hold
  the PDF open beside the page. Numbering is explicit, not auto-generated.
- Every non-trivial theorem gets a `Proof`. It renders collapsed, so a reader can skim results and
  open only the arguments they want.
- **Proofs are staged, not narrated**: assumptions → a chain of `BlockMath` (in)equalities →
  contradiction or conclusion. If a proof reads as one long paragraph, restructure it.
- When the notes mark a section "(Optional Read)", keep the material but say plainly that it can
  be skipped on a first pass.

## Chapters must be visual

**Every chapter teaches visually, not just in symbols.** Each major concept gets an interactive or
animated figure, and abstract objects (a subspace, a projection, a covariance ellipse, an
ε-neighborhood) are exactly the things that need one.

- 2D / planar figures → Konva via `components/2d/` and `CanvasFigure`.
- Prefer **interactivity** (drag / sliders / live readouts) when the concept has parameters the
  reader should sweep. Otherwise a looping animation.
- Make the reader *see the claim*: draw the residual meeting the subspace at a right angle, show
  the ε that fails, drag the outlier and watch the L1 and L2 fits separate.
- 3D (Babylon) is **not** installed. If a concept genuinely needs it (a subspace in R³, a
  quadratic-form surface), add the dependency in that chapter's PR and explain why in the PR body.

## Page structure (order fixed)

1. Intro — what this chapter is for, in one or two paragraphs.
2. **Definitions**
3. **Theorems & Proofs** (collapsible)
4. **Figure(s)** — placed inline next to the idea they illustrate, not collected at the end.
5. **Worked Example**
6. **Why Robotics** — where this shows up in a real robot (estimation, calibration, control).
   This is what makes the math stick; do not skip it.
7. **Implementation** — `CodeTabs` with python / matlab, embedded from `sample_code/` via
   vite `?raw` (no copy-pasted duplicates). Include it when the chapter has something worth
   running; a chapter that is purely about proof technique does not get a token code block just
   to fill the slot.
8. **References**

The `sections[]` array in `pages/chapters/index.ts` lists the same headings in the same order.

## Conventions

- **Wrap figures in `CanvasFigure`** — it adds the caption and the click-to-expand modal. The modal
  mounts a *second, independent* instance, so a figure that keeps its own React state (sliders)
  must be a self-contained component; pass a fresh instance as the `modal` prop.
- **Every display equation needs `Terms`** — put `components/math/Terms` directly under each
  `BlockMath` and define **every** symbol there, including ones defined earlier on the page or in
  an earlier chapter. The reader should never have to scroll back to decode a formula.
- **Reuse the shared scaffolding** — `CanvasFigure`, `CoordinateCanvas`, `konvaUtils`. Don't
  re-implement axes, grids, or coordinate math.
- **Theme-aware colors** — canvases can't read CSS variables. Read colors from `useCanvasColors()`
  so figures render correctly in light and dark mode. Never hard-code theme colors in a figure.
- **Placement** — per-chapter figures live in `components/pages/chapter<N>/`; the chapter page
  (`pages/chapters/Chapter<N>.tsx`) imports and drops them inline next to the relevant prose.
- **Registering a chapter** — set `contents` in `pages/chapters/index.ts` only when the page is
  actually written. Chapters without `contents` are skipped by the home cards, sidebar, search,
  sitemap, and prerender, so an unfinished chapter never gets indexed.
- **Section titles must match the rendered `<h2>` exactly** in both languages — the sidebar, TOC,
  and search anchors derive their slugs from those strings.
- **Comments** explain *why*; identifiers and signatures carry the *what*.

## Prose style (EN & KO)

- **No em-dash (`—`) parentheticals in body prose, captions, or UI strings.** Mid-sentence
  `— aside —` insertions break the reading flow. Restructure instead: split into separate
  sentences, use a colon for elaborations, or parentheses for short glosses. (Em dashes as
  structural separators in card/list layouts, e.g. `Ch.N · Title — blurb`, are fine, as are
  hyphens/en-dashes inside names like Gram–Schmidt.)
- **Korean prose uses the term a Korean grad student would actually say.** That is usually the
  settled Korean word (행렬, 벡터 공간, 고윳값, 수렴, 볼록, 내적, 사영, 기저, 차원, 유계, 완비성,
  대우, 귀류법, 귀납법, 반례, 진리표), but where the field says it in English, write English:
  quantifier, implication, norm, dense, rank, upper bound / least upper bound, normal equation,
  positive definite, null space, contraction mapping. Dictionary-literal coinages are a defect:
  not 양화사/함의/논리곱/조밀/상계/최소상계/노름/영공간.
- **Particles follow the Korean pronunciation of the preceding English token**, and a copula is
  not a subject particle: `implication은`, `implication이` (받침 있음) but `quantifier는`,
  `upper bound가`; the copula stays `upper bound이고 / 이며`, never `bound가고`. Never run a
  blind find-and-replace over Korean prose without rechecking every particle it touched.
- **직역 금지** — Korean is written fresh, not translated from the English sentence. Translationese
  ("~에 대한 것이다", "우리는 ~할 수 있다") is a defect.
- **조사는 선행 영어 토큰에 붙인다**: "norm 을" ❌ → "norm을" ✅. Same after `<InlineMath/>`.
- No semicolon-joined Korean sentences ("~한다; ~한다"). Split with a period.

## Verify

The dev server runs from `document/` (`yarn dev`). After changing a page or figure, load the
affected chapter (`/chapter/<N>/`) and confirm it renders and reacts with no console errors, in
**both languages and both color schemes** — a passing `yarn build` alone does not prove a canvas
works. Run `yarn build` **and** `yarn typecheck` before opening a PR.

## Source material

The original PDF is **not** committed here (`*.pdf` is gitignored). Keep a local copy for
authoring; link readers to <https://github.com/michiganrobotics/rob501> instead.
