# DFK Portfolio "Dev Terminal" Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `index.html` and `css/style.css` against the approved design spec at `docs/superpowers/specs/2026-08-10-dfk-portfolio-revamp-design.md`, plus add `js/main.js` for interactions. Drop the deprecated dark-mode toggle. Leave all `portfolio-item*.html` sub-pages and `img/*` assets untouched.

**Architecture:** Single dark theme, mobile-first, vanilla HTML/CSS/JS with three JS responsibilities — typed-text hero, scroll-reveal via IntersectionObserver, mobile bottom-sheet nav. All animations are progressive enhancements; the page must be fully readable without JS.

**Tech Stack:** HTML5, CSS (custom properties, grid, clamp), vanilla JS, Google Fonts (JetBrains Mono + Inter), Font Awesome 5, plain `<img>` references to existing files in `img/`. No bundler, no framework, no test framework.

**Testing approach:** This project has no test framework (`package.json` only declares `dark-mode-toggle` as a dep; no `npm test` script exists). For a static visual portfolio, automated unit tests cannot meaningfully verify design or layout. Instead, **each task ends with a manual verification step**: open `index.html` (or serve via `python3 -m http.server`), check at the relevant breakpoint with DevTools, confirm the spec requirements that task owns. The **final task** runs a consolidated checklist (breakpoints, Lighthouse, axe, keyboard, reduced-motion).

---

## File Structure

| File | Responsibility |
|------|---------------|
| `index.html` | New semantic markup, six `<section>`s + footer contact bar |
| `css/style.css` | Full replacement — tokens, layout, components, motion, a11y, responsive |
| `js/main.js` | Typed-text, scroll reveal, mobile nav drawer, header scroll shadow, cursor ring, reduced-motion short-circuit |
| `js/index.js` | Top-bar nav toggle behavior (opens/closes mobile drawer) |
| `js/dark.js` | **Delete** — no longer needed |

Sub-pages (`portfolio-item*.html`, `tech-for-2024.html`, `sql.html`, `files/*`, `img/*`) are NOT touched.

---

## Task 1: Clean up deprecated dark-mode plumbing

**Files:**
- Delete: `js/dark.js`
- Modify: `index.html:19` — remove `<script src="/js/dark.js" type="module">`
- Modify: `index.html:23-25` — remove `<dark-mode-toggle>…</dark-mode-toggle>` comment + element
- Modify: `css/style.css` later in Task 2; nothing to remove here

- [ ] **Step 1: Confirm the dark-mode files**

Read `js/dark.js` (referenced at line 19 of `index.html`) to verify it only loads `dark-mode-toggle` and toggles `body.classList`. Delete it.

```bash
rm /home/dfk/Desktop/DFK-Portfolio/dfk007.github.io/js/dark.js
```

- [ ] **Step 2: Remove the import from `index.html`**

Locate line 19:
```html
<script src="/js/dark.js" type="module"></script>
```

Delete that line. (The full rebuild in Task 5 rewrites the whole file, but doing this now keeps incremental diffs clean.)

- [ ] **Step 3: Remove the dark-mode-toggle element**

Locate lines 22–25:
```html
<body>
<!--    dark-mode-toggle-->
<dark-mode-toggle></dark-mode-toggle>
<!--    -->
  <header>
```

Remove the two `<!-- -->`-wrapper lines and the `<dark-mode-toggle></dark-mode-toggle>` element, leaving a blank line between `<body>` and `<header>`.

- [ ] **Step 4: Verify the page still parses**

```bash
python3 -c "from html.parser import HTMLParser; HTMLParser().feed(open('/home/dfk/Desktop/DFK-Portfolio/dfk007.github.io/index.html').read()); print('ok')"
```

Expected: `ok`

- [ ] **Step 5: Commit**

```bash
git add js/dark.html 2>/dev/null; git rm js/dark.js
git add index.html
git commit -m "chore: remove deprecated dark-mode-toggle and dark.js"
```

---

## Task 2: Replace `css/style.css` with the dark terminal foundation

**Files:**
- Modify: `css/style.css` — full replacement

This task sets all design tokens, typography, base reset, layout primitives, and the responsive container. Component-specific blocks (hero, services, timeline, skills, work, education, footer) are owned by Tasks 3–8 and stacked *below* the foundation. **Strategy:** write the foundation now, leave component blocks as section markers with TODO comments, then fill them in the next tasks. Every task inserts its own block *above* the closing `}` of `style.css`. The plan uses one `edit` per component insertion to keep diffs reviewable.

- [ ] **Step 1: Write the complete foundation block**

Replace `css/style.css` with:

```css
/* =============================================================
   DFK Portfolio — Dev Terminal
   Foundation: tokens, reset, type, layout, motion, a11y
   ============================================================= */

:root {
    /* surfaces */
    --bg-0: #0a0a0b;
    --bg-1: #111114;
    --bg-2: #16161a;
    --border: #1f1f24;

    /* text */
    --text: #e6e6e6;
    --muted: #8a8a92;

    /* accents */
    --accent: #7cffb3;
    --accent-dim: #3aa877;
    --danger: #ff6b6b;

    /* type */
    --ff-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    --ff-body: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;

    /* fluid display */
    --fs-h1: clamp(2.5rem, 6vw + 1rem, 5.25rem);
    --fs-h2: clamp(1.75rem, 3vw + 1rem, 3rem);
    --fs-h3: clamp(1.125rem, 1vw + 0.875rem, 1.375rem);
    --fs-body: 1rem;
    --fs-small: 0.875rem;

    /* spacing & motion */
    --r-sm: 6px;
    --r-md: 10px;
    --r-lg: 14px;
    --shadow-1: 0 1px 0 rgba(255,255,255,.02) inset, 0 0 0 1px var(--border);
    --shadow-glow: 0 0 0 1px var(--accent-dim), 0 0 24px -8px var(--accent);
    --ease-out: cubic-bezier(.2, .8, .2, 1);
    --dur-fast: 200ms;
    --dur-mid: 350ms;
    --dur-slow: 600ms;
}

/* reset */
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body {
    margin: 0;
    background: var(--bg-0);
    color: var(--text);
    font-family: var(--ff-body);
    font-size: var(--fs-body);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    overflow-x: hidden;
}
img, svg { display: block; max-width: 100%; }
button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
a { color: inherit; text-decoration: none; }
ul, ol { padding: 0; margin: 0; list-style: none; }
:focus { outline: none; }
:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
    border-radius: var(--r-sm);
}

/* skip link */
.skip-link {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0.75rem 1rem;
    background: var(--accent);
    color: var(--bg-0);
    font-weight: 700;
    transform: translateY(-200%);
    transition: transform var(--dur-fast) var(--ease-out);
    z-index: 1000;
}
.skip-link:focus-visible { transform: translateY(0); }

/* layout container */
.container {
    width: 100%;
    max-width: 1200px;
    margin-inline: auto;
    padding-inline: clamp(1rem, 4vw, 2rem);
}

/* section */
section {
    padding-block: clamp(4rem, 8vw, 7rem);
}
section[data-reveal] {
    opacity: 0;
    transform: translateY(8px);
    transition: opacity var(--dur-slow) var(--ease-out),
                transform var(--dur-slow) var(--ease-out);
    transition-delay: calc(var(--i, 0) * 60ms);
}
section.is-visible {
    opacity: 1;
    transform: translateY(0);
}

/* headings */
h1, h2, h3 { margin: 0; line-height: 1.1; letter-spacing: -0.02em; }
h1 { font-size: var(--fs-h1); font-family: var(--ff-mono); font-weight: 700; }
h2 { font-size: var(--fs-h2); font-weight: 600; }
h3 { font-size: var(--fs-h3); font-weight: 600; }

strong { font-weight: 600; }

/* mono labels */
.mono-label {
    display: inline-block;
    font-family: var(--ff-mono);
    font-size: var(--fs-small);
    color: var(--accent);
    text-transform: lowercase;
    letter-spacing: 0.02em;
    margin-bottom: 0.75rem;
}
.mono-label::before { content: '// '; opacity: .6; }

/* hairline divider */
hr.rule {
    border: 0;
    border-top: 1px solid var(--border);
    margin: 2rem 0;
}

/* reduced motion */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
        scroll-behavior: auto !important;
    }
    section[data-reveal] { opacity: 1; transform: none; }
    .cursor-ring { display: none; }
}

/* =============================================================
   Component blocks are appended below by Tasks 3-8
   ============================================================= */
```

