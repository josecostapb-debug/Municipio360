
import React, { useState } from 'react';
import { Municipality, Category, AreaType } from '../types';
import { GoogleGenAI } from "@google/genai";

interface PopularityPollProps {
  municipality: Municipality;
  onClose: () => void;
  onSuccess: (feedback: any) => void;
}

const PopularityPoll: React.FC<PopularityPollProps> = ({ municipality, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Perfil, 2: Categoria, 3: Detalhes, 4: Sucesso
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    citizenName: '',
    neighborhood: '',
    areaType: AreaType.URBANA,
    category: Category.SAUDE,
    rating: 3,
    comment: '',
    timestamp: new Date().toISOString()
  });

  const [sentimentResult, setSentimentResult] = useState('NEUTRO');

  const handleSubmit = async () => {
    setLoading(true);
    let sentiment = 'NEUTRO';
    
    // Heurística básica de fallback caso a IA falhe
    if (formData.rating >= 4) sentiment = 'POSITIVO';
    if (formData.rating <= 2) sentiment = 'NEGATIVO';

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
      console.warn("IA indisponível no momento. Usando heurística de rating para o sentimento.");
      // Mantém o sentimento baseado no rating definido acima
    } finally {
      setSentimentResult(sentiment);
      setStep(4);
      setLoading(false);
      
      setTimeout(() => {
        onSuccess({ ...formData, sentiment, municipalityId: municipality.id });
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-indigo-950/90 backdrop-blur-xl">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {step < 4 && (
          <div className="bg-indigo-600 p-8 text-white relative">
            <button onClick={onClose} className="absolute top-6 right-6 opacity-60 hover:opacity-100 transition-opacity">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Voz do Cidadão</p>
            <h2 className="text-2xl font-black tracking-tight mt-1">{municipality.name} te ouve</h2>
          </div>
        )}

        <div className="p-10">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="text-center mb-4">
                <h3 className="font-black text-xl text-slate-900">Quem está falando?</h3>
                <p className="text-xs text-slate-500 mt-1">Identifique-se para que possamos agir.</p>
              </div>
              <div className="space-y-4">
                <input 
                  type="text" placeholder="Seu nome"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold"
                  value={formData.citizenName} onChange={e => setFormData({...formData, citizenName: e.target.value})}
                />
                <input 
                  type="text" placeholder="Seu bairro ou comunidade"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold"
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
              <button disabled={!formData.citizenName || !formData.neighborhood} onClick={() => setStep(2)} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 transition-all disabled:opacity-50">Próximo</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h3 className="font-black text-xl text-slate-900 text-center">Qual o assunto principal?</h3>
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
              <button onClick={() => setStep(1)} className="w-full text-[9px] font-black text-slate-400 uppercase tracking-widest">Voltar</button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="text-center">
                <p className="text-[10px] font-black text-indigo-600 uppercase mb-2">Avaliação de {formData.category}</p>
                <div className="flex justify-center gap-2">
                   {[1,2,3,4,5].map(star => (
                     <button key={star} onClick={() => setFormData({...formData, rating: star})} className={`text-3xl transition-transform hover:scale-125 ${formData.rating >= star ? 'grayscale-0' : 'grayscale opacity-20'}`}>
                        {star <= 2 ? '😡' : star === 3 ? '😐' : '😊'}
                     </button>
                   ))}
                </div>
              </div>
              <textarea 
                placeholder="Como podemos melhorar?"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-medium min-h-[150px] text-sm"
                value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})}
              ></textarea>
              <button disabled={loading || !formData.comment} onClick={handleSubmit} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl disabled:opacity-50">
                {loading ? "Processando Voz..." : "Enviar agora"}
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="py-12 text-center animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center mb-6">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Obrigado!</h2>
              <p className="text-sm text-slate-500 mt-2 px-4 leading-relaxed">Sua participação é vital para uma gestão melhor em {municipality.name}.</p>
              
              <button 
                onClick={() => onSuccess({ ...formData, sentiment: sentimentResult, municipalityId: municipality.id })}
                className="mt-10 px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
              >
                Voltar ao Início
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularityPoll;
