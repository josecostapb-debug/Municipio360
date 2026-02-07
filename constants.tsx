
import { Municipality, Feedback, Category, AreaType } from './types';

// Função auxiliar para gerar IDs consistentes
const slugify = (text: string) => text.toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/\s+/g, '-')
  .replace(/[^\w-]+/g, '');

const cityNames = [
  "Água Branca", "Aguiar", "Alagoa Grande", "Alagoa Nova", "Alagoinha", "Alcantil", "Algodão de Jandaíra", "Alhandra", "Amparo", "Aparecida", "Araçagi", "Arara", "Araruna", "Areia", "Areia de Baraúnas", "Areial", "Aroeiras", "Assunção", "Baía da Traição", "Bananeiras", "Baraúna", "Barra de Santa Rosa", "Barra de Santana", "Barra de São Miguel", "Bayeux", "Belém", "Belém do Brejo do Cruz", "Bernardino Batista", "Boa Ventura", "Boa Vista", "Bom Jesus", "Bom Sucesso", "Bonito de Santa Fé", "Boqueirão", "Borborema", "Brejo do Cruz", "Brejo dos Santo", "Caaporã", "Cabaceiras", "Cabedelo", "Cachoeira dos Índios", "Cacimba de Areia", "Cacimba de Dentro", "Cacimbas", "Caiçara", "Cajazeiras", "Cajazeirinhas", "Caldas Brandão", "Camalaú", "Campina Grande", "Capim", "Caraúbas", "Carrapateira", "Casserengue", "Catingueira", "Catolé do Rocha", "Caturité", "Conceição", "Condado", "Conde", "Congo", "Coremas", "Coxixola", "Cruz do Espírito Santo", "Cubati", "Cuité", "Cuité de Mamanguape", "Cuitegi", "Curral de Cima", "Curral Velho", "Damião", "Desterro", "Diamante", "Dona Inês", "Duas Estradas", "Emas", "Esperança", "Fagundes", "Frei Martinho", "Gado Bravo", "Guarabira", "Gurinhém", "Gurjão", "Ibiara", "Igaracy", "Imaculada", "Ingá", "Itabaiana", "Itaporanga", "Itapororoca", "Itatuba", "Jacaraú", "Jericó", "João Pessoa", "Joca Claudino", "Juarez Távora", "Juazeirinho", "Junco do Seridó", "Juripiranga", "Juru", "Lagoa", "Lagoa de Dentro", "Lagoa Seca", "Lastro", "Livramento", "Logradouro", "Lucena", "Mãe d’Água", "Malta", "Mamanguape", "Manaíra", "Marcação", "Mari", "Marizópolis", "Massaranduba", "Mataraca", "Matinhas", "Mato Grosso", "Maturéia", "Mogeiro", "Montadas", "Monte Horebe", "Monteiro", "Mulungu", "Natuba", "Nazarezinho", "Nova Floresta", "Nova Olinda", "Nova Palmeira", "Olho d’Água", "Olivedos", "Ouro Velho", "Parari", "Passagem", "Patos", "Paulista", "Pedra Branca", "Pedra Lavrada", "Pedras de Fogo", "Pedro Régis", "Piancó", "Picuí", "Pilar", "Pilões", "Pilõezinhos", "Pirpirituba", "Pitimbu", "Pocinhos", "Poço Dantas", "Poço de José de Moura", "Pombal", "Prata", "Princesa Isabel", "Puxinanã", "Queimadas", "Quixaba", "Remígio", "Riachão", "Riachão do Bacamarte", "Riachão do Poço", "Riacho de Santo Antônio", "Riacho dos Cavalos", "Rio Tinto", "Salgadinho", "Salgado de São Félix", "Santa Cecília", "Santa Cruz", "Santa Helena", "Santa Inês", "Santa Luzia", "Santa Rita", "Santa Teresinha", "Santana de Mangueira", "Santana dos Garrotes", "Santo André", "São Bentinho", "São Bento", "São Domingos", "São Domingos do Cariri", "São Francisco", "São João do Cariri", "São João do Rio do Peixe", "São João do Tigre", "São José da Lagoa Tapada", "São José de Caiana", "São José de Espinharas", "São José de Piranhas", "São José de Princesa", "São José do Bonfim", "São José do Brejo do Cruz", "São José do Sabugi", "São José dos Cordeiros", "São José dos Ramos", "São Mamede", "São Miguel de Taipu", "São Sebastião de Lagoa de Roça", "São Sebastião do Umbuzeiro", "Sapé", "São Vicente do Seridó", "Serra Branca", "Serra da Raiz", "Serra Grande", "Serra Redonda", "Serraria", "Sertãozinho", "Sobrado", "Solânea", "Soledade", "Sossêgo", "Sousa", "Sumé", "Tacima", "Taperoá", "Tavares", "Teixeira", "Tenório", "Triunfo", "Uiraúna", "Umbuzeiro", "Várzea", "Vieirópolis", "Vista Serrana", "Zabelê"
];

// Mapeamento regional básico para os polos e Paraíba para os demais
export const MUNICIPALITIES: Municipality[] = cityNames.map(name => {
  let region = "Paraíba";
  const id = slugify(name);
  
  if (["joao-pessoa", "cabedelo", "santa-rita", "bayeux", "conde"].includes(id)) region = "Litoral";
  if (["campina-grande", "queimadas", "lagoa-seca", "esperanca"].includes(id)) region = "Agreste";
  if (["patos", "sousa", "cajazeiras", "pombal", "itaporanga"].includes(id)) region = "Sertão";
  if (["guarabira", "bananeiras", "solanea"].includes(id)) region = "Brejo";

  return { id, name, region };
});

export const INITIAL_FEEDBACKS: Feedback[] = [
  { 
    id: 'f1', 
    municipalityId: 'joao-pessoa', 
    citizenName: 'Maria Silva', 
    neighborhood: 'Manaíra', 
    areaType: AreaType.URBANA,
    category: Category.ILUMINACAO, 
    sentiment: 'NEGATIVO', 
    comment: 'A rua principal está sem luz há 3 dias. Muito perigoso.', 
    rating: 1, 
    timestamp: '2024-05-23T10:00:00Z',
    status: 'PENDENTE'
  },
  { 
    id: 'f2', 
    municipalityId: 'campina-grande', 
    citizenName: 'José da Roça', 
    neighborhood: 'Distrito de Galante', 
    areaType: AreaType.RURAL,
    category: Category.INFRAESTRUTURA, 
    sentiment: 'NEGATIVO', 
    comment: 'A estrada vicinal está intransitável depois da chuva.', 
    rating: 2, 
    timestamp: '2024-05-23T09:45:00Z',
    status: 'PENDENTE'
  },
  { 
    id: 'f3', 
    municipalityId: 'patos', 
    citizenName: 'João Souza', 
    neighborhood: 'Centro', 
    areaType: AreaType.URBANA,
    category: Category.LIMPEZA, 
    sentiment: 'POSITIVO', 
    comment: 'A coleta de lixo passou no horário certinho hoje, parabéns.', 
    rating: 5, 
    timestamp: '2024-05-23T09:30:00Z',
    status: 'LIDO'
  }
];

export const CATEGORIES = Object.values(Category);
