// Mock Data para o Torneio de Equipes - 4 Atletas (2 Homens e 2 Mulheres)
// Formato Oficial: ELIMINATÓRIA SIMPLES (MATA-MATA DIRETO)
// 5 disputas por confronto:
// 1. Dupla Masculina (Homem 1 + Homem 2)
// 2. Dupla Feminina (Mulher 1 + Mulher 2)
// 3. Dupla Mista (1 Homem escalado + 1 Mulher escalada)
// 4. Simples Masculina (1 Homem escalado)
// 5. Simples Feminina (1 Mulher escalada)

export const initialT4Rules = {
  title: "Regulamento Oficial - Torneio Equipes 4 Atletas (Eliminatória Simples)",
  rulesText: `1. FORMAÇÃO DA EQUIPE:
- Cada equipe é formada obrigatoriamente por 4 atletas: 2 homens e 2 mulheres.
- Todos os 4 atletas participam das disputas do confronto.

2. FORMA DE DISPUTA (ELIMINATÓRIA SIMPLES / MATA-MATA):
- A forma de disputa é SEMPRE ELIMINATÓRIA SIMPLES (Mata-Mata Direto).
- O chaveamento é gerado automaticamente conforme a quantidade de equipes inscritas (Quartas de Final, Semifinais, Final e Decisão de 3º Lugar).
- A equipe que vencer o confronto (melhor de 5 disputas) avança diretamente para a próxima fase.
- A equipe derrotada é eliminada da chave principal (com disputa de 3º lugar para semifinalistas).

3. ESTRUTURA DO CONFRONTO (5 DISPUTAS):
- Cada confronto entre 2 equipes é composto por 5 jogos no formato de 1 SET até 6 games (5x5 vai a 7, 6x6 tiebreak de 7):
  * Jogo 1: Dupla Masculina (H1 + H2)
  * Jogo 2: Dupla Feminina (M1 + M2)
  * Jogo 3: Dupla Mista (1 Homem + 1 Mulher escalados pelo capitão/técnico)
  * Jogo 4: Simples Masculina (1 Homem escalado pelo capitão/técnico)
  * Jogo 5: Simples Feminina (1 Mulher escalada pelo capitão/técnico)

4. OBRIGATORIEDADE DA ESCALAÇÃO PRÉVIA:
- Antes do início do confronto, os capitães/técnicos de cada equipe devem registrar a ESCALAÇÃO OFICIAL:
  * Indicar qual homem e qual mulher jogarão a Dupla Mista.
  * Indicar qual homem jogará a Simples Masculina.
  * Indicar qual mulher jogará a Simples Feminina.
- Os confrontos só podem ser iniciados após a confirmação da escalação de ambas as equipes.

5. PONTUAÇÃO E CRITÉRIOS DE CLASSIFICAÇÃO:
- Vencedor do Confronto: A equipe que vencer 3 ou mais das 5 disputas (3x2, 4x1, 5x0).
- Critérios de classificação final no mata-mata:
  1º Lugar: Campeão (Vencedor da Final)
  2º Lugar: Vice-Campeão (Derrotado na Final)
  3º Lugar: Vencedor da Decisão de 3º Lugar
  4º Lugar: Derrotado na Decisão de 3º Lugar
  5º ao 8º Lugar: Eliminados nas Quartas de Final (ordenados por disputas e saldo de games)`
};

