// backend/huggingFaceAPI.js
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import fetch from "node-fetch";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

if (!HF_API_KEY) {
  console.error("❌ Missing HUGGINGFACE_API_KEY in .env file");
  process.exit(1);
}

console.log("✅ Loaded Hugging Face key successfully!");

const MODEL_URL = "https://api-inference.huggingface.co/models/gpt2";

export async function queryHuggingFace(prompt) {
  try {
    const response = await fetch(MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: 50 },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Hugging Face API error ${response.status}: ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error("❌ Error calling Hugging Face API:", error.message);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("🚀 Testing Hugging Face...");
  const result = await queryHuggingFace("What is ZeroWaste Bites?");
  console.log("🟢 Result:", result);
}