Use `write` to overwrite `css/style.css`.

- [ ] **Step 2: Verify the file is syntactically valid**

```bash
python3 -c "
import re
css = open('/home/dfk/Desktop/DFK-Portfolio/dfk007.github.io/css/style.css').read()
opens = css.count('{')
closes = css.count('}')
assert opens == closes, f'unbalanced braces: {opens} vs {closes}'
print(f'css ok ({opens} rules)')
"
```

Expected: `css ok (NN rules)` (any non-zero number matching between opens and closes).

- [ ] **Step 3: Check it visually**

```bash
cd /home/dfk/Desktop/DFK-Portfolio/dfk007.github.io && python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8000/index.html
kill $SERVER_PID 2>/dev/null
```

Expected: `200`. (The page will look wrong since components are not yet defined — that is expected. The verification here is that the file doesn't break the request pipeline.)

- [ ] **Step 4: Commit**

```bash
git add css/style.css
git commit -m "feat(css): add dark terminal foundation — tokens, layout, a11y, motion"
```

---

## Task 3: Add header + nav (top bar on desktop, bottom-sheet on mobile)

**Files:**
- Modify: `css/style.css` — append header/nav blocks (above the closing `/* ====` marker)
- Modify: `index.html` — Task 5 will rewrite the file fully; here we only stage the CSS

- [ ] **Step 1: Append header + nav CSS**

Insert before `/* =====` marker at end of `css/style.css`:

```css
/* =============================================================
   Header + Nav
   ============================================================= */

.header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(10, 10, 11, 0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid transparent;
    transition: border-color var(--dur-mid) var(--ease-out);
}
.header.is-scrolled {
    border-bottom-color: var(--border);
}
.header__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
}
.logo {
    font-family: var(--ff-mono);
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.02em;
}
.logo:hover { color: var(--accent); }

.nav__list {
    display: none;
    gap: 1.75rem;
    align-items: center;
}
.nav__link {
    position: relative;
    font-size: 0.9375rem;
    color: var(--muted);
    padding: 0.5rem 0;
    transition: color var(--dur-fast) var(--ease-out);
}
.nav__link::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: var(--accent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 250ms var(--ease-out);
}
.nav__link:hover,
.nav__link:focus-visible,
.nav__link[aria-current="true"] {
    color: var(--text);
}
.nav__link:hover::after,
.nav__link:focus-visible::after,
.nav__link[aria-current="true"]::after {
    transform: scaleX(1);
}

.nav-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: var(--r-sm);
}
.nav-toggle:hover { background: var(--bg-2); }
.hamburger,
.hamburger::before,
.hamburger::after {
    content: '';
    display: block;
    background: var(--text);
    width: 20px;
    height: 2px;
    border-radius: 2px;
    position: relative;
    transition: transform var(--dur-mid) var(--ease-out);
}
.hamburger::before { position: absolute; top: -6px; left: 0; }
.hamburger::after  { position: absolute; top: 6px;  left: 0; }
body.nav-open .hamburger { background: transparent; }
body.nav-open .hamburger::before { transform: translateY(6px) rotate(45deg); }
body.nav-open .hamburger::after  { transform: translateY(-6px) rotate(-45deg); }

/* mobile drawer */
@media (max-width: 767px) {
    .nav {
        position: fixed;
        inset: 64px 0 auto 0;
        background: var(--bg-0);
        border-top: 1px solid var(--border);
        max-height: 0;
        overflow: hidden;
        transition: max-height var(--dur-mid) var(--ease-out);
    }
    body.nav-open .nav { max-height: calc(100vh - 64px); }
    .nav__list {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 0;
        padding: 1rem;
    }
    .nav__link {
        display: block;
        font-family: var(--ff-mono);
        font-size: 1rem;
        padding: 0.875rem 0.5rem;
        border-bottom: 1px solid var(--border);
    }
    .nav__link::after { display: none; }
}

@media (min-width: 768px) {
    .nav__list { display: flex; }
    .nav-toggle { display: none; }
}
```

The end-of-file `/* =====` marker must remain the literal last line.

- [ ] **Step 2: Quick syntax check**

```bash
python3 -c "
css = open('/home/dfk/Desktop/DFK-Portfolio/dfk007.github.io/css/style.css').read()
print(f'opens={css.count(chr(123))} closes={css.count(chr(125))}')
"
```

Expected: `opens=… closes=…` with **equal numbers**.

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat(css): header + nav (sticky top bar, mobile drawer)"
```

---

## Task 4: Add hero section CSS

**Files:**
- Modify: `css/style.css` — append hero block before the marker

- [ ] **Step 1: Append hero CSS**

Insert before `/* =====` marker:

```css
/* =============================================================
   Hero
   ============================================================= */

.hero {
    position: relative;
    min-height: clamp(560px, 90vh, 900px);
    padding-top: clamp(3rem, 8vw, 6rem);
    overflow: hidden;
    isolation: isolate;
}
.hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(124,255,179,.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(124,255,179,.04) 1px, transparent 1px);
    background-size: 32px 32px;
    mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
    z-index: -1;
    pointer-events: none;
}
.hero::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 60%, var(--bg-0));
    z-index: -1;
    pointer-events: none;
}
.hero__inner {
    display: grid;
    gap: clamp(2rem, 4vw, 3rem);
    align-items: center;
    grid-template-columns: 1fr;
}
@media (min-width: 768px) {
    .hero__inner {
        grid-template-columns: 1.4fr 1fr;
    }
}

.hero__name {
    font-family: var(--ff-mono);
    font-weight: 700;
    line-height: 1.05;
    margin: 0 0 1rem;
    word-break: break-word;
}
.hero__name-prompt { color: var(--accent); margin-right: 0.5rem; }
.hero__caret {
    display: inline-block;
    width: 0.6ch;
    color: var(--accent);
    animation: blink 1.05s steps(2) infinite;
    margin-left: 2px;
}
@keyframes blink { 50% { opacity: 0; } }

