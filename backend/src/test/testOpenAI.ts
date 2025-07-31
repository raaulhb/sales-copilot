import { testOpenAIConnection } from "../config/ai";

async function runTest() {
  console.log("🧪 Testing OpenAI connection...");

  const isConnected = await testOpenAIConnection();

  if (isConnected) {
    console.log("✅ OpenAI connection successful!");
    console.log("💰 Ready to use real AI services");
  } else {
    console.log("❌ OpenAI connection failed");
    console.log("🤖 Will use mock services");
  }
}

runTest().catch(console.error);
