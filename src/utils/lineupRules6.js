/**
 * Regras Oficiais de Escalação e Revezamento para o Torneio de 6 Atletas:
 * 1. Confrontos em Melhor de 3 Jogos (Duplas).
 * 2. Não pode repetir a mesma formação de dupla no confronto.
 * 3. Os dois primeiros jogos devem ser definidos antes do primeiro jogo.
 * 4. Caso haja o 3º jogo (desempate se 1x1), os atletas que jogaram apenas um jogo
 *    devem fazer o 3º e último jogo do confronto (e não pode repetir formação anterior).
 */

// Normaliza o par de atletas independente da ordem (ex: 'Lucas' & 'Pedro' === 'Pedro' & 'Lucas')
export const normalizePairKey = (player1, player2) => {
  if (!player1 || !player2) return '';
  const names = [player1.trim().toLowerCase(), player2.trim().toLowerCase()].sort();
  return names.join(':::');
};

// Verifica se duas formações de duplas são idênticas
export const isSameFormation = (p1A, p2A, p1B, p2B) => {
  const keyA = normalizePairKey(p1A, p2A);
  const keyB = normalizePairKey(p1B, p2B);
  if (!keyA || !keyB) return false;
  return keyA === keyB;
};

// Calcula quantos jogos cada atleta da equipe já foi escalado/jogou nos Jogos 1 e 2
export const getAthleteParticipation = (allTeamAthletes = [], g1 = { p1: '', p2: '' }, g2 = { p1: '', p2: '' }) => {
  const counts = {};

  allTeamAthletes.forEach((ath) => {
    counts[ath.name] = 0;
  });

  const increment = (name) => {
    if (!name) return;
    const trimmed = name.trim();
    counts[trimmed] = (counts[trimmed] || 0) + 1;
  };

  increment(g1.p1);
  increment(g1.p2);
  increment(g2.p1);
  increment(g2.p2);

  return counts;
};

// Determina quais atletas são elegíveis para o 3º Jogo (Desempate)
// Regra: Os atletas que jogaram apenas um jogo (ou que ainda não jogaram) devem fazer o 3º jogo.
// Atletas que já jogaram 2 jogos no confronto são BLOQUEADOS.
export const getGame3Eligibility = (allTeamAthletes = [], g1 = { p1: '', p2: '' }, g2 = { p1: '', p2: '' }) => {
  const participation = getAthleteParticipation(allTeamAthletes, g1, g2);

  const eligible = [];
  const ineligible = [];

  // Se o atleta jogou 2 vezes, está bloqueado
  // Se jogou 1 vez (ou 0 vezes), está elegível
  Object.keys(participation).forEach((athName) => {
    const count = participation[athName];
    if (count >= 2) {
      ineligible.push({ name: athName, playedCount: count, reason: 'Já disputou 2 jogos neste confronto' });
    } else {
      eligible.push({
        name: athName,
        playedCount: count,
        priority: count === 1 ? 'Jogou 1 jogo (Prioridade para o 3º Jogo)' : 'Não jogou ainda (0 jogos)'
      });
    }
  });

  return { participation, eligible, ineligible };
};

// Seleciona automaticamente os dois atletas para o 3º Jogo de desempate
// Regra: Os atletas que não jogarem dois jogos são selecionados automaticamente
// garantindo que não repitam a mesma formação do 1º nem do 2º Jogo.
export const getAutoLineupGame3 = (allTeamAthletes = [], g1 = { p1: '', p2: '' }, g2 = { p1: '', p2: '' }) => {
  if (!allTeamAthletes.length) {
    return { p1: '', p2: '' };
  }

  const participation = getAthleteParticipation(allTeamAthletes, g1, g2);

  // Atletas com menos de 2 jogos (jogaram 0 ou 1 jogo)
  const candidates = allTeamAthletes.filter((ath) => (participation[ath.name] || 0) < 2);

  if (candidates.length < 2) {
    return { p1: candidates[0]?.name || '', p2: '' };
  }

  // Gera todas as duplas possíveis que não repetem a formação do Jogo 1 nem do Jogo 2
  const validPairs = [];

  for (let i = 0; i < candidates.length; i++) {
    for (let j = i + 1; j < candidates.length; j++) {
      const p1 = candidates[i].name;
      const p2 = candidates[j].name;

      if (isSameFormation(p1, p2, g1.p1, g1.p2)) continue;
      if (isSameFormation(p1, p2, g2.p1, g2.p2)) continue;

      const part1 = participation[p1] || 0;
      const part2 = participation[p2] || 0;

      let score = 0;
      if (part1 === 0 && part2 === 0) {
        score = 100; // Prioridade máxima se houver atletas que ainda não entraram em quadra (revezamento total de 6 atletas)
      } else if (part1 === 0 || part2 === 0) {
        score = 50; // Atleta com 0 jogos + atleta com 1 jogo
      } else {
        score = 25; // Ambos jogaram 1 jogo (em formações diferentes)
      }

      validPairs.push({ p1, p2, score });
    }
  }

  // Ordena por prioridade
  validPairs.sort((a, b) => b.score - a.score);

  if (validPairs.length > 0) {
    return { p1: validPairs[0].p1, p2: validPairs[0].p2 };
  }

  return { p1: candidates[0].name, p2: candidates[1].name };
};

