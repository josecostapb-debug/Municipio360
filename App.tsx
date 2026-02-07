
import React, { useState, useMemo, useEffect } from 'react';
import { User, UserRole, Feedback, Municipality, Category } from './types';
import { INITIAL_FEEDBACKS, MUNICIPALITIES } from './constants';
import Sidebar from './components/Sidebar';
import DashboardGestor from './pages/DashboardGestor';
import PopularityPoll from './components/PopularityPoll';
import RelatoriosIA from './pages/RelatoriosIA';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LOGIN' | 'GESTOR' | 'CIDADAO'>('LOGIN');
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(INITIAL_FEEDBACKS);
  const [notif, setNotif] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash && viewMode === 'LOGIN') {
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
  }, [viewMode]);

  const currentMunicipality = useMemo(() => 
    MUNICIPALITIES.find(m => m.id === (user?.municipalityId || selectedCityId)) || MUNICIPALITIES[0], 
    [user, selectedCityId]
  );

  const filteredMunicipalities = useMemo(() => {
    if (!searchTerm) return MUNICIPALITIES;
    return MUNICIPALITIES.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleLoginMunicipality = (m: Municipality) => {
    window.location.hash = '';
    setUser({ id: `gestor-${m.id}`, name: 'Prefeito(a)', role: UserRole.PREFEITO, municipalityId: m.id });
    setViewMode('GESTOR');
  };

  const handleCitizenAccess = (m: Municipality) => {
    setSelectedCityId(m.id);
    setViewMode('CIDADAO');
    window.location.hash = `/${m.id}`;
  };

  const logout = () => {
    setViewMode('LOGIN');
    setUser(null);
    setSelectedCityId(null);
    window.location.hash = '';
    setIsSidebarOpen(false);
    setActiveTab('dashboard');
  };

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <DashboardGestor 
          feedbacks={feedbacks} 
          municipality={currentMunicipality} 
          onOpenMenu={() => setIsSidebarOpen(true)}
        />
      );
    }
    if (activeTab === 'relatorios') {
      return (
        <RelatoriosIA 
          feedbacks={feedbacks.filter(f => f.municipalityId === currentMunicipality.id)} 
          municipality={currentMunicipality} 
        />
      );
    }
    // Feed e outros podem ser implementados a seguir
    return <div className="p-10 font-bold text-slate-400">Em desenvolvimento...</div>;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-row overflow-hidden font-inter">
      
      {/* MODO GESTOR (SIDEBAR + MAIN) */}
      {viewMode === 'GESTOR' && user && (
        <>
          <Sidebar 
            user={user} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onLogout={logout} 
            onSwitchMunicipality={logout}
            municipalityName={currentMunicipality.name}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
          />
          
          <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative bg-slate-50">
            {notif && (
              <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-indigo-900 text-white px-8 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-10 font-black text-xs uppercase tracking-widest">
                {notif}
              </div>
            )}
            
            {renderContent()}
          </main>
        </>
      )}

      {/* MODO LOGIN / SELEÇÃO */}
      {viewMode === 'LOGIN' && (
        <div className="fixed inset-0 z-[100] bg-indigo-950 flex items-center justify-center p-6 overflow-y-auto">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
             <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
             <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]"></div>
          </div>
          
          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl max-w-xl w-full relative z-10 animate-in zoom-in-95 duration-500">
            <div className="text-center mb-10">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-600 rounded-[2rem] mx-auto flex items-center justify-center text-white text-2xl md:text-3xl font-black mb-6 shadow-xl shadow-indigo-200">PB</div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Fala, Paraíba!</h1>
              <p className="text-slate-500 font-bold mt-2 text-[10px] md:text-xs uppercase tracking-[0.2em]">Ouvidoria Digital e Transparência</p>
            </div>
            
            <input 
              type="text" 
              placeholder="Buscar Município..." 
              className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-semibold mb-8 shadow-inner"
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            
            <div className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
              {filteredMunicipalities.map(m => (
                <div key={m.id} className="group bg-slate-50 border border-slate-100 rounded-[2rem] p-4 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all flex flex-col gap-3">
                  <div className="flex items-center justify-between px-2">
                    <span className="font-black text-slate-900 text-lg">{m.name}</span>
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{m.region}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleCitizenAccess(m)} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100">Avaliar Gestão</button>
                    <button onClick={() => handleLoginMunicipality(m)} className="flex-1 py-4 bg-slate-900 text-slate-400 rounded-2xl hover:bg-black hover:text-white transition-all font-black text-[10px] uppercase tracking-widest">Gabinete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODO CIDADAO (FEEDBACK) */}
      {viewMode === 'CIDADAO' && (
        <PopularityPoll 
          municipality={currentMunicipality} 
          onClose={logout}
          onSuccess={(newFeedback) => {
            setFeedbacks(prev => [ { ...newFeedback, id: Date.now().toString(), status: 'PENDENTE' }, ...prev ]);
            setNotif("Obrigado pela participação!");
            setTimeout(() => setNotif(null), 3000);
            logout();
          }}
        />
      )}
    </div>
  );
};

export default App;
