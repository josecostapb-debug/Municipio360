
import React from 'react';
import { Metric, Alert, Municipality, Department, HospitalUnit, HealthNetworkNode } from '../types';
import StatCard from '../components/StatCard';
import AIAdvisor from '../components/AIAdvisor';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

interface DashboardGestorProps {
  metrics: Metric[];
  alerts: Alert[];
  municipality: Municipality;
}

const DashboardGestor: React.FC<DashboardGestorProps> = ({ metrics, alerts, municipality }) => {
  const COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  const lrfMetric = metrics.find(m => m.id.startsWith('lrf-percent'))!;
  const approvalMetric = metrics.find(m => m.id.startsWith('popularity'))!;
  
  const safetyMetrics = metrics.filter(m => m.department === Department.SEGURANCA);
  const transitMetrics = metrics.filter(m => m.department === Department.TRANSITO);
  const healthDetailMetric = metrics.find(m => m.id.startsWith('h-units'))!;
  const healthNetworkMetric = metrics.find(m => m.id.startsWith('h-network'))!;
  
  const coreOpsMetrics = metrics.filter(m => 
    (m.department === Department.EDUCACAO || m.department === Department.INFRAESTRUTURA)
  );

  const getLRFColor = (val: number) => {
    if (val <= 48.6) return '#10b981';
    if (val <= 51.3) return '#f59e0b';
    return '#ef4444';
  };

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
            Gestão Estratégica • {municipality.name} - PB
          </p>
        </div>
        <div className="text-left md:text-right w-full md:w-auto">
           <div className="px-3 py-1 bg-slate-900 text-blue-400 rounded-full text-[9px] md:text-[10px] font-black uppercase mb-1 inline-block border border-blue-900/50">Radar Ativo</div>
           <p className="text-[10px] md:text-xs text-slate-400 font-mono block">REF: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </header>

      <AIAdvisor metrics={metrics} municipality={municipality} />

      {/* --- INSTRUMENTOS DE VOO (FISCAL E POLÍTICO) --- */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative border border-white/5">
           <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Limite LRF (Gasto Pessoal)</h3>
           <div className="relative flex justify-center py-4">
              <svg className="w-48 h-32" viewBox="0 0 100 60">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={getLRFColor(lrfMetric.value)} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(lrfMetric.value / 60) * 126} 126`} className="transition-all duration-1000" />
              </svg>
              <div className="absolute bottom-6 text-center">
                 <p className="text-4xl font-black">{lrfMetric.value}%</p>
                 <p className="text-[10px] font-bold text-slate-500 uppercase">TCE-PB STATUS</p>
              </div>
           </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 flex flex-col">
           <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8">Termômetro Político</h3>
           <div className="flex flex-1 items-end gap-10 px-4">
              <div className="w-10 h-full bg-slate-100 rounded-full relative overflow-hidden border border-slate-200 flex flex-col justify-end">
                 <div style={{ height: `${approvalMetric.value}%`, backgroundColor: getApprovalColor(approvalMetric.value) }} className="w-full transition-all duration-1000 rounded-t-full"></div>
              </div>
              <div className="flex-1 pb-4">
                 <p className="text-6xl font-black text-slate-900 tracking-tighter">{approvalMetric.value}%</p>
                 <p className="text-sm font-bold text-slate-400 mt-1 uppercase">Aprovação</p>
              </div>
           </div>
        </div>

        <div className="bg-slate-100 rounded-[2.5rem] p-8 border border-slate-200 flex flex-col justify-center">
           <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 text-center">Rede por Bairro (Atenção Básica)</h3>
           <div className="space-y-3">
              {(healthNetworkMetric.details as HealthNetworkNode[]).slice(0, 4).map((node, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700">{node.neighborhood}</span>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[9px] font-black rounded-lg">UBS: {node.ubs}</span>
                    {node.upa > 0 && <span className="px-2 py-1 bg-rose-100 text-rose-700 text-[9px] font-black rounded-lg">UPA: {node.upa}</span>}
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* --- SAÚDE DETALHADA: OCUPAÇÃO POR UNIDADE --- */}
      <h2 className="text-lg md:text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
        <div className="w-2 h-6 bg-blue-600 rounded-full shrink-0"></div>
        Vigilância Hospitalar (Leitos Municipais)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {(healthDetailMetric.details as HospitalUnit[]).map((unit, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-4 right-4">
               <div className={`w-2 h-2 rounded-full ${unit.occupancy > 85 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{unit.name}</p>
            <p className="text-3xl font-black text-slate-900">{unit.occupancy}%</p>
            <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
               <div style={{ width: `${unit.occupancy}%` }} className={`h-full transition-all duration-1000 ${unit.occupancy > 85 ? 'bg-rose-500' : 'bg-blue-600'}`}></div>
            </div>
            <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase">Total: {unit.totalBeds} leitos ativos</p>
          </div>
        ))}
      </div>

      {/* --- SEGURANÇA PÚBLICA E VIÁRIA --- */}
      <h2 className="text-lg md:text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
        <div className="w-2 h-6 bg-rose-600 rounded-full shrink-0"></div>
        Segurança Pública e Ordem Social
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
        {safetyMetrics.map(m => <StatCard key={m.id} metric={m} />)}
      </div>

      <h2 className="text-lg md:text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
        <div className="w-2 h-6 bg-amber-600 rounded-full shrink-0"></div>
        Segurança Viária e Mobilidade
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
        {transitMetrics.map(m => <StatCard key={m.id} metric={m} />)}
      </div>

      {/* --- OUTROS INDICADORES --- */}
      <h2 className="text-lg md:text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
        <div className="w-2 h-6 bg-indigo-600 rounded-full shrink-0"></div>
        Educação e Infraestrutura
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
        {coreOpsMetrics.map(m => <StatCard key={m.id} metric={m} />)}
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Eficiência Operacional</h3>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={safetyMetrics.concat(transitMetrics).slice(0, 6)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 8, fontWeight: 'bold'}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="value" fill="#334155" radius={[10, 10, 0, 0]} barSize={35} />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">Prioridades de Comando</h3>
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
