# DFK Portfolio — "Dev Terminal" Revamp Design

**Date:** 2026-08-10
**Owner:** Daud Farzand
**Scope:** Full UI/UX, frontend design, and responsiveness overhaul of `index.html` and shared styles. Portfolio-item sub-pages and image assets are untouched.

---

## 1. Goal

Rebuild the portfolio homepage with a dark, technical, terminal-inspired aesthetic that immediately communicates "AI/ML infrastructure engineer" before a single word is read. Improve responsiveness across all breakpoints, modernize motion and interaction, and raise the perceived craft level without rebuilding the seven `portfolio-item*.html` sub-pages.

**Success criteria:**
- Hero loads under 1s on a 4G connection with no layout shift (CLS = 0)
- Lighthouse: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95
- Works cleanly at 320 / 480 / 768 / 1024 / 1280 / 1920 widths with no horizontal overflow
- Reduced-motion preference is respected everywhere
- Keyboard-only users can navigate every section

---

## 2. Design Direction

Aesthetic reference: Linear + Vercel + a CLI prompt — deep near-black canvas, sharp 1px borders, mono accents, subtle scanline/grain texture, restrained motion.

### 2.1 Palette (CSS custom properties)

| Token | Value | Use |
|-------|-------|-----|
| `--bg-0` | `#0a0a0b` | Page background |
| `--bg-1` | `#111114` | Cards, raised surfaces |
| `--bg-2` | `#16161a` | Hover/active surface |
| `--border` | `#1f1f24` | Hairline dividers, card borders |
| `--text` | `#e6e6e6` | Primary text |
| `--muted` | `#8a8a92` | Secondary text, captions |
| `--accent` | `#7cffb3` | Primary accent (mint-green) |
| `--accent-dim` | `#3aa877` | Dim accent on hover/borders |
| `--danger` | `#ff6b6b` | Reserved for status/error states |

Mint-green accent is chosen deliberately to avoid the AI-startup cliché of electric blue/violet. It reads cleanly against near-black, has high contrast for WCAG AA, and feels terminal/native.

### 2.2 Typography

- **Display / headings / mono accents:** JetBrains Mono 500/700
- **Body:** Inter 400/500/600
- **Tabular numerals** for stats, dates, indices
- Letter-spacing: `0.02em` on body, `-0.02em` on display
- Fluid type via `clamp()` on `h1` / `h2` / `h3` only — body stays at `1rem`/`1.0625rem`

### 2.3 Layout & Sections

#### Hero (`#home`) — full-viewport, asymmetric
- Left column: oversized mono name `> daud_farzand` with blinking caret, typed-out subtitle cycling three role strings every 3.5s, two pill CTAs (`View Work` → `#work`, `Get in Touch` → `#contact`)
- Right column: portrait in a 1px bordered card with corner brackets (`┌ ┐ └ ┘`), status pill `● available` (mint-green dot, pulsing 2s)
- Background: faint 32px grid overlay at 4% opacity, subtle scanline gradient
- Stacks vertically under 768px; portrait becomes 240px square card above the text

#### Services (`#services`) — 3-up bento grid
- Each tile: small mono index (`01 / 02 / 03`), heading, body, hover lift (4px) + accent border glow
- Tiles span 1 col on mobile, 3 cols at ≥1024px
- Darker bg (`--bg-1`) than the page to recede, accent border on hover only

#### Experience (`#about`) — vertical timeline
- Left rail with year markers (2022 → 2025) connected by a 1px line
- Cards on the right with role · company · dates · bulleted achievements
- Replaces the dense paragraph block currently in the HTML
- One card per employer in this order: Tech Prysm (current, marked with `now` badge), Techanzy Limited, Programmer's Force Pvt Ltd, Unmatched Resumes LLC
- Latest card sits at the top; older entries recede visually via the `.timeline__entry--archival` modifier (CSS-only: header uses `--muted` instead of `--text`). Modifier is applied at the markup level by the implementer based on the dates in the content below.

#### Skills (`#skills`) — chip cloud, no cards
- Six category labels as mono `h3` headings: `// ai_ml`, `// backend_frontend`, `// cloud_devops`, `// data`, `// observability`, `// security_auth`
- Beneath each: comma-separated `<span>` chips with `·` separators
- Hover on a chip reveals a one-line definition tooltip (CSS-only via `data-tip` attribute + `::after`)
- Avoids the card-in-card-in-card feel

