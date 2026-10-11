export const initialScoringRules = {
  firstPlace: 100,
  secondPlace: 70,
  thirdPlace: 50,
  fourthPlace: 35,
  quarterFinalist: 20,
  bonusPerMatchWin: 5,
  title: "Regulamento Oficial do Torneio Inter-Equipes",
  rulesText: `1. FORMATO DE DISPUTA DOS JOGOS:
- Todas as partidas serão disputadas em 1 SET ÚNICO ATÉ 6 GAMES.
- Em caso de empate em 5 x 5, o set vai a 7 games (vitória por 7 x 5).
- Em caso de empate em 6 x 6, será disputado um TIE-BREAK DE 7 PONTOS (com vantagem mínima obrigatória de 2 pontos, ex: 7-5, 8-6, 9-7).

2. SISTEMA DE DISPUTA (GRUPOS E MATA-MATA):
- As equipes serão divididas em grupos de 3 ou 4 equipes conforme o número de inscritos na categoria.
- Fase de Grupos: Todos jogam contra todos dentro do grupo (Round Robin).
- Classificam-se as 2 (DUAS) MELHORES EQUIPES de cada grupo para a fase eliminatória (Mata-Mata).
- Critérios de desempate no grupo:
  1º Maior número de vitórias
  2º Maior saldo de games (Games Pró - Games Contra)
  3º Maior número de games pró
  4º Confronto direto (quando empate entre duas equipes)

3. PONTUAÇÃO GERAL DE EQUIPES:
- Campeão da Categoria: 100 pontos
- Vice-Campeão: 70 pontos
- 3º Lugar: 50 pontos
- 4º Lugar: 35 pontos
- Quartas de final / Participação: 20 pontos
- Bônus por partida vencida: +5 pontos

4. TOLERÂNCIA:
- Tolerância máxima de 10 minutos para apresentação na quadra designada.`
};

export const initialTeams = [
  {
    id: "team-1",
    name: "Tubarões da Areia",
    shortName: "TUB",
    color: "#06b6d4",
    secondaryColor: "#083344",
    captain: "Rodrigo 'Shark' Alencar",
    contact: "(11) 98877-1122",
    city: "Santos - SP",
    logoText: "🦈"
  },
  {
    id: "team-2",
    name: "Leões do Padel & Tennis",
    shortName: "LEO",
    color: "#f59e0b",
    secondaryColor: "#451a03",
    captain: "Felipe Bernardes",
    contact: "(19) 99123-4567",
    city: "Campinas - SP",
    logoText: "🦁"
  },
  {
    id: "team-3",
    name: "Valkyrias Beach Club",
    shortName: "VAL",
    color: "#ec4899",
    secondaryColor: "#500724",
    captain: "Camila Guimarães",
    contact: "(11) 97321-9988",
    city: "São Paulo - SP",
    logoText: "⚡"
  },
  {
    id: "team-4",
    name: "Fênix Esporte Clube",
    shortName: "FNX",
    color: "#10b981",
    secondaryColor: "#022c22",
    captain: "Marcelo Dantas",
    contact: "(13) 98112-3344",
    city: "Guarujá - SP",
    logoText: "🔥"
  }
];

export const initialCategories = [
  {
    id: "cat-1",
    name: "Masculino Open",
    gender: "M",
    level: "Avançado",
    matchFormat: "1 Set até 6 games (5x5 vai a 7, 6x6 tiebreak de 7)",
    description: "Categoria principal - Grupos de 4 equipes com 2 classificados"
  },
  {
    id: "cat-2",
    name: "Feminino A",
    gender: "F",
    level: "Intermediário/Avançado",
    matchFormat: "1 Set até 6 games (5x5 vai a 7, 6x6 tiebreak de 7)",
    description: "Categoria feminina de duplas"
  },
  {
    id: "cat-3",
    name: "Mista B",
    gender: "X",
    level: "Intermediário",
    matchFormat: "1 Set até 6 games (5x5 vai a 7, 6x6 tiebreak de 7)",
    description: "Duplas mistas categoria B"
  }
];

