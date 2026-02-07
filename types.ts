
export enum UserRole {
  PREFEITO = 'PREFEITO',
  CIDADAO = 'CIDADAO',
  ADMIN = 'ADMIN',
  SECRETARIO = 'SECRETARIO',
  SERVIDOR = 'SERVIDOR'
}

export enum AreaType {
  URBANA = 'Zona Urbana',
  RURAL = 'Zona Rural'
}

export enum Category {
  SAUDE = 'Saúde',
  EDUCACAO = 'Educação',
  INFRAESTRUTURA = 'Infraestrutura',
  ILUMINACAO = 'Iluminação',
  SEGURANCA = 'Segurança',
  LIMPEZA = 'Limpeza Urbana',
  ELOGIO = 'Elogio',
  SUGESTAO = 'Sugestão'
}

// Fix: Added Department enum used in EnvioDados.tsx
export enum Department {
  SAUDE = 'Saúde',
  EDUCACAO = 'Educação',
  INFRAESTRUTURA = 'Infraestrutura',
  FINANCAS = 'Finanças',
  ADMINISTRACAO = 'Administração',
  SEGURANCA = 'Segurança',
  LIMPEZA = 'Limpeza Urbana'
}

export type Sentiment = 'POSITIVO' | 'NEUTRO' | 'NEGATIVO';

// Fix: Added Status type used in StatCard.tsx
export type Status = 'VERDE' | 'AMARELO' | 'VERMELHO';

export interface Municipality {
  id: string;
  name: string;
  region: string;
}

export interface Feedback {
  id: string;
  municipalityId: string;
  citizenName: string;
  neighborhood: string;
  areaType: AreaType;
  category: Category;
  sentiment: Sentiment;
  comment: string;
  rating: number; // 1 a 5
  timestamp: string;
  status: 'LIDO' | 'PENDENTE' | 'RESOLVIDO';
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  municipalityId: string;
  // Fix: Added optional department property for governmental users
  department?: Department;
}

// Fix: Added Metric interface used in StatCard.tsx
export interface Metric {
  id: string;
  name: string;
  department: string;
  value: number;
  previousValue: number;
  unit: string;
  thresholds: {
    warning: number;
    critical: number;
    higherIsBetter: boolean;
  };
}