.hero__typed {
    font-family: var(--ff-mono);
    font-size: clamp(1.0625rem, 1.5vw + .85rem, 1.4375rem);
    color: var(--accent);
    min-height: 1.6em;
    margin-bottom: 1.5rem;
}
.hero__typed[aria-live="polite"] { outline: none; }

.hero__lede {
    color: var(--muted);
    max-width: 52ch;
    margin: 0 0 2rem;
    font-size: 1.0625rem;
}

.hero__cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
}
.btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    border-radius: var(--r-md);
    font-family: var(--ff-mono);
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    border: 1px solid transparent;
    transition: transform var(--dur-fast) var(--ease-out),
                background-color var(--dur-fast) var(--ease-out),
                border-color var(--dur-fast) var(--ease-out);
}
.btn--primary {
    background: var(--accent);
    color: var(--bg-0);
}
.btn--primary:hover { transform: translateY(-1px); background: var(--accent-dim); }
.btn--ghost {
    background: transparent;
    border-color: var(--border);
    color: var(--text);
}
.btn--ghost:hover { border-color: var(--accent); color: var(--accent); }

.status-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--bg-1);
    font-family: var(--ff-mono);
    font-size: 0.8125rem;
    color: var(--muted);
    width: max-content;
}
.status-pill__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 0 0 var(--accent);
    animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(124,255,179,.6); }
    50%      { box-shadow: 0 0 0 6px rgba(124,255,179,0); }
}

/* hero portrait card */
.hero__portrait {
    position: relative;
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    overflow: hidden;
    background: var(--bg-1);
    aspect-ratio: 4 / 5;
    max-width: 360px;
    margin-inline: auto;
}
.hero__portrait img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: contrast(1.05) saturate(0.95);
}
.hero__portrait::before,
.hero__portrait::after {
    content: '';
    position: absolute;
    width: 14px;
    height: 14px;
    border: 1px solid var(--accent);
}
.hero__portrait::before {
    top: 10px;
    left: 10px;
    border-right: 0;
    border-bottom: 0;
}
.hero__portrait::after {
    bottom: 10px;
    right: 10px;
    border-left: 0;
    border-top: 0;
}
@media (max-width: 767px) {
    .hero__portrait { aspect-ratio: 1 / 1; max-width: 240px; }
}
```

- [ ] **Step 2: Verify brace balance**

```bash
python3 -c "
css = open('/home/dfk/Desktop/DFK-Portfolio/dfk007.github.io/css/style.css').read()
o, c = css.count(chr(123)), css.count(chr(125))
print(f'opens={o} closes={c} {\"OK\" if o==c else \"MISMATCH\"}')
"
```

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat(css): hero — name, typed-text, CTAs, portrait card, grid bg"
```

---

## Task 5: Rebuild `index.html` — full restructure

**Files:**
- Modify: `index.html` — full rewrite

This is the main content task. The new file wires together everything the components in Tasks 6–8 expect.

