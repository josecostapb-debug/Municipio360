
import React, { useState } from 'react';
import { Department, User } from '../types';

interface EnvioDadosProps {
  user: User;
  onSuccess: () => void;
}

const EnvioDados: React.FC<EnvioDadosProps> = ({ user, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const dept = user.department || Department.SAUDE;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-8 text-white">
          <h1 className="text-2xl font-bold">Coleta de Indicadores</h1>
          <p className="text-slate-400 mt-1">Secretaria de {dept}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
            <strong>Instrução:</strong> Preencha os dados acumulados da última semana. Os campos com * são obrigatórios.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Indicador Principal *</label>
              <input 
                type="number" 
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: 1240"
              />
              <p className="text-[10px] text-slate-500">Referente a: Atendimentos/Alunos/Obras</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Meta do Mês (%)</label>
              <input 
                type="number" 
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: 85"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Justificativa de Oscilação (se houver)</label>
            <textarea 
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
              placeholder="Descreva o motivo caso o dado esteja muito fora do histórico..."
            ></textarea>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="confirm" required className="w-4 h-4 text-blue-600" />
            <label htmlFor="confirm" className="text-xs text-slate-600">Declaro que os dados informados são verídicos e de responsabilidade desta secretaria.</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Processando...' : 'Enviar Dados para o Gabinete'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnvioDados;