export const initialAthletes = [
  // Tubarões
  { id: "ath-1", name: "Lucas Silveira", teamId: "team-1", categoryId: "cat-1", partnerName: "Pedro Guedes", phone: "11988880001" },
  { id: "ath-2", name: "Pedro Guedes", teamId: "team-1", categoryId: "cat-1", partnerName: "Lucas Silveira", phone: "11988880002" },
  { id: "ath-3", name: "Fernanda Costa", teamId: "team-1", categoryId: "cat-2", partnerName: "Juliana Ramos", phone: "11988880003" },
  { id: "ath-4", name: "Juliana Ramos", teamId: "team-1", categoryId: "cat-2", partnerName: "Fernanda Costa", phone: "11988880004" },
  { id: "ath-5", name: "Lucas Silveira", teamId: "team-1", categoryId: "cat-3", partnerName: "Fernanda Costa", phone: "11988880001" },

  // Leões
  { id: "ath-7", name: "Gabriel Siqueira", teamId: "team-2", categoryId: "cat-1", partnerName: "Rafael Moura", phone: "19977770001" },
  { id: "ath-8", name: "Rafael Moura", teamId: "team-2", categoryId: "cat-1", partnerName: "Gabriel Siqueira", phone: "19977770002" },
  { id: "ath-9", name: "Mariana Prado", teamId: "team-2", categoryId: "cat-2", partnerName: "Beatriz Lima", phone: "19977770003" },
  { id: "ath-10", name: "Beatriz Lima", teamId: "team-2", categoryId: "cat-2", partnerName: "Mariana Prado", phone: "19977770004" },
  { id: "ath-11", name: "Felipe Bernardes", teamId: "team-2", categoryId: "cat-3", partnerName: "Mariana Prado", phone: "19977770005" },

  // Valkyrias
  { id: "ath-13", name: "Bruno Castanho", teamId: "team-3", categoryId: "cat-1", partnerName: "Thiago Rocha", phone: "11966660001" },
  { id: "ath-14", name: "Thiago Rocha", teamId: "team-3", categoryId: "cat-1", partnerName: "Bruno Castanho", phone: "11966660002" },
  { id: "ath-15", name: "Camila Guimarães", teamId: "team-3", categoryId: "cat-2", partnerName: "Larissa Neves", phone: "11966660003" },
  { id: "ath-16", name: "Larissa Neves", teamId: "team-3", categoryId: "cat-2", partnerName: "Camila Guimarães", phone: "11966660004" },
  { id: "ath-17", name: "Thiago Rocha", teamId: "team-3", categoryId: "cat-3", partnerName: "Camila Guimarães", phone: "11966660002" },

  // Fênix
  { id: "ath-19", name: "Marcelo Dantas", teamId: "team-4", categoryId: "cat-1", partnerName: "Vinicius Prado", phone: "13955550001" },
  { id: "ath-20", name: "Vinicius Prado", teamId: "team-4", categoryId: "cat-1", partnerName: "Marcelo Dantas", phone: "13955550002" },
  { id: "ath-21", name: "Patricia Nogueira", teamId: "team-4", categoryId: "cat-2", partnerName: "Amanda Vilela", phone: "13955550003" },
  { id: "ath-22", name: "Amanda Vilela", teamId: "team-4", categoryId: "cat-2", partnerName: "Patricia Nogueira", phone: "13955550004" },
  { id: "ath-23", name: "Marcelo Dantas", teamId: "team-4", categoryId: "cat-3", partnerName: "Patricia Nogueira", phone: "13955550001" }
];

export const initialCourts = [
  {
    id: "court-1",
    name: "Quadra 1 - Central",
    surface: "Areia Coberta (Arena Show)",
    status: "em_andamento",
    currentMatchId: "match-1"
  },
  {
    id: "court-2",
    name: "Quadra 2 - Patrocinador",
    surface: "Areia Externa",
    status: "agendada",
    currentMatchId: "match-2"
  },
  {
    id: "court-3",
    name: "Quadra 3 - Sunset",
    surface: "Areia Fina",
    status: "livre",
    currentMatchId: null
  },
  {
    id: "court-4",
    name: "Quadra 4 - Pro Court",
    surface: "Areia Tratada",
    status: "livre",
    currentMatchId: null
  }
];

