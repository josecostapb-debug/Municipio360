
import React, { useState, useMemo } from 'react';
import { User, UserRole, Metric, Alert, Department, Municipality } from './types';
import { INITIAL_ALERTS, MUNICIPALITIES, generateMetricsForMunicipality } from './constants';
import Sidebar from './components/Sidebar';
import DashboardGestor from './pages/DashboardGestor';
import EnvioDados from './pages/EnvioDados';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [notif, setNotif] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSwitching, setIsSwitching] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Busca de municípios para o seletor
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

  // GERAÇÃO DE MÉTRICAS DINÂMICAS
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

  const handleDataSuccess = () => {
    setNotif('Dados enviados com sucesso! Sincronizando dashboard...');
    setActiveTab('dashboard');
    setTimeout(() => setNotif(null), 5000);
  };

  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    setNotif(`Alerta marcado como resolvido.`);
    setTimeout(() => setNotif(null), 3000);
  };

  // TELA DE SELEÇÃO DE MUNICÍPIO (LOGIN OU TROCA)
  if (!user || isSwitching) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[140px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[140px]"></div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl max-w-xl w-full relative z-10 border border-white/20 animate-in zoom-in-95 duration-300">
          <div className="text-center mb-6 md:mb-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-2xl md:rounded-3xl mx-auto flex items-center justify-center text-white text-3xl md:text-4xl font-black mb-4 md:6 shadow-2xl shadow-blue-500/30">M</div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Município360</h1>
            <p className="text-sm md:text-base text-slate-500 font-medium mt-1 px-4">
              {isSwitching ? 'Escolha um novo município para análise' : 'Acesse o Painel Estratégico da Paraíba'}
            </p>
          </div>
          
          <div className="space-y-4 md:space-y-6">
            <div className="relative">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 md:mb-3 block text-center">Pesquise entre os 223 municípios</label>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="Ex: Patos, Sousa, Princesa Isabel..."
                  className="w-full pl-12 md:pl-14 pr-4 md:pr-6 py-4 md:py-5 bg-slate-50 border border-slate-200 rounded-[1.2rem] md:rounded-[1.5rem] focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-semibold text-base md:text-lg"
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="w-5 h-5 md:w-6 md:h-6 text-slate-400 absolute left-4 md:left-5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="max-h-[300px] md:max-h-[360px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {filteredMunicipalities.length > 0 ? (
                filteredMunicipalities.map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleLoginMunicipality(m)}
                    className="w-full p-4 md:p-5 border border-slate-100 bg-slate-50/50 rounded-[1rem] md:rounded-[1.2rem] hover:bg-blue-600 hover:border-blue-600 group transition-all flex items-center justify-between"
                  >
                    <div className="text-left overflow-hidden">
                      <p className="font-bold text-slate-800 text-base md:text-lg group-hover:text-white transition-colors truncate">{m.name}</p>
                      <div className="flex flex-wrap gap-2 md:gap-3 mt-1">
                        <span className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase group-hover:text-blue-100">Região: {m.region}</span>
                        <span className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase group-hover:text-blue-100">• Pop: {m.population.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shrink-0">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 font-bold border-2 border-dashed border-slate-100 rounded-[1.5rem] md:rounded-[2rem]">
                  Nenhuma cidade encontrada.
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 md:10 pt-6 border-t border-slate-100 flex justify-between items-center px-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado da Paraíba</span>
            {isSwitching && (
              <button 
                onClick={() => setIsSwitching(false)}
                className="text-[10px] font-black text-rose-500 uppercase hover:underline"
              >
                Cancelar Troca
              </button>
            )}
          </div>
        </div>
        
        <p className="mt-8 md:mt-10 text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-40 text-center">GovTech • Gestão Inteligente de 223 Municípios</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      {/* Sidebar Mobile Toggle Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }} 
        onLogout={handleLogout} 
        municipalityName={currentMunicipality.name}
        onSwitchMunicipality={() => setIsSwitching(true)}
        isOpen={isSidebarOpen}
      />
      
      <main className={`flex-1 transition-all duration-300 w-full lg:ml-64 min-h-screen pb-20`}>
        {/* Mobile Top Bar */}
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-20 flex justify-between items-center shadow-sm">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-[10px] font-black text-white">360</div>
            <span className="font-black text-slate-900 text-sm tracking-tight">Município360</span>
          </div>
          <div className="w-10"></div> {/* Spacer for symmetry */}
        </div>

        {notif && (
          <div className="fixed bottom-4 md:top-8 left-4 right-4 md:left-auto md:right-8 z-50 bg-slate-900 text-white px-6 md:px-8 py-4 md:py-5 rounded-[1.2rem] md:rounded-[1.5rem] shadow-2xl border border-white/10 flex items-center gap-4 md:gap-5 animate-in slide-in-from-bottom-10 md:slide-in-from-right-10 duration-500">
             <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping shrink-0"></div>
             <span className="text-xs md:text-sm font-black tracking-tight uppercase">{notif}</span>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DashboardGestor 
            metrics={currentMetrics} 
            alerts={filteredAlerts} 
            municipality={currentMunicipality}
          />
        )}
        
        {activeTab === 'envio' && <EnvioDados user={user} onSuccess={handleDataSuccess} />}
        
        {activeTab === 'alertas' && (
          <div className="p-6 md:p-10">
            <header className="mb-8 md:10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Central de Alertas</h1>
                <p className="text-slate-500 font-semibold mt-1">Prefeitura de {currentMunicipality.name} — Monitoramento Ativo</p>
              </div>
            </header>
            <div className="space-y-4 max-w-4xl">
              {filteredAlerts.length === 0 ? (
                <div className="bg-white p-12 md:p-20 rounded-[2rem] md:rounded-[3rem] border border-dashed border-slate-300 text-center">
                   <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-50 text-blue-500 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto mb-6 md:8">
                      <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                   </div>
                   <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Gestão Estável</h2>
                   <p className="text-slate-500 font-medium mt-2">Nenhuma anomalia detectada em {currentMunicipality.name} hoje.</p>
                </div>
              ) : (
                filteredAlerts.map(alert => (
                  <div key={alert.id} className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 flex flex-col md:flex-row gap-6 md:gap-8 items-start shadow-sm hover:shadow-xl transition-all border-l-[8px] md:border-l-[12px] border-l-blue-500">
                    <div className="flex-1 w-full">
                      <div className="flex justify-between mb-3 items-center">
                        <span className="text-[9px] md:text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-3 md:px-4 py-1 rounded-full">{alert.department}</span>
                        <span className="text-[10px] md:text-xs text-slate-400 font-black">{alert.date}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{alert.title}</h3>
                      <p className="text-slate-600 font-medium mt-2 md:mt-3 leading-relaxed text-base md:text-lg">{alert.description}</p>
                      <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4 w-full">
                        <button onClick={() => handleResolveAlert(alert.id)} className="flex-1 px-6 py-3.5 bg-slate-900 text-white text-xs font-black rounded-xl md:rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-[0.1em] shadow-xl shadow-slate-900/10">Marcar como Resolvido</button>
                        <button className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-700 text-xs font-black rounded-xl md:rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-[0.1em]">Relatório Completo</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
