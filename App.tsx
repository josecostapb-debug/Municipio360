
import React, { useState, useMemo } from 'react';
import { User, UserRole, Metric, Alert, Municipality, Vote } from './types';
import { INITIAL_ALERTS, MUNICIPALITIES, generateMetricsForMunicipality } from './constants';
import Sidebar from './components/Sidebar';
import DashboardGestor from './pages/DashboardGestor';
import EnvioDados from './pages/EnvioDados';
import PopularityPoll from './components/PopularityPoll';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [notif, setNotif] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSwitching, setIsSwitching] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPoll, setShowPoll] = useState(false);

  const filteredMunicipalities = useMemo(() => {
    if (!searchTerm) return MUNICIPALITIES;
    return MUNICIPALITIES.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const currentMunicipality = useMemo(() => 
    MUNICIPALITIES.find(m => m.id === user?.municipalityId) || MUNICIPALITIES[0], 
    [user]
  );

  const currentMetrics = useMemo(() => {
    if (!user) return [];
    return generateMetricsForMunicipality(currentMunicipality);
  }, [user, currentMunicipality]);

  const filteredAlerts = useMemo(() => 
    alerts.filter(a => a.municipalityId === user?.municipalityId),
    [alerts, user]
  );

  const handleLoginMunicipality = (m: Municipality) => {
    const newUser: User = {
      id: `user-${m.id}`,
      name: `Gestor Municipal`,
      role: UserRole.PREFEITO,
      municipalityId: m.id
    };
    setUser(newUser);
    setActiveTab('dashboard');
    setIsSwitching(false);
    setSearchTerm('');
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setSearchTerm('');
    setIsSwitching(false);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      {/* Botão Flutuante para Popularidade (Simulando acesso cidadão) */}
      {!isSwitching && user && (
        <button 
          onClick={() => setShowPoll(true)}
          className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-4 rounded-2xl shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 font-black text-xs uppercase tracking-widest"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Termômetro Popular
        </button>
      )}

      {showPoll && (
        <PopularityPoll 
          municipality={currentMunicipality} 
          onClose={() => setShowPoll(false)}
          onSuccess={(vote) => {
            setNotif("Voto processado com IA e geolocalização!");
            setTimeout(() => setNotif(null), 3000);
            setShowPoll(false);
          }}
        />
      )}

      {(!user || isSwitching) ? (
        <div className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
          {/* Background visuals */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[140px]"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[140px]"></div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] shadow-2xl max-w-xl w-full relative z-10 animate-in zoom-in-95 duration-300">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center text-white text-4xl font-black mb-6 shadow-2xl shadow-blue-500/30">M</div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Município360</h1>
              <p className="text-slate-500 font-medium mt-1">
                {isSwitching ? 'Escolha um novo município' : 'Cockpit de Gestão da Paraíba'}
              </p>
            </div>
            
            <input 
              type="text" 
              placeholder="Pesquise sua cidade..."
              className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-semibold mb-6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="max-h-[360px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {filteredMunicipalities.map(m => (
                <button
                  key={m.id}
                  onClick={() => handleLoginMunicipality(m)}
                  className="w-full p-5 bg-slate-50/50 border border-slate-100 rounded-[1.2rem] hover:bg-blue-600 hover:text-white group transition-all flex items-center justify-between"
                >
                  <div className="text-left">
                    <p className="font-bold text-lg">{m.name}</p>
                    <p className="text-[10px] uppercase font-black opacity-50">{m.region} • {m.population.toLocaleString()} hab</p>
                  </div>
                  <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <Sidebar 
            user={user} 
            activeTab={activeTab} 
            setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} 
            onLogout={handleLogout} 
            municipalityName={currentMunicipality.name}
            onSwitchMunicipality={() => setIsSwitching(true)}
            isOpen={isSidebarOpen}
          />
          <main className="flex-1 lg:ml-64 min-h-screen pb-20">
            {/* Mobile Header */}
            <div className="lg:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-20 flex justify-between items-center shadow-sm">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
              <span className="font-black text-slate-900 text-sm tracking-tight">Município360</span>
              <div className="w-10"></div>
            </div>

            {notif && (
              <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-10">
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                 <span className="text-xs font-black uppercase tracking-widest">{notif}</span>
              </div>
            )}

            {activeTab === 'dashboard' && <DashboardGestor metrics={currentMetrics} alerts={filteredAlerts} municipality={currentMunicipality} />}
            {activeTab === 'envio' && <EnvioDados user={user} onSuccess={() => { setNotif("Dados Sincronizados"); setActiveTab('dashboard'); setTimeout(() => setNotif(null), 3000); }} />}
            {activeTab === 'alertas' && <div className="p-8"><h1 className="text-3xl font-black mb-8 uppercase tracking-tighter">Central de Crises</h1>{filteredAlerts.map(a => <div key={a.id} className="bg-white p-6 rounded-3xl border mb-4 shadow-sm border-l-8 border-l-blue-500"><h3 className="font-bold">{a.title}</h3><p className="text-sm text-slate-500">{a.description}</p></div>)}</div>}
          </main>
        </>
      )}
    </div>
  );
};

export default App;
