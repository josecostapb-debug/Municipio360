
import React, { useState } from 'react';
import { Feedback, Municipality, Category, AreaType } from '../types';
import AIAdvisor from '../components/AIAdvisor';

interface DashboardGestorProps {
  feedbacks: Feedback[];
  municipality: Municipality;
  onOpenMenu: () => void;
}

const DashboardGestor: React.FC<DashboardGestorProps> = ({ feedbacks, municipality, onOpenMenu }) => {
  const [filterArea, setFilterArea] = useState<AreaType | 'TODOS'>('TODOS');
  
  const cityFeedbacks = feedbacks.filter(f => f.municipalityId === municipality.id);
  const filteredFeedbacks = filterArea === 'TODOS' 
    ? cityFeedbacks 
    : cityFeedbacks.filter(f => f.areaType === filterArea);

  const positiveCount = cityFeedbacks.filter(f => f.sentiment === 'POSITIVO').length;
  const negativeCount = cityFeedbacks.filter(f => f.sentiment === 'NEGATIVO').length;
  const total = cityFeedbacks.length || 1;
  const popularityScore = Math.round((positiveCount / total) * 100);

  const getThermometerColor = (score: number) => {
    if (score > 70) return 'text-emerald-500';
    if (score > 40) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getSentimentBg = (s: string) => {
    if (s === 'POSITIVO') return 'bg-emerald-50 border-emerald-100 text-emerald-700';
    if (s === 'NEGATIVO') return 'bg-rose-50 border-rose-100 text-rose-700';
    return 'bg-slate-50 border-slate-100 text-slate-700';
  };

  const handleResponder = (f: Feedback) => {
    const message = encodeURIComponent(`Olá, ${f.citizenName}! Aqui é do Gabinete do Prefeito de ${municipality.name}. Recebemos seu relato sobre ${f.category} ("${f.comment.substring(0, 30)}...") e gostaríamos de conversar sobre isso.`);
    const whatsappUrl = `https://wa.me/${f.whatsapp}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="p-4 md:p-8 lg:p-10">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenMenu}
            className="lg:hidden p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 shadow-sm hover:bg-slate-50"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">Gabinete de {municipality.name}</h1>
            <p className="text-slate-500 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.2em] mt-1">Visão Geral de Popularidade</p>
          </div>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto gap-1">
          {['TODOS', AreaType.URBANA, AreaType.RURAL].map((area) => (
            <button 
              key={area}
              onClick={() => setFilterArea(area as any)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterArea === area ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {area === 'TODOS' ? 'Visão Geral' : area}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center relative group">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 rounded-t-full"></div>
          
          <div className="mb-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Índice de Aprovação</h3>
            <div className="relative inline-block scale-110">
               <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="transparent" stroke="#f8fafc" strokeWidth="10" />
                  <circle 
                    cx="50" cy="50" r="42" fill="transparent" 
                    stroke="currentColor" strokeWidth="10" 
                    strokeDasharray={`${(popularityScore / 100) * 264} 264`}
                    className={`${getThermometerColor(popularityScore)} transition-all duration-1000 ease-out`}
                    strokeLinecap="round"
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-black tracking-tighter ${getThermometerColor(popularityScore)}`}>{popularityScore}%</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Popularidade</span>
               </div>
            </div>
          </div>
          
          <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
             <div>
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Positivos</p>
                <p className="text-xl font-black text-slate-800">{positiveCount}</p>
             </div>
             <div>
                <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-1">Negativos</p>
                <p className="text-xl font-black text-slate-800">{negativeCount}</p>
             </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <AIAdvisor feedbacks={cityFeedbacks} municipality={municipality} />
          
          <div className="grid grid-cols-2 gap-4 mt-6">
             <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2rem]">
                <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-2">Principal Demanda Urbana</p>
                <p className="text-sm font-black text-indigo-900 truncate">Sinalização no Bessa</p>
             </div>
             <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem]">
                <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-2">Alerta Zona Rural</p>
                <p className="text-sm font-black text-amber-900 truncate">Estradas em Galante</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
               <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
                 Relatos em Tempo Real
               </h3>
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Filtrado por: {filterArea}</span>
            </div>
            
            <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
              {filteredFeedbacks.length > 0 ? filteredFeedbacks.map(f => (
                <div key={f.id} className="p-8 hover:bg-slate-50/50 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center font-black text-lg ${getSentimentBg(f.sentiment)}`}>
                        {f.citizenName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 leading-none mb-2">{f.citizenName}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{f.neighborhood}</span>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${f.areaType === AreaType.URBANA ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                            {f.areaType}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="block text-[9px] font-black text-slate-400 border border-slate-200 px-3 py-1.5 rounded-xl uppercase tracking-tighter bg-white mb-1">
                        {f.category}
                      </span>
                      <span className="text-[10px] font-black text-indigo-600">Nota: {f.rating}/10</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-700 text-sm font-medium leading-relaxed pl-1">
                    "{f.comment}"
                  </p>
                  
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase">
                       <span className="bg-slate-100 px-2 py-1 rounded">CPF/Título: {f.cpfOrVoterId.substring(0,3)}...</span>
                    </div>
                    <div className="flex gap-3">
                      <button className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">Marcar Lido</button>
                      <button 
                        onClick={() => handleResponder(f)}
                        className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.941-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217s.231.001.332.005c.109.004.253-.041.397.303.145.348.491 1.2.534 1.289.044.09.072.195.014.311-.058.116-.087.188-.173.289-.087.101-.183.225-.261.303-.093.094-.191.196-.081.385.11.19.488.805 1.047 1.301.721.639 1.327.838 1.515.931.188.093.297.078.406-.048.11-.127.462-.536.586-.717.124-.181.249-.152.419-.087.171.065 1.083.511 1.27.605.188.094.312.14.356.216.043.077.043.446-.1.851z"/></svg>
                        Responder via WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-24 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                  </div>
                  <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Sem feedbacks registrados para esta zona</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
             <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8">Zonas Críticas</h3>
             <div className="space-y-6">
                {Array.from(new Set(cityFeedbacks.map(f => f.neighborhood))).slice(0, 5).map(nb => {
                  const nbFeedbacks = cityFeedbacks.filter(f => f.neighborhood === nb);
                  const nbNeg = nbFeedbacks.filter(f => f.sentiment === 'NEGATIVO').length;
                  const intensity = Math.min(100, (nbNeg / (nbFeedbacks.length || 1)) * 100);
                  
                  return (
                    <div key={nb} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[10px] font-black text-slate-600">
                        <span className="truncate pr-4 uppercase tracking-tighter">{nb}</span>
                        <span className="text-rose-500">{nbNeg}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${intensity}%` }} 
                          className={`h-full transition-all duration-700 ${intensity > 50 ? 'bg-rose-500' : 'bg-amber-500'}`}
                        ></div>
                      </div>
                    </div>
                  );
                })}
             </div>
           </div>

           <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-125"></div>
              <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4">Metas de Gestão</p>
              <h4 className="text-xl font-black mb-2 leading-tight">Melhorar Nota Média Geral</h4>
              <p className="text-xs text-indigo-100/60 mb-8 leading-relaxed">Nota atual: {(cityFeedbacks.reduce((acc, f) => acc + f.rating, 0) / total).toFixed(1)} / 10</p>
              <div className="flex items-center justify-between text-[10px] font-black mb-2">
                <span>Meta: 8.5</span>
                <span>72%</span>
              </div>
              <div className="h-2 bg-black/10 rounded-full overflow-hidden">
                <div className="w-[72%] h-full bg-white rounded-full"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGestor;
