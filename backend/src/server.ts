import dotenv from "dotenv";
import path from "path";

// Configurar dotenv baseado no ambiente
const envFile = process.env.NODE_ENV === "staging" ? ".env.staging" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

import app from "./app";

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Sales Co-pilot Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
});
