import dotenv from "dotenv";
import path from "path";
import OpenAI from "openai";

// Carregar .env ANTES de qualquer outra coisa
dotenv.config();

// Debug
console.log("🔑 Loading API key...");
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.log("❌ No API key found in environment");
} else if (apiKey === "sk-test-key") {
  console.log("❌ Using default test key");
} else {
  console.log("✅ Valid API key loaded:", apiKey.substring(0, 15) + "...");
}

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: apiKey || "sk-test-key",
});

// Configuration
export const AI_CONFIG = {
  whisper: {
    model: "whisper-1",
    language: "pt",
    response_format: "json",
    temperature: 0.2,
  },
  gpt: {
    model: "gpt-4o-mini",
    temperature: 0.3,
    max_tokens: 1000,
  },
};

// Test OpenAI connection
export const testOpenAIConnection = async (): Promise<boolean> => {
  try {
    if (!apiKey || apiKey === "sk-test-key") {
      console.log("❌ Invalid API key for testing");
      return false;
    }

    console.log(
      "🧪 Testing OpenAI connection with key:",
      apiKey.substring(0, 15) + "..."
    );
    const response = await openai.models.list();
    console.log(
      "✅ OpenAI connection successful! Found",
      response.data.length,
      "models"
    );
    return true;
  } catch (error: any) {
    console.error("❌ OpenAI connection failed:", error.message);
    return false;
  }
};
