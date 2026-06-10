/**
 * NeuroBridge API server.
 * - POST /api/analyze : analyze a workplace message (Gemini, server-side key)
 * - POST /api/signup  : capture an email for pilot/waitlist (user evidence)
 * - GET  /api/health  : health check
 * - GET  /api/stats   : usage counts (requires ADMIN_TOKEN) — judge/demo evidence
 * Also serves the built frontend from ../frontend/dist (single Cloud Run service).
 *
 * Every analysis is logged (Firestore if available, always structured stdout) —
 * these logs are the "evidence of your product running" the XPRIZE rules require.
 */
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeMessage } from "./gemini.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json({ limit: "32kb" }));

// ---------- Optional Firestore (enabled automatically on Google Cloud) ----------
let db = null;
if (process.env.FIRESTORE_ENABLED !== "false") {
  try {
    const { Firestore } = await import("@google-cloud/firestore");
    db = new Firestore();
    console.log(JSON.stringify({ event: "firestore_ready" }));
  } catch (e) {
    console.log(JSON.stringify({ event: "firestore_unavailable", reason: e.message }));
  }
}

async function logEvent(collection, doc) {
  const record = { ...doc, ts: new Date().toISOString() };
  console.log(JSON.stringify({ event: collection, ...record })); // always visible in Cloud Run logs
  if (db) {
    try { await db.collection(collection).add(record); }
    catch (e) { console.error(JSON.stringify({ event: "firestore_write_error", reason: e.message })); }
  }
}

// ---------- Simple in-memory rate limiting (per client, per IP) ----------
const buckets = new Map();
const LIMIT = Number(process.env.RATE_LIMIT_PER_HOUR || 30);
function rateLimited(key) {
  const now = Date.now();
  const windowStart = now - 60 * 60 * 1000;
  const hits = (buckets.get(key) || []).filter((t) => t > windowStart);
  if (hits.length >= LIMIT) { buckets.set(key, hits); return true; }
  hits.push(now);
  buckets.set(key, hits);
  return false;
}

// ---------- API ----------
app.get("/api/health", (_req, res) => res.json({ ok: true, service: "neurobridge", time: new Date().toISOString() }));

app.post("/api/analyze", async (req, res) => {
  const { message, clientId } = req.body || {};
  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Provide a 'message' string to analyze." });
  }
  if (message.length > 8000) {
    return res.status(400).json({ error: "Message too long (max 8,000 characters)." });
  }
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
  if (rateLimited(`ip:${ip}`) || (clientId && rateLimited(`client:${clientId}`))) {
    return res.status(429).json({ error: "You've reached the free analysis limit for this hour. Please try again later." });
  }

  try {
    const { result, model, latencyMs } = await analyzeMessage(message);
    await logEvent("analyses", {
      clientId: clientId || null,
      model,
      latencyMs,
      messageChars: message.length,
      urgency: result.urgency || null,
    });
    res.json(result);
  } catch (err) {
    await logEvent("analysis_errors", { clientId: clientId || null, error: err.message });
    res.status(err.status || 500).json({ error: err.message || "Analysis failed. Please try again." });
  }
});

app.post("/api/signup", async (req, res) => {
  const { email, role, clientId } = req.body || {};
  const valid = typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!valid) return res.status(400).json({ error: "Please provide a valid email address." });
  await logEvent("signups", { email: email.toLowerCase(), role: role || null, clientId: clientId || null });
  res.json({ ok: true });
});

app.get("/api/stats", async (req, res) => {
  if (!process.env.ADMIN_TOKEN || req.headers.authorization !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!db) return res.json({ note: "Firestore not enabled; see Cloud Run logs for usage events." });
  const [analyses, signups] = await Promise.all([
    db.collection("analyses").count().get(),
    db.collection("signups").count().get(),
  ]);
  res.json({ totalAnalyses: analyses.data().count, totalSignups: signups.data().count });
});

// ---------- Static frontend (built by the Dockerfile) ----------
const dist = path.join(__dirname, "public");
app.use(express.static(dist));
app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html"), (err) => { if (err) res.status(404).send("Not found"); }));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(JSON.stringify({ event: "server_started", port })));