export const initialT4Teams = [
  {
    id: "t4-team-1",
    name: "Titanium Beach Club",
    shortName: "TIT",
    color: "#06b6d4",
    secondaryColor: "#083344",
    captain: "Carlos Eduardo",
    contact: "(11) 98765-4321",
    city: "Santos - SP",
    logoText: "⚡",
    athletes: {
      men: [
        { id: "ath-t4-1", name: "Carlos Eduardo", nickname: "Cadu", phone: "(11) 98765-4321" },
        { id: "ath-t4-2", name: "Lucas Martins", nickname: "Lukinha", phone: "(11) 98765-4322" }
      ],
      women: [
        { id: "ath-t4-3", name: "Paula Souza", nickname: "Paulinha", phone: "(11) 98765-4323" },
        { id: "ath-t4-4", name: "Fernanda Lima", nickname: "Fê Lima", phone: "(11) 98765-4324" }
      ]
    }
  },
  {
    id: "t4-team-2",
    name: "Predadores da Areia",
    shortName: "PRED",
    color: "#f59e0b",
    secondaryColor: "#451a03",
    captain: "Bruno Castro",
    contact: "(19) 99111-2233",
    city: "Campinas - SP",
    logoText: "🦁",
    athletes: {
      men: [
        { id: "ath-t4-5", name: "Bruno Castro", nickname: "Brunão", phone: "(19) 99111-2233" },
        { id: "ath-t4-6", name: "Rafael Neves", nickname: "Rafa", phone: "(19) 99111-2234" }
      ],
      women: [
        { id: "ath-t4-7", name: "Camila Duarte", nickname: "Cami", phone: "(19) 99111-2235" },
        { id: "ath-t4-8", name: "Juliana Rocha", nickname: "Ju Rocha", phone: "(19) 99111-2236" }
      ]
    }
  },
  {
    id: "t4-team-3",
    name: "Gladiadores do Litoral",
    shortName: "GLAD",
    color: "#10b981",
    secondaryColor: "#022c22",
    captain: "Thiago Silva",
    contact: "(13) 98222-3344",
    city: "Guarujá - SP",
    logoText: "🛡️",
    athletes: {
      men: [
        { id: "ath-t4-9", name: "Thiago Silva", nickname: "Thiaguinho", phone: "(13) 98222-3344" },
        { id: "ath-t4-10", name: "Diego Ferreira", nickname: "Diegão", phone: "(13) 98222-3345" }
      ],
      women: [
        { id: "ath-t4-11", name: "Beatriz Mendes", nickname: "Bia", phone: "(13) 98222-3346" },
        { id: "ath-t4-12", name: "Vanessa Costa", nickname: "Vane", phone: "(13) 98222-3347" }
      ]
    }
  },
  {
    id: "t4-team-4",
    name: "Spartanos Arena",
    shortName: "SPAR",
    color: "#ec4899",
    secondaryColor: "#500724",
    captain: "Marcelo Ribeiro",
    contact: "(11) 97333-4455",
    city: "São Paulo - SP",
    logoText: "⚔️",
    athletes: {
      men: [
        { id: "ath-t4-13", name: "Marcelo Ribeiro", nickname: "Marcelão", phone: "(11) 97333-4455" },
        { id: "ath-t4-14", name: "Gabriel Santos", nickname: "Biel", phone: "(11) 97333-4456" }
      ],
      women: [
        { id: "ath-t4-15", name: "Larissa Moreira", nickname: "Lari", phone: "(11) 97333-4457" },
        { id: "ath-t4-16", name: "Amanda Alves", nickname: "Mandinha", phone: "(11) 97333-4458" }
      ]
    }
  }
];

export const initialT4Courts = [
  { id: "t4-court-1", name: "Quadra 1 - Central", surface: "Areia Coberta", status: "em_andamento" },
  { id: "t4-court-2", name: "Quadra 2 - Match Court", surface: "Areia Externa", status: "agendada" },
  { id: "t4-court-3", name: "Quadra 3 - Sunset", surface: "Areia Fina", status: "livre" },
  { id: "t4-court-4", name: "Quadra 4 - Master", surface: "Areia Especial", status: "livre" }
];

