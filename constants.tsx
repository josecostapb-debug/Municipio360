
import { Municipality, Feedback, Category, AreaType } from './types';

const slugify = (text: string) => text.toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/\s+/g, '-')
  .replace(/[^\w-]+/g, '');

const cityNames = ["João Pessoa", "Campina Grande", "Patos", "Guarabira", "Sousa", "Cajazeiras", "Cabedelo", "Santa Rita", "Bayeux", "Conde"];

export const MUNICIPALITIES: Municipality[] = cityNames.map(name => {
  let region = "Paraíba";
  const id = slugify(name);
  if (["joao-pessoa", "cabedelo", "santa-rita", "bayeux", "conde"].includes(id)) region = "Litoral";
  if (["campina-grande"].includes(id)) region = "Agreste";
  if (["patos", "sousa", "cajazeiras"].includes(id)) region = "Sertão";
  if (["guarabira"].includes(id)) region = "Brejo";
  return { id, name, region };
});

export const INITIAL_FEEDBACKS: Feedback[] = [
  { 
    id: 'f1', 
    municipalityId: 'joao-pessoa', 
    citizenName: 'Maria Silva', 
    cpfOrVoterId: '123.456.789-00',
    whatsapp: '83988887777',
    neighborhood: 'Manaíra', 
    areaType: AreaType.URBANA,
    category: Category.ILUMINACAO, 
    sentiment: 'NEGATIVO', 
    comment: 'A rua principal está sem luz há 3 dias. Muito perigoso.', 
    rating: 2, 
    timestamp: '2024-05-23T10:00:00Z',
    status: 'PENDENTE'
  },
  { 
    id: 'f2', 
    municipalityId: 'campina-grande', 
    citizenName: 'José da Roça', 
    cpfOrVoterId: '987.654.321-11',
    whatsapp: '83977776666',
    neighborhood: 'Distrito de Galante', 
    areaType: AreaType.RURAL,
    category: Category.INFRAESTRUTURA, 
    sentiment: 'NEGATIVO', 
    comment: 'A estrada vicinal está intransitável depois da chuva.', 
    rating: 3, 
    timestamp: '2024-05-23T09:45:00Z',
    status: 'PENDENTE'
  }
];

export const CATEGORIES = Object.values(Category);
