# NeuroBridge 🍃

**AI workplace-communication copilot for autistic professionals.**
NeuroBridge takes vague, idiom-filled workplace messages (email, Slack, meeting notes) and translates them into plain language: the literal meaning, the hidden expectations, a step-by-step task checklist with deadlines, tone-matched reply drafts, a jargon glossary, and sensory pacing tips.

*A submission to the [Build with Gemini XPRIZE](https://www.geminixprize.com/) — Category: Education & Human Potential.*

---

## Why

Autistic adults face persistent under- and unemployment, and ambiguous workplace communication is one of the most-cited barriers. Existing tools are consumer self-help apps; NeuroBridge is employer-paid, requires no diagnosis disclosure, and works at the moment a confusing message arrives.

## How it works

```
Web app (React/Vite)
   → NeuroBridge API on Google Cloud Run (Express, Node 22)
       → Gemini (2.5 Flash, with model fallback) — every analysis        ← satisfies the Gemini/LLM rule
       → Firestore — users, signups, analysis logs                       ← Google Cloud product
       → Structured stdout logs (Cloud Run) — production evidence
```

- **All AI calls are server-side.** The Gemini API key never leaves the backend.
- Every analysis is logged (model used, latency, anonymized client id) — this is the production-evidence trail required by the competition rules.
- Anonymous users get a rate-limited free tier; the **Join the pilot** flow captures emails for personal workspaces and employer pilots.

## Repository layout

```
frontend/   React + Vite app (sensory-friendly UI: muted palette, dark mode, text scaling, reduced-motion support)
backend/    Express API: /api/analyze, /api/signup, /api/health, /api/stats — serves the built frontend in production
Dockerfile  Multi-stage build → single Cloud Run service
```

## Run locally

```bash
# backend (terminal 1)
cd backend && npm install
GEMINI_API_KEY=your_key npm run dev          # http://localhost:8080

# frontend (terminal 2)
cd frontend && npm install
echo "VITE_API_URL=http://localhost:8080" > .env.local
npm run dev                                   # http://localhost:5173
```

## Deploy (Cloud Run)

```bash
gcloud run deploy neurobridge \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_KEY
```

The single service serves both the API and the built frontend.

## Project history (XPRIZE disclosure)

NeuroBridge was newly created after the start of the Hackathon Submission Period (May 19, 2026), scaffolded with Google Antigravity using standard React/Vite tooling. No pre-existing proprietary code was used.

## Privacy

Messages submitted for analysis are processed to generate the result and logged in anonymized form (length, urgency, latency — not content). Message content is never used to train AI models.
