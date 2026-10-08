---
name: context-7
description: >-
  Provides live, version-accurate documentation, code examples, and API schemas for modern
  frameworks and packages (Next.js, Remotion, Cloudinary, Supabase, Tailwind, Framer Motion)
  via the Context7 engine and Model Context Protocol (MCP).
  Use whenever writing code with modern framework APIs, checking breaking changes, or verifying package SDK signatures.
---

# Context 7 — Real-Time Documentation & API Engine

Context 7 empowers Antigravity with live, real-time documentation retrieval directly connected via Model Context Protocol (MCP) and Upstash Context7.

---

## 1. Primary Objectives
1. **Zero Hallucinations**: Always retrieve version-specific API signatures for fast-evolving packages (e.g. Next.js App Router, Remotion Lambda SDK, Cloudinary Node SDK, Supabase SSR Auth).
2. **Lightweight & Cloud-First**: Zero local memory consumption. All lookups happen over remote endpoints (`https://mcp.context7.com/mcp`).
3. **Targeted Code Retrieval**: Pull precise code snippets and TypeScript interfaces instead of heavy raw markdown dumps.

---

## 2. Core Package Context Guidelines

### A. Next.js App Router (Latest)
- Use Server Components by default; add `'use client'` only when state, event handlers, or browser APIs are required.
- Standalone runner output compatibility: always ensure static asset sync (`scripts/sync-next-standalone-files.mjs`).

### B. Remotion & Remotion Lambda
- Keep Remotion template folders strictly code-only.
- Always supply exact `frameRange: [0, totalFrames - 1]` to Lambda renders.
- Compositions must use static props with fallback defaults.

### C. Cloudinary Asset Management
- Server-side SDK: `cloudinary.v2` with `CLOUDINARY_URL` / env credentials.
- Client-side optimization: deliver responsive images via `https://res.cloudinary.com/dhouh9idx/...` with auto-format and quality optimization.

### D. Supabase Postgres & Auth
- Use Supabase SSR client for Next.js App Router cookie handling.
- Enforce Row Level Security (RLS) on all database tables.

---

## 3. Querying Documentation
When implementing complex integrations:
1. Identify the package name and exact version in `package.json`.
2. Query Context7 MCP endpoint (`https://mcp.context7.com/mcp`) for the exact method syntax.
3. Validate TypeScript definitions before emitting code.
