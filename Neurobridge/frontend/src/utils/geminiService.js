/**
 * NeuroBridge API client.
 * All AI calls now go through the NeuroBridge backend (see /backend) —
 * the Gemini API key lives server-side only. Users never handle keys.
 */

const API_BASE = import.meta.env.VITE_API_URL || "";

/** Stable anonymous id so usage can be counted as real users (XPRIZE evidence). */
export function getClientId() {
  let id = localStorage.getItem("neurobridge_client_id");
  if (!id) {
    id = (crypto.randomUUID && crypto.randomUUID()) || `nb-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("neurobridge_client_id", id);
  }
  return id;
}

async function post(path, body) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Could not reach the NeuroBridge service. Please check your connection and try again.");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Something went wrong (HTTP ${response.status}). Please try again.`);
  }
  return data;
}

export function analyzeMessage(message) {
  return post("/api/analyze", { message, clientId: getClientId() });
}

export function signup(email, role) {
  return post("/api/signup", { email, role, clientId: getClientId() });
}
