// src/services/aiService.js
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) throw new Error("Missing GEMINI_API_KEY in .env");

const BASE = "https://generativelanguage.googleapis.com";
const VERSION = "v1beta"; // docs show v1beta endpoints
const URL = `${BASE}/${VERSION}/models/${MODEL}:generateContent?key=${API_KEY}`;

/**
 * helper - call Gemini REST generateContent
 * prompt: string
 * opts: optional generation config (temperature, maxOutputTokens, etc.)
 */
async function callGemini(prompt, opts = {}) {
  try {
    const payload = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      // optional: pass generationConfig (temperature, maxOutputTokens, etc.)
      generationConfig: opts.generationConfig || {
        temperature: opts.temperature ?? 0.2,
        maxOutputTokens: opts.maxOutputTokens ?? 512
      }
    };

    const resp = await axios.post(URL, payload, {
      headers: {
        "Content-Type": "application/json",
        // The docs show using x-goog-api-key in examples; query param ?key= also works.
        // We already appended ?key= in URL above; in some setups you may use:
        // 'x-goog-api-key': API_KEY
      },
      timeout: 30_000
    });

    // Standard response path: candidates[0].content.parts[0].text
    const text =
      resp?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      // fallback for SDK-style responses
      resp?.data?.text ||
      "";

    return text.trim();
  } catch (err) {
    // return a helpful error, but don't leak the API key
    const msg =
      err?.response?.data?.error?.message ||
      err?.message ||
      "Unknown error from Gemini";
    throw new Error(`Gemini API error: ${msg}`);
  }
}

/* Public functions your routes call — build a clear prompt and call Gemini */

export async function polishText(text) {
  if (!text) throw new Error("text is required");
  const prompt = `Polish the following text for clarity and grammar without changing meaning:\n\n${text}\n\nReturn only the polished text.`;
  return await callGemini(prompt, { temperature: 0.1, maxOutputTokens: 300 });
}

export async function convertTone(text, tone) {
  if (!text || !tone) throw new Error("text and tone are required");
  const prompt = `Rewrite the following text in a ${tone} tone, preserving meaning and length where possible:\n\n${text}\n\nReturn only the rewritten text.`;
  return await callGemini(prompt, { temperature: 0.2, maxOutputTokens: 300 });
}

export async function generateReply(context) {
  if (!context) throw new Error("context is required");
  const prompt = `You are an assistant that writes short, helpful chat/email replies.\n\nContext:\n${context}\n\nWrite a friendly, concise reply (1-3 sentences).`;
  return await callGemini(prompt, { temperature: 0.6, maxOutputTokens: 200 });
}

export default { polishText, convertTone, generateReply };
