
import { Metric, Department, Alert, Municipality, HospitalUnit, HealthNetworkNode } from './types';

export const MUNICIPALITIES: Municipality[] = [
  { id: 'joao-pessoa', name: 'João Pessoa', region: 'Litoral', population: 833932 },
  { id: 'campina-grande', name: 'Campina Grande', region: 'Agreste', population: 411807 },
  { id: 'santa-rita', name: 'Santa Rita', region: 'Litoral', population: 149910 },
  { id: 'patos', name: 'Patos', region: 'Sertão', population: 108733 },
  { id: 'bayeux', name: 'Bayeux', region: 'Litoral', population: 97203 },
  { id: 'sousa', name: 'Sousa', region: 'Sertão', population: 67259 },
  { id: 'cabedelo', name: 'Cabedelo', region: 'Litoral', population: 66519 },
  { id: 'cajazeiras', name: 'Cajazeiras', region: 'Sertão', population: 63239 },
  { id: 'guarabira', name: 'Guarabira', region: 'Brejo', population: 60110 },
  { id: 'sape', name: 'Sapé', region: 'Zona da Mata', population: 52697 },
  { id: 'queimadas', name: 'Queimadas', region: 'Agreste', population: 44634 },
  { id: 'mamanguape', name: 'Mamanguape', region: 'Litoral Nordeste', population: 44583 },
  { id: 'pombal', name: 'Pombal', region: 'Sertão', population: 32443 },
  { id: 'monteiro', name: 'Monteiro', region: 'Cariri', population: 32277 },
  { id: 'esperanca', name: 'Esperança', region: 'Agreste', population: 31215 },
  { id: 'catole-do-rocha', name: 'Catolé do Rocha', region: 'Sertão', population: 30661 },
  { id: 'zabele', name: 'Zabelê', region: 'Cariri', population: 2234 }
];

