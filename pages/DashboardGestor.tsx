
import React from 'react';
import { Metric, Alert, Municipality } from '../types';
import StatCard from '../components/StatCard';
import AIAdvisor from '../components/AIAdvisor';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';

interface DashboardGestorProps {
  metrics: Metric[];
  alerts: Alert[];
  municipality: Municipality;
}

const DashboardGestor: React.FC<DashboardGestorProps> = ({ metrics, alerts, municipality }) => {
  // Cores do Cockpit
  const COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  // Métricas Fiscais específicas
  const lrfMetric = metrics.find(m => m.id.startsWith('lrf-percent'))!;
  const rclMetric = metrics.find(m => m.id.startsWith('rcl'))!;
  const gastoRealMetric = metrics.find(m => m.id.startsWith('gasto-pessoal-rs'))!;
  const approvalMetric = metrics.find(m => m.id.startsWith('popularity'))!;

  // Lógica de Cor LRF (TCE-PB)
  const getLRFColor = (val: number) => {
    if (val <= 48.6) return '#10b981'; // Verde
    if (val <= 51.3) return '#f59e0b'; // Amarelo
    return '#ef4444'; // Vermelho
  };

  // Lógica de Aprovação
  const getApprovalColor = (val: number) => {
    if (val >= 60) return '#10b981';
    if (val >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            COCKPIT EXECUTIVO 360°
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] md:text-xs tracking-widest mt-1">
            Centro de Comando Governamental • {municipality.name} - PB
          </p>
        </div>
        <div className="text-left md:text-right w-full md:w-auto">
           <div className="px-3 py-1 bg-slate-900 text-blue-400 rounded-full text-[9px] md:text-[10px] font-black uppercase mb-1 inline-block border border-blue-900/50">Sistemas Ativos</div>
           <p className="text-[10px] md:text-xs text-slate-400 font-mono block">REF: {new Date().toLocaleDateString('pt-BR')} | LAT: -7.12 | LNG: -34.84</p>
        </div>
      </header>

      <AIAdvisor metrics={metrics} municipality={municipality} />

      {/* --- MÓDULO INSTRUMENTOS FISCAIS & POLÍTICOS --- */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        
        {/* VELOCÍMETRO LRF (GAUGE) */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden border border-white/5">
           <div className="flex justify-between items-start mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Limite LRF (Gasto Pessoal)</h3>
              <span className="font-mono text-[10px] text-blue-500">TCE-PB STANDARD</span>
           </div>

           <div className="relative flex justify-center py-4">
              {/* Custom SVG Gauge */}
              <svg className="w-48 h-32" viewBox="0 0 100 60">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
                <path 
                  d="M 10 50 A 40 40 0 0 1 90 50" 
                  fill="none" 
                  stroke={getLRFColor(lrfMetric.value)} 
                  strokeWidth="12" 
                  strokeLinecap="round" 
                  strokeDasharray={`${(lrfMetric.value / 60) * 126} 126`} 
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute bottom-6 text-center">
                 <p className="text-4xl font-black">{lrfMetric.value}%</p>
                 <p className="text-[10px] font-bold text-slate-500 uppercase">Percentual Atual</p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/5">
              <div>
                 <p className="text-[10px] text-slate-500 font-bold uppercase">RCL Projetada</p>
                 <p className="font-mono text-sm">R$ {(rclMetric.value / 1000000).toFixed(1)}M</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] text-slate-500 font-bold uppercase">Gasto Pessoal</p>
                 <p className="font-mono text-sm text-blue-400">R$ {(gastoRealMetric.value / 1000000).toFixed(1)}M</p>
              </div>
           </div>
           
           <div className="mt-4 flex gap-2">
              <div className="h-1 flex-1 bg-emerald-500/20 rounded-full"><div className="h-full bg-emerald-500 rounded-full w-full"></div></div>
              <div className="h-1 flex-1 bg-amber-500/20 rounded-full"><div className={`h-full bg-amber-500 rounded-full ${lrfMetric.value > 48.6 ? 'w-full' : 'w-0'}`}></div></div>
              <div className="h-1 flex-1 bg-rose-500/20 rounded-full"><div className={`h-full bg-rose-500 rounded-full ${lrfMetric.value > 51.3 ? 'w-full' : 'w-0'}`}></div></div>
           </div>
        </div>

        {/* TERMÔMETRO DE POPULARIDADE */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 flex flex-col">
           <div className="flex justify-between items-start mb-8">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Termômetro Político</h3>
              <div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg">LIVE</div>
           </div>

           <div className="flex flex-1 items-end gap-10 px-4">
              {/* Thermometer Visual */}
              <div className="w-10 h-full bg-slate-100 rounded-full relative overflow-hidden border border-slate-200 flex flex-col justify-end">
                 <div 
                    style={{ height: `${approvalMetric.value}%`, backgroundColor: getApprovalColor(approvalMetric.value) }} 
                    className="w-full transition-all duration-1000 rounded-t-full shadow-[0_0_20px_rgba(0,0,0,0.1)]"
                 ></div>
                 <div className="absolute inset-x-0 bottom-0 h-10 w-full rounded-full border-t border-white/20" style={{ backgroundColor: getApprovalColor(approvalMetric.value) }}></div>
              </div>

              <div className="flex-1 pb-4">
                 <p className="text-6xl font-black text-slate-900 tracking-tighter">{approvalMetric.value}%</p>
                 <p className="text-sm font-bold text-slate-400 mt-1 uppercase">Aprovação Popular</p>
                 
                 <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                       <p className="text-[10px] font-bold text-slate-600">Positivo: 64%</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                       <p className="text-[10px] font-bold text-slate-600">Neutro: 21%</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                       <p className="text-[10px] font-bold text-slate-600">Negativo: 15%</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* MAPA DE CALOR DE SATISFAÇÃO (SIMULADO) */}
        <div className="bg-slate-100 rounded-[2.5rem] p-8 border border-slate-200 relative overflow-hidden group">
           <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Mapeamento de Bairros</h3>
           <div className="w-full h-48 bg-slate-200 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center relative">
              <svg className="w-full h-full text-slate-300 opacity-50" fill="currentColor" viewBox="0 0 200 100">
                <path d="M20,20 Q40,10 60,30 T100,20 T140,40 T180,20" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              {/* Simulating hotspots */}
              <div className="absolute top-10 left-10 w-8 h-8 bg-emerald-400/30 rounded-full animate-pulse blur-md"></div>
              <div className="absolute bottom-10 right-20 w-12 h-12 bg-rose-400/30 rounded-full animate-pulse blur-md"></div>
              <div className="absolute top-20 right-40 w-6 h-6 bg-amber-400/30 rounded-full animate-pulse blur-md"></div>
              
              <p className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100/40 backdrop-blur-[2px]">Mapeamento Geo-Político Ativo</p>
           </div>
           <div className="mt-6 space-y-2">
              <div className="flex justify-between text-[10px] font-bold">
                 <span className="text-slate-500">MAIOR APROVAÇÃO:</span>
                 <span className="text-emerald-600 uppercase">Centro Histórico</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold">
                 <span className="text-slate-500">MAIOR CRÍTICA:</span>
                 <span className="text-rose-600 uppercase">Zona Sul (Saneamento)</span>
              </div>
           </div>
        </div>
      </section>

      {/* --- MÓDULOS OPERACIONAIS (ESTILO ANTERIOR PRESERVADO) --- */}
      <h2 className="text-lg md:text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
        <div className="w-2 h-6 bg-indigo-600 rounded-full shrink-0"></div>
        Indicadores Operacionais de Base
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
        {metrics.filter(m => !m.id.includes('lrf') && !m.id.includes('rcl') && !m.id.includes('gasto') && !m.id.includes('popularity')).slice(0, 4).map(m => (
          <StatCard key={m.id} metric={m} />
        ))}
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GRÁFICO OPERACIONAL (EX: SAÚDE/EDUC) */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Eficiência de Serviços</h3>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.filter(m => m.department === 'Saúde' || m.department === 'Educação').slice(0, 4)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="value" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* ALERTAS CRÍTICOS */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            Prioridades do Dia
          </h3>
          <div className="space-y-4">
            {alerts.length > 0 ? alerts.map(alert => (
              <div key={alert.id} className={`p-5 rounded-2xl border-l-4 shadow-sm transition-transform hover:scale-[1.01] ${alert.status === 'VERMELHO' ? 'bg-rose-50 border-rose-500' : 'bg-amber-50 border-amber-500'}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[9px] font-black uppercase opacity-60">{alert.department}</span>
                  <span className="text-[9px] font-bold text-slate-400">{alert.date}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm md:text-base">{alert.title}</h4>
                <p className="text-[10px] md:text-xs text-slate-600 mt-1 leading-relaxed">{alert.description}</p>
              </div>
            )) : (
              <div className="py-16 text-center text-slate-400 font-bold uppercase text-[9px] md:text-[10px] tracking-widest">Sem alertas críticos</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardGestor;