// Helper para construir as 5 disputas oficiais de um confronto
export const createDisputesForTie = (tieId, t1, t2) => {
  return [
    {
      id: `${tieId}-disp-1`,
      tieId,
      order: 1,
      type: "dupla_masculina",
      label: "Dupla Masculina",
      icon: "Users",
      status: "agendada",
      team1Players: t1?.athletes?.men ? `${t1.athletes.men[0]?.name || 'H1'} & ${t1.athletes.men[1]?.name || 'H2'}` : "Dupla Masc",
      team2Players: t2?.athletes?.men ? `${t2.athletes.men[0]?.name || 'H1'} & ${t2.athletes.men[1]?.name || 'H2'}` : "Dupla Masc",
      gamesT1: 0,
      gamesT2: 0,
      tiebreakT1: null,
      tiebreakT2: null,
      winnerTeamId: null
    },
    {
      id: `${tieId}-disp-2`,
      tieId,
      order: 2,
      type: "dupla_feminina",
      label: "Dupla Feminina",
      icon: "Users",
      status: "agendada",
      team1Players: t1?.athletes?.women ? `${t1.athletes.women[0]?.name || 'M1'} & ${t1.athletes.women[1]?.name || 'M2'}` : "Dupla Fem",
      team2Players: t2?.athletes?.women ? `${t2.athletes.women[0]?.name || 'M1'} & ${t2.athletes.women[1]?.name || 'M2'}` : "Dupla Fem",
      gamesT1: 0,
      gamesT2: 0,
      tiebreakT1: null,
      tiebreakT2: null,
      winnerTeamId: null
    },
    {
      id: `${tieId}-disp-3`,
      tieId,
      order: 3,
      type: "dupla_mista",
      label: "Dupla Mista",
      icon: "HeartHandshake",
      status: "agendada",
      team1Players: "A definir na escalação",
      team2Players: "A definir na escalação",
      gamesT1: 0,
      gamesT2: 0,
      tiebreakT1: null,
      tiebreakT2: null,
      winnerTeamId: null
    },
    {
      id: `${tieId}-disp-4`,
      tieId,
      order: 4,
      type: "simples_masculina",
      label: "Simples Masculina",
      icon: "User",
      status: "agendada",
      team1Players: "A definir na escalação",
      team2Players: "A definir na escalação",
      gamesT1: 0,
      gamesT2: 0,
      tiebreakT1: null,
      tiebreakT2: null,
      winnerTeamId: null
    },
    {
      id: `${tieId}-disp-5`,
      tieId,
      order: 5,
      type: "simples_feminina",
      label: "Simples Feminina",
      icon: "User",
      status: "agendada",
      team1Players: "A definir na escalação",
      team2Players: "A definir na escalação",
      gamesT1: 0,
      gamesT2: 0,
      tiebreakT1: null,
      tiebreakT2: null,
      winnerTeamId: null
    }
  ];
};

