<div align="center">

# 📐 Linear Algebra → Kalman

Interactive study notes for **Jessy W. Grizzle's**
**_[ROB 501: Mathematics for Robotics](https://grizzle.robotics.umich.edu/education/rob501)_**
(University of Michigan) — all 7 chapters, bilingual (EN · 한국어), with an interactive figure
for every key idea.

🔗 **[Open the live site →](https://robotics-study.github.io/linear_algebra_to_kalman/)**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)
![KaTeX](https://img.shields.io/badge/KaTeX-math-0f9d58)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

</div>

---

## Contents

- [Overview](#overview)
- [Chapters](#chapters)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Sample code](#sample-code)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

> **Disclaimer.** These are unofficial, non-commercial study notes based on Jessy W. Grizzle's
> _ROB 501: Mathematics for Robotics_ (University of Michigan, 2022). This project is **not
> affiliated with or endorsed by** the author or the university. All explanatory text, code, and
> interactive figures here are original work; the course notes' own text and figures are not
> reproduced, and the PDF is not redistributed here. The original notes are published at
> [michiganrobotics/rob501](https://github.com/michiganrobotics/rob501).

---

## Overview

The repo name traces the spine of the course — from proofs and abstract linear algebra through
least squares and matrix factorizations to the Kalman filter — but the notes cover **all seven
chapters**, including the real analysis and optimization that close the course.

| Path            | What it is                                                              |
| --------------- | ----------------------------------------------------------------------- |
| `document/`     | The study web app (React + Vite + TypeScript). This is what's deployed. |
| `sample_code/`  | Standalone Python and MATLAB reference implementations, by chapter.     |

Each chapter page combines prose (English and Korean) with KaTeX-rendered derivations, explicit
**Definition / Theorem / Proof** blocks, and interactive **Konva** 2D figures. Proofs are
collapsible: skim the results, or open the argument and follow it step by step.

## Chapters

| #  | Title                                          | Highlights                                                                                     | Sample code |
| -- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------- |
| 1  | Introduction to Mathematical Arguments         | Proof techniques, truth tables, negating quantified statements, sup/inf                        | —           |
| 2  | Highlights of Abstract Linear Algebra          | Vector spaces, subspaces, basis and dimension, change of basis, diagonalization                | —           |
| 3  | Inner Product Spaces and Least Squares         | Norms, Gram-Schmidt, the projection theorem, quadratic forms, least squares                    | —           |
| 4  | Three Useful Matrix Factorizations             | QR, SVD and numerical rank, LU with pivoting, Cholesky                                         | —           |
| 5  | Probability, Estimation, and the Kalman Filter | BLUE and MVE, Gaussian conditioning, the discrete-time Kalman filter, EKF                      | —           |
| 6  | Real Analysis: Limits and Extrema              | Open/closed sets, Cauchy sequences, contraction mapping, compactness and extrema               | —           |
| 7  | Brief Remarks on Optimization                  | Convex sets and functions, quadratic programs, LPs for the 1-norm and max-norm                 | —           |

> Chapters live at path URLs, e.g. `…/linear_algebra_to_kalman/chapter/2/`; Korean adds `?lang=ko`.
> Section deep links use `#hash` anchors.

## Features

- 🌏 **Bilingual** — every page in English and Korean (`?lang=ko`), with per-language metadata.
- 📐 **Statements and proofs as first-class blocks** — definitions, theorems, and collapsible
  proofs instead of a wall of prose.
- 🕹️ **A figure per concept** — draggable, parameterized Konva canvases with live readouts.
- 🧮 **Step-by-step math** — every formula is derived in numbered steps, typeset with KaTeX, and
  every symbol is defined on the spot.
- 🔍 **Search** — client-side index over all chapters and sections, in both languages.
- 🌗 **Light / dark** — follows the system `prefers-color-scheme`.
- 📈 **SEO-ready** — per-chapter prerendered HTML shells with baked titles, descriptions,
  canonical/hreflang links and JSON-LD, plus a generated `sitemap.xml` and `robots.txt`.
- 📱 **Responsive** — mobile layout with a collapsible sidebar and full-screen figure modals.

## Tech stack

- **React 18** + **React Router 6** — SPA with path-based chapter routes (`/chapter/N/`)
- **Vite 6** + **TypeScript** — build & dev server
- **Tailwind CSS 3** — styling via CSS-variable design tokens
- **Konva** + **react-konva** — 2D canvas figures
- **KaTeX** + **react-katex** — math typesetting

## Getting started

**Requirements**

```yaml
node: ">= 18.20.4"
yarn: ">= 1.22.21"
```

**Install & run**

```bash
git clone git@github.com:robotics-study/linear_algebra_to_kalman.git
cd linear_algebra_to_kalman/document
yarn install
yarn dev        # http://localhost:3000
```

**Other scripts** (run inside `document/`)

```bash
yarn build      # sitemap → vite build → per-chapter prerendered shells (document/dist)
yarn typecheck  # tsc --noEmit (vite build alone does not typecheck)
yarn preview    # serve the production build locally
```

## Project structure

```
linear_algebra_to_kalman/
├── document/                     # web app (deployed)
│   ├── index.html                # base metadata, JSON-LD, analytics
│   ├── vite.config.ts            # base path: /linear_algebra_to_kalman in production
│   ├── scripts/
│   │   ├── gen-sitemap.mjs       # sitemap.xml from the chapter list (runs before build)
│   │   └── prerender.mjs         # dist/chapter/N/index.html shells (runs after build)
│   └── src/
│       ├── App.tsx               # routes: /, /chapter/:n
│       ├── libs/                 # i18n, nav, seo, search, slug, theme helpers
│       ├── components/
│       │   ├── 2d/               # Konva coordinate canvas
│       │   ├── math/             # KaTeX wrappers, Terms, Statement / Proof blocks
│       │   ├── CanvasFigure.tsx  # figure wrapper: caption + full-screen modal
│       │   ├── CodeTabs.tsx      # python / matlab source panel
│       │   └── pages/chapter{1..7}/   # per-chapter interactive figures
│       └── pages/
│           ├── home/             # landing: keyword chips, part-grouped cards
│           └── chapters/         # Chapter{1..7}.tsx, metadata index, shared blurbs
└── sample_code/
    └── chapter<N>/{python,matlab}/
```

## Sample code

Reference implementations live under `sample_code/<chapter>/<language>/` and are linked from the
chapter cards in the app. The course itself is MATLAB-based, so MATLAB scripts stay close to the
original assignments; the Python versions are there so readers can run everything without a
MATLAB license.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which typechecks and builds
`document/` and publishes `document/dist` with **GitHub Actions Pages**. The production base path
is `/linear_algebra_to_kalman`, and the build emits `sitemap.xml`, `robots.txt`, per-chapter
prerendered shells, and a `404.html` SPA fallback.

## Contributing

1. Fork the repo and create a feature branch (`feature/…`).
2. Make changes under `document/` (and `sample_code/` if adding examples).
3. Verify with `yarn build` **and** `yarn typecheck`, then check the affected chapter in the
   browser (both `?lang=ko` and English, light and dark) for console errors.
4. Open a PR against `robotics-study/linear_algebra_to_kalman` `main`.

Authoring conventions — page section order, statement/proof blocks, figure rules, and the Korean
prose style — are documented in [`CLAUDE.md`](./CLAUDE.md).

## License

The original source code of this project (the web app and sample code) is released under the
[MIT](https://opensource.org/licenses/MIT) license — see [`LICENSE`](./LICENSE).

The MIT license covers only this project's own code. The underlying course notes, _ROB 501:
Mathematics for Robotics_ by Jessy W. Grizzle (University of Michigan, 2022), remain the copyright
of their author and institution and are **not** relicensed here.
