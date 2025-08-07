import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  Target,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle,
  Copy,
} from "lucide-react";

interface DiscProfile {
  assertiveness: number;
  emotionality: number;
  profile: "PRAGMATICO" | "INTUITIVO" | "ANALITICO" | "INTEGRADOR";
  confidence: number;
}

interface SalesRecommendation {
  immediateAction: string;
  approach: string;
  suggestedScript: string;
  timing: "immediate" | "short_term" | "long_term";
  rationale: string;
  priority: "high" | "medium" | "low";
  objectionHandling?: string;
  nextSteps: string[];
}

interface LiveRecommendationsProps {
  currentProfile?: DiscProfile | null;
  latestTranscript?: string;
  isRecording?: boolean;
}

const LiveRecommendations: React.FC<LiveRecommendationsProps> = ({
  currentProfile,
  latestTranscript,
  isRecording = false,
}) => {
  const [recommendations, setRecommendations] =
    useState<SalesRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate recommendations when profile changes
  useEffect(() => {
    if (
      currentProfile &&
      latestTranscript &&
      latestTranscript.trim().length > 5
    ) {
      generateRecommendations();
    }
  }, [currentProfile, latestTranscript]);

  const generateRecommendations = async () => {
    if (!currentProfile || !latestTranscript) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3001/api"
        }/analysis/recommendations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profile: currentProfile,
            transcript: latestTranscript,
            salesStage: "discovery",
          }),
        }
      );

      const result = await response.json();
      if (result.success) {
        setRecommendations(result.data);
        console.log("💡 Recommendations loaded:", result.data);
      }
    } catch (error) {
      console.error("❌ Failed to generate recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyScript = async (script: string) => {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      console.log("📋 Script copiado:", script);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy script:", error);
    }
  };

  const getProfileColor = (profile: string) => {
    const colors = {
      PRAGMATICO: "bg-red-100 text-red-800 border-red-200",
      INTUITIVO: "bg-yellow-100 text-yellow-800 border-yellow-200",
      ANALITICO: "bg-blue-100 text-blue-800 border-blue-200",
      INTEGRADOR: "bg-green-100 text-green-800 border-green-200",
    };
    return (
      colors[profile as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getProfileIcon = (profile: string) => {
    const icons = {
      PRAGMATICO: "🔥",
      INTUITIVO: "🌟",
      ANALITICO: "📊",
      INTEGRADOR: "🤝",
    };
    return icons[profile as keyof typeof icons] || "🎯";
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "low":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Target className="w-4 h-4 text-blue-600" />;
    }
  };

  const getTimingBadge = (timing: string) => {
    const variants = {
      immediate: "bg-red-100 text-red-800 border-red-200",
      short_term: "bg-yellow-100 text-yellow-800 border-yellow-200",
      long_term: "bg-blue-100 text-blue-800 border-blue-200",
    };
    const labels = {
      immediate: "Agora",
      short_term: "Em breve",
      long_term: "Futuro",
    };

    return (
      <Badge className={variants[timing as keyof typeof variants]}>
        {labels[timing as keyof typeof labels] || timing}
      </Badge>
    );
  };

  // Empty state when no recording
  if (!isRecording && !currentProfile) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Recomendações Inteligentes
          </CardTitle>
          <CardDescription>
            Sugestões baseadas no perfil DISC detectado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-slate-500">
            <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="mb-2">Inicie uma gravação para receber</p>
            <p className="text-sm">recomendações personalizadas</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading state while recording but no profile yet
  if (isRecording && !currentProfile) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Recomendações Inteligentes
            <Badge className="text-blue-800 bg-blue-100 border-blue-200 animate-pulse">
              🎤 Analisando...
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center">
            <div className="w-8 h-8 mx-auto mb-3 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="text-sm text-slate-600">
              Analisando perfil comportamental...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Recomendações Inteligentes
        </CardTitle>

        <CardDescription>
          Sugestões personalizadas baseadas no perfil comportamental
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Badge centralizado no início do content, igual aos outros cards */}
        {currentProfile && (
          <div className="pb-4 text-center border-b border-gray-100">
            <Badge
              className={`${getProfileColor(currentProfile.profile)} px-3 py-1`}
            >
              {getProfileIcon(currentProfile.profile)} {currentProfile.profile}{" "}
              ({currentProfile.confidence}%)
            </Badge>
          </div>
        )}

        {loading ? (
          <div className="py-4 text-center">
            <div className="w-8 h-8 mx-auto mb-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500">Gerando recomendações...</p>
          </div>
        ) : recommendations ? (
          <div className="space-y-4">
            {/* Resto do conteúdo igual... */}
            {/* Immediate Action */}
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center gap-2 mb-2">
                {getPriorityIcon(recommendations.priority)}
                <h4 className="font-semibold text-red-800">Ação Imediata</h4>
                {getTimingBadge(recommendations.timing)}
              </div>
              <p className="font-medium text-red-700">
                {recommendations.immediateAction}
              </p>
            </div>

            {/* Suggested Script */}
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">
                    Script Sugerido
                  </h4>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleCopyScript(recommendations.suggestedScript)
                  }
                  className="flex-shrink-0 text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
              </div>
              <div className="p-3 bg-white border border-blue-200 rounded">
                <p className="text-sm italic leading-relaxed text-blue-700 break-words">
                  "{recommendations.suggestedScript}"
                </p>
              </div>
            </div>

            {/* Approach Strategy */}
            <div className="p-3 border rounded-lg bg-slate-50 border-slate-200">
              <h4 className="flex items-center gap-2 mb-2 font-semibold text-slate-700">
                <Target className="w-4 h-4" />
                Estratégia
              </h4>
              <p className="text-sm break-words text-slate-600">
                {recommendations.approach}
              </p>
            </div>

            {/* Next Steps */}
            <div className="p-3 border border-green-200 rounded-lg bg-green-50">
              <h4 className="mb-2 font-semibold text-green-700">
                Próximos Passos
              </h4>
              <ul className="space-y-2">
                {recommendations.nextSteps.map((step, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-green-600"
                  >
                    <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="break-words">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rationale */}
            <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
              <h4 className="mb-1 font-semibold text-yellow-700">
                💡 Por que funciona
              </h4>
              <p className="text-sm text-yellow-700 break-words">
                {recommendations.rationale}
              </p>
            </div>

            {/* Objection Handling */}
            {recommendations.objectionHandling && (
              <div className="p-3 border border-orange-200 rounded-lg bg-orange-50">
                <h4 className="mb-1 font-semibold text-orange-700">
                  ⚠️ Possíveis Objeções
                </h4>
                <p className="text-sm text-orange-600 break-words">
                  {recommendations.objectionHandling}
                </p>
              </div>
            )}
          </div>
        ) : currentProfile ? (
          <div className="py-4 text-center text-slate-500">
            <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              Continue falando para receber recomendações
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default LiveRecommendations;
