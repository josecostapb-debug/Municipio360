
import React from 'react';
import { UserRole, User } from '../types';

interface SidebarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  municipalityName: string;
  onSwitchMunicipality?: () => void;
  isOpen?: boolean; // New prop for mobile control
}

const Sidebar: React.FC<SidebarProps> = ({ 
  user, activeTab, setActiveTab, onLogout, municipalityName, onSwitchMunicipality, isOpen 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel 360°', roles: [UserRole.PREFEITO, UserRole.ADMIN] },
    { id: 'secretaria', label: 'Minha Secretaria', roles: [UserRole.SECRETARIO, UserRole.SERVIDOR] },
    { id: 'envio', label: 'Coleta de Dados', roles: [UserRole.SECRETARIO, UserRole.SERVIDOR] },
    { id: 'alertas', label: 'Alertas', roles: [UserRole.PREFEITO, UserRole.SECRETARIO, UserRole.ADMIN] },
    { id: 'admin', label: 'Configurações', roles: [UserRole.ADMIN] },
  ];

  return (
    <div className={`
      w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-40 border-r border-white/5 
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-black flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-xs tracking-tighter shrink-0">360</div>
          Município360
        </h1>
        
        <div 
          onClick={onSwitchMunicipality}
          className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 cursor-pointer hover:bg-slate-800 transition-all group"
        >
          <div className="flex justify-between items-start mb-1">
            <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Cidade Atual</p>
            <svg className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <p className="text-sm font-bold text-slate-100 truncate">{municipalityName}</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 mt-2 overflow-y-auto custom-scrollbar">
        {menuItems.filter(item => item.roles.includes(user.role)).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 font-semibold text-sm ${
              activeTab === item.id 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${activeTab === item.id ? 'bg-white' : 'bg-transparent'}`}></div>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-black/10">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-sm font-bold border border-slate-600 shadow-inner shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate text-slate-100">{user.name}</p>
            <p className="text-[9px] text-blue-500 uppercase font-black tracking-widest opacity-80">{user.role}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full px-4 py-2 text-[10px] font-black text-rose-400 border border-rose-900/30 rounded-xl hover:bg-rose-900/20 transition-all uppercase tracking-widest"
        >
          Encerrar Sessão
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
