
import React, { useState, useMemo, useEffect } from 'react';
import { User, UserRole, Metric, Alert, Municipality, Vote } from './types';
import { INITIAL_ALERTS, MUNICIPALITIES, generateMetricsForMunicipality } from './constants';
import Sidebar from './components/Sidebar';
import DashboardGestor from './pages/DashboardGestor';
import EnvioDados from './pages/EnvioDados';
import PopularityPoll from './components/PopularityPoll';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LOGIN' | 'GESTOR' | 'CIDADAO'>('LOGIN');
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [alerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [notif, setNotif] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

  // Efeito para detectar "Rota" via URL (Simulando municipio360.com.br/#/id-da-cidade)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash) {
        const city = MUNICIPALITIES.find(m => m.id === hash);
        if (city) {
          setSelectedCityId(city.id);
          setViewMode('CIDADAO');
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const filteredMunicipalities = useMemo(() => {
    if (!searchTerm) return MUNICIPALITIES;
    return MUNICIPALITIES.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const currentMunicipality = useMemo(() => 
    MUNICIPALITIES.find(m => m.id === (user?.municipalityId || selectedCityId)) || MUNICIPALITIES[0], 
    [user, selectedCityId]
  );

  const currentMetrics = useMemo(() => {
    return generateMetricsForMunicipality(currentMunicipality);
  }, [currentMunicipality]);

  const handleLoginMunicipality = (m: Municipality) => {
    const newUser: User = {
      id: `user-${m.id}`,
      name: `Gestor Municipal`,
      role: UserRole.PREFEITO,
      municipalityId: m.id
    };
    setUser(newUser);
    setViewMode('GESTOR');
    setActiveTab('dashboard');
  };

  const handleCitizenAccess = (m: Municipality) => {
    setSelectedCityId(m.id);
    setViewMode('CIDADAO');
    window.location.hash = `/${m.id}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-x-hidden">
      {/* MODO CIDADAO */}
      {viewMode === 'CIDADAO' && (
        <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] mx-auto flex items-center justify-center text-white text-4xl font-black mb-8 shadow-2xl rotate-3">M</div>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-2">Portal da Transparência Ativa</p>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Fala, {currentMunicipality.name}!</h1>
            <p className="text-slate-500 font-medium mb-12 leading-relaxed">
              Sua opinião vai direto para o Cockpit de Comando da Prefeitura. Ajude-nos a construir uma gestão baseada em dados reais.
            </p>
            
            <button 
              onClick={() => setShowPoll(true)}
              className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-2xl shadow-indigo-200 hover:scale-[1.02] transition-transform flex items-center justify-center gap-4"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              Avaliar Gestão de {currentMunicipality.name}
            </button>

            <button 
              onClick={() => { setViewMode('LOGIN'); window.location.hash = ''; }}
              className="mt-8 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-indigo-600 transition-colors"
            >
              Não é de {currentMunicipality.name}? Mudar cidade
            </button>
          </div>
        </div>
      )}

      {/* MODO LOGIN */}
      {viewMode === 'LOGIN' && (
        <div className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[140px]"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[140px]"></div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] shadow-2xl max-w-xl w-full relative z-10 animate-in zoom-in-95 duration-300">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center text-white text-4xl font-black mb-6 shadow-2xl shadow-blue-500/30">M</div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Município360</h1>
              <p className="text-slate-500 font-medium mt-1">Selecione seu município para continuar</p>
            </div>
            
            <input 
              type="text" 
              placeholder="Ex: João Pessoa, Patos, Sousa..."
              className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-100 outline-none transition-all font-semibold mb-6 shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {filteredMunicipalities.map(m => (
                <div key={m.id} className="flex gap-2">
                  <button
                    onClick={() => handleLoginMunicipality(m)}
                    className="flex-1 p-5 bg-slate-900 text-white rounded-[1.2rem] hover:bg-slate-800 group transition-all flex items-center justify-between"
                  >
                    <div className="text-left">
                      <p className="font-bold text-base">{m.name}</p>
                      <p className="text-[9px] uppercase font-black opacity-50 tracking-widest">Painel Gestor</p>
                    </div>
                    <svg className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </button>
                  <button
                    onClick={() => handleCitizenAccess(m)}
                    className="p-5 bg-indigo-50 text-indigo-600 rounded-[1.2rem] hover:bg-indigo-100 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                  >
                    Avaliar
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODO GESTOR (CORREÇÃO DE LAYOUT) */}
      {viewMode === 'GESTOR' && user && (
        <div className="flex h-screen overflow-hidden">
          {/* Backdrop Mobile */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <Sidebar 
            user={user} 
            activeTab={activeTab} 
            setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} 
            onLogout={() => { setViewMode('LOGIN'); setUser(null); }} 
            municipalityName={currentMunicipality.name}
            onSwitchMunicipality={() => setViewMode('LOGIN')}
            isOpen={isSidebarOpen}
          />

          <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
            {/* Top Bar Mobile */}
            <div className="lg:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-20 flex justify-between items-center shadow-sm shrink-0">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <span className="font-black text-slate-900 text-sm tracking-tight uppercase">Município360</span>
              <div className="w-10"></div>
            </div>

            {notif && (
              <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-10 border border-blue-500/50">
                 <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
                 <span className="text-xs font-black uppercase tracking-widest">{notif}</span>
              </div>
            )}

            {/* Scrollable Container para o Dashboard */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {activeTab === 'dashboard' && <DashboardGestor metrics={currentMetrics} alerts={alerts.filter(a => a.municipalityId === user.municipalityId)} municipality={currentMunicipality} />}
              {activeTab === 'envio' && <EnvioDados user={user} onSuccess={() => { setNotif("Sincronizado"); setActiveTab('dashboard'); setTimeout(() => setNotif(null), 3000); }} />}
              <div className="h-20 lg:h-8"></div> {/* Padding inferior */}
            </div>
          </main>
        </div>
      )}

      {/* OVERLAY DE VOTAÇÃO */}
      {showPoll && (
        <PopularityPoll 
          municipality={currentMunicipality} 
          onClose={() => setShowPoll(false)}
          onSuccess={(vote) => {
            setNotif(`Obrigado! Sentimento: ${vote.sentiment}`);
            setTimeout(() => { setNotif(null); setShowPoll(false); }, 3000);
          }}
        />
      )}
    </div>
  );
};

export default App;