- [ ] **Step 1: Write the new `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Daud Farzand — AI Platform Engineer specializing in RAG pipelines, Model Context Protocol, and LLM infrastructure on Vertex AI and AWS." />
  <meta name="theme-color" content="#0a0a0b" />
  <title>Daud Farzand — AI Platform Engineer</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%230a0a0b'/%3E%3Ctext x='8' y='44' font-family='monospace' font-size='40' font-weight='700' fill='%237cffb3'%3E%26gt;_%3C/text%3E%3C/svg%3E" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css" rel="stylesheet" />
  <link href="css/style.css" rel="stylesheet" />
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="header">
    <div class="container header__inner">
      <a class="logo" href="#home">&gt;_&nbsp;dfk</a>
      <nav class="nav" aria-label="Primary">
        <ul class="nav__list">
          <li><a class="nav__link" href="#home">home</a></li>
          <li><a class="nav__link" href="#services">services</a></li>
          <li><a class="nav__link" href="#about">experience</a></li>
          <li><a class="nav__link" href="#skills">skills</a></li>
          <li><a class="nav__link" href="#work">work</a></li>
          <li><a class="nav__link" href="#education">education</a></li>
          <li><a class="nav__link" href="#contact">contact</a></li>
        </ul>
      </nav>
      <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
        <span class="hamburger" aria-hidden="true"></span>
      </button>
    </div>
  </header>

  <main id="main">
    <!-- Hero -->
    <section id="home" class="hero" data-reveal aria-labelledby="home-h">
      <div class="container hero__inner">
        <div>
          <span class="status-pill"><span class="status-pill__dot" aria-hidden="true"></span>available · lahore, pk</span>
          <h1 id="home-h" class="hero__name">
            <span class="hero__name-prompt">&gt;</span>daud_farzand<span class="hero__caret" aria-hidden="true"></span>
          </h1>
          <p class="hero__typed" aria-live="polite" data-typed='["AI Platform Engineer","RAG & LLM Infrastructure Specialist","MLOps · Vertex AI · AWS Bedrock"]'></p>
          <p class="hero__lede">AI Platform Infrastructure Engineer specializing in RAG pipelines, Model Context Protocol (MCP), and LLM serving on Google Cloud (Vertex AI) and AWS. I ship multi-tenant SaaS for AI with enterprise-grade observability and cost optimization.</p>
          <div class="hero__cta-row">
            <a class="btn btn--primary" href="#work">View Work →</a>
            <a class="btn btn--ghost" href="#contact">Get in Touch</a>
          </div>
        </div>
        <figure class="hero__portrait" aria-hidden="true">
          <img alt="" src="img/pp.jfif" />
        </figure>
      </div>
    </section>

    <!-- Services -->
    <section id="services" class="services" data-reveal aria-labelledby="services-h">
      <div class="container">
        <span class="mono-label">what_i_do</span>
        <h2 id="services-h">Three pillars of AI platform engineering.</h2>
        <div class="services__grid">
          <article class="service">
            <span class="service__index">01</span>
            <h3 class="service__title">RAG &amp; LLM Infrastructure</h3>
            <p>I build production RAG pipelines with the Model Context Protocol (MCP), manage vector databases (pgvector, Pinecone, Weaviate, Chroma), and serve LLMs through OpenAI-compatible APIs with token tracking and per-tenant analytics.</p>
          </article>
          <article class="service">
            <span class="service__index">02</span>
            <h3 class="service__title">AI Platform &amp; MLOps</h3>
            <p>I architect multi-tenant SaaS for AI workloads on FastAPI and Next.js 15, deploy inference on Vertex AI and AWS Bedrock, and ship ML models through GitHub Actions, GitLab CI/CD, Terraform, and ArgoCD.</p>
          </article>
          <article class="service">
            <span class="service__index">03</span>
            <h3 class="service__title">Observability &amp; Cloud Infra</h3>
            <p>I run Docker, Kubernetes, and Helm on hybrid cloud (AWS, GCP, on-prem GPU), instrument AI/ML workloads with Prometheus, Grafana, and OpenTelemetry, and tune inference cost, latency, and uptime.</p>
          </article>
        </div>
        <a class="btn btn--ghost" href="#work" style="margin-top:3rem;">See all projects →</a>
      </div>
    </section>

    <!-- Experience -->
    <section id="about" class="experience" data-reveal aria-labelledby="about-h">
      <div class="container">
        <span class="mono-label">experience.log</span>
        <h2 id="about-h">Where I've shipped AI infrastructure.</h2>
        <ol class="timeline">
          <li class="timeline__entry">
            <span class="timeline__year">2025 — now</span>
            <div class="timeline__card">
              <header class="timeline__card-head">
                <h3>Tech Prysm <span class="timeline__role">· AI Platform Infrastructure Engineer</span></h3>
                <span class="timeline__now">now</span>
              </header>
              <ul class="timeline__bullets">
                <li>Production RAG pipelines with 40% accuracy lift</li>
                <li>MCP infrastructure; 70% integration time reduction</li>
                <li>Vertex AI workloads at 99.9% uptime</li>
                <li>CI/CD for ML models (GitHub Actions, Terraform)</li>
                <li>Observability stack (Prometheus, Grafana, OpenTelemetry)</li>
                <li>Vector DB infra for 10M+ chunks, sub-second query latency</li>
                <li>35% LLM cost reduction via prompt caching and streaming</li>
              </ul>
            </div>
          </li>
          <li class="timeline__entry">
            <span class="timeline__year">2024 — 2025</span>
            <div class="timeline__card">
              <header class="timeline__card-head">
                <h3>Techanzy Limited <span class="timeline__role">· AI Platform Engineer</span></h3>
              </header>
              <ul class="timeline__bullets">
                <li>Architected <em>ServeLLM</em>, a privacy-first OpenAI-compatible LLM platform</li>
                <li>SSE streaming with &lt; 50ms time-to-first-token</li>
                <li>Token tracking &amp; billing with real-time analytics</li>
                <li>Hybrid-cloud inference (AWS + GCP + on-prem GPU)</li>
                <li>5-tier RBAC, multi-tenant SaaS</li>
                <li>&lt; 1.5GB memory footprint per service</li>
              </ul>
            </div>
          </li>
          <li class="timeline__entry timeline__entry--archival">
            <span class="timeline__year">2023 — 2024</span>
            <div class="timeline__card">
              <header class="timeline__card-head">
                <h3>Programmer's Force Pvt Ltd <span class="timeline__role">· DevOps Engineer</span></h3>
              </header>
              <ul class="timeline__bullets">
                <li>Containerized apps with Docker</li>
                <li>GitLab CI/CD pipelines</li>
                <li>Ansible config automation</li>
                <li>Grafana / Prometheus monitoring</li>
                <li>Backup, recovery, and rebuild playbooks</li>
                <li>Kubernetes security hardening (RBAC, policies)</li>
              </ul>
            </div>
          </li>
          <li class="timeline__entry timeline__entry--archival">
            <span class="timeline__year">2022 — 2022</span>
            <div class="timeline__card">
              <header class="timeline__card-head">
                <h3>Unmatched Resumes LLC <span class="timeline__role">· Technology Director</span></h3>
              </header>
              <ul class="timeline__bullets">
                <li>Led WordPress web platform, 30% engagement lift</li>
                <li>Managed release pipeline &amp; product backlog</li>
                <li>Drove engineering capacity planning</li>
              </ul>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <!-- Skills -->
    <section id="skills" class="skills" data-reveal aria-labelledby="skills-h">
      <div class="container">
        <span class="mono-label">stack</span>
        <h2 id="skills-h">Six categories of daily driver.</h2>
        <div class="skill-groups">
          <div class="skill-group">
            <h3 class="skill-group__title">// ai_ml</h3>
            <ul class="skill-chips">
              <li>RAG pipelines</li><li>Model Context Protocol (MCP)</li><li>Vertex AI</li><li>Ollama</li><li>OpenAI API</li><li>LangChain</li><li>tiktoken</li><li>Embedding models</li><li>pgvector</li><li>Pinecone</li><li>Weaviate</li><li>Chroma</li>
            </ul>
          </div>
          <div class="skill-group">
            <h3 class="skill-group__title">// backend_frontend</h3>
            <ul class="skill-chips">
              <li>FastAPI</li><li>Python 3.11+</li><li>REST</li><li>SSE streaming</li><li>gRPC</li><li>microservices</li><li>Next.js 15</li><li>React 19</li><li>TypeScript</li><li>Tailwind CSS</li><li>SSR</li>
            </ul>
          </div>
          <div class="skill-group">
            <h3 class="skill-group__title">// cloud_devops</h3>
            <ul class="skill-chips">
              <li>Vertex AI</li><li>Cloud Run</li><li>GKE</li><li>BigQuery</li><li>EC2</li><li>EKS</li><li>S3</li><li>Lambda</li><li>Bedrock</li><li>Docker</li><li>Kubernetes</li><li>Helm</li><li>ArgoCD</li><li>Terraform</li><li>Ansible</li><li>WireGuard</li>
            </ul>
          </div>
          <div class="skill-group">
            <h3 class="skill-group__title">// data</h3>
            <ul class="skill-chips">
              <li>PostgreSQL</li><li>pgvector</li><li>PgBouncer</li><li>Redis</li><li>SQLAlchemy</li><li>Alembic</li><li>MinIO</li><li>Google Cloud Storage</li>
            </ul>
          </div>
          <div class="skill-group">
            <h3 class="skill-group__title">// observability</h3>
            <ul class="skill-chips">
              <li>Prometheus</li><li>Grafana</li><li>OpenTelemetry</li><li>real-time dashboards</li><li>model-drift detection</li>
            </ul>
          </div>
          <div class="skill-group">
            <h3 class="skill-group__title">// security_auth</h3>
            <ul class="skill-chips">
              <li>JWT</li><li>API-key management</li><li>5-tier RBAC</li><li>middleware auth</li><li>OAuth2</li><li>secrets management</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Work -->
    <section id="work" class="work" data-reveal aria-labelledby="work-h">
      <div class="container">
        <span class="mono-label">selected_work</span>
        <h2 id="work-h">Five projects that pay the bills.</h2>
        <div class="work-grid">
          <a class="work-tile work-tile--large" href="portfolio-item.html">
            <div class="work-tile__media"><img alt="ServeLLM — privacy-first OpenAI-compatible LLM platform" src="img/fightclub-thumb.png" /></div>
            <div class="work-tile__body">
              <span class="work-tile__tag">flagship</span>
              <h3>ServeLLM</h3>
              <p>Privacy-first OpenAI-compatible LLM platform with SSE streaming, token tracking, and hybrid-cloud inference.</p>
              <ul class="work-tile__chips"><li>FastAPI</li><li>Next.js 15</li><li>Ollama</li><li>PostgreSQL</li></ul>
            </div>
          </a>
          <a class="work-tile" href="portfolio-item02.html">
            <div class="work-tile__media"><img alt="Enterprise RAG Pipeline — pgvector + Vertex AI, 40% accuracy lift" src="img/meanbabies-thumb.png" /></div>
            <div class="work-tile__body">
              <h3>Enterprise RAG Pipeline</h3>
              <p>pgvector + Vertex AI — 40% accuracy lift, 10M+ chunks.</p>
              <ul class="work-tile__chips"><li>pgvector</li><li>Vertex AI</li><li>LangChain</li></ul>
            </div>
          </a>
          <a class="work-tile" href="portfolio-item03.html">
            <div class="work-tile__media"><img alt="AI/ML Observability Stack — Prometheus, Grafana, OpenTelemetry" src="img/soltars-thumb.png" /></div>
            <div class="work-tile__body">
              <h3>AI/ML Observability Stack</h3>
              <p>Real-time monitoring of model latency, token usage, retrieval accuracy.</p>
              <ul class="work-tile__chips"><li>Prometheus</li><li>Grafana</li><li>OpenTelemetry</li></ul>
            </div>
          </a>
          <a class="work-tile" href="portfolio-item04.html">
            <div class="work-tile__media"><img alt="Vector Database Infrastructure — 10M+ chunks, sub-second queries" src="img/zealous-benz-thumb.png" /></div>
            <div class="work-tile__body">
              <h3>Vector DB Infrastructure</h3>
              <p>10M+ embeddings with sub-second semantic search.</p>
              <ul class="work-tile__chips"><li>Pinecone</li><li>pgvector</li></ul>
            </div>
          </a>
          <a class="work-tile" href="portfolio-item05.html">
            <div class="work-tile__media"><img alt="Hybrid-Cloud LLM Deployment — AWS, GCP, on-prem GPU" src="img/portfolio-05.jpg" /></div>
            <div class="work-tile__body">
              <h3>Hybrid-Cloud LLM</h3>
              <p>AWS + GCP + on-prem GPU orchestration for low-latency inference.</p>
              <ul class="work-tile__chips"><li>AWS Bedrock</li><li>ArgoCD</li><li>Helm</li></ul>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Education -->
    <section id="education" class="education" data-reveal aria-labelledby="education-h">
      <div class="container">
        <span class="mono-label">education</span>
        <h2 id="education-h">Foundations and credentials.</h2>
        <div class="education__grid">
          <div class="education__block">
            <h3>Degree</h3>
            <p class="education__primary">Bachelor's in Machine Learning &amp; Artificial Intelligence</p>
            <p class="education__meta">Goldsmiths, University of London · 2023</p>
          </div>
          <hr class="rule" />
          <div class="education__block">
            <h3>Certifications</h3>
            <ul class="education__list">
              <li>Google IT Support Specialization</li>
              <li>Google Data Analytics Specialization</li>
              <li>Google Digital Product Management</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Contact footer -->
  <footer id="contact" class="contact-bar" data-reveal aria-labelledby="contact-h">
    <div class="container contact-bar__inner">
      <div>
        <h2 id="contact-h" class="contact-bar__headline">let's ship something.</h2>
        <p class="contact-bar__lede">Open to AI platform, RAG infrastructure, and MLOps roles or consulting.</p>
      </div>
      <div class="contact-bar__grid">
        <a class="contact-bar__link" href="mailto:daudfarzand89@gmail.com"><i class="fas fa-envelope" aria-hidden="true"></i>daudfarzand89@gmail.com</a>
        <a class="contact-bar__link" href="tel:+923455137420"><i class="fas fa-phone" aria-hidden="true"></i>(92) 345-5137420</a>
        <p class="contact-bar__link"><i class="fas fa-location-dot" aria-hidden="true"></i>Lahore, Pakistan</p>
      </div>
      <ul class="contact-bar__socials" aria-label="Social profiles">
        <li><a href="https://www.linkedin.com/in/daud-farzand-982743192/" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin" aria-hidden="true"></i></a></li>
        <li><a href="https://github.com/dfk007" target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github" aria-hidden="true"></i></a></li>
        <li><a href="https://www.instagram.com/twenty_second_savage/" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a></li>
        <li><a href="./files/Daud_Farzand_Resume_2026_v2.pdf" target="_blank" rel="noopener" aria-label="Download resume">RESUME</a></li>
      </ul>
    </div>
    <p class="contact-bar__small">© <span id="year"></span> daud farzand · built with vanilla web</p>
  </footer>

  <script src="js/main.js" defer></script>
  <script src="js/index.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Validate HTML**

```bash
python3 -c "
from html.parser import HTMLParser
class V(HTMLParser):
    def __init__(self): super().__init__(); self.errs=[]
    def error(self, m): self.errs.append(m)
