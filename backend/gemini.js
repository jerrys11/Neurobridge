/**
 * Gemini analysis service (server-side).
 * The Gemini API key lives ONLY here, supplied via the GEMINI_API_KEY env var.
 * Model fallback chain is configurable via GEMINI_MODELS (comma-separated).
 */

const DEFAULT_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"];

function getModels() {
  const env = process.env.GEMINI_MODELS;
  if (env && env.trim()) return env.split(",").map((m) => m.trim()).filter(Boolean);
  return DEFAULT_MODELS;
}

function buildPrompt(message) {
  return `
You are NeuroBridge, an AI workplace communication assistant designed for autistic professionals.
Take a vague, unstructured, or idiom-filled workplace message (Slack message, email, meeting note)
and translate it into a structured, literal, anxiety-reducing guide.

Analyze this message:
"""
${message}
"""

Reply with a single valid JSON object with EXACTLY this structure (no markdown wrapping):

{
  "urgency": "High" | "Medium" | "Low",
  "urgencyReason": "Brief explanation of the rating based on explicit or implicit deadlines.",
  "sentiment": "Friendly, Neutral, Stressed, etc.",
  "deadline": {
    "phrase": "The deadline in human words, e.g. 'Tomorrow by early afternoon' - or 'No deadline stated' if none.",
    "date": "Best-guess ISO 8601 date/time if one can be inferred (e.g. '2026-06-11T14:00'), otherwise null.",
    "isExplicit": true | false
  },
  "subtext": "The literal meaning and hidden expectations in plain language, decoding polite qualifiers like 'whenever you get a chance'.",
  "assumedContext": [
    "Things the sender assumes the reader already knows but never states. Empty array if none."
  ],
  "checklist": [
    "Literal, specific, ordered, actionable steps. Avoid vague tasks."
  ],
  "drafts": [
    { "tone": "Polite & Collaborative", "text": "A complete professional, warm reply draft." },
    { "tone": "Direct & Concise", "text": "A short, highly literal, polite reply draft." },
    { "tone": "Casual (Slack Style)", "text": "A relaxed, friendly reply suitable for team chat." },
    { "tone": "Clarifying Question", "text": "If anything is ambiguous, a polite reply asking the single most important clarifying question. If nothing is ambiguous, a brief confirmation reply instead." }
  ],
  "jargon": [
    { "phrase": "corporate idiom used in the message", "translation": "Clear, literal meaning in this context." }
  ],
  "sensoryTips": [
    "2-3 tailored pacing/coping tips matched to the stress level of this specific task."
  ]
}

Rules: valid JSON only, no trailing commas, no backticks, no commentary.`;
}

export async function analyzeMessage(message) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error("Server is not configured with a Gemini API key.");
    err.status = 503;
    throw err;
  }

  const prompt = buildPrompt(message);
  let lastError = null;

  for (const model of getModels()) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const started = Date.now();
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
        console.warn(`Model ${model} failed: ${errorMessage} (status: ${response.status})`);
        if (response.status === 401 || response.status === 403) {
          const err = new Error(`Gemini auth error: ${errorMessage}`);
          err.status = 502;
          throw err;
        }
        lastError = new Error(`Model ${model} failed: ${errorMessage}`);
        continue;
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!responseText) {
        lastError = new Error(`Model ${model} returned an empty response.`);
        continue;
      }

      let cleanText = responseText.trim();
      if (cleanText.startsWith("```json")) cleanText = cleanText.slice(7);
      if (cleanText.startsWith("```")) cleanText = cleanText.slice(3);
      if (cleanText.endsWith("```")) cleanText = cleanText.slice(0, -3);

      const result = JSON.parse(cleanText.trim());
      return { result, model, latencyMs: Date.now() - started };
    } catch (error) {
      if (error.status) throw error;
      lastError = error;
    }
  }

  const err = new Error(lastError?.message || "All Gemini models failed.");
  err.status = 502;
  throw err;
}
