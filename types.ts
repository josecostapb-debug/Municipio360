
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
  ASSISTENCIA = 'Assistência Social',
  POLITICO = 'Gestão Política',
  SEGURANCA = 'Segurança Pública',
  TRANSITO = 'Segurança Viária'
}

export type Status = 'VERDE' | 'AMARELO' | 'VERMELHO';

export interface Municipality {
  id: string;
  name: string;
  region: string;
  population: number;
}

export interface HospitalUnit {
  name: string;
  occupancy: number;
  totalBeds: number;
}

export interface HealthNetworkNode {
  neighborhood: string;
  ubs: number;
  upa: number;
}

export interface Metric {
  id: string;
  municipalityId: string;
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
  details?: any; // Para dados complexos como lista de hospitais
}

export interface Alert {
  id: string;
  municipalityId: string;
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
  municipalityId: string;
  department?: Department;
}

export interface Vote {
  id: string;
  municipalityId: string;
  rating: number; 
  comment: string;
  sentiment: 'POSITIVO' | 'NEUTRO' | 'NEGATIVO';
  coords?: { lat: number; lng: number };
  timestamp: string;
}
