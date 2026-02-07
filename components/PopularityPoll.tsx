
import React, { useState } from 'react';
import { Municipality } from '../types';
import { GoogleGenAI } from "@google/genai";

interface PopularityPollProps {
  municipality: Municipality;
  onClose: () => void;
  onSuccess: (vote: any) => void;
}

const PopularityPoll: React.FC<PopularityPollProps> = ({ municipality, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
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
      // 1. Geolocalização
      const pos = await new Promise<GeolocationPosition>((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 });
      });
      coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    } catch (e) {
      console.warn("Geo blocked or failed");
    }

    try {
      // 2. Análise de Sentimento com Gemini
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Classifique o sentimento deste comentário de um cidadão da cidade de ${municipality.name} em uma única palavra (POSITIVO, NEUTRO ou NEGATIVO): "${formData.comment}"`,
      });
      
      const sentiment = (response.text?.trim() || 'NEUTRO').toUpperCase();

      // 3. Sucesso
      onSuccess({
        ...formData,
        coords,
        sentiment,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      onSuccess({ ...formData, coords, sentiment: 'NEUTRO', timestamp: new Date().toISOString() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-indigo-600 p-8 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 opacity-60 hover:opacity-100">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Termômetro Popular</p>
          <h2 className="text-2xl font-black tracking-tight mt-1">Sua opinião sobre {municipality.name}</h2>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-black uppercase text-slate-400 mb-2 block tracking-widest">Identificação (CPF/Título)</label>
                <input 
                  type="text" 
                  placeholder="000.000.000-00"
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-bold"
                  value={formData.cpf}
                  onChange={e => setFormData({...formData, cpf: e.target.value})}
                />
                <p className="text-[10px] text-slate-400 mt-2 italic">* Seus dados são protegidos pela LGPD Municipal.</p>
              </div>
              <button 
                disabled={!formData.cpf}
                onClick={() => setStep(2)}
                className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all disabled:opacity-30"
              >
                Prosseguir para Avaliação
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-4">
                  <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Nota da Gestão: <span className="text-indigo-600 text-lg">{formData.rating}</span></label>
                  <span className="text-[10px] font-bold text-slate-400 italic">Arraste o cursor</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                  value={formData.rating}
                  onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-400 mb-2 block tracking-widest">O que pode melhorar?</label>
                <textarea 
                  placeholder="Diga-nos o motivo da sua nota..."
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none font-medium min-h-[100px]"
                  value={formData.comment}
                  onChange={e => setFormData({...formData, comment: e.target.value})}
                ></textarea>
              </div>

              <button 
                disabled={loading || !formData.comment}
                onClick={handleGeoAndSubmit}
                className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sincronizando com Geo-IA...
                  </>
                ) : (
                  "Enviar Opinião"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopularityPoll;
