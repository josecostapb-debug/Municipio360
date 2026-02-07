
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Feedback, Municipality } from '../types';

interface AIAdvisorProps {
  feedbacks: Feedback[];
  municipality: Municipality;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ feedbacks, municipality }) => {
  const [insight, setInsight] = useState<string>('Escutando o que o povo diz...');
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState<'NONE' | 'QUOTA' | 'GENERIC'>('NONE');

  useEffect(() => {
    const fetchInsight = async () => {
      if (feedbacks.length === 0) {
        setInsight('Aguardando feedbacks para gerar o relatório estratégico.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorType('NONE');
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const summary = feedbacks.slice(0, 10).map(f => `[${f.category} - ${f.sentiment}]: ${f.comment}`).join('\n');
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Você é um estrategista político e de comunicação governamental. Analise estes feedbacks reais da população de ${municipality.name}: \n${summary}\n\nDê um resumo curto para o Prefeito sobre o humor da cidade e 2 ações imediatas para melhorar a popularidade e resolver os problemas citados. Seja direto e empático.`,
          config: { temperature: 0.7 }
        });

        setInsight(response.text || 'O povo está em silêncio por enquanto.');
      } catch (error: any) {
        console.error("Erro na IA:", error);
        if (error.message?.includes('quota') || error.status === 429) {
          setErrorType('QUOTA');
          setInsight('O sistema de análise por IA atingiu o limite de uso temporário. Os dados brutos abaixo continuam sendo atualizados em tempo real para sua gestão.');
        } else {
          setErrorType('GENERIC');
          setInsight('Houve uma instabilidade na conexão com o cérebro digital. O pulso da cidade continua sendo monitorado manualmente através dos relatos abaixo.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [feedbacks, municipality]);

  return (
    <div className={`p-6 rounded-[2rem] shadow-xl mb-8 border transition-colors duration-500 ${
      errorType !== 'NONE' 
        ? 'bg-amber-900 border-amber-400/30' 
        : 'bg-indigo-900 border-white/10'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${
            errorType !== 'NONE' ? 'bg-amber-500/20 border-amber-400/30' : 'bg-indigo-500/20 border-indigo-400/30'
          }`}>
            {errorType !== 'NONE' ? (
              <svg className="w-5 h-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.268 16c-.77 1.333.192 3 1.732 3z" /></svg>
            ) : (
              <svg className="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            )}
          </div>
          <div>
            <h2 className={`text-xs font-black uppercase tracking-widest ${errorType !== 'NONE' ? 'text-amber-300' : 'text-indigo-300'}`}>
              {errorType === 'QUOTA' ? 'Aviso de Cota' : 'Inteligência Política'}
            </h2>
            <p className={`text-[10px] font-bold uppercase ${errorType !== 'NONE' ? 'text-amber-400/60' : 'text-indigo-400'}`}>
              Relatório de Escuta Ativa
            </p>
          </div>
        </div>
        
        {loading && (
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
      </div>
      
      <div className={`text-sm leading-relaxed ${errorType !== 'NONE' ? 'text-amber-100/90' : 'text-white/90 italic'}`}>
        {loading ? <span className="opacity-50">Sintonizando voz das ruas...</span> : insight}
      </div>

      {errorType === 'QUOTA' && (
        <div className="mt-4 pt-4 border-t border-amber-400/20">
          <button 
            onClick={() => window.location.reload()}
            className="text-[9px] font-black uppercase tracking-widest text-amber-400 hover:text-white transition-colors"
          >
            Tentar Reconectar →
          </button>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;
