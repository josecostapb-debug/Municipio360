
import React, { useState } from 'react';
import { Municipality, Category, AreaType } from '../types';
import { GoogleGenAI } from "@google/genai";

interface PopularityPollProps {
  municipality: Municipality;
  onClose: () => void;
  onSuccess: (feedback: any) => void;
}

const PopularityPoll: React.FC<PopularityPollProps> = ({ municipality, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Identificação, 2: Categoria, 3: Avaliação 1-10, 4: Sucesso
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    citizenName: '',
    cpfOrVoterId: '',
    whatsapp: '',
    neighborhood: '',
    areaType: AreaType.URBANA,
    category: Category.SAUDE,
    rating: 5,
    comment: '',
    timestamp: new Date().toISOString()
  });

  const [sentimentResult, setSentimentResult] = useState('NEUTRO');

  const handleSubmit = async () => {
    setLoading(true);
    let sentiment = 'NEUTRO';
    
    // Heurística baseada na nova escala 1-10
    if (formData.rating >= 8) sentiment = 'POSITIVO';
    if (formData.rating <= 4) sentiment = 'NEGATIVO';

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analise o sentimento deste comentário público para a prefeitura: "${formData.comment}". Responda APENAS uma das palavras: POSITIVO, NEUTRO ou NEGATIVO.`,
      });
      
      const aiSentiment = (response.text?.trim() || '').toUpperCase();
      if (['POSITIVO', 'NEUTRO', 'NEGATIVO'].includes(aiSentiment)) {
        sentiment = aiSentiment;
      }
    } catch (e) {
      console.warn("IA indisponível. Usando heurística de rating.");
    } finally {
      setSentimentResult(sentiment);
      setStep(4);
      setLoading(false);
      
      setTimeout(() => {
        onSuccess({ ...formData, sentiment, municipalityId: municipality.id });
      }, 3000);
    }
  };

  const isIdentified = formData.citizenName && formData.cpfOrVoterId.length >= 11 && formData.whatsapp.length >= 10;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-indigo-950/90 backdrop-blur-xl overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-300">
        
        {step < 4 && (
          <div className="bg-indigo-600 p-8 text-white relative">
            <button onClick={onClose} className="absolute top-6 right-6 opacity-60 hover:opacity-100 transition-opacity">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 text-center">Protocolo de Escuta Ativa</p>
            <h2 className="text-2xl font-black tracking-tight mt-1 text-center">{municipality.name} te ouve</h2>
          </div>
        )}

        <div className="p-8 md:p-12">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="text-center mb-2">
                <h3 className="font-black text-xl text-slate-900">Identificação Obrigatória</h3>
                <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Garantia de Veracidade</p>
              </div>
              <div className="space-y-4">
                <input 
                  type="text" placeholder="Seu nome completo"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-sm"
                  value={formData.citizenName} onChange={e => setFormData({...formData, citizenName: e.target.value})}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder="CPF ou Título de Eleitor"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-sm"
                    value={formData.cpfOrVoterId} onChange={e => setFormData({...formData, cpfOrVoterId: e.target.value})}
                  />
                  <input 
                    type="tel" placeholder="WhatsApp (DDD+Número)"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-sm"
                    value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value.replace(/\D/g,'')})}
                  />
                </div>
                <input 
                  type="text" placeholder="Seu bairro ou comunidade"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-sm"
                  value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})}
                />
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setFormData({...formData, areaType: AreaType.URBANA})}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.areaType === AreaType.URBANA ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                  >
                    Zona Urbana
                  </button>
                  <button 
                    onClick={() => setFormData({...formData, areaType: AreaType.RURAL})}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.areaType === AreaType.RURAL ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                  >
                    Zona Rural
                  </button>
                </div>
              </div>
              <button disabled={!isIdentified || !formData.neighborhood} onClick={() => setStep(2)} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 transition-all disabled:opacity-30">Continuar Avaliação</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h3 className="font-black text-xl text-slate-900 text-center">O que você quer avaliar?</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.values(Category).map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => { setFormData({...formData, category: cat}); setStep(3); }}
                    className="p-4 bg-slate-50 border-2 border-transparent hover:border-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all text-center"
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(1)} className="w-full text-[9px] font-black text-slate-400 uppercase tracking-widest">Voltar para Identificação</button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="text-center">
                <p className="text-[10px] font-black text-indigo-600 uppercase mb-4 tracking-widest">Dê sua nota para {formData.category} (1 a 10)</p>
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                   {[1,2,3,4,5,6,7,8,9,10].map(n => (
                     <button 
                      key={n} 
                      onClick={() => setFormData({...formData, rating: n})} 
                      className={`w-10 h-10 rounded-xl font-black text-xs transition-all transform hover:scale-110 ${
                        formData.rating === n 
                        ? 'bg-indigo-600 text-white scale-110 shadow-lg' 
                        : 'bg-slate-100 text-slate-400'
                      }`}
                     >
                        {n}
                     </button>
                   ))}
                </div>
                <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase px-4 mb-8">
                   <span className="text-rose-500">Péssimo (1)</span>
                   <span className="text-amber-500">Regular (5)</span>
                   <span className="text-emerald-500">Excelente (10)</span>
                </div>
              </div>
              <textarea 
                placeholder="Detalhe sua experiência ou sugestão..."
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-medium min-h-[120px] text-sm"
                value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})}
              ></textarea>
              <button disabled={loading || !formData.comment} onClick={handleSubmit} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl disabled:opacity-50">
                {loading ? "Validando Dados..." : "Finalizar e Enviar"}
              </button>
              <button onClick={() => setStep(2)} className="w-full text-[9px] font-black text-slate-400 uppercase tracking-widest">Mudar Assunto</button>
            </div>
          )}

          {step === 4 && (
            <div className="py-12 text-center animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center mb-6 shadow-inner">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Avaliação Concluída!</h2>
              <p className="text-sm text-slate-500 mt-2 px-4 leading-relaxed font-medium">Sua voz foi registrada sob o protocolo <strong>#{Math.floor(Math.random()*900000)}</strong>. O Gabinete do Prefeito entrará em contato via WhatsApp se necessário.</p>
              
              <button 
                onClick={() => onSuccess({ ...formData, sentiment: sentimentResult, municipalityId: municipality.id })}
                className="mt-10 px-8 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-transform active:scale-95"
              >
                Retornar ao Portal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularityPoll;