#### Work (`#work`) — asymmetric bento grid
- One large tile (col-span 2) for ServeLLM (the headline project), four standard tiles for the remaining projects
- Each tile: image with overlay gradient on hover, title, tech-stack chips, links to existing `portfolio-item.html` etc.
- Real links preserved: `portfolio-item.html`, `portfolio-item02.html` … `portfolio-item05.html`

#### Education (`#education`) — two-column block
- Left: degree block (Goldsmiths, ML/AI, 2023)
- Right: certifications list with thin horizontal rules between entries
- Aesthetically restrained; this section is reference material, not a focal point

#### Footer / Contact (`#contact`) — accent bar
- Mint-green band with email CTA, phone, location, social row
- Replaces the plain dark footer; visually closes the page with the accent color used earlier
- Contains: mailto, phone tel link, location text, LinkedIn / GitHub / Instagram / Resume icons

### 2.4 Responsiveness

Breakpoints (mobile-first):
- Base: < 480px (single column)
- `sm`: 480px+
- `md`: 768px+ (tablet — nav switches from bottom-sheet to top-bar)
- `lg`: 1024px+ (desktop — bento grids activate)
- `xl`: 1280px+ (max content width 1200px, centered)

Container max-width: `1200px` with `padding-inline: clamp(1rem, 4vw, 2rem)`.

### 2.5 Motion & Interactions

| Element | Trigger | Animation | Duration |
|---------|---------|-----------|----------|
| Hero subtitle | On load + interval | Typed-text cycle through 3 strings | 3.5s/cycle |
| All sections | IntersectionObserver (10% visible) | fade-up + translateY(8px → 0) | 500ms ease-out, 60ms stagger per item |
| Service / work tile | Hover | translateY(-4px) + accent border glow | 200ms ease-out |
| Nav link | Hover | underline grows from left | 250ms |
| Status pill | Always | pulse on the dot only | 2s infinite |
| Cursor ring | Pointer move (desktop ≥1024px only) | ring follows pointer with 80ms ease | continuous |
| `prefers-reduced-motion: reduce` | OS-level | All animations disabled, instant state changes | — |

### 2.6 Accessibility