// Chaveamento Inicial Oficial: Eliminatória Simples para 4 equipes (Semifinais + Final + 3º Lugar)
export const initialT4Ties = [
  {
    id: "t4-semi-1",
    round: 1,
    phase: "Semifinal 1",
    group: "Chave Principal",
    stage: "mata_mata",
    matchNumber: 1,
    startTime: "09:00",
    courtId: "t4-court-1",
    status: "em_andamento",
    team1Id: "t4-team-1", // Titanium
    team2Id: "t4-team-2", // Predadores
    team1Label: "Titanium Beach Club",
    team2Label: "Predadores da Areia",
    nextTieId: "t4-final",
    nextTieSlot: 1,
    thirdPlaceTieId: "t4-3place",
    thirdPlaceTieSlot: 1,
    lineupTeam1: {
      confirmed: true,
      mixedManId: "ath-t4-1",
      mixedWomanId: "ath-t4-3",
      singlesManId: "ath-t4-2",
      singlesWomanId: "ath-t4-4"
    },
    lineupTeam2: {
      confirmed: true,
      mixedManId: "ath-t4-5",
      mixedWomanId: "ath-t4-7",
      singlesManId: "ath-t4-6",
      singlesWomanId: "ath-t4-8"
    },
    score: {
      disputesWonT1: 2,
      disputesWonT2: 1,
      isFinished: false,
      winnerId: null
    },
    disputes: [
      {
        id: "disp-semi1-1",
        tieId: "t4-semi-1",
        order: 1,
        type: "dupla_masculina",
        label: "Dupla Masculina",
        status: "finalizada",
        team1Players: "Carlos Eduardo & Lucas Martins",
        team2Players: "Bruno Castro & Rafael Neves",
        gamesT1: 6,
        gamesT2: 4,
        tiebreakT1: null,
        tiebreakT2: null,
        winnerTeamId: "t4-team-1"
      },
      {
        id: "disp-semi1-2",
        tieId: "t4-semi-1",
        order: 2,
        type: "dupla_feminina",
        label: "Dupla Feminina",
        status: "finalizada",
        team1Players: "Paula Souza & Fernanda Lima",
        team2Players: "Camila Duarte & Juliana Rocha",
        gamesT1: 3,
        gamesT2: 6,
        tiebreakT1: null,
        tiebreakT2: null,
        winnerTeamId: "t4-team-2"
      },
      {
        id: "disp-semi1-3",
        tieId: "t4-semi-1",
        order: 3,
        type: "dupla_mista",
        label: "Dupla Mista",
        status: "finalizada",
        team1Players: "Carlos Eduardo & Paula Souza",
        team2Players: "Bruno Castro & Camila Duarte",
        gamesT1: 7,
        gamesT2: 6,
        tiebreakT1: 7,
        tiebreakT2: 4,
        winnerTeamId: "t4-team-1"
      },
      {
        id: "disp-semi1-4",
        tieId: "t4-semi-1",
        order: 4,
        type: "simples_masculina",
        label: "Simples Masculina",
        status: "em_andamento",
        team1Players: "Lucas Martins",
        team2Players: "Rafael Neves",
        gamesT1: 4,
        gamesT2: 3,
        tiebreakT1: null,
        tiebreakT2: null,
        winnerTeamId: null
      },
      {
        id: "disp-semi1-5",
        tieId: "t4-semi-1",
        order: 5,
        type: "simples_feminina",
        label: "Simples Feminina",
        status: "agendada",
        team1Players: "Fernanda Lima",
        team2Players: "Juliana Rocha",
        gamesT1: 0,
        gamesT2: 0,
        tiebreakT1: null,
        tiebreakT2: null,
        winnerTeamId: null
      }
    ]
  },
  {
    id: "t4-semi-2",
    round: 1,
    phase: "Semifinal 2",
    group: "Chave Principal",
    stage: "mata_mata",
    matchNumber: 2,
    startTime: "10:30",
    courtId: "t4-court-2",
    status: "pendente_escalacao",
    team1Id: "t4-team-3", // Gladiadores
    team2Id: "t4-team-4", // Spartanos
    team1Label: "Gladiadores do Litoral",
    team2Label: "Spartanos Arena",
    nextTieId: "t4-final",
    nextTieSlot: 2,
    thirdPlaceTieId: "t4-3place",
    thirdPlaceTieSlot: 2,
    lineupTeam1: {
      confirmed: false,
      mixedManId: null,
      mixedWomanId: null,
      singlesManId: null,
      singlesWomanId: null
    },
    lineupTeam2: {
      confirmed: false,
      mixedManId: null,
      mixedWomanId: null,
      singlesManId: null,
      singlesWomanId: null
    },
    score: {
      disputesWonT1: 0,
      disputesWonT2: 0,
      isFinished: false,
      winnerId: null
    },
    disputes: [
      {
        id: "disp-semi2-1",
        tieId: "t4-semi-2",
        order: 1,
        type: "dupla_masculina",
        label: "Dupla Masculina",
        status: "agendada",
        team1Players: "Thiago Silva & Diego Ferreira",
        team2Players: "Marcelo Ribeiro & Gabriel Santos",
        gamesT1: 0,
        gamesT2: 0,
        tiebreakT1: null,
        tiebreakT2: null,
        winnerTeamId: null
      },
      {
        id: "disp-semi2-2",
        tieId: "t4-semi-2",
        order: 2,
        type: "dupla_feminina",
        label: "Dupla Feminina",
        status: "agendada",
        team1Players: "Beatriz Mendes & Vanessa Costa",
        team2Players: "Larissa Moreira & Amanda Alves",
        gamesT1: 0,
        gamesT2: 0,
        tiebreakT1: null,
        tiebreakT2: null,
        winnerTeamId: null
      },
      {
        id: "disp-semi2-3",
        tieId: "t4-semi-2",
        order: 3,
        type: "dupla_mista",
        label: "Dupla Mista",
        status: "agendada",
        team1Players: "A definir na escalação",
        team2Players: "A definir na escalação",
        gamesT1: 0,
        gamesT2: 0,
        tiebreakT1: null,
        tiebreakT2: null,
        winnerTeamId: null
      },
      {
        id: "disp-semi2-4",
        tieId: "t4-semi-2",
        order: 4,
        type: "simples_masculina",
        label: "Simples Masculina",
        status: "agendada",
        team1Players: "A definir na escalação",
        team2Players: "A definir na escalação",
        gamesT1: 0,
        gamesT2: 0,
        tiebreakT1: null,
        tiebreakT2: null,
        winnerTeamId: null
      },
      {
        id: "disp-semi2-5",
        tieId: "t4-semi-2",
        order: 5,
        type: "simples_feminina",
        label: "Simples Feminina",
        status: "agendada",
        team1Players: "A definir na escalação",
        team2Players: "A definir na escalação",
        gamesT1: 0,
        gamesT2: 0,
        tiebreakT1: null,
        tiebreakT2: null,
        winnerTeamId: null
      }
    ]
  },
  {
    id: "t4-final",
    round: 2,
    phase: "Grande Final (Título)",
    group: "Chave Principal",
    stage: "mata_mata",
    matchNumber: 3,
    startTime: "14:00",
    courtId: "t4-court-1",
    status: "agendada",
    team1Id: null,
    team2Id: null,
    team1Label: "Vencedor Semifinal 1",
    team2Label: "Vencedor Semifinal 2",
    lineupTeam1: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
    lineupTeam2: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
    score: { disputesWonT1: 0, disputesWonT2: 0, isFinished: false, winnerId: null },
    disputes: [
      { id: "disp-final-1", tieId: "t4-final", order: 1, type: "dupla_masculina", label: "Dupla Masculina", status: "agendada", team1Players: "Aguardando definição", team2Players: "Aguardando definição", gamesT1: 0, gamesT2: 0, winnerTeamId: null },
      { id: "disp-final-2", tieId: "t4-final", order: 2, type: "dupla_feminina", label: "Dupla Feminina", status: "agendada", team1Players: "Aguardando definição", team2Players: "Aguardando definição", gamesT1: 0, gamesT2: 0, winnerTeamId: null },
      { id: "disp-final-3", tieId: "t4-final", order: 3, type: "dupla_mista", label: "Dupla Mista", status: "agendada", team1Players: "A definir na escalação", team2Players: "A definir na escalação", gamesT1: 0, gamesT2: 0, winnerTeamId: null },
      { id: "disp-final-4", tieId: "t4-final", order: 4, type: "simples_masculina", label: "Simples Masculina", status: "agendada", team1Players: "A definir na escalação", team2Players: "A definir na escalação", gamesT1: 0, gamesT2: 0, winnerTeamId: null },
      { id: "disp-final-5", tieId: "t4-final", order: 5, type: "simples_feminina", label: "Simples Feminina", status: "agendada", team1Players: "A definir na escalação", team2Players: "A definir na escalação", gamesT1: 0, gamesT2: 0, winnerTeamId: null }
    ]
  },
  {
    id: "t4-3place",
    round: 2,
    phase: "Decisão 3º Lugar",
    group: "Chave Principal",
    stage: "mata_mata",
    matchNumber: 4,
    startTime: "13:00",
    courtId: "t4-court-2",
    status: "agendada",
    team1Id: null,
    team2Id: null,
    team1Label: "Derrotado Semifinal 1",
    team2Label: "Derrotado Semifinal 2",
    lineupTeam1: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
    lineupTeam2: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
    score: { disputesWonT1: 0, disputesWonT2: 0, isFinished: false, winnerId: null },
    disputes: [
      { id: "disp-3p-1", tieId: "t4-3place", order: 1, type: "dupla_masculina", label: "Dupla Masculina", status: "agendada", team1Players: "Aguardando definição", team2Players: "Aguardando definição", gamesT1: 0, gamesT2: 0, winnerTeamId: null },
      { id: "disp-3p-2", tieId: "t4-3place", order: 2, type: "dupla_feminina", label: "Dupla Feminina", status: "agendada", team1Players: "Aguardando definição", team2Players: "Aguardando definição", gamesT1: 0, gamesT2: 0, winnerTeamId: null },
      { id: "disp-3p-3", tieId: "t4-3place", order: 3, type: "dupla_mista", label: "Dupla Mista", status: "agendada", team1Players: "A definir na escalação", team2Players: "A definir na escalação", gamesT1: 0, gamesT2: 0, winnerTeamId: null },
      { id: "disp-3p-4", tieId: "t4-3place", order: 4, type: "simples_masculina", label: "Simples Masculina", status: "agendada", team1Players: "A definir na escalação", team2Players: "A definir na escalação", gamesT1: 0, gamesT2: 0, winnerTeamId: null },
      { id: "disp-3p-5", tieId: "t4-3place", order: 5, type: "simples_feminina", label: "Simples Feminina", status: "agendada", team1Players: "A definir na escalação", team2Players: "A definir na escalação", gamesT1: 0, gamesT2: 0, winnerTeamId: null }
    ]
  }
];
