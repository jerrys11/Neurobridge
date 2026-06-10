# SETUP — what Jerry needs to do (I can't do these for you)

## 1. Get a Gemini API key (5 min)
- Go to https://aistudio.google.com/ → Get API key. (Your XPRIZE registration includes $100 AI Ultra + $300 Cloud credits.)
- Never commit it. It goes only in Cloud Run env vars / local `.env`.

## 2. Create a Google Cloud project + deploy (20 min)
```bash
gcloud auth login
gcloud projects create neurobridge-prod   # or use an existing project
gcloud config set project neurobridge-prod
gcloud services enable run.googleapis.com firestore.googleapis.com cloudbuild.googleapis.com
gcloud firestore databases create --location=us-central1
gcloud run deploy neurobridge --source . --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=YOUR_KEY,ADMIN_TOKEN=pick_a_long_random_string
```
Then point your domain (or keep the run.app URL). You can retire the Vercel deployment,
or set VITE_API_URL on Vercel to the Cloud Run URL and keep Vercel as the frontend.
Simplest: one Cloud Run service does everything.

## 3. Check model names
Default chain is `gemini-2.5-flash → gemini-2.0-flash`. If a newer Flash model is GA
(check https://ai.google.dev/gemini-api/docs/models), add it first via the
`GEMINI_MODELS` env var — no code change needed.

## 4. Revenue (do this week — judges score monthly revenue curve)
- Fastest path: **Stripe Payment Links** (no code): create products for
  "Pilot Package — $750", "Team — $12/seat/mo", "Individual Pro — $9/mo"
  and link them from the Join modal / your outreach emails.
- Keep ALL revenue in Stripe. Export monthly. Track related-party revenue separately (target: zero).

## 5. XPRIZE housekeeping
- Share the GitHub repo with **testing@devpost.com** and **judging@hacker.fund**.
- Keep the Devpost submission draft updated as you go.
- Screenshot dashboards weekly (Cloud Run logs, Firestore counts, Stripe) — submission evidence.
- /api/stats endpoint: `curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" https://YOUR_URL/api/stats`

## 6. What changed in this drop (commit-ready)
- `backend/` — NEW: Express API (analyze/signup/health/stats), server-side Gemini key,
  rate limiting, Firestore + structured logging, serves built frontend.
- `Dockerfile`, `.dockerignore` — NEW: single Cloud Run service.
- `frontend/index.html` — real title/meta (was "frontend").
- `frontend/src/utils/geminiService.js` — now a thin API client; BYO-key code removed.
- `frontend/src/App.jsx` — no API-key flow; auto-scroll to results (reduced-motion aware); honest footer.
- `frontend/src/components/SettingsModal.jsx` — repurposed: "Join the pilot" email capture (user evidence + sales funnel).
- `frontend/src/components/ActionChecklist.jsx` — keyboard/screen-reader accessible; quiet "Copied ✓" instead of alert().
- `frontend/src/components/ToneAnalysis.jsx` — NEW deadline badge + "what the sender assumes you know" section; urgency icon (not color-only).
- `frontend/src/components/CopilotSidebar.jsx` — decorative emoji aria-hidden; role=status/alert; key-free empty state.
- `frontend/src/index.css` — focus-visible styles, prefers-reduced-motion, new badges.
- `backend/gemini.js` prompt — adds deadline {phrase, date, isExplicit}, assumedContext[], and a 4th "Clarifying Question" draft.
- `README.md` — judge-facing rewrite (old one described "NeuroAgency" and linked a file on your C: drive).