// Matches structured in Group Stages (Round Robin) + Knockout (Top 2 qualify)
// Score format: { gamesT1: number, gamesT2: number, tiebreakT1?: number, tiebreakT2?: number, currentPoints: string }
export const initialMatches = [
  // Categoria Masc Open (cat-1) - Grupo Único com 4 equipes (Classificam 2)
  {
    id: "match-1",
    categoryId: "cat-1",
    stage: "grupo",
    groupName: "Grupo A",
    phase: "Rodada 1",
    matchNumber: 1,
    team1Id: "team-1",
    team1Label: "Tubarões da Areia",
    team1Players: "Lucas & Pedro",
    team2Id: "team-2",
    team2Label: "Leões do Padel & Tennis",
    team2Players: "Gabriel & Rafael",
    courtId: "court-1",
    status: "em_andamento",
    startTime: "09:00",
    score: {
      gamesT1: 5,
      gamesT2: 4,
      tiebreakT1: 0,
      tiebreakT2: 0,
      currentPoints: "40-30"
    },
    winnerId: null,
    nextMatchId: null
  },
  {
    id: "match-2",
    categoryId: "cat-1",
    stage: "grupo",
    groupName: "Grupo A",
    phase: "Rodada 1",
    matchNumber: 2,
    team1Id: "team-3",
    team1Label: "Valkyrias Beach Club",
    team1Players: "Bruno & Thiago",
    team2Id: "team-4",
    team2Label: "Fênix Esporte Clube",
    team2Players: "Marcelo & Vinicius",
    courtId: "court-2",
    status: "agendada",
    startTime: "09:45",
    score: {
      gamesT1: 0,
      gamesT2: 0,
      tiebreakT1: 0,
      tiebreakT2: 0,
      currentPoints: "0-0"
    },
    winnerId: null,
    nextMatchId: null
  },
  {
    id: "match-3",
    categoryId: "cat-1",
    stage: "grupo",
    groupName: "Grupo A",
    phase: "Rodada 2",
    matchNumber: 3,
    team1Id: "team-1",
    team1Label: "Tubarões da Areia",
    team1Players: "Lucas & Pedro",
    team2Id: "team-3",
    team2Label: "Valkyrias Beach Club",
    team2Players: "Bruno & Thiago",
    courtId: null,
    status: "agendada",
    startTime: "10:30",
    score: {
      gamesT1: 0,
      gamesT2: 0,
      tiebreakT1: 0,
      tiebreakT2: 0,
      currentPoints: "0-0"
    },
    winnerId: null,
    nextMatchId: null
  },
  {
    id: "match-4",
    categoryId: "cat-1",
    stage: "grupo",
    groupName: "Grupo A",
    phase: "Rodada 2",
    matchNumber: 4,
    team1Id: "team-2",
    team1Label: "Leões do Padel & Tennis",
    team1Players: "Gabriel & Rafael",
    team2Id: "team-4",
    team2Label: "Fênix Esporte Clube",
    team2Players: "Marcelo & Vinicius",
    courtId: null,
    status: "agendada",
    startTime: "11:15",
    score: {
      gamesT1: 0,
      gamesT2: 0,
      tiebreakT1: 0,
      tiebreakT2: 0,
      currentPoints: "0-0"
    },
    winnerId: null,
    nextMatchId: null
  },
  {
    id: "match-5",
    categoryId: "cat-1",
    stage: "grupo",
    groupName: "Grupo A",
    phase: "Rodada 3",
    matchNumber: 5,
    team1Id: "team-1",
    team1Label: "Tubarões da Areia",
    team1Players: "Lucas & Pedro",
    team2Id: "team-4",
    team2Label: "Fênix Esporte Clube",
    team2Players: "Marcelo & Vinicius",
    courtId: null,
    status: "agendada",
    startTime: "12:00",
    score: {
      gamesT1: 0,
      gamesT2: 0,
      tiebreakT1: 0,
      tiebreakT2: 0,
      currentPoints: "0-0"
    },
    winnerId: null,
    nextMatchId: null
  },
  {
    id: "match-6",
    categoryId: "cat-1",
    stage: "grupo",
    groupName: "Grupo A",
    phase: "Rodada 3",
    matchNumber: 6,
    team1Id: "team-2",
    team1Label: "Leões do Padel & Tennis",
    team1Players: "Gabriel & Rafael",
    team2Id: "team-3",
    team2Label: "Valkyrias Beach Club",
    team2Players: "Bruno & Thiago",
    courtId: null,
    status: "agendada",
    startTime: "12:45",
    score: {
      gamesT1: 0,
      gamesT2: 0,
      tiebreakT1: 0,
      tiebreakT2: 0,
      currentPoints: "0-0"
    },
    winnerId: null,
    nextMatchId: null
  },
  // Grande Final Masc Open (1º do Grupo x 2º do Grupo)
  {
    id: "match-7-fin",
    categoryId: "cat-1",
    stage: "mata_mata",
    groupName: null,
    phase: "Grande Final",
    round: 2,
    matchNumber: 7,
    team1Id: null,
    team1Label: "1º Colocado Grupo A",
    team1Players: "A definir",
    team2Id: null,
    team2Label: "2º Colocado Grupo A",
    team2Players: "A definir",
    courtId: null,
    status: "pendente",
    startTime: "14:30",
    score: {
      gamesT1: 0,
      gamesT2: 0,
      tiebreakT1: 0,
      tiebreakT2: 0,
      currentPoints: "0-0"
    },
    winnerId: null,
    nextMatchId: null
  },
  // Decisão de 3º e 4º Lugar Masc Open (3º do Grupo x 4º do Grupo)
  {
    id: "match-7-3rd",
    categoryId: "cat-1",
    stage: "mata_mata",
    groupName: null,
    phase: "Decisão de 3º e 4º Lugar",
    round: 2,
    matchNumber: 8,
    team1Id: null,
    team1Label: "3º Colocado Grupo A",
    team1Players: "A definir",
    team2Id: null,
    team2Label: "4º Colocado Grupo A",
    team2Players: "A definir",
    courtId: null,
    status: "pendente",
    startTime: "15:15",
    score: {
      gamesT1: 0,
      gamesT2: 0,
      tiebreakT1: 0,
      tiebreakT2: 0,
      currentPoints: "0-0"
    },
    winnerId: null,
    nextMatchId: null
  },

  // Categoria Fem A (cat-2) - Rodada com resultado encerrado de teste
  {
    id: "match-8",
    categoryId: "cat-2",
    stage: "grupo",
    groupName: "Grupo A",
    phase: "Rodada 1",
    matchNumber: 1,
    team1Id: "team-3",
    team1Label: "Valkyrias Beach Club",
    team1Players: "Camila & Larissa",
    team2Id: "team-1",
    team2Label: "Tubarões da Areia",
    team2Players: "Fernanda & Juliana",
    courtId: null,
    status: "encerrada",
    startTime: "09:00",
    score: {
      gamesT1: 7,
      gamesT2: 5,
      tiebreakT1: 0,
      tiebreakT2: 0,
      currentPoints: "7x5 Final"
    },
    winnerId: "team-3",
    nextMatchId: null
  },
  {
    id: "match-9",
    categoryId: "cat-2",
    stage: "grupo",
    groupName: "Grupo A",
    phase: "Rodada 1",
    matchNumber: 2,
    team1Id: "team-2",
    team1Label: "Leões do Padel & Tennis",
    team1Players: "Mariana & Beatriz",
    team2Id: "team-4",
    team2Label: "Fênix Esporte Clube",
    team2Players: "Patricia & Amanda",
    courtId: null,
    status: "encerrada",
    startTime: "09:45",
    score: {
      gamesT1: 7,
      gamesT2: 6,
      tiebreakT1: 7,
      tiebreakT2: 5,
      currentPoints: "7x6 (7-5) Final"
    },
    winnerId: "team-2",
    nextMatchId: null
  },
  {
    id: "match-10-fin",
    categoryId: "cat-2",
    stage: "mata_mata",
    groupName: null,
    phase: "Grande Final",
    round: 2,
    matchNumber: 3,
    team1Id: "team-3",
    team1Label: "Valkyrias Beach Club",
    team1Players: "Camila & Larissa",
    team2Id: "team-2",
    team2Label: "Leões do Padel & Tennis",
    team2Players: "Mariana & Beatriz",
    courtId: null,
    status: "pendente",
    startTime: "15:00",
    score: {
      gamesT1: 0,
      gamesT2: 0,
      tiebreakT1: 0,
      tiebreakT2: 0,
      currentPoints: "0-0"
    },
    winnerId: null,
    nextMatchId: null
  },
  // Decisão de 3º e 4º Lugar Fem A
  {
    id: "match-10-3rd",
    categoryId: "cat-2",
    stage: "mata_mata",
    groupName: null,
    phase: "Decisão de 3º e 4º Lugar",
    round: 2,
    matchNumber: 4,
    team1Id: "team-1",
    team1Label: "Tubarões da Areia",
    team1Players: "Fernanda & Juliana",
    team2Id: "team-4",
    team2Label: "Fênix Esporte Clube",
    team2Players: "Patricia & Amanda",
    courtId: null,
    status: "pendente",
    startTime: "15:45",
    score: {
      gamesT1: 0,
      gamesT2: 0,
      tiebreakT1: 0,
      tiebreakT2: 0,
      currentPoints: "0-0"
    },
    winnerId: null,
    nextMatchId: null
  }
];