- WCAG AA contrast: body `--text` on `--bg-0` = 13.8:1; `--accent` on `--bg-0` = 14.2:1; `--muted` on `--bg-0` = 4.8:1
- `focus-visible`: 2px `--accent` outline + 2px offset on every interactive element
- Skip-link "Skip to content" as the first focusable element
- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<section aria-labelledby>`, `<footer>`
- All icon-only links carry `aria-label`
- `<img alt="…">` on every image (preserved from current HTML, augmented where missing)
- Typed-text role uses `aria-live="polite"` so screen readers announce role changes
- No motion for `prefers-reduced-motion`

---

## 3. Architecture

### 3.1 File changes

| Path | Action |
|------|--------|
| `index.html` | Full restructure with new semantic markup |
| `css/style.css` | Complete replacement (single file, ~600 lines) |
| `js/main.js` | **New.** Typed text, scroll reveal, mobile nav drawer, intersection observer, optional cursor ring |
| `js/dark.js` | **Remove** (delete the file; site is dark-first) |
| `js/index.js` | Replace contents with nav-toggle behavior for the new top-bar nav |
| `dfk-docs-revamp-Plans/portfolio-revamp-checklist.md` | Mark UI/UX items completed; leave as historical record |
| `portfolio-item*.html`, `img/*`, `files/*` | Untouched |

### 3.2 New `index.html` outline

```
<header>
  <a class="logo" href="#home">>_ dfk</a>
  <nav class="nav">
    <ul> [home, services, about, skills, work, education, contact] </ul>
  </nav>
</header>

<a class="skip-link" href="#main">Skip to content</a>

<main id="main">
  <section id="home" class="hero"> ... </section>
  <section id="services" class="services"> ... </section>
  <section id="about" class="experience"> ... </section>
  <section id="skills" class="skills"> ... </section>
  <section id="work" class="work"> ... </section>
  <section id="education" class="education"> ... </section>
</main>

<footer id="contact" class="contact-bar"> ... </footer>

<script src="js/main.js" defer></script>
<script src="js/index.js" defer></script>
```

Each `<section>` carries `aria-labelledby` pointing at its `h2`.

### 3.3 Component breakdown

Each visual component lives in `style.css` as a single block, named with BEM-lite (`hero__name`, `service__title`). No preprocessor; no framework.

- `header` (sticky, 64px tall, backdrop-filter blur on scroll)
- `.nav` (top-bar on `md+`, bottom-sheet on mobile)
- `.hero` + `.hero__name`, `.hero__caret`, `.hero__typed`, `.hero__cta-row`
- `.services` + `.service` (3-up bento, asymmetric grid)
- `.timeline` + `.timeline__rail` + `.timeline__entry` (left rail, right cards)
- `.skill-group` + `.chip` + `[data-tip]::after` (tooltip)
- `.work-grid` + `.work-tile` (large + 4 standard)
- `.edu-grid` + `.edu-block`
- `.contact-bar` (mint accent, flex row, social icons)

### 3.4 `js/main.js` responsibilities

```js
// 1. Typed-text: cycles through an array of role strings in the hero subtitle.
//    Strips to empty + writes each char with a small jitter, ~50ms per char,
//    holds 1s, deletes in reverse, pauses 300ms, moves to next.
// 2. Scroll reveal: Single IntersectionObserver on document, threshold 0.1.
//    Adds .is-visible to anything with [data-reveal]. Stagger via --i CSS var.
// 3. Nav drawer (mobile): toggles .nav-open on body when hamburger is pressed.
// 4. Header shadow on scroll: adds .is-scrolled to header after y > 8.
// 5. Cursor ring (desktop only, matches (pointer:fine)): single absolutely-
//    positioned div that lerps toward pointer coords using rAF.
// 6. Reduced motion: at module top, checks matchMedia('(prefers-reduced-motion: reduce)'),
//    passes a flag down so the typed-text and scroll-reveal code paths can short-
//    circuit to instant state.
// 7. ARIA: each animated section gets aria-hidden="true" until revealed, then false.
```

All exports stay off — loaded as a single `<script src="js/main.js" defer>`.

---

## 4. Content (carried over from current `index.html`)

Content is preserved exactly except where the new structure calls for bullets or different ordering.

### Hero
- Name: **Daud Farzand**
- Typed role strings (cycled):
  1. "AI Platform Engineer"
  2. "RAG & LLM Infrastructure Specialist"
  3. "MLOps · Vertex AI · AWS Bedrock"

### Services (3 tiles)
1. RAG & LLM Infrastructure — current paragraph verbatim
2. AI Platform & MLOps — current paragraph verbatim
3. Observability & Cloud Infra — current paragraph verbatim

### Experience (timeline cards, new bullets)

**Tech Prysm** · AI Platform Infrastructure Engineer · Oct 2025 – Present · `now`
- Production RAG pipelines with 40% accuracy lift
- MCP infrastructure, 70% integration time reduction
- Vertex AI workloads at 99.9% uptime
- CI/CD for ML models (GitHub Actions, Terraform)
- Observability stack (Prometheus, Grafana, OpenTelemetry)
- Vector DB infra for 10M+ chunks, sub-second query latency
- 35% LLM cost reduction via prompt caching + streaming

**Techanzy Limited** · AI Platform Engineer · May 2024 – Sept 2025
- Architected `ServeLLM`, a privacy-first OpenAI-compatible LLM platform
- SSE streaming with <50ms time-to-first-token
- Token tracking & billing with real-time analytics
- Hybrid-cloud inference (AWS + GCP + on-prem GPU)
- 5-tier RBAC, multi-tenant SaaS
- <1.5GB memory footprint per service

**Programmer's Force Pvt Ltd** · DevOps Engineer · Jan 2023 – Mar 2024
- Containerized apps with Docker
- GitLab CI/CD pipelines
- Ansible config automation
- Grafana / Prometheus monitoring
- Backup, recovery, and rebuild playbooks
- Kubernetes security hardening (RBAC, policies)

**Unmatched Resumes LLC** · Technology Director · Mar 2022 – Dec 2022
- Led WordPress web platform, 30% engagement lift
- Managed release pipeline & product backlog
- Drove engineering capacity planning

### Skills (chips, by category)
- **// ai_ml** — RAG pipelines · Model Context Protocol (MCP) · Vertex AI · Ollama · OpenAI API · LangChain · tiktoken · Embedding models · pgvector · Pinecone · Weaviate · Chroma
- **// backend_frontend** — FastAPI · Python 3.11+ · REST · SSE streaming · gRPC · microservices · Next.js 15 · React 19 · TypeScript · Tailwind CSS · SSR
- **// cloud_devops** — Vertex AI · Cloud Run · GKE · BigQuery · EC2 · EKS · S3 · Lambda · Bedrock · Docker · Kubernetes · Helm · ArgoCD · Terraform · Ansible · WireGuard
- **// data** — PostgreSQL · pgvector · PgBouncer · Redis · SQLAlchemy · Alembic · MinIO · Google Cloud Storage
- **// observability** — Prometheus · Grafana · OpenTelemetry · real-time dashboards · model-drift detection
- **// security_auth** — JWT · API-key management · 5-tier RBAC · middleware auth · OAuth2 · secrets management

