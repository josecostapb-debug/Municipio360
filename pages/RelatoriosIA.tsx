
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Feedback, Municipality } from '../types';

interface RelatoriosIAProps {
  feedbacks: Feedback[];
  municipality: Municipality;
}

const RelatoriosIA: React.FC<RelatoriosIAProps> = ({ feedbacks, municipality }) => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFullReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const dataString = feedbacks.map(f => `[Bairro: ${f.neighborhood}, Cat: ${f.category}, Nota: ${f.rating}]: ${f.comment}`).join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Você é um Consultor Sênior de Gestão Pública. Com base nos seguintes feedbacks reais de ${municipality.name}:\n\n${dataString}\n\nEscreva um Relatório Estratégico para o Prefeito dividido em:\n1. DIAGNÓSTICO DE CLIMA (Como o povo se sente hoje)\n2. ZONAS DE RISCO (Quais áreas podem gerar crises políticas ou sociais)\n3. PLANO DE AÇÃO 48H (O que fazer imediatamente para acalmar os pontos críticos)\n4. OPORTUNIDADES DE INVESTIMENTO (Onde aplicar verba para máximo retorno de satisfação). Use um tom formal, porém encorajador.`,
      });

      setReport(response.text || "Não foi possível consolidar os dados.");
    } catch (err: any) {
      if (err.message?.includes('quota')) {
        setError("Limite de processamento atingido. Tente novamente em alguns minutos ou atualize sua chave de API.");
      } else {
        setError("Ocorreu um erro ao processar o relatório. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Relatórios Estratégicos</h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">Inteligência de Dados para Gestão Municipal</p>
      </header>

      {!report && !loading ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] p-16 text-center">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Pronto para a análise mensal?</h2>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">Processaremos {feedbacks.length} relatos populares para criar um plano de ação completo para {municipality.name}.</p>
          <button 
            onClick={generateFullReport}
            className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform hover:-translate-y-1"
          >
            Gerar Plano Estratégico
          </button>
        </div>
      ) : loading ? (
        <div className="bg-slate-900 rounded-[3rem] p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
            <h2 className="text-2xl font-black mb-2">Processando Inteligência...</h2>
            <p className="text-indigo-300 font-bold uppercase text-[10px] tracking-[0.3em] animate-pulse">Cruzando dados de {feedbacks.length} cidadãos</p>
          </div>
        </div>
      ) : report ? (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-700">
          <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Documento Interno - Sigiloso</p>
              <h3 className="text-xl font-black">Plano Estratégico de Governo</h3>
            </div>
            <button 
              onClick={() => setReport(null)}
              className="px-4 py-2 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
            >
              Novo Relatório
            </button>
          </div>
          <div className="p-10 md:p-16 prose prose-slate max-w-none">
            <div className="flex justify-between items-start mb-12 pb-8 border-b border-slate-100">
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase">Município</p>
                 <p className="font-bold text-slate-900">{municipality.name} - PB</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase">Data de Emissão</p>
                 <p className="font-bold text-slate-900">{new Date().toLocaleDateString('pt-BR')}</p>
               </div>
            </div>
            
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium">
              {report}
            </div>

            <div className="mt-16 p-8 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
              <p className="text-xs font-bold text-slate-500 italic">Este relatório foi gerado por Inteligência Artificial e deve ser validado pelos órgãos de controle.</p>
              <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                Imprimir
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {error && (
        <div className="mt-8 p-6 bg-rose-50 border border-rose-200 rounded-3xl flex items-center gap-4 text-rose-800">
          <svg className="w-6 h-6 shrink-0 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <p className="font-black text-xs uppercase tracking-widest">Erro de Processamento</p>
            <p className="text-sm font-medium opacity-80">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatoriosIA;
