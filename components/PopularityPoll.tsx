
import React, { useState } from 'react';
import { Municipality } from '../types';
import { GoogleGenAI } from "@google/genai";

interface PopularityPollProps {
  municipality: Municipality;
  onClose: () => void;
  onSuccess: (vote: any) => void;
}

const PopularityPoll: React.FC<PopularityPollProps> = ({ municipality, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: ID, 2: Rating, 3: Success
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cpf: '',
    rating: 50,
    comment: ''
  });

  const handleGeoAndSubmit = async () => {
    setLoading(true);
    let coords = null;

    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 });
      });
      coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    } catch (e) { console.warn("Geo blocked"); }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Classifique o sentimento deste comentário de um cidadão da cidade de ${municipality.name}: "${formData.comment}". Responda APENAS a palavra POSITIVO, NEUTRO ou NEGATIVO.`,
      });
      
      const sentiment = (response.text?.trim() || 'NEUTRO').toUpperCase();
      
      // Simula envio para banco de dados
      setTimeout(() => {
        setStep(3); // Vai para tela de sucesso
        setLoading(false);
        // Notifica o app pai após um tempo
        setTimeout(() => onSuccess({ ...formData, coords, sentiment }), 2000);
      }, 1000);
    } catch (e) {
      setStep(3);
      setLoading(false);
      setTimeout(() => onSuccess({ ...formData, coords, sentiment: 'NEUTRO' }), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {step !== 3 && (
          <div className="bg-indigo-600 p-8 text-white relative">
            <button onClick={onClose} className="absolute top-6 right-6 opacity-60 hover:opacity-100 transition-opacity">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Canal Direto com o Prefeito</p>
            <h2 className="text-2xl font-black tracking-tight mt-1">{municipality.name} te ouve</h2>
          </div>
        )}

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl mx-auto flex items-center justify-center text-indigo-600 mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <h3 className="font-bold text-slate-900">Validar Residência</h3>
                <p className="text-xs text-slate-500 mt-1">Insira seu CPF ou Título para garantir que sua voz seja contada.</p>
              </div>
              <input 
                type="text" 
                placeholder="000.000.000-00"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-center text-lg"
                value={formData.cpf}
                onChange={e => setFormData({...formData, cpf: e.target.value})}
              />
              <button 
                disabled={formData.cpf.length < 11}
                onClick={() => setStep(2)}
                className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all disabled:opacity-30 shadow-xl"
              >
                Prosseguir para Avaliação
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Sua Nota: <span className={`text-2xl ml-2 ${formData.rating > 60 ? 'text-emerald-500' : formData.rating > 40 ? 'text-amber-500' : 'text-rose-500'}`}>{formData.rating}</span></label>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  className="w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                  value={formData.rating}
                  onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}
                />
                <div className="flex justify-between mt-2 text-[9px] font-black text-slate-400 uppercase">
                  <span>Insatisfeito</span>
                  <span>Muito Satisfeito</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-400 mb-2 block tracking-widest">O que você diria ao prefeito?</label>
                <textarea 
                  placeholder="Seja direto: elogios, críticas ou sugestões de melhoria..."
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-medium min-h-[120px] text-sm"
                  value={formData.comment}
                  onChange={e => setFormData({...formData, comment: e.target.value})}
                ></textarea>
              </div>

              <button 
                disabled={loading || !formData.comment}
                onClick={handleGeoAndSubmit}
                className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sincronizando Opinião...
                  </>
                ) : (
                  "Enviar para o Gabinete"
                )}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="py-12 text-center animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center mb-6">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Obrigado, Cidadão!</h2>
              <p className="text-sm text-slate-500 mt-2 px-4 leading-relaxed">Sua participação foi registrada. O prefeito verá seu feedback no painel de comando em tempo real.</p>
              <div className="mt-8 pt-8 border-t border-slate-100">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Município360 • Gestão Transparente</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularityPoll;
