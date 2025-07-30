import OpenAI from "openai";

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-test-key",
});

// Configuration
export const AI_CONFIG = {
  whisper: {
    model: "whisper-1",
    language: "pt", // Portuguese
    response_format: "json",
    temperature: 0.2,
  },
  gpt: {
    model: "gpt-4o-mini", // More cost-effective for analysis
    temperature: 0.3,
    max_tokens: 1000,
  },
};

// Test OpenAI connection
export const testOpenAIConnection = async (): Promise<boolean> => {
  try {
    const response = await openai.models.list();
    console.log("✅ OpenAI connection successful");
    return true;
  } catch (error) {
    console.error("❌ OpenAI connection failed:", error);
    return false;
  }
};
