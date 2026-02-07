
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
  cpfOrVoterId: string; // Novo: Validação de identidade
  whatsapp: string;      // Novo: Canal de resposta
  neighborhood: string;
  areaType: AreaType;
  category: Category;
  sentiment: Sentiment;
  comment: string;
  rating: number; // Agora 1 a 10
  timestamp: string;
  status: 'LIDO' | 'PENDENTE' | 'RESOLVIDO';
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  municipalityId: string;
  department?: Department;
}

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
