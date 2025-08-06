export const config = {
  environment: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3001"),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  openaiApiKey: process.env.OPENAI_API_KEY,
  useRealAI: process.env.USE_REAL_AI === "true",
  debugBehavioralAnalysis: process.env.DEBUG_BEHAVIORAL_ANALYSIS === "true",
  databaseUrl: process.env.DATABASE_URL,

  // Staging-specific configs
  isStaging: process.env.NODE_ENV === "staging",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",,
};
;
