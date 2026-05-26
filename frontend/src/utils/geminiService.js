/**
 * Service to interface with Google's Gemini API
 * using a native fetch call with automatic model fallback to prevent 404 errors.
 */

/**
 * Sends a message to Gemini and requests a structured communication analysis.
 * @param {string} message - The original vague corporate message.
 * @param {string} apiKey - The user's Gemini API key.
 * @returns {Promise<Object>} The parsed analysis JSON.
 */
export async function analyzeMessage(message, apiKey) {
  if (!apiKey) {
    throw new Error("API Key is missing. Please add your Gemini API Key in the settings.");
  }

  const prompt = `
You are NeuroBridge, an AI workplace communication assistant designed for autistic professionals. 
Your task is to take a vague, unstructured, or idiom-filled workplace message (like a Slack message or email) and translate it into a structured, literal, and anxiety-reducing guide.

Analyze this message:
"""
${message}
"""

You MUST reply with a single, valid JSON object containing exactly the following structure and no other markdown wrapping (do NOT wrap in \`\`\`json or \`\`\` tags):

{
  "urgency": "High" | "Medium" | "Low",
  "urgencyReason": "Brief explanation of why the urgency is rated this way based on implicit deadlines.",
  "sentiment": "Friendly, Neutral, Stressed, etc.",
  "subtext": "Explain the literal meaning and hidden expectations of what the sender is asking for in plain language, explaining any corporate idioms or polite qualifiers (like 'whenever you get a chance' or 'could you take a look').",
  "checklist": [
    "A list of literal, specific, and actionable checklist steps for the user to perform. Avoid vague tasks. Write actions in order.",
    "Step two...",
    "Step three..."
  ],
  "drafts": [
    {
      "tone": "Polite & Collaborative",
      "text": "A complete draft message the employee can send back to the manager that sounds professional, warm, and corporate."
    },
    {
      "tone": "Direct & Concise",
      "text": "A draft message that is short, to-the-point, and highly literal, while remaining polite."
    },
    {
      "tone": "Casual (Slack Style)",
      "text": "A relaxed, friendly draft message suitable for a fast-paced team Slack channel."
    }
  ],
  "jargon": [
    {
      "phrase": "any jargon or corporate idiom used in the message, e.g. 'needs some love' or 'circle back'",
      "translation": "A clear, literal definition of what this idiom actually means in this context."
    }
  ],
  "sensoryTips": [
    "Provide 2-3 tailored coping tips for the user based on the stress level or nature of the task (e.g. 'This task has a tight deadline. Take a 5-second deep breath before reading the checklist.', 'Web styling can be visually intense. Set a timer to rest your eyes for 2 minutes.')."
  ]
}

Make sure the JSON is perfectly formatted. Do not include trailing commas or backticks.
`;

  // List of models to try in order of preference (2.5 -> 2.0 -> 1.5)
  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  let lastError = null;

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    try {
      console.log(`Attempting interpretation with model: ${model}`);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `HTTP error! status: ${response.status}`;
        
        const msg = errorMessage.toLowerCase();
        const isAuthError = msg.includes("api key") || msg.includes("invalid key") || msg.includes("unauthorized") || response.status === 403;

        // If it's not a credentials/auth error, try other models before giving up
        if (!isAuthError) {
          console.warn(`Model ${model} failed: ${errorMessage}. Trying fallback...`);
          lastError = new Error(errorMessage);
          continue;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!responseText) {
        throw new Error("Received empty response from Gemini API.");
      }

      let cleanText = responseText.trim();
      if (cleanText.startsWith("```json")) {
        cleanText = cleanText.substring(7);
      }
      if (cleanText.endsWith("```")) {
        cleanText = cleanText.substring(0, cleanText.length - 3);
      }
      cleanText = cleanText.trim();

      return JSON.parse(cleanText);
    } catch (error) {
      lastError = error;
      const msg = error.message.toLowerCase();
      const isAuthError = msg.includes("api key") || msg.includes("invalid key") || msg.includes("unauthorized");
      
      if (isAuthError) {
        throw error;
      }
      console.warn(`Error with model ${model}: ${error.message}. Retrying fallback...`);
    }
  }

  // If all models in the loop fail, throw the last error
  throw lastError || new Error("Failed to connect to any active Gemini model versions.");
}