### Work (5 tiles, image paths unchanged)
1. ServeLLM — `portfolio-item.html` → `img/fightclub-thumb.png`
2. Enterprise RAG Pipeline — `portfolio-item02.html` → `img/meanbabies-thumb.png`
3. AI/ML Observability Stack — `portfolio-item03.html` → `img/soltars-thumb.png`
4. Vector Database Infrastructure — `portfolio-item04.html` → `img/zealous-benz-thumb.png`
5. Hybrid-Cloud LLM Deployment — `portfolio-item05.html` → `img/portfolio-05.jpg`

### Education
- **Degree**: Bachelor's in Machine Learning & Artificial Intelligence, Goldsmiths, University of London (2023)
- **Certifications**: Google IT Support Specialization · Google Data Analytics Specialization · Google Digital Product Management

### Contact (footer accent bar)
- Email: `mailto:daudfarzand89@gmail.com` (label "daudfarzand89@gmail.com")
- Phone: `tel:+923455137420` (label "(92) 345-5137420")
- Location: "Lahore, Pakistan"
- Socials: LinkedIn · GitHub · Instagram · Resume (PDF link unchanged)

---

## 5. Removed / Replaced

- Removed: `<dark-mode-toggle>` element, `js/dark.js` import, `js/dark.js` file
- Removed: the red (`#f8333c`) accent throughout — replaced by mint-green
- Removed: inline `style="background-image:none"` hack on `#skills`
- Removed: section background image `img/services-bg.jpg` (replaced by solid `--bg-1`)
- Removed: the original `.section__subtitle` red-bar pill design (replaced by section dividers + mono labels)

---

## 6. Testing & Verification

- Manual: load `index.html` directly in Chrome, Safari, Firefox at the six breakpoint widths; check no horizontal overflow
- Lighthouse: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95 on `file://` (or `python -m http.server`)
- Keyboard: tab through entire page, every focus-visible ring visible
- Reduced motion: toggle OS setting, reload, confirm no animation
- Screen reader (VoiceOver or NVDA): skip-link works, each `<section>` is announced by its heading
- Wave or axe DevTools: 0 critical, 0 serious violations
- Click each work tile: links open correct `portfolio-item*.html`

---

## 7. Out of Scope

- Restyling the seven `portfolio-item*.html` sub-pages
- Adding a real contact form (mailto is sufficient)
- Building a CMS or content layer
- Internationalization beyond the existing English
- Replacing the existing thumbnail images with new ones
- Backend changes

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Mint-green on near-black may feel cold to some viewers | The body text is warm-neutral `#e6e6e6`; accent is used sparingly on borders, dots, and one bar only |
| JetBrains Mono for headings could reduce legibility at small sizes | Body and prose use Inter; mono is reserved for display-only elements and labels |
| Cursor ring could be distracting or janky on low-end devices | Listener checks `(pointer:fine)`, gatekeeps to ≥1024px, throttles via rAF, auto-disables when reduced-motion is set |
| Sub-page navigation breaks if CSS classes change names | Work tile links use plain `<a href="portfolio-item*.html">` — no JS dependency for navigation |
| Static site hosted on GitHub Pages — JS errors could break page | All animations are progressive enhancements; without JS the page is fully readable and reachable |
