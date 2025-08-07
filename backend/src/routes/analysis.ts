import express from "express";
import { analysisController } from "../controllers/analysisController";
import { discService } from "../services/discService";
const router = express.Router();

// Analysis routes
router.post("/disc", analysisController.analyzeDisc);
router.post("/sentiment", analysisController.analyzeSentiment);
router.get(
  "/session/:sessionId/insights",
  analysisController.getSessionInsights
);
router.post("/recommendations", analysisController.generateRecommendations);
// Análise comportamental completa (DISC + FDNA + MBTI)
router.post(
  "/expanded-behavioral",
  analysisController.analyzeExpandedBehavioral
);

// Testes individuais para desenvolvimento
router.post("/expanded-disc", analysisController.analyzeExpandedDISC);
router.post("/mbti", analysisController.analyzeMBTI);

// Test route for DISC profiles
router.get("/test-disc/:profile", async (req, res) => {
  try {
    const { profile } = req.params;

    if (
      !["PRAGMATICO", "INTUITIVO", "ANALITICO", "INTEGRADOR"].includes(profile)
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Invalid profile. Use: PRAGMATICO, INTUITIVO, ANALITICO, or INTEGRADOR",
      });
    }

    const result = await discService.testProfile(profile as any);

    res.json({
      success: true,
      data: result,
      message: "DISC profile test completed",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Rota de teste para perfis expandidos
router.get("/test-expanded/:discType/:subtype", async (req, res) => {
  try {
    const { discType, subtype } = req.params;

    // Mock data para teste
    const mockTranscript = `Teste de análise para perfil ${discType} subtipo ${subtype}. 
      Preciso de uma solução que seja eficiente e traga resultados concretos. 
      Vocês têm dados de performance e cases de sucesso?`;

    const { BehavioralAnalysis } = await import(
      "../services/behavioralAnalysis"
    );
    const result = await BehavioralAnalysis.analyzeComplete(mockTranscript);

    res.json({
      success: true,
      data: {
        ...result,
        testParams: { discType, subtype },
        message: `Teste de análise expandida para ${discType} - ${subtype}`,
      },
      message: "Expanded behavioral analysis test completed",
    });
  } catch (error: any) {
    console.error("❌ [STAGING] Test expanded analysis error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
