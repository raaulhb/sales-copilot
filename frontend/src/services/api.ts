import axios from "axios";

// Configuração de ambiente
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const IS_STAGING = import.meta.env.VITE_ENV === "staging";

// Instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    ...(IS_STAGING && { "X-Environment": "staging" }),
  },
});

// Interceptor para logs em staging
if (IS_STAGING) {
  api.interceptors.request.use(
    (config) => {
      console.log(
        `🚀 [STAGING] API Request: ${config.method?.toUpperCase()} ${
          config.url
        }`
      );
      return config;
    },
    (error) => {
      console.error("❌ [STAGING] API Request Error:", error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log(
        `✅ [STAGING] API Response: ${response.status} ${response.config.url}`
      );
      return response;
    },
    (error) => {
      console.error("❌ [STAGING] API Response Error:", error);
      return Promise.reject(error);
    }
  );
}

// Tipos para as requisições (baseados no sistema atual)
export interface AudioProcessRequest {
  audio: File;
  sessionId: string;
}

export interface AnalysisResponse {
  success: boolean;
  data: {
    transcript: string;
    profile: {
      type: "PRAGMATICO" | "INTUITIVO" | "ANALITICO" | "INTEGRADOR";
      confidence: number;
      reasoning: string;
    };
    recommendations: {
      immediateAction: string;
      script: string;
    };
  };
}

// Funções da API
export const apiService = {
  // Health check
  async healthCheck() {
    const response = await api.get("/health");
    return response.data;
  },

  // Processar áudio (função principal atual)
  async processAudio(
    audioFile: File,
    sessionId: string
  ): Promise<AnalysisResponse> {
    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("sessionId", sessionId);

    const response = await api.post("/audio/process", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Gerar recomendações (se existir endpoint separado)
  async generateRecommendations(analysisData: any) {
    const response = await api.post("/analysis/recommendations", analysisData);
    return response.data;
  },
};

export default api;
