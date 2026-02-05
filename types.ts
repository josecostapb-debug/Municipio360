
export enum UserRole {
  PREFEITO = 'PREFEITO',
  SECRETARIO = 'SECRETARIO',
  SERVIDOR = 'SERVIDOR',
  ADMIN = 'ADMIN',
  CIDADAO = 'CIDADAO'
}

export enum Department {
  SAUDE = 'Saúde',
  EDUCACAO = 'Educação',
  INFRAESTRUTURA = 'Infraestrutura',
  FINANCAS = 'Finanças',
  ASSISTENCIA = 'Assistência Social'
}

export type Status = 'VERDE' | 'AMARELO' | 'VERMELHO';

export interface Municipality {
  id: string;
  name: string;
  region: string;
  population: number;
}

export interface Metric {
  id: string;
  municipalityId: string; // Vínculo com o município
  name: string;
  value: number;
  unit: string;
  previousValue: number;
  thresholds: {
    warning: number;
    critical: number;
    higherIsBetter: boolean;
  };
  department: Department;
}

export interface Alert {
  id: string;
  municipalityId: string; // Vínculo com o município
  title: string;
  description: string;
  status: Status;
  date: string;
  department: Department;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  municipalityId: string; // Vínculo do usuário com sua prefeitura
  department?: Department;
}