v = V()
v.feed(open('/home/dfk/Desktop/DFK-Portfolio/dfk007.github.io/index.html').read())
print('html ok' if not v.errs else v.errs)
"
```

Expected: `html ok`.

- [ ] **Step 3: Confirm every section id from the nav exists**

```bash
python3 -c "
import re
html = open('/home/dfk/Desktop/DFK-Portfolio/dfk007.github.io/index.html').read()
ids = set(re.findall(r'id=\"([^\"]+)\"', html))
hrefs = set(re.findall(r'href=\"#([^\"]+)\"', html))
missing = hrefs - ids
print('ids:', sorted(ids))
print('hrefs:', sorted(hrefs))
print('missing anchors:', missing if missing else 'none')
"
```

Expected: `missing anchors: none`.

- [ ] **Step 4: Serve and confirm 200**

```bash
cd /home/dfk/Desktop/DFK-Portfolio/dfk007.github.io && python3 -m http.server 8000 &
SERVER_PID=$!
sleep 1
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8000/index.html
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8000/css/style.css
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8000/img/pp.jfif
kill $SERVER_PID 2>/dev/null
```

Expected: `200` for each curl.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat(html): full rebuild — semantic structure, hero, services, timeline, skills, work, education, contact"
```

---

## Task 6: Add services, timeline, and skills CSS

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Append the three component blocks**

Insert before the final `/* =====` marker:

