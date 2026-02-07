
import React from 'react';
import { UserRole, User } from '../types';

interface SidebarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  municipalityName: string;
  onSwitchMunicipality?: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  user, activeTab, setActiveTab, onLogout, municipalityName, onSwitchMunicipality, isOpen, setIsOpen 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel do Prefeito', roles: [UserRole.PREFEITO, UserRole.ADMIN] },
    { id: 'feed', label: 'Feed da Voz Pública', roles: [UserRole.PREFEITO, UserRole.ADMIN, UserRole.SECRETARIO] },
    { id: 'relatorios', label: 'Relatórios IA', roles: [UserRole.PREFEITO, UserRole.ADMIN] },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  return (
    <>
      {/* Backdrop para Mobile - Apenas visível quando o menu está aberto no celular */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-white flex flex-col shrink-0 border-r border-white/5 
        transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header da Sidebar */}
        <div className="p-8 border-b border-slate-800 shrink-0 relative">
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden absolute top-8 right-6 p-2 text-slate-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h1 className="text-xl font-black flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-xs font-black tracking-tighter shrink-0">PB</div>
            Voz Gestora
          </h1>
          
          <div className="bg-slate-800/30 p-4 rounded-[1.5rem] border border-slate-700/50">
            <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mb-1">Município</p>
            <p className="text-sm font-bold text-slate-100 truncate">{municipalityName}</p>
          </div>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 p-6 space-y-2 mt-2 overflow-y-auto custom-scrollbar">
          {menuItems.filter(item => item.roles.includes(user.role)).map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full text-left px-5 py-4 rounded-2xl transition-all flex items-center gap-4 font-bold text-sm ${
                activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${activeTab === item.id ? 'bg-white' : 'bg-slate-700'}`}></div>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Rodapé com botão Sair (sempre visível no menu) */}
        <div className="p-6 border-t border-slate-800 bg-black/10 shrink-0">
          <div className="flex items-center gap-3 mb-6 bg-slate-800/20 p-3 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-sm font-black border border-indigo-400/30 shadow-inner shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black truncate text-slate-100 tracking-tight">{user.name}</p>
              <p className="text-[9px] text-indigo-400 uppercase font-black tracking-widest opacity-80">{user.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={onLogout}
              className="w-full px-5 py-4 text-[10px] font-black text-rose-400 border border-rose-900/30 rounded-2xl hover:bg-rose-900/20 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sair do Sistema
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
