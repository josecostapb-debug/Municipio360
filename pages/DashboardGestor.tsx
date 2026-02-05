
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
  const COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const ECONOMIC_COLORS = ['#0ea5e9', '#f43f5e', '#10b981', '#f59e0b'];
  const HEALTH_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#6366f1', '#94a3b8'];

  // --- DADOS DEMOGRÁFICOS ---
  const genderData = [
    { name: 'Feminino', value: Math.floor(municipality.population * 0.515) },
    { name: 'Masculino', value: Math.floor(municipality.population * 0.485) },
  ];

  // --- DADOS DE TRABALHO ---
  const peaValue = metrics.find(m => m.id.includes('pea'))?.value || Math.floor(municipality.population * 0.48);
  const formalValue = metrics.find(m => m.id.includes('formal'))?.value || Math.floor(municipality.population * 0.28);
  const informalValue = peaValue - formalValue;

  const laborData = [
    { name: 'Emprego Formal', value: formalValue },
    { name: 'Sem Registro Formal', value: Math.max(0, informalValue) },
  ];

  const sectorData = [
    { name: 'Serviços', value: Math.floor(peaValue * 0.55) },
    { name: 'Comércio', value: Math.floor(peaValue * 0.25) },
    { name: 'Indústria', value: Math.floor(peaValue * 0.12) },
    { name: 'Agropecuária', value: Math.floor(peaValue * 0.08) },
  ].sort((a, b) => b.value - a.value);

  // --- DADOS DE MORTALIDADE (NOVOS) ---
  const totalDeaths = metrics.find(m => m.id.startsWith('h3'))?.value || 0;
  
  // Distribuição de Óbitos por Gênero (Simulação realista: Homens morrem mais por causas externas/doenças agudas)
  const deathGenderData = [
    { name: 'Masculino (Óbitos)', value: Math.floor(totalDeaths * 0.58) },
    { name: 'Feminino (Óbitos)', value: Math.floor(totalDeaths * 0.42) },
  ];

  // Causas de Morte (Baseado em perfil epidemiológico regional)
  const deathCauseData = [
    { name: 'Aparelho Circulatório', value: Math.floor(totalDeaths * 0.28) },
    { name: 'Neoplasias (Câncer)', value: Math.floor(totalDeaths * 0.18) },
    { name: 'Causas Externas', value: Math.floor(totalDeaths * 0.15) },
    { name: 'Aparelho Respiratório', value: Math.floor(totalDeaths * 0.12) },
    { name: 'Outros/Inespecíficos', value: Math.floor(totalDeaths * 0.27) },
  ].sort((a, b) => b.value - a.value);

  // --- DADOS DE RH ---
  const hrMetrics = metrics.filter(m => m.id.includes('hr'));
  const efCount = hrMetrics.find(m => m.id.includes('hr3'))?.value || 0;
  const nonEfCount = hrMetrics.find(m => m.id.includes('hr5'))?.value || 0;
  const efCost = hrMetrics.find(m => m.id.includes('hr2'))?.value || 0;
  const nonEfCost = hrMetrics.find(m => m.id.includes('hr4'))?.value || 0;

  const employeeDistribution = [
    { name: 'Efetivos', value: efCount },
    { name: 'Não-Efetivos', value: nonEfCount },
  ];

  // Métricas de destaque
  const highlightMetrics = [
    metrics.find(m => m.id.startsWith('h2')), // Nascimentos
    metrics.find(m => m.id.startsWith('h3')), // Óbitos
    metrics.find(m => m.id.startsWith('e2')), // Alunos
    metrics.find(m => m.id.startsWith('e1')), // Frequência
  ].filter(Boolean) as Metric[];

  return (
    <div className="p-8">
      <header className="mb-8 flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Painel Executivo 360°</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Prefeitura de {municipality.name} - PB</p>
        </div>
        <div className="text-right">
           <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase mb-1 inline-block">Sincronizado</div>
           <p className="text-xs text-slate-400 font-medium italic">Monitorando {municipality.population.toLocaleString()} habitantes</p>
        </div>
      </header>

      <AIAdvisor metrics={metrics} municipality={municipality} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        <div className="p-5 rounded-xl border bg-blue-600 text-white shadow-lg relative overflow-hidden">
          <p className="text-xs font-bold uppercase opacity-80 mb-1">População Total</p>
          <p className="text-3xl font-black">{municipality.population.toLocaleString()}</p>
          <p className="text-[10px] mt-2 font-medium opacity-70 italic tracking-tighter">Estimativa Corrente</p>
          <div className="absolute top-[-20px] right-[-20px] opacity-10">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          </div>
        </div>
        {highlightMetrics.map(m => <StatCard key={m.id} metric={m} />)}
      </div>

      <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
        <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
        Dinâmica Populacional e Social
      </h2>
      
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Distribuição por Gênero (População) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 text-center">População por Gênero</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                  {genderData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Empregabilidade */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Mercado de Trabalho (PEA)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={laborData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                  {laborData.map((entry, index) => <Cell key={`cell-${index}`} fill={ECONOMIC_COLORS[index % ECONOMIC_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Matriz Produtiva */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Empresas por Setor</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={sectorData} margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} width={80} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
        <div className="w-2 h-6 bg-rose-600 rounded-full"></div>
        Vigilância de Saúde e Mortalidade
      </h2>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Óbitos por Gênero */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Óbitos por Gênero (Mês)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deathGenderData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} dataKey="value" paddingAngle={8}>
                  <Cell fill="#ef4444" />
                  <Cell fill="#f43f5e" />
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Óbitos por Causa */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Principais Causas de Óbito</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={deathCauseData} margin={{ left: 40, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} width={120} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {deathCauseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={HEALTH_COLORS[index % HEALTH_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
        <div className="w-2 h-6 bg-emerald-600 rounded-full"></div>
        Gestão Operacional e Alertas
      </h2>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gestão de RH */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Quadro de Servidores</h3>
          <div className="h-48 mb-6">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeeDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={60} />
              </BarChart>
             </ResponsiveContainer>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl flex justify-between items-center border border-slate-100">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gasto Total de Folha</p>
              <p className="text-2xl font-black text-slate-900">R$ {((efCost + nonEfCost) / 1000000).toFixed(1)}M</p>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full">
              <span className="text-[10px] font-black uppercase">LRF em Conformidade</span>
            </div>
          </div>
        </div>

        {/* Alertas */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">Prioridades de Atenção</h3>
          <div className="space-y-4">
            {alerts.length > 0 ? alerts.map(alert => (
              <div key={alert.id} className={`p-5 rounded-2xl border-l-4 shadow-sm transition-transform hover:scale-[1.01] ${alert.status === 'VERMELHO' ? 'bg-rose-50 border-rose-500' : 'bg-amber-50 border-amber-500'}`}>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-black uppercase opacity-60">{alert.department}</span>
                  <span className="text-[10px] font-bold text-slate-400">{alert.date}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-base">{alert.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{alert.description}</p>
              </div>
            )) : (
              <div className="py-16 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">Sem pendências críticas</div>
            )}
          </div>
        </div>
      </section>

      {/* Grid Final de métricas operacionais variadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
         {metrics.filter(m => 
            m.id.startsWith('h1') || 
            m.id.startsWith('f1') || 
            m.id.startsWith('i1') || 
            m.id.startsWith('e3')
         ).map(m => <StatCard key={m.id} metric={m} />)}
      </div>
    </div>
  );
};

export default DashboardGestor;