```css
/* =============================================================
   Services
   ============================================================= */

.services { background: var(--bg-0); }
.services h2 { max-width: 22ch; margin-bottom: 3rem; }

.services__grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: 1fr;
}
@media (min-width: 768px)  { .services__grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .services__grid { grid-template-columns: repeat(3, 1fr); } }

.service {
    position: relative;
    padding: 2rem;
    background: var(--bg-1);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    transition: transform var(--dur-fast) var(--ease-out),
                border-color var(--dur-fast) var(--ease-out),
                box-shadow var(--dur-fast) var(--ease-out);
}
.service:hover {
    transform: translateY(-4px);
    border-color: var(--accent-dim);
    box-shadow: var(--shadow-glow);
}
.service__index {
    font-family: var(--ff-mono);
    font-size: 0.75rem;
    color: var(--accent);
    letter-spacing: 0.05em;
}
.service__title { margin: 0.5rem 0 1rem; }
.service p { color: var(--muted); margin: 0; }


/* =============================================================
   Experience (timeline)
   ============================================================= */

.experience { background: var(--bg-0); border-top: 1px solid var(--border); }
.experience h2 { margin-bottom: 3rem; }

.timeline {
    position: relative;
    padding-left: 0;
    margin: 0;
    display: grid;
    gap: 2rem;
}
.timeline::before {
    content: '';
    position: absolute;
    left: 110px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--border);
}
.timeline__entry {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: 2rem;
    align-items: start;
}
.timeline__year {
    position: relative;
    padding-top: 0.25rem;
    font-family: var(--ff-mono);
    font-size: 0.8125rem;
    color: var(--muted);
    text-align: right;
}
.timeline__year::after {
    content: '';
    position: absolute;
    top: 0.65rem;
    right: -16px;
    width: 16px;
    height: 1px;
    background: var(--border);
}
.timeline__card {
    background: var(--bg-1);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: 1.5rem;
}
.timeline__card-head {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
}
.timeline__card-head h3 { font-size: 1.125rem; font-weight: 600; }
.timeline__role { font-weight: 400; color: var(--muted); font-size: 1rem; }
.timeline__now {
    font-family: var(--ff-mono);
    font-size: 0.6875rem;
    background: var(--accent);
    color: var(--bg-0);
    padding: 0.125rem 0.5rem;
    border-radius: 999px;
    letter-spacing: 0.05em;
}
.timeline__bullets {
    list-style: disc;
    padding-left: 1.25rem;
    color: var(--muted);
}
.timeline__bullets li { margin: 0.25rem 0; }
.timeline__entry--archival .timeline__card-head h3 { color: var(--muted); }
.timeline__entry--archival .timeline__bullets { color: #6f6f76; }

@media (max-width: 640px) {
    .timeline::before { left: 0; top: 0; }
    .timeline__entry {
        grid-template-columns: 1fr;
        gap: 0.5rem;
        padding-left: 1.5rem;
    }
    .timeline__year { text-align: left; }
    .timeline__year::after { right: -8px; left: auto; }
}


/* =============================================================
   Skills (chip cloud)
   ============================================================= */

.skills { background: var(--bg-1); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.skills h2 { margin-bottom: 3rem; }

.skill-groups {
    display: grid;
    gap: 2.5rem;
    grid-template-columns: 1fr;
}
@media (min-width: 768px) { .skill-groups { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px){ .skill-groups { grid-template-columns: repeat(3, 1fr); } }

.skill-group__title {
    font-family: var(--ff-mono);
    font-size: 0.875rem;
    color: var(--accent);
    margin-bottom: 1rem;
    letter-spacing: 0.02em;
}
.skill-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}
.skill-chips li {
    font-family: var(--ff-mono);
    font-size: 0.8125rem;
    padding: 0.375rem 0.75rem;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--text);
    transition: border-color var(--dur-fast) var(--ease-out),
                color var(--dur-fast) var(--ease-out);
}
.skill-chips li:hover {
    border-color: var(--accent-dim);
    color: var(--accent);
}
```

- [ ] **Step 2: Verify CSS parses**

```bash
python3 -c "
css = open('/home/dfk/Desktop/DFK-Portfolio/dfk007.github.io/css/style.css').read()
o, c = css.count(chr(123)), css.count(chr(125))
print('OK' if o == c else f'MISMATCH {o}/{c}')
"
```

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat(css): services grid, experience timeline, skills chip cloud"
```

---

## Task 7: Add work, education, and contact-bar CSS

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Append the three blocks**

Insert before the final `/* =====` marker:

```css
/* =============================================================
   Work (bento grid)
   ============================================================= */

.work { background: var(--bg-0); }
.work h2 { margin-bottom: 3rem; }

.work-grid {
    display: grid;
    gap: 1.25rem;
    grid-template-columns: 1fr;
}
@media (min-width: 768px)  { .work-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .work-grid { grid-template-columns: repeat(3, 1fr); } }

.work-tile {
    position: relative;
    display: block;
    background: var(--bg-1);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    overflow: hidden;
    transition: transform var(--dur-fast) var(--ease-out),
                border-color var(--dur-fast) var(--ease-out),
                box-shadow var(--dur-fast) var(--ease-out);
}
.work-tile:hover {
    transform: translateY(-4px);
    border-color: var(--accent-dim);
    box-shadow: var(--shadow-glow);
}
.work-tile--large {
    grid-column: span 1;
}
@media (min-width: 1024px) {
    .work-tile--large { grid-column: span 2; grid-row: span 1; }
}

.work-tile__media {
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: var(--bg-2);
    position: relative;
}
.work-tile__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 600ms var(--ease-out), filter 350ms var(--ease-out);
    filter: saturate(.85) brightness(.95);
}
.work-tile:hover .work-tile__media img {
    transform: scale(1.05);
    filter: saturate(1) brightness(1);
}
.work-tile__media::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,.55));
    pointer-events: none;
}
.work-tile__body {
    padding: 1.25rem;
}
.work-tile__tag {
    font-family: var(--ff-mono);
    font-size: 0.6875rem;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.1em;
}
.work-tile__body h3 {
    margin: 0.5rem 0 0.5rem;
    font-size: 1.125rem;
}
.work-tile__body p {
    color: var(--muted);
    margin: 0 0 1rem;
    font-size: 0.9375rem;
}
.work-tile__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
}
.work-tile__chips li {
    font-family: var(--ff-mono);
    font-size: 0.6875rem;
    padding: 0.25rem 0.5rem;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--muted);
}


/* =============================================================
   Education
   ============================================================= */

.education { background: var(--bg-0); border-top: 1px solid var(--border); }
.education h2 { margin-bottom: 3rem; }

.education__grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr;
}
@media (min-width: 768px) { .education__grid { grid-template-columns: 1fr 1fr; align-items: start; } }

.education__block h3 { font-family: var(--ff-mono); font-size: 0.875rem; color: var(--accent); margin-bottom: 1rem; }
.education__primary { margin: 0 0 0.25rem; font-size: 1.0625rem; }
.education__meta { color: var(--muted); margin: 0; font-size: 0.9375rem; }
.education__list li {
    padding: 0.875rem 0;
    border-bottom: 1px solid var(--border);
    color: var(--text);
}
.education__list li:last-child { border-bottom: 0; }


/* =============================================================
   Contact bar (footer)
   ============================================================= */

.contact-bar {
    background: var(--accent);
    color: var(--bg-0);
    padding-block: clamp(3rem, 6vw, 5rem);
    margin-top: 4rem;
}
.contact-bar__inner {
    display: grid;
    gap: 2.5rem;
}
@media (min-width: 768px) {
    .contact-bar__inner {
        grid-template-columns: 1.2fr 1fr;
        grid-template-areas:
            "head grid"
            "socials socials";
    }
    .contact-bar__inner > div:first-child { grid-area: head; }
    .contact-bar__grid { grid-area: grid; }
    .contact-bar__socials { grid-area: socials; }
}

.contact-bar__headline {
    font-family: var(--ff-mono);
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    margin: 0 0 0.5rem;
    color: var(--bg-0);
}
.contact-bar__lede {
    margin: 0;
    color: rgba(10, 10, 11, 0.75);
    font-size: 1.0625rem;
    max-width: 40ch;
}

.contact-bar__grid {
    display: grid;
    gap: 0.75rem;
    align-content: start;
}
.contact-bar__link {
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    font-family: var(--ff-mono);
    font-size: 0.9375rem;
    color: var(--bg-0);
    padding: 0.625rem 0.875rem;
    background: rgba(10, 10, 11, 0.08);
    border-radius: var(--r-md);
    width: max-content;
    max-width: 100%;
    transition: background-color var(--dur-fast) var(--ease-out);
}
.contact-bar__link:hover { background: rgba(10, 10, 11, 0.18); }

.contact-bar__socials {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
}
.contact-bar__socials a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--bg-0);
    color: var(--accent);
    font-size: 1rem;
    transition: transform var(--dur-fast) var(--ease-out);
}
.contact-bar__socials a:hover { transform: translateY(-2px); }

