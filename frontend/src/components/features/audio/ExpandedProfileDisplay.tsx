import React from "react";
import { ExpandedDISCProfile, MBTIProfile } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Brain,
  Users,
  BarChart3,
  Heart,
} from "lucide-react";

interface ExpandedProfileDisplayProps {
  discProfile?: ExpandedDISCProfile;
  mbtiProfile?: MBTIProfile;
  isLoading?: boolean;
}

export const ExpandedProfileDisplay: React.FC<ExpandedProfileDisplayProps> = ({
  discProfile,
  mbtiProfile,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  // Função para converter score (-100 a +100) para porcentagem (0 a 100)
  const scoreToPercentage = (score: number): number => {
    return Math.max(0, Math.min(100, (score + 100) / 2));
  };

  // Cores por perfil DISC
  const getDiscColor = (type: string): string => {
    const colors = {
      PRAGMATICO: "bg-red-500",
      INTUITIVO: "bg-yellow-500",
      ANALITICO: "bg-blue-500",
      INTEGRADOR: "bg-green-500",
    };
    return colors[type as keyof typeof colors] || "bg-gray-500";
  };

  // Cores por dimensão MBTI
  const getMBTIColor = (dimension: string): string => {
    const colors = {
      E: "text-orange-600",
      I: "text-purple-600",
      S: "text-green-600",
      N: "text-blue-600",
      T: "text-gray-600",
      F: "text-pink-600",
      J: "text-indigo-600",
      P: "text-yellow-600",
    };
    return colors[dimension as keyof typeof colors] || "text-gray-500";
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* DISC + FDNA Profile */}
      {discProfile && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Perfil DISC + FDNA
              </CardTitle>
              <Badge className={`${getDiscColor(discProfile.type)} text-white`}>
                {discProfile.confidence}% confiança
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Perfil Principal */}
            <div className="text-center">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-full ${getDiscColor(
                  discProfile.type
                )} text-white font-medium`}
              >
                {discProfile.type}
              </div>
              <div className="mt-2 text-sm font-medium text-gray-600">
                Subtipo: {discProfile.subtype}
              </div>
            </div>

            {/* Eixos Comportamentais */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">
                Eixos Comportamentais
              </h4>

              {/* Eixo Ataque/Defesa */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Ataque
                  </span>
                  <span className="flex items-center gap-1">
                    Defesa
                    <TrendingDown className="w-3 h-3" />
                  </span>
                </div>
                <Progress
                  value={scoreToPercentage(
                    discProfile.behavioralAxes.attackDefense
                  )}
                  className="h-2"
                />
                <div className="text-xs text-center text-gray-500">
                  {discProfile.behavioralAxes.attackDefense > 0
                    ? "Orientado por resultados"
                    : "Cauteloso"}
                </div>
              </div>

              {/* Eixo Razão/Emoção */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    Razão
                  </span>
                  <span className="flex items-center gap-1">
                    Emoção
                    <Heart className="w-3 h-3" />
                  </span>
                </div>
                <Progress
                  value={scoreToPercentage(
                    discProfile.behavioralAxes.reasonEmotion
                  )}
                  className="h-2"
                />
                <div className="text-xs text-center text-gray-500">
                  {discProfile.behavioralAxes.reasonEmotion > 0
                    ? "Orientado por relacionamentos"
                    : "Lógico e objetivo"}
                </div>
              </div>
            </div>

            {/* Características */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">
                Características Principais
              </h4>
              <div className="flex flex-wrap gap-2">
                {discProfile.fdnaDetails.primaryTraits.map((trait, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Estilo de Comunicação */}
            <div className="p-3 rounded-lg bg-blue-50">
              <h4 className="text-sm font-medium text-blue-800">
                Estilo de Comunicação
              </h4>
              <p className="mt-1 text-sm text-blue-700">
                {discProfile.fdnaDetails.communicationStyle}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* MBTI Profile */}
      {mbtiProfile && (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Perfil MBTI
              </CardTitle>
              <Badge className="text-white bg-purple-500">
                {mbtiProfile.confidence}% confiança
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Tipo MBTI */}
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 text-lg font-bold text-white bg-purple-500 rounded-full">
                {mbtiProfile.type}
              </div>
            </div>

            {/* Descrição */}
            <div className="p-3 rounded-lg bg-purple-50">
              <p className="text-sm text-purple-800">
                {mbtiProfile.description}
              </p>
            </div>

            {/* Dimensões MBTI */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">
                Dimensões da Personalidade
              </h4>

              {Object.entries(mbtiProfile.dimensions).map(
                ([dimension, score]) => {
                  const labels = {
                    extroversion: {
                      left: "Introversão",
                      right: "Extroversão",
                      leftChar: "I",
                      rightChar: "E",
                    },
                    sensing: {
                      left: "Intuição",
                      right: "Sensação",
                      leftChar: "N",
                      rightChar: "S",
                    },
                    thinking: {
                      left: "Sentimento",
                      right: "Pensamento",
                      leftChar: "F",
                      rightChar: "T",
                    },
                    judging: {
                      left: "Percepção",
                      right: "Julgamento",
                      leftChar: "P",
                      rightChar: "J",
                    },
                  };

                  const label = labels[dimension as keyof typeof labels];
                  const dominantChar =
                    score > 0 ? label.rightChar : label.leftChar;

                  return (
                    <div
                      key={dimension}
                      className="space-y-1"
                    >
                      <div className="flex justify-between text-sm">
                        <span className={getMBTIColor(label.leftChar)}>
                          {label.left}
                        </span>
                        <span
                          className={`font-medium ${getMBTIColor(
                            dominantChar
                          )}`}
                        >
                          {dominantChar} ({Math.abs(score)})
                        </span>
                        <span className={getMBTIColor(label.rightChar)}>
                          {label.right}
                        </span>
                      </div>
                      <Progress
                        value={scoreToPercentage(score)}
                        className="h-2"
                      />
                    </div>
                  );
                }
              )}
            </div>

            {/* Pontos Fortes */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Pontos Fortes</h4>
              <div className="flex flex-wrap gap-2">
                {mbtiProfile.strengths.map((strength, index) => (
                  <Badge
                    key={index}
                    className="text-xs text-green-800 bg-green-100"
                  >
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Áreas de Desenvolvimento */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">
                Áreas de Desenvolvimento
              </h4>
              <div className="flex flex-wrap gap-2">
                {mbtiProfile.developmentAreas.map((area, index) => (
                  <Badge
                    key={index}
                    className="text-xs bg-amber-100 text-amber-800"
                  >
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExpandedProfileDisplay;
