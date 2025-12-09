import React, { useState } from "react";
import { Lightbulb, DollarSign, Target, TrendingUp, FileText, Users } from "lucide-react";
import { Button } from "../ui/button"; // ajuste o import conforme sua pasta

const suggestions = [
  {
    icon: DollarSign,
    text: "Como reduzir meu CPM?",
    color: "text-green-600 bg-green-50 border-green-200"
  },
  {
    icon: FileText,
    text: "Que tipo de conteúdo devo criar?",
    color: "text-blue-600 bg-blue-50 border-blue-200"
  },
  {
    icon: Target,
    text: "Como segmentar meu público?",
    color: "text-purple-600 bg-purple-50 border-purple-200"
  },
  {
    icon: TrendingUp,
    text: "Qual orçamento ideal para começar?",
    color: "text-orange-600 bg-orange-50 border-orange-200"
  },
  {
    icon: Users,
    text: "Facebook Ads ou Google Ads?",
    color: "text-pink-600 bg-pink-50 border-pink-200"
  },
  {
    icon: Lightbulb,
    text: "Análise de métricas da campanha",
    color: "text-yellow-600 bg-yellow-50 border-yellow-200"
  }
];

export default function SuggestedQuestions() {
  const [chatResponse, setChatResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleClick(question) {
    setLoading(true);
    setChatResponse("");
    try {
      const response = await fetch("http://127.0.0.1:8000/projetos/api/gemini-chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question })
      });
      const data = await response.json();
      setChatResponse(data.response);
    } catch (e) {
      setChatResponse("Erro ao obter resposta. Tente novamente.");
    }
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {suggestions.map(({ icon: Icon, text, color }, idx) => (
          <Button
            key={idx}
            className={`w-full flex items-center gap-2 border ${color}`}
            onClick={() => handleClick(text)}
            disabled={loading}
          >
            <Icon size={20} />
            {text}
          </Button>
        ))}
      </div>
      <div className="rounded border px-4 py-2 min-h-[64px] bg-gray-50">
        {loading ? "Pensando..." : chatResponse || "Selecione uma sugestão acima para conversar."}
      </div>
    </div>
  );
}
