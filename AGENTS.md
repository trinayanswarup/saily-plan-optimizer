# Project Context for AI Agents

This is a Next.js 15+ project using the App Router.

## Stack
- Framework: Next.js (App Router, not Pages Router)
- Language: TypeScript — use strict types, avoid `any`
- Styling: Tailwind CSS only — no inline styles, no CSS modules
- AI: Groq API (Llama 3.3 70B) via `/api/generate` route
- Deployment: Vercel

## Project Purpose
AI-powered eSIM plan advisor for Saily (Nord Security). Analyses user trip history and usage habits to recommend the best data plan via Groq AI.

## Key Conventions
- All AI calls go through `/app/api/` route handlers — never call Groq from the frontend
- Keep AI prompts server-side only
- Environment variables: `GROQ_API_KEY` is server-only — never expose as `NEXT_PUBLIC_*`
- Components live in `/app/` using the App Router structure

## What NOT to do
- Do not use the Pages Router (`/pages/` directory)
- Do not use `getServerSideProps` or `getStaticProps`
- Do not expose the Groq API key to the client
- Do not use inline styles — Tailwind only