export const generateMetricsForMunicipality = (m: Municipality): Metric[] => {
  const popFactor = m.population / 411807; 
  const randomVar = (base: number, range: number) => base + (Math.random() * range - range / 2);
  
  const rcl = Math.floor(randomVar(120000000, 20000000) * popFactor);
  const arrecadacaoTotal = rcl * 1.15; // Arrecadação geralmente maior que RCL
  const despesaTotal = arrecadacaoTotal * randomVar(0.92, 0.05);
  
  const gastoPessoalPercent = randomVar(49.5, 5); 
  const gastoPessoalTotal = (rcl * gastoPessoalPercent) / 100;
  
  // Divisão da folha (TCE-PB)
  const percentEfetivos = randomVar(75, 10);
  const gastoEfetivos = (gastoPessoalTotal * percentEfetivos) / 100;
  const gastoContratados = gastoPessoalTotal - gastoEfetivos;

  const popularity = Math.floor(randomVar(65, 15));

  const hospitalNames = ['Hosp. Municipal Dr. Severino', 'Maternidade Municipal', 'UPA Central', 'Hosp. de Trauma (Regional)'];
  const unitsCount = m.population > 200000 ? 4 : m.population > 50000 ? 2 : 1;
  const hospitalUnits: HospitalUnit[] = Array.from({ length: unitsCount }).map((_, i) => ({
    name: hospitalNames[i % hospitalNames.length],
    occupancy: Math.floor(randomVar(78, 20)),
    totalBeds: Math.floor(40 * (popFactor + 1))
  }));

  const neighborhoods = ['Centro', 'Bairro das Nações', 'Zona Sul', 'Distrito Industrial', 'Alto do Sertão'];
  const healthNetwork: HealthNetworkNode[] = neighborhoods.map(n => ({
    neighborhood: n,
    ubs: Math.max(1, Math.floor(randomVar(4, 3) * (popFactor + 0.5))),
    upa: Math.random() > 0.7 ? 1 : 0
  }));

  return [
    // --- COCKPIT FISCAL & POLÍTICO ---
    { id: `lrf-percent-${m.id}`, municipalityId: m.id, name: 'Gasto com Pessoal (LRF)', value: Number(gastoPessoalPercent.toFixed(2)), unit: '%', previousValue: 47.2, department: Department.FINANCAS, thresholds: { warning: 48.6, critical: 51.3, higherIsBetter: false } },
    { id: `arrecadacao-${m.id}`, municipalityId: m.id, name: 'Arrecadação Total', value: arrecadacaoTotal, unit: 'R$', previousValue: arrecadacaoTotal * 0.98, department: Department.FINANCAS, thresholds: { warning: 0, critical: 0, higherIsBetter: true } },
    { id: `despesa-${m.id}`, municipalityId: m.id, name: 'Despesa Total', value: despesaTotal, unit: 'R$', previousValue: despesaTotal * 0.97, department: Department.FINANCAS, thresholds: { warning: 0, critical: 0, higherIsBetter: false } },
    { id: `gasto-efetivo-${m.id}`, municipalityId: m.id, name: 'Pessoal Efetivo', value: gastoEfetivos, unit: 'R$', previousValue: gastoEfetivos * 0.99, department: Department.FINANCAS, thresholds: { warning: 0, critical: 0, higherIsBetter: false } },
    { id: `gasto-contratado-${m.id}`, municipalityId: m.id, name: 'Pessoal Contratado', value: gastoContratados, unit: 'R$', previousValue: gastoContratados * 1.05, department: Department.FINANCAS, thresholds: { warning: 0, critical: 0, higherIsBetter: false } },
    { id: `popularity-${m.id}`, municipalityId: m.id, name: 'Aprovação da Gestão', value: popularity, unit: '%', previousValue: 62, department: Department.POLITICO, thresholds: { warning: 50, critical: 40, higherIsBetter: true } },

    // --- SEGURANÇA PÚBLICA ---
    { id: `s-hom-${m.id}`, municipalityId: m.id, name: 'Homicídios', value: Math.max(0, Math.floor(randomVar(5, 4) * popFactor)), unit: 'ocorr.', previousValue: 4 * popFactor, department: Department.SEGURANCA, thresholds: { warning: 6 * popFactor, critical: 10 * popFactor, higherIsBetter: false } },
    { id: `s-fem-${m.id}`, municipalityId: m.id, name: 'Feminicídios', value: Math.max(0, Math.floor(randomVar(1, 0.5) * popFactor)), unit: 'ocorr.', previousValue: 0, department: Department.SEGURANCA, thresholds: { warning: 1, critical: 2, higherIsBetter: false } },
    { id: `s-lat-${m.id}`, municipalityId: m.id, name: 'Latrocínio', value: Math.max(0, Math.floor(randomVar(1, 0.5) * popFactor)), unit: 'ocorr.', previousValue: 0.2 * popFactor, department: Department.SEGURANCA, thresholds: { warning: 1, critical: 2, higherIsBetter: false } },
    { id: `s-ass-${m.id}`, municipalityId: m.id, name: 'Assaltos', value: Math.floor(randomVar(120, 40) * popFactor), unit: 'ocorr.', previousValue: 110 * popFactor, department: Department.SEGURANCA, thresholds: { warning: 150 * popFactor, critical: 200 * popFactor, higherIsBetter: false } },
    { id: `s-fur-${m.id}`, municipalityId: m.id, name: 'Furtos', value: Math.floor(randomVar(250, 80) * popFactor), unit: 'ocorr.', previousValue: 240 * popFactor, department: Department.SEGURANCA, thresholds: { warning: 300 * popFactor, critical: 400 * popFactor, higherIsBetter: false } },

    // --- SEGURANÇA VIÁRIA ---
    { id: `t-acc-${m.id}`, municipalityId: m.id, name: 'Acid. Graves (Carro)', value: Math.floor(randomVar(15, 8) * popFactor), unit: 'ocorr.', previousValue: 12 * popFactor, department: Department.TRANSITO, thresholds: { warning: 20 * popFactor, critical: 30 * popFactor, higherIsBetter: false } },
    { id: `t-mot-${m.id}`, municipalityId: m.id, name: 'Acid. Motocicletas', value: Math.floor(randomVar(45, 15) * popFactor), unit: 'ocorr.', previousValue: 40 * popFactor, department: Department.TRANSITO, thresholds: { warning: 50 * popFactor, critical: 70 * popFactor, higherIsBetter: false } },
    { id: `t-fat-${m.id}`, municipalityId: m.id, name: 'Vítimas Fatais (Trânsito)', value: Math.max(0, Math.floor(randomVar(3, 2) * popFactor)), unit: 'vidas', previousValue: 2 * popFactor, department: Department.TRANSITO, thresholds: { warning: 4 * popFactor, critical: 6 * popFactor, higherIsBetter: false } },

    // --- SAÚDE DETALHADA ---
    { 
      id: `h-units-${m.id}`, 
      municipalityId: m.id, 
      name: 'Ocupação Hospitalar por Unidade', 
      value: Math.floor(hospitalUnits.reduce((acc, u) => acc + u.occupancy, 0) / hospitalUnits.length), 
      unit: '%', 
      previousValue: 72, 
      department: Department.SAUDE, 
      thresholds: { warning: 80, critical: 90, higherIsBetter: false },
      details: hospitalUnits
    },
    { 
      id: `h-network-${m.id}`, 
      municipalityId: m.id, 
      name: 'Rede de Bairros (UBS/UPA)', 
      value: healthNetwork.reduce((acc, n) => acc + n.ubs + n.upa, 0), 
      unit: 'unid.', 
      previousValue: healthNetwork.length * 2, 
      department: Department.SAUDE, 
      thresholds: { warning: 10, critical: 5, higherIsBetter: true },
      details: healthNetwork
    },

    // --- EDUCAÇÃO & INFRA ---
    { id: `e1-${m.id}`, municipalityId: m.id, name: 'Frequência Escolar', value: Math.floor(randomVar(94, 4)), unit: '%', previousValue: 92, department: Department.EDUCACAO, thresholds: { warning: 90, critical: 80, higherIsBetter: true } },
    { id: `i1-${m.id}`, municipalityId: m.id, name: 'Obras de Pavimentação', value: Math.max(1, Math.floor(randomVar(8, 6) * (popFactor * 5))), unit: 'frentes', previousValue: 5, department: Department.INFRAESTRUTURA, thresholds: { warning: 3, critical: 1, higherIsBetter: true } }
  ];
};

export const INITIAL_ALERTS: Alert[] = [
  { id: 'al-1', municipalityId: 'campina-grande', title: 'Equilíbrio Fiscal', description: 'Gasto com pessoal está em 48.5% da RCL.', status: 'VERDE', date: '2024-05-22', department: Department.FINANCAS },
  { id: 'al-2', municipalityId: 'patos', title: 'Recursos Hídricos', description: 'Nível crítico de abastecimento.', status: 'VERMELHO', date: '2024-05-22', department: Department.INFRAESTRUTURA },
];
