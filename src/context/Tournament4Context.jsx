import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  initialT4Teams,
  initialT4Ties,
  initialT4Courts,
  initialT4Rules,
  createDisputesForTie
} from '../data/mockTournament4';

const Tournament4Context = createContext();

const STORAGE_KEY_T4 = 'arenamaster_tournament4_data_v2';

export const Tournament4Provider = ({ children }) => {
  // State
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_T4}_teams`);
    return saved ? JSON.parse(saved) : initialT4Teams;
  });

  const [ties, setTies] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_T4}_ties`);
    return saved ? JSON.parse(saved) : initialT4Ties;
  });

  const [courts, setCourts] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_T4}_courts`);
    return saved ? JSON.parse(saved) : initialT4Courts;
  });

  const [rules, setRules] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_T4}_rules`);
    return saved ? JSON.parse(saved) : initialT4Rules;
  });

  const [activeTab4, setActiveTab4] = useState('schedule'); // 'schedule' | 'confrontos' | 'standings' | 'teams' | 'courts' | 'rules'

  // Modais
  const [lineupModalTie, setLineupModalTie] = useState(null); // tie selecionado para escalar
  const [scoreModalData, setScoreModalData] = useState(null); // { tieId, disputeId }
  const [courtModalTie, setCourtModalTie] = useState(null); // tie selecionado para atribuir quadra
  const [teamFormModal, setTeamFormModal] = useState(null); // team to edit or 'new'

  // Persistência
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_T4}_teams`, JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_T4}_ties`, JSON.stringify(ties));
  }, [ties]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_T4}_courts`, JSON.stringify(courts));
  }, [courts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_T4}_rules`, JSON.stringify(rules));
  }, [rules]);

  // Equipes CRUD
  const addTeam = (newTeamData) => {
    const id = `t4-team-${Date.now()}`;
    const newTeam = {
      id,
      ...newTeamData,
      athletes: {
        men: newTeamData.athletes?.men || [
          { id: `ath-m1-${Date.now()}`, name: 'Homem 1', nickname: '', phone: '' },
          { id: `ath-m2-${Date.now()}`, name: 'Homem 2', nickname: '', phone: '' }
        ],
        women: newTeamData.athletes?.women || [
          { id: `ath-w1-${Date.now()}`, name: 'Mulher 1', nickname: '', phone: '' },
          { id: `ath-w2-${Date.now()}`, name: 'Mulher 2', nickname: '', phone: '' }
        ]
      }
    };
    setTeams((prev) => [...prev, newTeam]);
    return newTeam;
  };

  const updateTeam = (teamId, updatedFields) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, ...updatedFields } : t))
    );
  };

  const deleteTeam = (teamId) => {
    setTeams((prev) => prev.filter((t) => t.id !== teamId));
    setTies((prev) => prev.filter((tie) => tie.team1Id !== teamId && tie.team2Id !== teamId));
  };

  // Helper para atualizar nomes exibidos nas disputas com base na escalação
  const buildDisputePlayerNames = (tie, updatedLineup1, updatedLineup2) => {
    const t1 = teams.find((t) => t.id === tie.team1Id);
    const t2 = teams.find((t) => t.id === tie.team2Id);

    const l1 = updatedLineup1 || tie.lineupTeam1;
    const l2 = updatedLineup2 || tie.lineupTeam2;

    const getAthleteName = (team, id) => {
      if (!id || !team) return 'A definir';
      const m = team.athletes?.men?.find((a) => a.id === id);
      if (m) return m.name;
      const w = team.athletes?.women?.find((a) => a.id === id);
      if (w) return w.name;
      return 'A definir';
    };

    return tie.disputes.map((disp) => {
      let team1Players = disp.team1Players;
      let team2Players = disp.team2Players;

      if (disp.type === 'dupla_masculina') {
        team1Players = t1 ? `${t1.athletes?.men?.[0]?.name || 'Homem 1'} & ${t1.athletes?.men?.[1]?.name || 'Homem 2'}` : 'Dupla Masc';
        team2Players = t2 ? `${t2.athletes?.men?.[0]?.name || 'Homem 1'} & ${t2.athletes?.men?.[1]?.name || 'Homem 2'}` : 'Dupla Masc';
      } else if (disp.type === 'dupla_feminina') {
        team1Players = t1 ? `${t1.athletes?.women?.[0]?.name || 'Mulher 1'} & ${t1.athletes?.women?.[1]?.name || 'Mulher 2'}` : 'Dupla Fem';
        team2Players = t2 ? `${t2.athletes?.women?.[0]?.name || 'Mulher 1'} & ${t2.athletes?.women?.[1]?.name || 'Mulher 2'}` : 'Dupla Fem';
      } else if (disp.type === 'dupla_mista') {
        const m1 = getAthleteName(t1, l1?.mixedManId);
        const w1 = getAthleteName(t1, l1?.mixedWomanId);
        team1Players = l1?.confirmed ? `${m1} & ${w1}` : 'A definir na escalação';

        const m2 = getAthleteName(t2, l2?.mixedManId);
        const w2 = getAthleteName(t2, l2?.mixedWomanId);
        team2Players = l2?.confirmed ? `${m2} & ${w2}` : 'A definir na escalação';
      } else if (disp.type === 'simples_masculina') {
        team1Players = l1?.confirmed ? getAthleteName(t1, l1?.singlesManId) : 'A definir na escalação';
        team2Players = l2?.confirmed ? getAthleteName(t2, l2?.singlesManId) : 'A definir na escalação';
      } else if (disp.type === 'simples_feminina') {
        team1Players = l1?.confirmed ? getAthleteName(t1, l1?.singlesWomanId) : 'A definir na escalação';
        team2Players = l2?.confirmed ? getAthleteName(t2, l2?.singlesWomanId) : 'A definir na escalação';
      }

      return {
        ...disp,
        team1Players,
        team2Players
      };
    });
  };

  // Definir Escalação da Equipe no Confronto
  const saveTieLineup = (tieId, { lineupTeam1, lineupTeam2 }) => {
    setTies((prev) =>
      prev.map((tie) => {
        if (tie.id !== tieId) return tie;

        const updatedL1 = lineupTeam1 !== undefined ? lineupTeam1 : tie.lineupTeam1;
        const updatedL2 = lineupTeam2 !== undefined ? lineupTeam2 : tie.lineupTeam2;

        const bothConfirmed = updatedL1?.confirmed && updatedL2?.confirmed;
        let newStatus = tie.status;
        if (tie.status === 'pendente_escalacao' && bothConfirmed) {
          newStatus = 'pronto';
        }

        const updatedDisputes = buildDisputePlayerNames(tie, updatedL1, updatedL2);

        return {
          ...tie,
          lineupTeam1: updatedL1,
          lineupTeam2: updatedL2,
          status: newStatus,
          disputes: updatedDisputes
        };
      })
    );
  };

  // Atualizar Placar de uma Disputa e Avançar no Chaveamento Eliminatório
  const updateDisputeScore = (tieId, disputeId, { gamesT1, gamesT2, tiebreakT1, tiebreakT2, status, winnerTeamId }) => {
    setTies((prev) => {
      // Primeiro atualiza o confronto alvo
      const updatedTies = prev.map((tie) => {
        if (tie.id !== tieId) return tie;

        const updatedDisputes = tie.disputes.map((disp) => {
          if (disp.id !== disputeId) return disp;
          return {
            ...disp,
            gamesT1: Number(gamesT1),
            gamesT2: Number(gamesT2),
            tiebreakT1: tiebreakT1 !== null && tiebreakT1 !== undefined ? Number(tiebreakT1) : null,
            tiebreakT2: tiebreakT2 !== null && tiebreakT2 !== undefined ? Number(tiebreakT2) : null,
            status: status || disp.status,
            winnerTeamId: winnerTeamId !== undefined ? winnerTeamId : disp.winnerTeamId
          };
        });

        // Recalcular placar geral do confronto
        let wonT1 = 0;
        let wonT2 = 0;
        let anyInProgress = false;
        let allFinished = true;

        updatedDisputes.forEach((d) => {
          if (d.winnerTeamId === tie.team1Id) wonT1++;
          if (d.winnerTeamId === tie.team2Id) wonT2++;
          if (d.status === 'em_andamento') anyInProgress = true;
          if (d.status !== 'finalizada') allFinished = false;
        });

        // Vencedor do confronto quando uma equipe atinge 3 disputas ou ao término
        let tieWinnerId = null;
        if (wonT1 >= 3) tieWinnerId = tie.team1Id;
        else if (wonT2 >= 3) tieWinnerId = tie.team2Id;

        let tieStatus = tie.status;
        if (allFinished || (wonT1 >= 3 || wonT2 >= 3)) {
          tieStatus = allFinished ? 'finalizado' : 'em_andamento';
        } else if (anyInProgress || wonT1 > 0 || wonT2 > 0) {
          tieStatus = 'em_andamento';
        }

        return {
          ...tie,
          status: tieStatus,
          score: {
            disputesWonT1: wonT1,
            disputesWonT2: wonT2,
            isFinished: allFinished,
            winnerId: tieWinnerId
          },
          disputes: updatedDisputes
        };
      });

      // Se o confronto alvo tiver vencedor definido, avançar vencedor para nextTie e perdedor para thirdPlaceTie
      const finishedTie = updatedTies.find((t) => t.id === tieId);
      if (!finishedTie || !finishedTie.score.winnerId) {
        return updatedTies;
      }

      const winnerId = finishedTie.score.winnerId;
      const loserId = winnerId === finishedTie.team1Id ? finishedTie.team2Id : finishedTie.team1Id;
      const winnerTeam = teams.find((t) => t.id === winnerId);
      const loserTeam = teams.find((t) => t.id === loserId);

      return updatedTies.map((m) => {
        let changed = false;
        let nextM = { ...m };

        // Avançar vencedor para o próximo confronto (ex: Final)
        if (finishedTie.nextTieId && m.id === finishedTie.nextTieId) {
          changed = true;
          if (finishedTie.nextTieSlot === 1) {
            nextM.team1Id = winnerId;
            nextM.team1Label = winnerTeam ? winnerTeam.name : 'Vencedor';
          } else if (finishedTie.nextTieSlot === 2) {
            nextM.team2Id = winnerId;
            nextM.team2Label = winnerTeam ? winnerTeam.name : 'Vencedor';
          }
        }

        // Avançar perdedor para disputa de 3º lugar (se houver)
        if (finishedTie.thirdPlaceTieId && m.id === finishedTie.thirdPlaceTieId) {
          changed = true;
          if (finishedTie.thirdPlaceTieSlot === 1) {
            nextM.team1Id = loserId;
            nextM.team1Label = loserTeam ? loserTeam.name : 'Derrotado';
          } else if (finishedTie.thirdPlaceTieSlot === 2) {
            nextM.team2Id = loserId;
            nextM.team2Label = loserTeam ? loserTeam.name : 'Derrotado';
          }
        }

        if (changed) {
          const t1 = teams.find((t) => t.id === nextM.team1Id);
          const t2 = teams.find((t) => t.id === nextM.team2Id);
          nextM.disputes = buildDisputePlayerNames(nextM, nextM.lineupTeam1, nextM.lineupTeam2);
        }

        return nextM;
      });
    });
  };

  // Atribuir quadra ao confronto
  const assignCourtToTie = (tieId, courtId, startTime) => {
    setTies((prev) =>
      prev.map((t) => (t.id === tieId ? { ...t, courtId, startTime: startTime || t.startTime } : t))
    );
    if (courtId) {
      setCourts((prev) =>
        prev.map((c) =>
          c.id === courtId ? { ...c, status: 'em_andamento' } : c
        )
      );
    }
  };

  // Mover confronto para outra quadra e horário (usado na Programação)
  const moveTie = (tieId, courtId, startTime) => {
    setTies((prev) =>
      prev.map((t) =>
        t.id === tieId
          ? {
              ...t,
              courtId: courtId || t.courtId,
              startTime: startTime || t.startTime
            }
          : t
      )
    );
  };

  // Liberar quadra
  const unassignCourt = (courtId) => {
    setCourts((prev) =>
      prev.map((c) => (c.id === courtId ? { ...c, status: 'livre' } : c))
    );
    setTies((prev) =>
      prev.map((t) => (t.courtId === courtId ? { ...t, courtId: null } : t))
    );
  };

  // Desalocar confronto específico da quadra
  const unassignTie = (tieId) => {
    setTies((prev) =>
      prev.map((t) => (t.id === tieId ? { ...t, courtId: null } : t))
    );
  };

  // Ajustar horário rápido do confronto (-15m / +15m)
  const adjustTieTime = (tieId, minutesDelta) => {
    setTies((prev) =>
      prev.map((t) => {
        if (t.id !== tieId) return t;
        const current = t.startTime || '09:00';
        const [h, m] = current.split(':').map(Number);
        let totalMins = (h || 0) * 60 + (m || 0) + minutesDelta;
        if (totalMins < 0) totalMins = 0;
        if (totalMins >= 24 * 60) totalMins = 23 * 60 + 59;
        const newH = String(Math.floor(totalMins / 60)).padStart(2, '0');
        const newM = String(totalMins % 60).padStart(2, '0');
        return { ...t, startTime: `${newH}:${newM}` };
      })
    );
  };

  // Gerador de Chaveamento em ELIMINATÓRIA SIMPLES conforme a quantidade de equipes
  const generateSingleEliminationBracket = () => {
    if (teams.length < 2) {
      alert('Cadastre ao menos 2 equipes para gerar o chaveamento eliminatório.');
      return;
    }

    const teamList = [...teams];
    const n = teamList.length;
    const generated = [];

    if (n <= 3) {
      // 2 ou 3 equipes: Final Direta
      const t1 = teamList[0];
      const t2 = teamList[1];
      const disputes = createDisputesForTie('t4-final', t1, t2);
      generated.push({
        id: 't4-final',
        round: 1,
        phase: 'Grande Final',
        group: 'Chave Principal',
        stage: 'mata_mata',
        matchNumber: 1,
        startTime: '10:00',
        courtId: courts[0]?.id || null,
        status: 'pendente_escalacao',
        team1Id: t1.id,
        team2Id: t2.id,
        team1Label: t1.name,
        team2Label: t2.name,
        lineupTeam1: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
        lineupTeam2: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
        score: { disputesWonT1: 0, disputesWonT2: 0, isFinished: false, winnerId: null },
        disputes
      });
    } else if (n <= 5) {
      // 4 equipes: Semifinais (2 jogos) + Final + Decisão 3º Lugar
      const [t1, t2, t3, t4] = teamList;

      // Semi 1: 1 x 2
      generated.push({
        id: 't4-semi-1',
        round: 1,
        phase: 'Semifinal 1',
        group: 'Chave Principal',
        stage: 'mata_mata',
        matchNumber: 1,
        startTime: '09:00',
        courtId: courts[0]?.id || null,
        status: 'pendente_escalacao',
        team1Id: t1.id,
        team2Id: t2.id,
        team1Label: t1.name,
        team2Label: t2.name,
        nextTieId: 't4-final',
        nextTieSlot: 1,
        thirdPlaceTieId: 't4-3place',
        thirdPlaceTieSlot: 1,
        lineupTeam1: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
        lineupTeam2: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
        score: { disputesWonT1: 0, disputesWonT2: 0, isFinished: false, winnerId: null },
        disputes: createDisputesForTie('t4-semi-1', t1, t2)
      });

      // Semi 2: 3 x 4
      generated.push({
        id: 't4-semi-2',
        round: 1,
        phase: 'Semifinal 2',
        group: 'Chave Principal',
        stage: 'mata_mata',
        matchNumber: 2,
        startTime: '10:30',
        courtId: courts[1]?.id || null,
        status: 'pendente_escalacao',
        team1Id: t3.id,
        team2Id: t4.id,
        team1Label: t3.name,
        team2Label: t4.name,
        nextTieId: 't4-final',
        nextTieSlot: 2,
        thirdPlaceTieId: 't4-3place',
        thirdPlaceTieSlot: 2,
        lineupTeam1: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
        lineupTeam2: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
        score: { disputesWonT1: 0, disputesWonT2: 0, isFinished: false, winnerId: null },
        disputes: createDisputesForTie('t4-semi-2', t3, t4)
      });

      // Final
      generated.push({
        id: 't4-final',
        round: 2,
        phase: 'Grande Final (Título)',
        group: 'Chave Principal',
        stage: 'mata_mata',
        matchNumber: 3,
        startTime: '14:00',
        courtId: courts[0]?.id || null,
        status: 'agendada',
        team1Id: null,
        team2Id: null,
        team1Label: 'Vencedor Semifinal 1',
        team2Label: 'Vencedor Semifinal 2',
        lineupTeam1: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
        lineupTeam2: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
        score: { disputesWonT1: 0, disputesWonT2: 0, isFinished: false, winnerId: null },
        disputes: createDisputesForTie('t4-final', null, null)
      });

      // Decisão 3º Lugar
      generated.push({
        id: 't4-3place',
        round: 2,
        phase: 'Decisão 3º Lugar',
        group: 'Chave Principal',
        stage: 'mata_mata',
        matchNumber: 4,
        startTime: '13:00',
        courtId: courts[1]?.id || null,
        status: 'agendada',
        team1Id: null,
        team2Id: null,
        team1Label: 'Derrotado Semifinal 1',
        team2Label: 'Derrotado Semifinal 2',
        lineupTeam1: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
        lineupTeam2: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
        score: { disputesWonT1: 0, disputesWonT2: 0, isFinished: false, winnerId: null },
        disputes: createDisputesForTie('t4-3place', null, null)
      });
    } else {
      // 6 a 8 equipes: Quartas de Final (4 jogos) + Semifinais (2) + Final + 3º Lugar
      for (let i = 0; i < 4; i++) {
        const tA = teamList[i * 2] || null;
        const tB = teamList[i * 2 + 1] || null;
        const semiIndex = Math.floor(i / 2) + 1;
        const semiSlot = (i % 2) + 1;

        generated.push({
          id: `t4-qf-${i + 1}`,
          round: 1,
          phase: `Quartas de Final ${i + 1}`,
          group: 'Chave Principal',
          stage: 'mata_mata',
          matchNumber: i + 1,
          startTime: `${String(8 + Math.floor(i * 1.5)).padStart(2, '0')}:00`,
          courtId: courts[i % courts.length]?.id || null,
          status: 'pendente_escalacao',
          team1Id: tA?.id || null,
          team2Id: tB?.id || null,
          team1Label: tA ? tA.name : 'Equipe Bye',
          team2Label: tB ? tB.name : 'Equipe Bye',
          nextTieId: `t4-semi-${semiIndex}`,
          nextTieSlot: semiSlot,
          lineupTeam1: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
          lineupTeam2: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
          score: { disputesWonT1: 0, disputesWonT2: 0, isFinished: false, winnerId: null },
          disputes: createDisputesForTie(`t4-qf-${i + 1}`, tA, tB)
        });
      }

      // Semifinais
      for (let s = 1; s <= 2; s++) {
        generated.push({
          id: `t4-semi-${s}`,
          round: 2,
          phase: `Semifinal ${s}`,
          group: 'Chave Principal',
          stage: 'mata_mata',
          matchNumber: 4 + s,
          startTime: `${11 + s}:00`,
          courtId: courts[(s - 1) % courts.length]?.id || null,
          status: 'agendada',
          team1Id: null,
          team2Id: null,
          team1Label: `Vencedor QF ${s * 2 - 1}`,
          team2Label: `Vencedor QF ${s * 2}`,
          nextTieId: 't4-final',
          nextTieSlot: s,
          thirdPlaceTieId: 't4-3place',
          thirdPlaceTieSlot: s,
          lineupTeam1: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
          lineupTeam2: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
          score: { disputesWonT1: 0, disputesWonT2: 0, isFinished: false, winnerId: null },
          disputes: createDisputesForTie(`t4-semi-${s}`, null, null)
        });
      }

      // Final
      generated.push({
        id: 't4-final',
        round: 3,
        phase: 'Grande Final (Título)',
        group: 'Chave Principal',
        stage: 'mata_mata',
        matchNumber: 7,
        startTime: '15:00',
        courtId: courts[0]?.id || null,
        status: 'agendada',
        team1Id: null,
        team2Id: null,
        team1Label: 'Vencedor Semifinal 1',
        team2Label: 'Vencedor Semifinal 2',
        lineupTeam1: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
        lineupTeam2: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
        score: { disputesWonT1: 0, disputesWonT2: 0, isFinished: false, winnerId: null },
        disputes: createDisputesForTie('t4-final', null, null)
      });

      // Decisão 3º Lugar
      generated.push({
        id: 't4-3place',
        round: 3,
        phase: 'Decisão 3º Lugar',
        group: 'Chave Principal',
        stage: 'mata_mata',
        matchNumber: 8,
        startTime: '14:00',
        courtId: courts[1]?.id || null,
        status: 'agendada',
        team1Id: null,
        team2Id: null,
        team1Label: 'Derrotado Semifinal 1',
        team2Label: 'Derrotado Semifinal 2',
        lineupTeam1: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
        lineupTeam2: { confirmed: false, mixedManId: null, mixedWomanId: null, singlesManId: null, singlesWomanId: null },
        score: { disputesWonT1: 0, disputesWonT2: 0, isFinished: false, winnerId: null },
        disputes: createDisputesForTie('t4-3place', null, null)
      });
    }

    setTies(generated);
  };

  // Cálculo da Tabela de Classificação do Torneio de 4 Atletas (baseado no desempenho e fase no mata-mata)
  const standings = useMemo(() => {
    const statsMap = {};

    teams.forEach((t) => {
      statsMap[t.id] = {
        team: t,
        tiesPlayed: 0,
        tiesWon: 0,
        tiesLost: 0,
        disputesWon: 0,
        disputesLost: 0,
        disputesDiff: 0,
        gamesFor: 0,
        gamesAgainst: 0,
        gamesDiff: 0,
        points: 0,
        isChampion: false,
        isRunnerUp: false,
        isThirdPlace: false
      };
    });

    ties.forEach((tie) => {
      const s1 = statsMap[tie.team1Id];
      const s2 = statsMap[tie.team2Id];

      let tieCounted = false;

      tie.disputes.forEach((d) => {
        const g1 = Number(d.gamesT1) || 0;
        const g2 = Number(d.gamesT2) || 0;

        if (d.status === 'finalizada' || g1 > 0 || g2 > 0) {
          if (s1) {
            s1.gamesFor += g1;
            s1.gamesAgainst += g2;
            if (d.winnerTeamId === tie.team1Id) {
              s1.disputesWon += 1;
              tieCounted = true;
            } else if (d.winnerTeamId === tie.team2Id) {
              s1.disputesLost += 1;
              tieCounted = true;
            }
          }
          if (s2) {
            s2.gamesFor += g2;
            s2.gamesAgainst += g1;
            if (d.winnerTeamId === tie.team2Id) {
              s2.disputesWon += 1;
              tieCounted = true;
            } else if (d.winnerTeamId === tie.team1Id) {
              s2.disputesLost += 1;
              tieCounted = true;
            }
          }
        }
      });

      if (tie.score.isFinished || tie.score.winnerId || tieCounted) {
        if (s1) s1.tiesPlayed += 1;
        if (s2) s2.tiesPlayed += 1;

        if (tie.score.winnerId === tie.team1Id) {
          if (s1) { s1.tiesWon += 1; s1.points += 3; }
          if (s2) { s2.tiesLost += 1; }
        } else if (tie.score.winnerId === tie.team2Id) {
          if (s2) { s2.tiesWon += 1; s2.points += 3; }
          if (s1) { s1.tiesLost += 1; }
        }

        // Títulos no mata-mata
        if (tie.id === 't4-final' && tie.score.winnerId) {
          const champId = tie.score.winnerId;
          const viceId = champId === tie.team1Id ? tie.team2Id : tie.team1Id;
          if (statsMap[champId]) { statsMap[champId].isChampion = true; statsMap[champId].points += 100; }
          if (statsMap[viceId]) { statsMap[viceId].isRunnerUp = true; statsMap[viceId].points += 70; }
        }
        if (tie.id === 't4-3place' && tie.score.winnerId) {
          const thirdId = tie.score.winnerId;
          if (statsMap[thirdId]) { statsMap[thirdId].isThirdPlace = true; statsMap[thirdId].points += 50; }
        }
      }
    });

    // Calcular saldos
    const list = Object.values(statsMap).map((item) => ({
      ...item,
      disputesDiff: item.disputesWon - item.disputesLost,
      gamesDiff: item.gamesFor - item.gamesAgainst
    }));

    // Ordenação do mata-mata
    list.sort((a, b) => {
      if (a.isChampion) return -1;
      if (b.isChampion) return 1;
      if (a.isRunnerUp) return -1;
      if (b.isRunnerUp) return 1;
      if (a.isThirdPlace) return -1;
      if (b.isThirdPlace) return 1;
      if (b.tiesWon !== a.tiesWon) return b.tiesWon - a.tiesWon;
      if (b.disputesDiff !== a.disputesDiff) return b.disputesDiff - a.disputesDiff;
      if (b.disputesWon !== a.disputesWon) return b.disputesWon - a.disputesWon;
      if (b.gamesDiff !== a.gamesDiff) return b.gamesDiff - a.gamesDiff;
      return b.gamesFor - a.gamesFor;
    });

    return list;
  }, [teams, ties]);

  // Reset para dados mock iniciais
  const resetToDefaultT4 = () => {
    setTeams(initialT4Teams);
    setTies(initialT4Ties);
    setCourts(initialT4Courts);
    setRules(initialT4Rules);
    localStorage.removeItem(`${STORAGE_KEY_T4}_teams`);
    localStorage.removeItem(`${STORAGE_KEY_T4}_ties`);
    localStorage.removeItem(`${STORAGE_KEY_T4}_courts`);
    localStorage.removeItem(`${STORAGE_KEY_T4}_rules`);
  };

  return (
    <Tournament4Context.Provider
      value={{
        teams,
        ties,
        courts,
        rules,
        standings,
        activeTab4,
        setActiveTab4,
        // Modais
        lineupModalTie,
        setLineupModalTie,
        scoreModalData,
        setScoreModalData,
        courtModalTie,
        setCourtModalTie,
        teamFormModal,
        setTeamFormModal,
        // Ações
        addTeam,
        updateTeam,
        deleteTeam,
        saveTieLineup,
        updateDisputeScore,
        assignCourtToTie,
        moveTie,
        unassignCourt,
        unassignTie,
        adjustTieTime,
        generateSingleEliminationBracket,
        resetToDefaultT4
      }}
    >
      {children}
    </Tournament4Context.Provider>
  );
};

export const useTournament4 = () => {
  const context = useContext(Tournament4Context);
  if (!context) {
    throw new Error('useTournament4 must be used within a Tournament4Provider');
  }
  return context;
};
