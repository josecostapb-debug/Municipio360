
import React from 'react';
import { Metric, Status } from '../types';

interface StatCardProps {
  metric: Metric;
}

const StatCard: React.FC<StatCardProps> = ({ metric }) => {
  const getStatus = (): Status => {
    const { value, thresholds } = metric;
    if (thresholds.higherIsBetter) {
      if (value < thresholds.critical) return 'VERMELHO';
      if (value < thresholds.warning) return 'AMARELO';
      return 'VERDE';
    } else {
      if (value > thresholds.critical) return 'VERMELHO';
      if (value > thresholds.warning) return 'AMARELO';
      return 'VERDE';
    }
  };

  const status = getStatus();
  const statusColors = {
    VERDE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    AMARELO: 'bg-amber-50 text-amber-700 border-amber-200',
    VERMELHO: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const statusDot = {
    VERDE: 'bg-emerald-500',
    AMARELO: 'bg-amber-500',
    VERMELHO: 'bg-rose-500',
  };

  const diff = metric.value - metric.previousValue;
  const isUp = diff > 0;

  return (
    <div className={`p-5 rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-tight">{metric.department}</span>
        <div className={`w-3 h-3 rounded-full ${statusDot[status]} animate-pulse`}></div>
      </div>
      
      <h3 className="text-sm font-medium text-slate-600 mb-1">{metric.name}</h3>
      
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900">
          {metric.unit === 'R$' ? `R$ ${(metric.value/1000000).toFixed(1)}M` : metric.value}
          <span className="text-sm font-normal text-slate-400 ml-1">{metric.unit !== 'R$' && metric.unit}</span>
        </span>
        <span className={`text-xs font-medium ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isUp ? '↑' : '↓'} {Math.abs(((diff / metric.previousValue) * 100)).toFixed(1)}%
        </span>
      </div>

      <div className={`mt-3 py-1 px-2 rounded text-[10px] font-bold inline-block border ${statusColors[status]}`}>
        {status === 'VERDE' && 'ESTÁVEL / DENTRO DA META'}
        {status === 'AMARELO' && 'ATENÇÃO REQUERIDA'}
        {status === 'VERMELHO' && 'RISCO CRÍTICO'}
      </div>
    </div>
  );
};

export default StatCard;
