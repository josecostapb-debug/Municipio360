
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Metric, Municipality } from '../types';

interface AIAdvisorProps {
  metrics: Metric[];
  municipality: Municipality;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ metrics, municipality }) => {
  const [insight, setInsight] = useState<string>('Analisando indicadores municipais...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      if (metrics.length === 0) {
        setInsight('Aguardando dados suficientes para análise estratégica.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const dataSummary = metrics.map(m => `${m.name}: ${m.value}${m.unit}`).join(', ');
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Você é um consultor sênior de gestão pública estratégica. Analise estes dados da Prefeitura de ${municipality.name} (${municipality.region} Paraibano, População: ${municipality.population}): ${dataSummary}. Dê um resumo executivo direto para o prefeito em 3 tópicos sobre o que ele deve priorizar hoje dada a realidade do município.`,
          config: {
            temperature: 0.7,
            thinkingConfig: { thinkingBudget: 0 }
          }
        });

        setInsight(response.text || 'Não foi possível gerar a análise.');
      } catch (error) {
        console.error('Gemini error:', error);
        setInsight('Análise suspensa temporariamente. Verifique a conexão com o servidor central.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [metrics, municipality]);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl mb-8 border border-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3.005 3.005 0 013.75-2.906z" /></svg>
      </div>
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-400/30 backdrop-blur-sm">
            <svg className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" /></svg>
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-blue-400">Advisor AI</h2>
            <p className="text-xs text-slate-300">Análise para {municipality.name} - PB</p>
          </div>
        </div>
      </div>
      <div className="text-sm leading-relaxed min-h-[60px] relative z-10">
        {loading ? (
          <div className="flex gap-2 items-center py-4">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-150"></div>
          </div>
        ) : (
          <div className="whitespace-pre-line text-slate-100 font-medium italic opacity-90">{insight}</div>
        )}
      </div>
    </div>
  );
};

export default AIAdvisor;