.contact-bar__small {
    text-align: center;
    margin: 3rem 0 0;
    font-family: var(--ff-mono);
    font-size: 0.75rem;
    color: rgba(10, 10, 11, 0.6);
}
```

- [ ] **Step 2: Verify CSS parses**

```bash
python3 -c "
css = open('/home/dfk/Desktop/DFK-Portfolio/dfk007.github.io/css/style.css').read()
o, c = css.count(chr(123)), css.count(chr(125))
print('OK' if o == c else f'MISMATCH {o}/{c}')
"
```

- [ ] **Step 3: Commit**

```bash
git add css/style.css
git commit -m "feat(css): work bento grid, education, mint contact bar"
```

---

## Task 8: Write `js/main.js` — typed-text, scroll-reveal, cursor ring

**Files:**
- Create: `js/main.js`

- [ ] **Step 1: Write the script**

```javascript
/* ===========================================================
   DFK Portfolio — interactions
   - typed-text hero
   - scroll reveal (IntersectionObserver)
   - header shadow on scroll
   - cursor ring (desktop only)
   - year stamp
   - reduced-motion short-circuits
   =========================================================== */

(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Year stamp ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header shadow on scroll ---------- */
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Scroll reveal ---------- */
  const revealables = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          entry.target.removeAttribute('aria-hidden');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
    revealables.forEach((el, i) => {
      el.setAttribute('aria-hidden', 'true');
      el.style.setProperty('--i', i % 6);
      io.observe(el);
    });
  } else {
    revealables.forEach((el) => {
      el.classList.add('is-visible');
      el.removeAttribute('aria-hidden');
    });
  }

  /* ---------- Typed-text hero ---------- */
  const typedEl = document.querySelector('[data-typed]');
  if (typedEl && !reducedMotion) {
    let strings;
    try {
      strings = JSON.parse(typedEl.getAttribute('data-typed'));
    } catch (_) {
      strings = [];
    }
    if (Array.isArray(strings) && strings.length) {
      let sIdx = 0, cIdx = 0, deleting = false;

      const tick = () => {
        const current = strings[sIdx];
        if (!deleting) {
          typedEl.textContent = current.slice(0, cIdx + 1);
          cIdx += 1;
          if (cIdx === current.length) {
            deleting = true;
            return setTimeout(tick, 1500);
          }
        } else {
          typedEl.textContent = current.slice(0, cIdx - 1);
          cIdx -= 1;
          if (cIdx === 0) {
            deleting = false;
            sIdx = (sIdx + 1) % strings.length;
            return setTimeout(tick, 400);
          }
        }
        const jitter = Math.random() * 60 - 20;
        setTimeout(tick, deleting ? 30 : 70 + jitter);
      };

      typedEl.textContent = '';
      setTimeout(tick, 600);
    }
  } else if (typedEl) {
    try {
      const first = JSON.parse(typedEl.getAttribute('data-typed'))[0];
      typedEl.textContent = first || '';
    } catch (_) {}
  }

  /* ---------- Cursor ring (desktop only) ---------- */
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isWide = window.matchMedia('(min-width: 1024px)').matches;
  if (canHover && isWide && !reducedMotion) {
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 28px; height: 28px;
      border: 1px solid var(--accent);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: width 200ms, height 200ms, opacity 200ms;
      opacity: 0;
      mix-blend-mode: difference;
    `;
    document.body.appendChild(ring);

    let x = 0, y = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      ring.style.opacity = '1';
    });
    window.addEventListener('mouseleave', () => { ring.style.opacity = '0'; });
    const raf = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      ring.style.transform = `translate(${x - 14}px, ${y - 14}px)`;
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }
})();
```

- [ ] **Step 2: Lint check (syntax)**

```bash
node --check /home/dfk/Desktop/DFK-Portfolio/dfk007.github.io/js/main.js && echo "ok"
```

Expected: `ok`. (If `node` is unavailable: `python3 -c "import esprima" 2>/dev/null && echo "skipped"` is acceptable — Node ships with most dev images; fallback if no JS engine.)

- [ ] **Step 3: Commit**

```bash
git add js/main.js
git commit -m "feat(js): typed-text hero, scroll reveal, cursor ring, header shadow"
```

---

## Task 9: Replace `js/index.js` with nav toggle behavior

**Files:**
- Modify: `js/index.js`

- [ ] **Step 1: Write the new script**

```javascript
/* Mobile nav drawer toggle and active-link tracking */

(() => {
  'use strict';

  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelectorAll('.nav__link');

  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* Active section highlighting */
  if ('IntersectionObserver' in window) {
    const sections = document.querySelectorAll('main section[id], footer[id]');
    const linkMap = new Map();
    navLinks.forEach((l) => {
      const id = l.getAttribute('href');
      if (id && id.startsWith('#')) linkMap.set(id.slice(1), l);
    });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.removeAttribute('aria-current'));
          const link = linkMap.get(entry.target.id);
          if (link) link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach((s) => obs.observe(s));
  }
})();
```

- [ ] **Step 2: Syntax check**

```bash
node --check /home/dfk/Desktop/DFK-Portfolio/dfk007.github.io/js/index.js && echo "ok"
```

- [ ] **Step 3: Commit**

```bash
git add js/index.js
git commit -m "feat(js): nav drawer toggle + active section highlighting"
```

---

## Task 10: Add nav active-link styling + cursor-ring hover-grow

**Files:**
- Modify: `css/style.css`

- [ ] **Step 1: Append final tweaks**

Insert before the closing `/* =====` marker:

```css
/* =============================================================
   Final tweaks — interactive states
   ============================================================= */

a.btn--primary:focus-visible,
a.btn--ghost:focus-visible {
    outline-color: var(--accent);
}

.work-tile:focus-visible,
.service:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

.timeline__card a:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
}

/* Cursor ring grows when hovering interactive elements */
.cursor-ring.is-hover {
    width: 44px;
    height: 44px;
    border-color: var(--text);
}
```

- [ ] **Step 2: Add cursor-ring hover-grow to `js/main.js`** (extend, don't rewrite)

Locate the line in `js/main.js`:
```javascript
      ring.style.transform = `translate(${x - 14}px, ${y - 14}px)`;
```

Replace that single line with:
```javascript
      ring.style.transform = `translate(${x - 14}px, ${y - 14}px)`;
      const hoverTarget = document.elementFromPoint(tx, ty);
      ring.classList.toggle('is-hover',
        !!hoverTarget && !!hoverTarget.closest('a, button, .work-tile, .service, .contact-bar__link'));
```

- [ ] **Step 3: Commit**

```bash
git add css/style.css js/main.js
git commit -m "feat: focus outlines on tiles + cursor-ring hover-grow"
```

---

## Task 11: Final verification — across breakpoints, accessibility, performance

**Files:** None modified (read-only)

- [ ] **Step 1: Serve the site**

```bash
cd /home/dfk/Desktop/DFK-Portfolio/dfk007.github.io && python3 -m http.server 8000 &
echo $! > /tmp/dfk-server.pid
sleep 1
curl -s -o /dev/null -w 'index: %{http_code}\n' http://localhost:8000/index.html
curl -s -o /dev/null -w 'css:   %{http_code}\n' http://localhost:8000/css/style.css
curl -s -o /dev/null -w 'js:    %{http_code}\n' http://localhost:8000/js/main.js
curl -s -o /dev/null -w 'js2:   %{http_code}\n' http://localhost:8000/js/index.js
curl -s -o /dev/null -w 'img:   %{http_code}\n' http://localhost:8000/img/pp.jfif
```

Expected: every line is `NNN: 200`.

- [ ] **Step 2: Lint CSS for syntactic issues with a real parser (best-effort)**

```bash
python3 - <<'PY'
import re
css = open('/home/dfk/Desktop/DFK-Portfolio/dfk007.github.io/css/style.css').read()
# balance + stray semicolons
opens, closes = css.count('{'), css.count('}')
print(f"braces: {opens} open / {closes} close — {'OK' if opens == closes else 'MISMATCH'}")
# simple property check: every rule should have at least one terminator
bad = re.findall(r'\{[^}]*\}', css)
empty = sum(1 for b in bad if b.strip()[1:-1].strip() == '')
print(f"empty rules: {empty}")
PY
```

Expected: `braces: … OK`, `empty rules: 0`.

- [ ] **Step 3: Lint JS**

```bash
node --check /home/dfk/Desktop/DFK-Portfolio/dfk007.github.io/js/main.js
node --check /home/dfk/Desktop/DFK-Portfolio/dfk007.github.io/js/index.js
```

Expected: exit 0 with no output.

- [ ] **Step 4: Run an accessibility spot-check on the HTML**

```bash
python3 - <<'PY'
from html.parser import HTMLParser
import re

html = open('/home/dfk/Desktop/DFK-Portfolio/dfk007.github.io/index.html').read()

# 1) every section has aria-labelledby pointing at an existing id
ids = set(re.findall(r'id="([^"]+)"', html))
labels = set(re.findall(r'aria-labelledby="([^"]+)"', html))
unresolved = [l for l in labels if l.split()[0] not in ids]
print('unresolved aria-labelledby:', unresolved or 'none')

# 2) every img has alt
no_alt = [m.group(0)[:80] for m in re.finditer(r'<img(?![^>]*\salt=)[^>]*>', html)]
print('imgs without alt:', len(no_alt))

# 3) every anchor that targets an id has a destination
hrefs = re.findall(r'href="#([^"]+)"', html)
missing_anchors = [h for h in hrefs if h not in ids]
print('broken # anchors:', missing_anchors or 'none')

# 4) icon-only links have aria-label
class Parser(HTMLParser):
    def __init__(self): super().__init__(); self.icon_only=[]; self.in_a=False; self.last_attrs=None; self.buf=[]
    def handle_starttag(self, tag, attrs):
        if tag=='a': self.in_a=True; self.last_attrs=dict(attrs); self.buf=[]
        elif tag=='i' and self.in_a: pass
    def handle_data(self, d):
        if self.in_a: self.buf.append(d)
    def handle_endtag(self, tag):
        if tag=='a':
            text=''.join(self.buf).strip()
            attrs=self.last_attrs or {}
            if 'aria-label' not in attrs and not text:
                href = attrs.get('href','')
                self.icon_only.append(href)
            self.in_a=False
p=Parser(); p.feed(html)
print('icon-only anchors without aria-label:', p.icon_only or 'none')
PY
```

Expected: every line reports `none` or `0`.

- [ ] **Step 5: Manual visual checks (browser at http://localhost:8000/index.html)**

| Check | How | Expected |
|-------|-----|----------|
| No horizontal overflow at 320px | DevTools → responsive 320 | Page width matches viewport, no scroll-x |
| Hero loads with grid background, typed-text cycling | Default desktop view | "AI Platform Engineer" cycles to "RAG & LLM…", etc. |
| Nav switches to hamburger ≤ 767px | DevTools → responsive 375 | Hamburger visible, top-bar nav hidden |
| Hamburger opens drawer | Click | Drawer slides down, body locked scroll |
| Drawer closes on link click | Click "skills" → drawer closes | Yes |
| Service tiles lift on hover | Hover over a tile | translateY + accent border glow |
| Timeline card older entries look muted | Scroll to "Programmer's Force" | Header text is `--muted`, bullets are dim |
| Skill chip cloud renders flat | Scroll to `#skills` | No cards-in-cards, just chips |
| Work grid: large + 4 standard | Resize to 1280+ | First tile spans 2 columns |
| All work-tile links work | Click each tile | Correct `portfolio-item*.html` opens |
| Education block two-column at ≥768 | Resize to 1024 | Two columns |
| Footer is mint-green with email/phone/socials | Scroll to bottom | Mint band, dark text |
| Skip-link visible on Tab | First Tab from address bar | "Skip to content" appears |
| Focus visible on every interactive | Tab through entire page | 2px mint ring on each |
| Reduced motion respected | DevTools → Rendering → Emulate prefers-reduced-motion: reduce → reload | No caret blink, no scroll reveal, no cursor ring |
| Lighthouse (Chrome DevTools → Lighthouse panel) | Run on http://localhost:8000/index.html | Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95 |

- [ ] **Step 6: Stop the server**

```bash
kill $(cat /tmp/dfk-server.pid) 2>/dev/null && rm /tmp/dfk-server.pid
```

- [ ] **Step 7: Final commit (only if Step 4 or 5 surfaced a fix)**

```bash
# If you had to apply any fixes during verification:
git status
git add -A
git commit -m "fix: post-verification tweaks"
```

---

## Self-Review

**Spec coverage:**
- §2.1 Palette — Task 2 ✓
- §2.2 Typography — Task 2 ✓
- §2.3 Layout & Sections — Tasks 4, 5, 6, 7 ✓
- §2.4 Responsiveness — Tasks 2 (container/clamp) + 4 (hero) + 6 (services/timeline) + 7 (work) ✓
- §2.5 Motion & Interactions — Tasks 8 (typed, reveal, cursor) + 10 (ring hover) ✓
- §2.6 Accessibility — Task 2 (focus/contrast), Task 5 (semantic landmarks, aria-labelledby, alt, aria-live, skip-link), Task 11 (verification) ✓
- §3.1 File changes — Tasks 1, 2, 5, 8, 9 ✓
- §3.2 `index.html` outline — Task 5 ✓
- §3.3 Components in `style.css` — Tasks 2, 3, 4, 6, 7, 10 ✓
- §3.4 `js/main.js` responsibilities — Task 8 ✓
- §4 Content (preserved) — Task 5 ✓
- §5 Removed/replaced — Task 1 ✓
- §6 Testing — Task 11 ✓
- §7 Out of scope — not built into any task ✓
- §8 Risks — mitigations are baked into Tasks 2, 8, 11 ✓

No spec gaps.

**Placeholder scan:** No TBD/TODO. No "implement later". All code is complete.

**Type/string consistency:**
- Hero data-typed JSON parses to the same 3 strings the design calls out, used identically across `js/main.js` and `index.html`.
- Class names match between Task 5 markup and CSS blocks (`.timeline__entry--archival`, `.service`, `.work-tile--large`, `.skill-chips li`, etc.).
- `data-reveal` attribute used identically in Tasks 5 and 8.

Plan complete.