// Validador completo de escalação da equipe para o confronto
export const validateTeamLineup = ({
  allTeamAthletes = [],
  g1 = { p1: '', p2: '' },
  g2 = { p1: '', p2: '' },
  g3 = { p1: '', p2: '' },
  isGame3Active = false
}) => {
  const errors = [];
  const warnings = [];

  // 1. Validação Jogo 1
  if (!g1.p1 || !g1.p2) {
    errors.push('O 1º Jogo deve ter 2 atletas definidos.');
  } else if (g1.p1.trim().toLowerCase() === g1.p2.trim().toLowerCase()) {
    errors.push('No 1º Jogo, selecione dois atletas diferentes para a dupla.');
  }

  // 2. Validação Jogo 2
  if (!g2.p1 || !g2.p2) {
    errors.push('O 2º Jogo deve ser definido antes do primeiro jogo.');
  } else if (g2.p1.trim().toLowerCase() === g2.p2.trim().toLowerCase()) {
    errors.push('No 2º Jogo, selecione dois atletas diferentes para a dupla.');
  }

  // 3. Regra: Não repetir a mesma formação entre Jogo 1 e Jogo 2
  if (g1.p1 && g1.p2 && g2.p1 && g2.p2) {
    if (isSameFormation(g1.p1, g1.p2, g2.p1, g2.p2)) {
      errors.push('Não é permitido repetir a mesma formação de dupla no Jogo 1 e Jogo 2! Revezamento obrigatório.');
    }
  }

  // 4. Validação Jogo 3 (caso necessário)
  if (isGame3Active && g3.p1 && g3.p2) {
    if (g3.p1.trim().toLowerCase() === g3.p2.trim().toLowerCase()) {
      errors.push('No 3º Jogo, selecione dois atletas diferentes para a dupla.');
    }

    // Não pode repetir formação do Jogo 1 nem do Jogo 2
    if (isSameFormation(g3.p1, g3.p2, g1.p1, g1.p2)) {
      errors.push('A formação do 3º Jogo não pode ser idêntica à formação do 1º Jogo!');
    }
    if (isSameFormation(g3.p1, g3.p2, g2.p1, g2.p2)) {
      errors.push('A formação do 3º Jogo não pode ser idêntica à formação do 2º Jogo!');
    }

    // Checar se algum atleta do Jogo 3 já jogou 2 vezes
    const part = getAthleteParticipation(allTeamAthletes, g1, g2);
    if ((part[g3.p1] || 0) >= 2) {
      errors.push(`O atleta ${g3.p1} já disputou 2 jogos e não pode disputar o 3º jogo.`);
    }
    if ((part[g3.p2] || 0) >= 2) {
      errors.push(`O atleta ${g3.p2} já disputou 2 jogos e não pode disputar o 3º jogo.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Helper para criar os 3 jogos da série Melhor de 3 do Torneio de 6 Atletas
export const createDefaultBestOf3Games = (matchId, t1PlayersStr = '', t2PlayersStr = '') => {
  const p1 = (t1PlayersStr || '').split('&').map((s) => s.trim());
  const p2 = (t2PlayersStr || '').split('&').map((s) => s.trim());

  return [
    {
      id: `${matchId}-g1`,
      order: 1,
      label: '1º Jogo (Duplas)',
      status: 'agendada',
      team1Players: p1[0] && p1[1] ? `${p1[0]} & ${p1[1]}` : (p1[0] || 'A definir'),
      team2Players: p2[0] && p2[1] ? `${p2[0]} & ${p2[1]}` : (p2[0] || 'A definir'),
      score: { gamesT1: 0, gamesT2: 0, tiebreakT1: 0, tiebreakT2: 0 },
      winnerTeamId: null
    },
    {
      id: `${matchId}-g2`,
      order: 2,
      label: '2º Jogo (Duplas)',
      status: 'agendada',
      team1Players: 'A definir antes do 1º jogo',
      team2Players: 'A definir antes do 1º jogo',
      score: { gamesT1: 0, gamesT2: 0, tiebreakT1: 0, tiebreakT2: 0 },
      winnerTeamId: null
    },
    {
      id: `${matchId}-g3`,
      order: 3,
      label: '3º Jogo Desempate (Se 1x1)',
      status: 'aguardando',
      team1Players: 'A definir se 1x1 (Atletas com 1 jogo)',
      team2Players: 'A definir se 1x1 (Atletas com 1 jogo)',
      score: { gamesT1: 0, gamesT2: 0, tiebreakT1: 0, tiebreakT2: 0 },
      winnerTeamId: null
    }
  ];
};

export const normalizeMatchBestOf3 = (m) => {
  if (m.games && m.games.length === 3) return m;

  const defaultGames = createDefaultBestOf3Games(m.id, m.team1Players, m.team2Players);

  if (m.status === 'encerrada' && m.winnerId) {
    const isT1Win = m.winnerId === m.team1Id;
    defaultGames[0].status = 'encerrada';
    defaultGames[0].score = { gamesT1: isT1Win ? 6 : 3, gamesT2: isT1Win ? 3 : 6 };
    defaultGames[0].winnerTeamId = m.winnerId;

    defaultGames[1].status = 'encerrada';
    defaultGames[1].score = { gamesT1: isT1Win ? 6 : 4, gamesT2: isT1Win ? 4 : 6 };
    defaultGames[1].winnerTeamId = m.winnerId;

    defaultGames[2].status = 'dispensada';
  }

  return {
    ...m,
    games: defaultGames,
    seriesScore: m.seriesScore || {
      winsT1: m.status === 'encerrada' && m.winnerId === m.team1Id ? 2 : 0,
      winsT2: m.status === 'encerrada' && m.winnerId === m.team2Id ? 2 : 0
    }
  };
};

