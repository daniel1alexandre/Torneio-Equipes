import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialTeams,
  initialCategories,
  initialAthletes,
  initialCourts,
  initialMatches,
  initialScoringRules
} from '../data/mockTournament';

import {
  createDefaultBestOf3Games,
  normalizeMatchBestOf3
} from '../utils/lineupRules6';


const TournamentContext = createContext();

const STORAGE_KEY = 'arenamaster_tournament_data_v2';

export const TournamentProvider = ({ children }) => {
  // State
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_teams`);
    return saved ? JSON.parse(saved) : initialTeams;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_categories`);
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [athletes, setAthletes] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_athletes`);
    return saved ? JSON.parse(saved) : initialAthletes;
  });

  const [courts, setCourts] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_courts`);
    return saved ? JSON.parse(saved) : initialCourts;
  });

  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_matches`);
    const raw = saved ? JSON.parse(saved) : initialMatches;
    return raw.map(normalizeMatchBestOf3);
  });

  const [scoringRules, setScoringRules] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_scoringRules`);
    return saved ? JSON.parse(saved) : initialScoringRules;
  });

  const [scheduleConfig, setScheduleConfig] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_scheduleConfig`);
    return saved
      ? JSON.parse(saved)
      : {
          courtCount: 4,
          matchDuration: 45,
          startTime: '08:00',
          endTime: '20:00'
        };
  });

  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || 'cat-1');

  // Modals
  const [scoreModalMatch, setScoreModalMatch] = useState(null);
  const [assignCourtData, setAssignCourtData] = useState(null); // { matchId, courtId }
  const [teamManageCategoryModal, setTeamManageCategoryModal] = useState(null); // teamId
  const [coachLineupMatch, setCoachLineupMatch] = useState(null); // match to edit coach lineup for 6 athletes

  // Salvar Escalação do Confronto em Melhor de 3 Jogos
  const saveMatchLineup = (matchId, {
    team1Players,
    team2Players,
    lineupTeam1Confirmed,
    lineupTeam2Confirmed,
    lineupGame1,
    lineupGame2,
    lineupGame3
  }) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== matchId) return m;

        const currentGames = m.games || createDefaultBestOf3Games(m.id, m.team1Players, m.team2Players);
        const updatedGames = currentGames.map((g) => {
          if (g.order === 1 && lineupGame1) {
            return {
              ...g,
              team1Players: lineupGame1.t1Players || g.team1Players,
              team2Players: lineupGame1.t2Players || g.team2Players
            };
          }
          if (g.order === 2 && lineupGame2) {
            return {
              ...g,
              team1Players: lineupGame2.t1Players || g.team1Players,
              team2Players: lineupGame2.t2Players || g.team2Players
            };
          }
          if (g.order === 3 && lineupGame3) {
            return {
              ...g,
              team1Players: lineupGame3.t1Players || g.team1Players,
              team2Players: lineupGame3.t2Players || g.team2Players
            };
          }
          return g;
        });

        const summaryT1 = lineupGame1?.t1Players
          ? `J1: ${lineupGame1.t1Players}${lineupGame2?.t1Players ? ` | J2: ${lineupGame2.t1Players}` : ''}`
          : team1Players || m.team1Players;

        const summaryT2 = lineupGame1?.t2Players
          ? `J1: ${lineupGame1.t2Players}${lineupGame2?.t2Players ? ` | J2: ${lineupGame2.t2Players}` : ''}`
          : team2Players || m.team2Players;

        return {
          ...m,
          team1Players: summaryT1,
          team2Players: summaryT2,
          lineupTeam1Confirmed: lineupTeam1Confirmed !== undefined ? lineupTeam1Confirmed : m.lineupTeam1Confirmed,
          lineupTeam2Confirmed: lineupTeam2Confirmed !== undefined ? lineupTeam2Confirmed : m.lineupTeam2Confirmed,
          lineupGame1: lineupGame1 !== undefined ? lineupGame1 : m.lineupGame1,
          lineupGame2: lineupGame2 !== undefined ? lineupGame2 : m.lineupGame2,
          lineupGame3: lineupGame3 !== undefined ? lineupGame3 : m.lineupGame3,
          games: updatedGames
        };
      })
    );
  };

  // Atualizar Placar de um Jogo Específico da Série Melhor de 3
  const updateSeriesGameScore = (matchId, gameOrder, { gamesT1, gamesT2, tiebreakT1, tiebreakT2, winnerTeamId }) => {
    let seriesOverWinnerId = null;

    setMatches((prev) => {
      const matchTarget = prev.find((m) => m.id === matchId);
      if (!matchTarget) return prev;

      const currentGames = (matchTarget.games || createDefaultBestOf3Games(matchTarget.id, matchTarget.team1Players, matchTarget.team2Players)).map((g) => {
        if (g.order !== gameOrder) return g;

        const g1 = Number(gamesT1 ?? g.score?.gamesT1 ?? 0);
        const g2 = Number(gamesT2 ?? g.score?.gamesT2 ?? 0);
        const tb1 = Number(tiebreakT1 ?? g.score?.tiebreakT1 ?? 0);
        const tb2 = Number(tiebreakT2 ?? g.score?.tiebreakT2 ?? 0);

        let autoWinner = winnerTeamId;
        if (!autoWinner) {
          if ((g1 >= 6 && g1 - g2 >= 2) || (g1 === 7 && (g2 === 5 || g2 === 6))) {
            autoWinner = matchTarget.team1Id;
          } else if ((g2 >= 6 && g2 - g1 >= 2) || (g2 === 7 && (g1 === 5 || g1 === 6))) {
            autoWinner = matchTarget.team2Id;
          }
        }

        return {
          ...g,
          score: { gamesT1: g1, gamesT2: g2, tiebreakT1: tb1, tiebreakT2: tb2 },
          status: autoWinner ? 'encerrada' : 'em_andamento',
          winnerTeamId: autoWinner || null
        };
      });

      // Recalcular vitórias na série
      let winsT1 = 0;
      let winsT2 = 0;
      currentGames.forEach((g) => {
        if (g.status === 'encerrada' && g.winnerTeamId) {
          if (g.winnerTeamId === matchTarget.team1Id) winsT1++;
          if (g.winnerTeamId === matchTarget.team2Id) winsT2++;
        }
      });

      let matchStatus = matchTarget.status;
      if (winsT1 >= 2) {
        seriesOverWinnerId = matchTarget.team1Id;
        matchStatus = 'encerrada';
        if (currentGames[2] && currentGames[2].status !== 'encerrada') {
          currentGames[2].status = 'dispensada';
        }
      } else if (winsT2 >= 2) {
        seriesOverWinnerId = matchTarget.team2Id;
        matchStatus = 'encerrada';
        if (currentGames[2] && currentGames[2].status !== 'encerrada') {
          currentGames[2].status = 'dispensada';
        }
      } else if (winsT1 === 1 && winsT2 === 1) {
        matchStatus = 'em_andamento';
        if (currentGames[2] && currentGames[2].status === 'aguardando') {
          currentGames[2].status = 'agendada';
        }
      } else if (winsT1 > 0 || winsT2 > 0) {
        matchStatus = 'em_andamento';
      }

      return prev.map((m) => {
        if (m.id !== matchId) return m;
        return {
          ...m,
          status: matchStatus,
          winnerId: seriesOverWinnerId || m.winnerId,
          games: currentGames,
          seriesScore: { winsT1, winsT2 },
          score: {
            ...m.score,
            gamesT1: winsT1,
            gamesT2: winsT2,
            set1: [winsT1, winsT2],
            currentPoints: matchStatus === 'encerrada' ? 'Encerrado' : `${winsT1}x${winsT2} (MD3)`
          }
        };
      });
    });

    if (seriesOverWinnerId) {
      finishMatch(matchId, seriesOverWinnerId);
    }
  };


  // Persist
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_teams`, JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_athletes`, JSON.stringify(athletes));
  }, [athletes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_courts`, JSON.stringify(courts));
  }, [courts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_matches`, JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_scheduleConfig`, JSON.stringify(scheduleConfig));
  }, [scheduleConfig]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_scoringRules`, JSON.stringify(scoringRules));
  }, [scoringRules]);

  // Team CRUD
  const addTeam = (team) => {
    const newTeam = {
      ...team,
      id: `team-${Date.now()}`
    };
    setTeams((prev) => [...prev, newTeam]);
    return newTeam;
  };

  const updateTeam = (id, updatedFields) => {
    setTeams((prev) =>
      prev.map((team) => (team.id === id ? { ...team, ...updatedFields } : team))
    );
  };

  const deleteTeam = (id) => {
    setTeams((prev) => prev.filter((team) => team.id !== id));
    setAthletes((prev) => prev.filter((a) => a.teamId !== id));
  };

  // Category CRUD
  const addCategory = (category) => {
    const newCat = {
      ...category,
      id: `cat-${Date.now()}`
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = (id, updatedFields) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updatedFields } : cat))
    );
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    setAthletes((prev) => prev.filter((a) => a.categoryId !== id));
    setMatches((prev) => prev.filter((m) => m.categoryId !== id));
  };

  // Athlete CRUD
  const addAthlete = (athlete) => {
    const newAthlete = {
      ...athlete,
      id: `ath-${Date.now()}`
    };
    setAthletes((prev) => [...prev, newAthlete]);
    return newAthlete;
  };

  const updateAthlete = (id, updatedFields) => {
    setAthletes((prev) =>
      prev.map((ath) => (ath.id === id ? { ...ath, ...updatedFields } : ath))
    );
  };

  const deleteAthlete = (id) => {
    setAthletes((prev) => prev.filter((ath) => ath.id !== id));
  };

  // Court CRUD
  const addCourt = (court) => {
    const newCourt = {
      ...court,
      id: `court-${Date.now()}`,
      status: 'livre',
      currentMatchId: null
    };
    setCourts((prev) => [...prev, newCourt]);
    return newCourt;
  };

  const updateCourt = (id, updatedFields) => {
    setCourts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteCourt = (id) => {
    setCourts((prev) => prev.filter((c) => c.id !== id));
  };

  // Match Scheduling & Court Integration
  const assignMatchToCourt = (matchId, courtId, startTime) => {
    const now = new Date();
    const timeStr =
      startTime ||
      `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Free any court currently holding this match
    setCourts((prevCourts) =>
      prevCourts.map((c) => {
        if (c.currentMatchId === matchId && c.id !== courtId) {
          return { ...c, currentMatchId: null, status: 'livre' };
        }
        if (c.id === courtId) {
          return { ...c, currentMatchId: matchId, status: 'em_andamento' };
        }
        return c;
      })
    );

    // Update match
    setMatches((prevMatches) =>
      prevMatches.map((m) => {
        if (m.id === matchId) {
          return {
            ...m,
            courtId: courtId,
            status: 'em_andamento',
            startTime: m.startTime || timeStr
          };
        }
        return m;
      })
    );
  };

  const scheduleMatchTime = (matchId, courtId, startTime) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          return {
            ...m,
            courtId: courtId || m.courtId,
            startTime: startTime || m.startTime,
            status: m.status === 'em_andamento' ? 'em_andamento' : 'agendada'
          };
        }
        return m;
      })
    );
  };

  const unassignCourt = (courtId) => {
    const court = courts.find((c) => c.id === courtId);
    if (court && court.currentMatchId) {
      const matchId = court.currentMatchId;
      setMatches((prev) =>
        prev.map((m) =>
          m.id === matchId ? { ...m, courtId: null, status: 'agendada' } : m
        )
      );
    }
    setCourts((prev) =>
      prev.map((c) =>
        c.id === courtId ? { ...c, currentMatchId: null, status: 'livre' } : c
      )
    );
  };

  const unassignMatchFromCourt = (matchId) => {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return;

    if (match.courtId) {
      setCourts((prev) =>
        prev.map((c) =>
          c.id === match.courtId && c.currentMatchId === matchId
            ? { ...c, currentMatchId: null, status: 'livre' }
            : c
        )
      );
    }

    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              courtId: null,
              startTime: null,
              status: m.status === 'encerrada' ? 'encerrada' : 'agendada'
            }
          : m
      )
    );
  };

  const autoScheduleAllMatches = () => {
    if (courts.length === 0) {
      alert('Cadastre ao menos uma quadra para programar.');
      return;
    }

    const startMinutes = 8 * 60; // 08:00
    const interval = 45; // 45 minutos

    const courtSchedules = {};
    courts.forEach((c) => {
      courtSchedules[c.id] = startMinutes;
    });

    let courtIndex = 0;

    setMatches((prev) =>
      prev.map((m) => {
        if (m.status === 'encerrada') return m;

        const assignedCourt = courts[courtIndex % courts.length];
        const currentTimeMin = courtSchedules[assignedCourt.id];

        const hh = String(Math.floor(currentTimeMin / 60)).padStart(2, '0');
        const mm = String(currentTimeMin % 60).padStart(2, '0');
        const timeStr = `${hh}:${mm}`;

        courtSchedules[assignedCourt.id] += interval;
        courtIndex++;

        return {
          ...m,
          courtId: assignedCourt.id,
          startTime: timeStr,
          status: m.status === 'em_andamento' ? 'em_andamento' : 'agendada'
        };
      })
    );
  };

  const clearAllSchedule = () => {
    setMatches((prev) =>
      prev.map((m) =>
        m.status === 'encerrada'
          ? m
          : { ...m, courtId: null, startTime: null, status: 'agendada' }
      )
    );
    setCourts((prev) =>
      prev.map((c) => ({ ...c, currentMatchId: null, status: 'livre' }))
    );
  };

  // Atualizar a quantidade de quadras de acordo com a configuração
  const applyCourtCount = (count) => {
    const newCount = Math.max(1, Math.min(16, Number(count) || 4));
    setCourts((prevCourts) => {
      if (prevCourts.length === newCount) return prevCourts;
      if (prevCourts.length < newCount) {
        const added = [];
        for (let i = prevCourts.length + 1; i <= newCount; i++) {
          added.push({
            id: `court-${i}`,
            name: `Quadra ${i}`,
            surface: 'Areia / Poliesportiva',
            status: 'livre',
            currentMatchId: null
          });
        }
        return [...prevCourts, ...added];
      } else {
        return prevCourts.slice(0, newCount);
      }
    });
    setScheduleConfig((prev) => ({ ...prev, courtCount: newCount }));
  };

  // Gerar e distribuir horários automaticamente com base nas configurações
  const generateScheduleFromConfig = (config) => {
    const finalConfig = config || scheduleConfig;
    const { courtCount, matchDuration, startTime, endTime } = finalConfig;

    const targetCourtCount = Math.max(1, Number(courtCount) || 4);
    applyCourtCount(targetCourtCount);

    const [startH, startM] = (startTime || '08:00').split(':').map(Number);
    const startTotalMin = (startH || 8) * 60 + (startM || 0);

    const interval = Number(matchDuration) || 45;

    // Build active courts
    let targetCourts = courts;
    if (courts.length < targetCourtCount) {
      const added = [];
      for (let i = courts.length + 1; i <= targetCourtCount; i++) {
        added.push({
          id: `court-${i}`,
          name: `Quadra ${i}`,
          surface: 'Areia / Poliesportiva',
          status: 'livre',
          currentMatchId: null
        });
      }
      targetCourts = [...courts, ...added];
    } else {
      targetCourts = courts.slice(0, targetCourtCount);
    }

    const courtTrackers = {};
    targetCourts.forEach((c) => {
      courtTrackers[c.id] = startTotalMin;
    });

    let cIndex = 0;

    setMatches((prev) =>
      prev.map((m) => {
        if (m.status === 'encerrada') return m;

        const assignedCourt = targetCourts[cIndex % targetCourts.length];
        const currentMin = courtTrackers[assignedCourt.id];

        const hh = String(Math.floor(currentMin / 60)).padStart(2, '0');
        const mm = String(currentMin % 60).padStart(2, '0');
        const timeStr = `${hh}:${mm}`;

        courtTrackers[assignedCourt.id] += interval;
        cIndex++;

        return {
          ...m,
          courtId: assignedCourt.id,
          startTime: timeStr,
          status: m.status === 'em_andamento' ? 'em_andamento' : 'agendada'
        };
      })
    );
  };

  // Mover partida para outra quadra / horário
  const moveMatch = (matchId, newCourtId, newTime) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          return {
            ...m,
            courtId: newCourtId,
            startTime: newTime !== undefined ? newTime : m.startTime,
            status: m.status === 'em_andamento' && newCourtId !== m.courtId ? 'agendada' : m.status
          };
        }
        return m;
      })
    );
  };

  // Live Score Updates (1 Set até 6 games, 5x5 vai a 7, 6x6 tiebreak de 7)
  const updateMatchScore = (matchId, scoreData, currentPoints) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          return {
            ...m,
            score: {
              ...m.score,
              ...scoreData,
              currentPoints: currentPoints !== undefined ? currentPoints : m.score?.currentPoints
            }
          };
        }
        return m;
      })
    );
  };

  // Finish Match & Advance
  const finishMatch = (matchId, winnerId) => {
    const currentMatch = matches.find((m) => m.id === matchId);
    if (!currentMatch) return;

    const winnerTeam = teams.find((t) => t.id === winnerId);
    const winnerPlayers =
      winnerId === currentMatch.team1Id
        ? currentMatch.team1Players
        : currentMatch.team2Players;

    const loserId =
      winnerId === currentMatch.team1Id
        ? currentMatch.team2Id
        : currentMatch.team1Id;
    const loserTeam = teams.find((t) => t.id === loserId);
    const loserPlayers =
      loserId === currentMatch.team1Id
        ? currentMatch.team1Players
        : currentMatch.team2Players;

    // Update match
    setMatches((prev) => {
      // 1. Update this match and any linked nextMatch / thirdPlaceMatch
      let updated = prev.map((m) => {
        if (m.id === matchId) {
          return {
            ...m,
            status: 'encerrada',
            winnerId: winnerId,
            score: {
              ...m.score,
              currentPoints: 'Encerrado'
            }
          };
        }
        // Advance winner in knockout if linked directly
        if (m.id === currentMatch.nextMatchId) {
          const t1Id = currentMatch.nextMatchSlot === 1 ? winnerId : m.team1Id;
          const t2Id = currentMatch.nextMatchSlot === 2 ? winnerId : m.team2Id;
          const isReady = Boolean(t1Id && t2Id);
          return {
            ...m,
            team1Id: t1Id,
            team1Label: currentMatch.nextMatchSlot === 1 ? (winnerTeam?.name || 'Equipe') : m.team1Label,
            team1Players: currentMatch.nextMatchSlot === 1 ? (winnerPlayers || 'Jogadores') : m.team1Players,
            team2Id: t2Id,
            team2Label: currentMatch.nextMatchSlot === 2 ? (winnerTeam?.name || 'Equipe') : m.team2Label,
            team2Players: currentMatch.nextMatchSlot === 2 ? (winnerPlayers || 'Jogadores') : m.team2Players,
            status: isReady ? 'agendada' : m.status
          };
        }
        // Advance loser to 3rd place match if linked directly
        if (m.id === currentMatch.thirdPlaceMatchId) {
          const t1Id = currentMatch.thirdPlaceMatchSlot === 1 ? loserId : m.team1Id;
          const t2Id = currentMatch.thirdPlaceMatchSlot === 2 ? loserId : m.team2Id;
          const isReady = Boolean(t1Id && t2Id);
          return {
            ...m,
            team1Id: t1Id,
            team1Label: currentMatch.thirdPlaceMatchSlot === 1 ? (loserTeam?.name || 'Equipe') : m.team1Label,
            team1Players: currentMatch.thirdPlaceMatchSlot === 1 ? (loserPlayers || 'Jogadores') : m.team1Players,
            team2Id: t2Id,
            team2Label: currentMatch.thirdPlaceMatchSlot === 2 ? (loserTeam?.name || 'Equipe') : m.team2Label,
            team2Players: currentMatch.thirdPlaceMatchSlot === 2 ? (loserPlayers || 'Jogadores') : m.team2Players,
            status: isReady ? 'agendada' : m.status
          };
        }
        return m;
      });

      // 2. Check if this match was in group stage, and if all group matches for this category are finished
      if (currentMatch.stage === 'grupo') {
        const catGroupMatches = updated.filter(
          (m) => m.categoryId === currentMatch.categoryId && m.stage === 'grupo'
        );
        const allGroupMatchesFinished = catGroupMatches.length > 0 && catGroupMatches.every((m) => m.status === 'encerrada');

        if (allGroupMatchesFinished) {
          const catId = currentMatch.categoryId;
          const catAthletes = athletes.filter((a) => a.categoryId === catId);
          const groupNames = [...new Set(catGroupMatches.map((m) => m.groupName).filter(Boolean))];

          const calcGroupStandings = (gName) => {
            const gMatches = catGroupMatches.filter((m) => m.groupName === gName);
            const teamMap = {};
            gMatches.forEach((m) => {
              [m.team1Id, m.team2Id].forEach((tId) => {
                if (tId && !teamMap[tId]) {
                  const tObj = teams.find((t) => t.id === tId);
                  if (tObj) {
                    teamMap[tId] = { team: tObj, matchesPlayed: 0, wins: 0, losses: 0, gamesWon: 0, gamesLost: 0, gameDiff: 0, points: 0 };
                  }
                }
              });
            });
            gMatches.forEach((m) => {
              if (m.status === 'encerrada' && m.winnerId) {
                const t1 = teamMap[m.team1Id];
                const t2 = teamMap[m.team2Id];
                const g1 = Number(m.score?.gamesT1 ?? m.score?.set1?.[0] ?? 0);
                const g2 = Number(m.score?.gamesT2 ?? m.score?.set1?.[1] ?? 0);
                if (t1) {
                  t1.matchesPlayed += 1;
                  t1.gamesWon += g1;
                  t1.gamesLost += g2;
                  if (m.winnerId === m.team1Id) { t1.wins += 1; t1.points += 3; } else { t1.losses += 1; }
                }
                if (t2) {
                  t2.matchesPlayed += 1;
                  t2.gamesWon += g2;
                  t2.gamesLost += g1;
                  if (m.winnerId === m.team2Id) { t2.wins += 1; t2.points += 3; } else { t2.losses += 1; }
                }
              }
            });
            Object.values(teamMap).forEach((item) => { item.gameDiff = item.gamesWon - item.gamesLost; });
            return Object.values(teamMap).sort((a, b) => {
              if (b.wins !== a.wins) return b.wins - a.wins;
              if (b.gameDiff !== a.gameDiff) return b.gameDiff - a.gameDiff;
              return b.gamesWon - a.gamesWon;
            });
          };

          if (groupNames.length === 1) {
            const gName = groupNames[0];
            const standings = calcGroupStandings(gName);
            const top1 = standings[0]?.team;
            const top2 = standings[1]?.team;
            const top3 = standings[2]?.team;
            const top4 = standings[3]?.team;
            const t1Ath = top1 ? catAthletes.filter((a) => a.teamId === top1.id).map((a) => a.name).join(' & ') : '';
            const t2Ath = top2 ? catAthletes.filter((a) => a.teamId === top2.id).map((a) => a.name).join(' & ') : '';
            const t3Ath = top3 ? catAthletes.filter((a) => a.teamId === top3.id).map((a) => a.name).join(' & ') : '';
            const t4Ath = top4 ? catAthletes.filter((a) => a.teamId === top4.id).map((a) => a.name).join(' & ') : '';

            updated = updated.map((m) => {
              if (m.categoryId === catId && m.stage === 'mata_mata') {
                if (m.phase.toLowerCase().includes('final') && !m.phase.toLowerCase().includes('semi') && !m.phase.toLowerCase().includes('3') && top1 && top2) {
                  return {
                    ...m,
                    team1Id: top1.id,
                    team1Label: `1º ${gName}: ${top1.name}`,
                    team1Players: t1Ath || 'Dupla 1',
                    team2Id: top2.id,
                    team2Label: `2º ${gName}: ${top2.name}`,
                    team2Players: t2Ath || 'Dupla 2',
                    status: 'agendada'
                  };
                }
                if (m.phase.toLowerCase().includes('3') && top3 && top4) {
                  return {
                    ...m,
                    team1Id: top3.id,
                    team1Label: `3º ${gName}: ${top3.name}`,
                    team1Players: t3Ath || 'Dupla 3',
                    team2Id: top4.id,
                    team2Label: `4º ${gName}: ${top4.name}`,
                    team2Players: t4Ath || 'Dupla 4',
                    status: 'agendada'
                  };
                }
              }
              return m;
            });
          } else if (groupNames.length >= 2) {
            const standingsA = calcGroupStandings('Grupo A');
            const standingsB = calcGroupStandings('Grupo B');
            const top1A = standingsA[0]?.team;
            const top2A = standingsA[1]?.team;
            const top1B = standingsB[0]?.team;
            const top2B = standingsB[1]?.team;

            if (top1A && top2B && top1B && top2A) {
              const p1A = catAthletes.filter((a) => a.teamId === top1A.id).map((a) => a.name).join(' & ');
              const p2B = catAthletes.filter((a) => a.teamId === top2B.id).map((a) => a.name).join(' & ');
              const p1B = catAthletes.filter((a) => a.teamId === top1B.id).map((a) => a.name).join(' & ');
              const p2A = catAthletes.filter((a) => a.teamId === top2A.id).map((a) => a.name).join(' & ');

              updated = updated.map((m) => {
                if (m.categoryId === catId && m.stage === 'mata_mata') {
                  if (m.phase.includes('Semifinal 1')) {
                    return {
                      ...m,
                      team1Id: top1A.id,
                      team1Label: `1º A: ${top1A.name}`,
                      team1Players: p1A || 'Dupla 1',
                      team2Id: top2B.id,
                      team2Label: `2º B: ${top2B.name}`,
                      team2Players: p2B || 'Dupla 2',
                      status: 'agendada'
                    };
                  }
                  if (m.phase.includes('Semifinal 2')) {
                    return {
                      ...m,
                      team1Id: top1B.id,
                      team1Label: `1º B: ${top1B.name}`,
                      team1Players: p1B || 'Dupla 1',
                      team2Id: top2A.id,
                      team2Label: `2º A: ${top2A.name}`,
                      team2Players: p2A || 'Dupla 2',
                      status: 'agendada'
                    };
                  }
                }
                return m;
              });
            }
          }
        }
      }

      return updated;
    });

    // Free court
    if (currentMatch.courtId) {
      setCourts((prev) =>
        prev.map((c) =>
          c.id === currentMatch.courtId
            ? { ...c, currentMatchId: null, status: 'livre' }
            : c
        )
      );
    }
  };

  // -------------------------------------------------------------
  // LÓGICA DE SORTEIO E CHAVEAMENTO ALEATÓRIO (Fisher-Yates)
  // -------------------------------------------------------------
  const buildBracketMatchesForCategory = (catId) => {
    const catAthletes = athletes.filter((a) => a.categoryId === catId);
    const uniqueTeamIds = [...new Set(catAthletes.map((a) => a.teamId))];
    let participatingTeams = teams.filter((t) => uniqueTeamIds.includes(t.id));

    // Fallback: If no athletes registered yet, use all teams
    if (participatingTeams.length < 2) {
      participatingTeams = [...teams];
    }

    if (participatingTeams.length < 2) {
      return [];
    }

    // -------------------------------------------------------------
    // EMBARALHAMENTO 100% ALEATÓRIO A CADA CLIQUE (Fisher-Yates)
    // -------------------------------------------------------------
    const shuffledTeams = [...participatingTeams];
    for (let i = shuffledTeams.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledTeams[i], shuffledTeams[j]] = [shuffledTeams[j], shuffledTeams[i]];
    }

    const newMatches = [];
    const baseId = `match-${catId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const count = shuffledTeams.length;

    let groupBuckets = [];
    if (count < 4) {
      groupBuckets = [{ name: 'Grupo A', teams: shuffledTeams }];
    } else {
      const mid = Math.ceil(count / 2);
      groupBuckets = [
        { name: 'Grupo A', teams: shuffledTeams.slice(0, mid) },
        { name: 'Grupo B', teams: shuffledTeams.slice(mid) }
      ];
    }

    let matchCount = 1;

    // Generate round-robin matches for each group
    groupBuckets.forEach((grp) => {
      const gTeams = grp.teams;
      const groupPairs = [];
      for (let i = 0; i < gTeams.length; i++) {
        for (let j = i + 1; j < gTeams.length; j++) {
          groupPairs.push([gTeams[i], gTeams[j]]);
        }
      }

      // Embaralhar também a sequência dos jogos do grupo
      for (let i = groupPairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [groupPairs[i], groupPairs[j]] = [groupPairs[j], groupPairs[i]];
      }

      groupPairs.forEach(([t1, t2]) => {
        const t1Athletes = catAthletes.filter((a) => a.teamId === t1.id);
        const t2Athletes = catAthletes.filter((a) => a.teamId === t2.id);

        newMatches.push({
          id: `${baseId}-g-${matchCount}`,
          categoryId: catId,
          stage: 'grupo',
          groupName: grp.name,
          phase: `${grp.name} - Jogo ${matchCount}`,
          matchNumber: matchCount,
          team1Id: t1.id,
          team1Label: t1.name,
          team1Players: t1Athletes.map((a) => a.name).join(' & ') || 'Dupla 1',
          team2Id: t2.id,
          team2Label: t2.name,
          team2Players: t2Athletes.map((a) => a.name).join(' & ') || 'Dupla 2',
          courtId: null,
          status: 'agendada',
          startTime: null,
          score: { gamesT1: 0, gamesT2: 0, tiebreakT1: 0, tiebreakT2: 0, set1: [0, 0], team1Score: 0, team2Score: 0, currentPoints: '0-0' },
          winnerId: null,
          nextMatchId: null
        });
        matchCount++;
      });
    });

    // Generate Knockout Stage
    if (groupBuckets.length === 1) {
      // 1 single group -> Top 2 go to Grande Final, 3º e 4º disputam 3º e 4º Lugar
      newMatches.push({
        id: `${baseId}-fin`,
        categoryId: catId,
        stage: 'mata_mata',
        groupName: null,
        phase: 'Grande Final',
        round: 2,
        matchNumber: matchCount++,
        team1Id: null,
        team1Label: '1º Colocado Grupo A',
        team1Players: 'A definir',
        team2Id: null,
        team2Label: '2º Colocado Grupo A',
        team2Players: 'A definir',
        courtId: null,
        status: 'pendente',
        startTime: null,
        score: { gamesT1: 0, gamesT2: 0, tiebreakT1: 0, tiebreakT2: 0, set1: [0, 0], team1Score: 0, team2Score: 0, currentPoints: '0-0' },
        winnerId: null,
        nextMatchId: null
      });

      newMatches.push({
        id: `${baseId}-3rd`,
        categoryId: catId,
        stage: 'mata_mata',
        groupName: null,
        phase: 'Decisão de 3º e 4º Lugar',
        round: 2,
        matchNumber: matchCount++,
        team1Id: null,
        team1Label: '3º Colocado Grupo A',
        team1Players: 'A definir',
        team2Id: null,
        team2Label: '4º Colocado Grupo A',
        team2Players: 'A definir',
        courtId: null,
        status: 'pendente',
        startTime: null,
        score: { gamesT1: 0, gamesT2: 0, tiebreakT1: 0, tiebreakT2: 0, set1: [0, 0], team1Score: 0, team2Score: 0, currentPoints: '0-0' },
        winnerId: null,
        nextMatchId: null
      });
    } else {
      // 2 groups (Grupo A e Grupo B) -> Semifinais + Disputa de 3º e 4º + Grande Final
      const semi1Id = `${baseId}-s1`;
      const semi2Id = `${baseId}-s2`;
      const thirdPlaceId = `${baseId}-3rd`;
      const finalId = `${baseId}-fin`;

      newMatches.push({
        id: semi1Id,
        categoryId: catId,
        stage: 'mata_mata',
        groupName: null,
        phase: 'Semifinal 1 (1º A x 2º B)',
        round: 1,
        matchNumber: matchCount++,
        team1Id: null,
        team1Label: '1º Grupo A',
        team1Players: 'A definir',
        team2Id: null,
        team2Label: '2º Grupo B',
        team2Players: 'A definir',
        courtId: null,
        status: 'pendente',
        startTime: null,
        score: { gamesT1: 0, gamesT2: 0, tiebreakT1: 0, tiebreakT2: 0, set1: [0, 0], team1Score: 0, team2Score: 0, currentPoints: '0-0' },
        winnerId: null,
        nextMatchId: finalId,
        nextMatchSlot: 1,
        thirdPlaceMatchId: thirdPlaceId,
        thirdPlaceMatchSlot: 1
      });

      newMatches.push({
        id: semi2Id,
        categoryId: catId,
        stage: 'mata_mata',
        groupName: null,
        phase: 'Semifinal 2 (1º B x 2º A)',
        round: 1,
        matchNumber: matchCount++,
        team1Id: null,
        team1Label: '1º Grupo B',
        team1Players: 'A definir',
        team2Id: null,
        team2Label: '2º Grupo A',
        team2Players: 'A definir',
        courtId: null,
        status: 'pendente',
        startTime: null,
        score: { gamesT1: 0, gamesT2: 0, tiebreakT1: 0, tiebreakT2: 0, set1: [0, 0], team1Score: 0, team2Score: 0, currentPoints: '0-0' },
        winnerId: null,
        nextMatchId: finalId,
        nextMatchSlot: 2,
        thirdPlaceMatchId: thirdPlaceId,
        thirdPlaceMatchSlot: 2
      });

      newMatches.push({
        id: thirdPlaceId,
        categoryId: catId,
        stage: 'mata_mata',
        groupName: null,
        phase: 'Decisão de 3º e 4º Lugar',
        round: 2,
        matchNumber: matchCount++,
        team1Id: null,
        team1Label: 'Perd. Semifinal 1',
        team1Players: 'A definir',
        team2Id: null,
        team2Label: 'Perd. Semifinal 2',
        team2Players: 'A definir',
        courtId: null,
        status: 'pendente',
        startTime: null,
        score: { gamesT1: 0, gamesT2: 0, tiebreakT1: 0, tiebreakT2: 0, set1: [0, 0], team1Score: 0, team2Score: 0, currentPoints: '0-0' },
        winnerId: null,
        nextMatchId: null
      });

      newMatches.push({
        id: finalId,
        categoryId: catId,
        stage: 'mata_mata',
        groupName: null,
        phase: 'Grande Final',
        round: 2,
        matchNumber: matchCount++,
        team1Id: null,
        team1Label: 'Venc. Semifinal 1',
        team1Players: 'A definir',
        team2Id: null,
        team2Label: 'Venc. Semifinal 2',
        team2Players: 'A definir',
        courtId: null,
        status: 'pendente',
        startTime: null,
        score: { gamesT1: 0, gamesT2: 0, tiebreakT1: 0, tiebreakT2: 0, set1: [0, 0], team1Score: 0, team2Score: 0, currentPoints: '0-0' },
        winnerId: null,
        nextMatchId: null
      });
    }

    return newMatches;
  };

  // Gerar chaveamento aleatório para uma categoria específica
  const generateBracketForCategory = (catId) => {
    const newMatches = buildBracketMatchesForCategory(catId);
    if (newMatches.length === 0) return;

    // Desvincular quadras alocadas a partidas desta categoria
    const catMatches = matches.filter((m) => m.categoryId === catId);
    const catMatchIds = catMatches.map((m) => m.id);
    const updatedCourts = courts.map((c) => {
      if (c.currentMatchId && catMatchIds.includes(c.currentMatchId)) {
        return { ...c, status: 'livre', currentMatchId: null, startTime: null };
      }
      return c;
    });
    setCourts(updatedCourts);

    setMatches((prev) => {
      const updated = [
        ...prev.filter((m) => m.categoryId !== catId),
        ...newMatches
      ];
      try {
        localStorage.setItem(`${STORAGE_KEY}_matches`, JSON.stringify(updated));
        localStorage.setItem(`${STORAGE_KEY}_courts`, JSON.stringify(updatedCourts));
      } catch (e) {}
      return updated;
    });
  };

  // Gerar sorteio aleatório em todas as categorias de uma vez
  const generateAllBrackets = () => {
    let allGenerated = [];
    categories.forEach((cat) => {
      const catMatches = buildBracketMatchesForCategory(cat.id);
      allGenerated = [...allGenerated, ...catMatches];
    });

    if (allGenerated.length === 0) return;

    // Liberar todas as quadras
    const updatedCourts = courts.map((c) => ({
      ...c,
      status: 'livre',
      currentMatchId: null,
      startTime: null
    }));

    setMatches(allGenerated);
    setCourts(updatedCourts);
    try {
      localStorage.setItem(`${STORAGE_KEY}_matches`, JSON.stringify(allGenerated));
      localStorage.setItem(`${STORAGE_KEY}_courts`, JSON.stringify(updatedCourts));
    } catch (e) {}
  };

  // Calcular Tabela de Classificação de um Grupo
  const getGroupStandings = (catId, groupName) => {
    const groupMatches = matches.filter(
      (m) => m.categoryId === catId && m.stage === 'grupo' && m.groupName === groupName
    );

    // Identify teams in this group
    const teamMap = {};
    groupMatches.forEach((m) => {
      if (m.team1Id && !teamMap[m.team1Id]) {
        const teamObj = teams.find((t) => t.id === m.team1Id);
        if (teamObj) {
          teamMap[m.team1Id] = {
            team: teamObj,
            matchesPlayed: 0,
            wins: 0,
            losses: 0,
            gamesWon: 0,
            gamesLost: 0,
            gameDiff: 0,
            points: 0
          };
        }
      }
      if (m.team2Id && !teamMap[m.team2Id]) {
        const teamObj = teams.find((t) => t.id === m.team2Id);
        if (teamObj) {
          teamMap[m.team2Id] = {
            team: teamObj,
            matchesPlayed: 0,
            wins: 0,
            losses: 0,
            gamesWon: 0,
            gamesLost: 0,
            gameDiff: 0,
            points: 0
          };
        }
      }
    });

    // Compute stats from finished matches
    groupMatches.forEach((m) => {
      if (m.status === 'encerrada' && m.winnerId) {
        const t1 = teamMap[m.team1Id];
        const t2 = teamMap[m.team2Id];
        const g1 = Number(m.score?.gamesT1 ?? m.score?.set1?.[0] ?? 0);
        const g2 = Number(m.score?.gamesT2 ?? m.score?.set1?.[1] ?? 0);

        if (t1) {
          t1.matchesPlayed += 1;
          t1.gamesWon += g1;
          t1.gamesLost += g2;
          if (m.winnerId === m.team1Id) {
            t1.wins += 1;
            t1.points += 3;
          } else {
            t1.losses += 1;
          }
        }

        if (t2) {
          t2.matchesPlayed += 1;
          t2.gamesWon += g2;
          t2.gamesLost += g1;
          if (m.winnerId === m.team2Id) {
            t2.wins += 1;
            t2.points += 3;
          } else {
            t2.losses += 1;
          }
        }
      }
    });

    // Calculate gameDiff
    Object.values(teamMap).forEach((item) => {
      item.gameDiff = item.gamesWon - item.gamesLost;
    });

    // Sort order: Wins desc, gameDiff desc, gamesWon desc
    return Object.values(teamMap).sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.gameDiff !== a.gameDiff) return b.gameDiff - a.gameDiff;
      return b.gamesWon - a.gamesWon;
    });
  };

  // Avançar Classificados (Top 2 de cada grupo) para o Mata-Mata
  const advanceGroupQualifiersToKnockout = (catId) => {
    const catMatches = matches.filter((m) => m.categoryId === catId);
    const groupMatches = catMatches.filter((m) => m.stage === 'grupo');
    const groupNames = [...new Set(groupMatches.map((m) => m.groupName))];

    if (groupNames.length === 0) {
      alert('Nenhum grupo encontrado.');
      return;
    }

    const catAthletes = athletes.filter((a) => a.categoryId === catId);

    if (groupNames.length === 1) {
      const gName = groupNames[0];
      const standings = getGroupStandings(catId, gName);
      if (standings.length < 2) {
        alert('É necessário ter ao menos 2 equipes no grupo.');
        return;
      }
      const top1 = standings[0].team;
      const top2 = standings[1].team;
      const top3 = standings[2]?.team;
      const top4 = standings[3]?.team;
      const t1Athletes = catAthletes.filter((a) => a.teamId === top1.id).map((a) => a.name).join(' & ');
      const t2Athletes = catAthletes.filter((a) => a.teamId === top2.id).map((a) => a.name).join(' & ');
      const t3Athletes = top3 ? catAthletes.filter((a) => a.teamId === top3.id).map((a) => a.name).join(' & ') : '';
      const t4Athletes = top4 ? catAthletes.filter((a) => a.teamId === top4.id).map((a) => a.name).join(' & ') : '';

      // Find final and 3rd/4th matches
      setMatches((prev) =>
        prev.map((m) => {
          if (m.categoryId === catId && m.stage === 'mata_mata') {
            if (m.phase.toLowerCase().includes('final') && !m.phase.toLowerCase().includes('semi') && !m.phase.toLowerCase().includes('3')) {
              return {
                ...m,
                team1Id: top1.id,
                team1Label: `1º ${gName}: ${top1.name}`,
                team1Players: t1Athletes || 'Dupla 1',
                team2Id: top2.id,
                team2Label: `2º ${gName}: ${top2.name}`,
                team2Players: t2Athletes || 'Dupla 2',
                status: 'agendada'
              };
            }
            if (m.phase.toLowerCase().includes('3') && top3 && top4) {
              return {
                ...m,
                team1Id: top3.id,
                team1Label: `3º ${gName}: ${top3.name}`,
                team1Players: t3Athletes || 'Dupla 3',
                team2Id: top4.id,
                team2Label: `4º ${gName}: ${top4.name}`,
                team2Players: t4Athletes || 'Dupla 4',
                status: 'agendada'
              };
            }
          }
          return m;
        })
      );
      alert(`Classificados do ${gName} avançados para a Grande Final e Decisão de 3º e 4º Lugar!`);
    } else if (groupNames.length >= 2) {
      // Grupo A e Grupo B
      const standingsA = getGroupStandings(catId, 'Grupo A');
      const standingsB = getGroupStandings(catId, 'Grupo B');

      if (standingsA.length < 2 || standingsB.length < 2) {
        alert('Ambos os grupos devem ter ao menos 2 equipes.');
        return;
      }

      const top1A = standingsA[0].team;
      const top2A = standingsA[1].team;
      const top1B = standingsB[0].team;
      const top2B = standingsB[1].team;

      setMatches((prev) =>
        prev.map((m) => {
          if (m.categoryId === catId && m.stage === 'mata_mata') {
            if (m.phase.includes('Semifinal 1')) {
              const p1 = catAthletes.filter((a) => a.teamId === top1A.id).map((a) => a.name).join(' & ');
              const p2 = catAthletes.filter((a) => a.teamId === top2B.id).map((a) => a.name).join(' & ');
              return {
                ...m,
                team1Id: top1A.id,
                team1Label: `1º A: ${top1A.name}`,
                team1Players: p1 || 'Dupla 1',
                team2Id: top2B.id,
                team2Label: `2º B: ${top2B.name}`,
                team2Players: p2 || 'Dupla 2',
                status: 'agendada'
              };
            }
            if (m.phase.includes('Semifinal 2')) {
              const p1 = catAthletes.filter((a) => a.teamId === top1B.id).map((a) => a.name).join(' & ');
              const p2 = catAthletes.filter((a) => a.teamId === top2A.id).map((a) => a.name).join(' & ');
              return {
                ...m,
                team1Id: top1B.id,
                team1Label: `1º B: ${top1B.name}`,
                team1Players: p1 || 'Dupla 1',
                team2Id: top2A.id,
                team2Label: `2º A: ${top2A.name}`,
                team2Players: p2 || 'Dupla 2',
                status: 'agendada'
              };
            }
          }
          return m;
        })
      );
      alert('Classificados de ambos os grupos avançados para as Semifinais!');
    }
  };

  // Standings Calculation Engine (Classificação Geral de Equipes)
  const calculateStandings = () => {
    const teamStats = {};
    teams.forEach((team) => {
      teamStats[team.id] = {
        team: team,
        totalPoints: 0,
        matchWins: 0,
        gold: 0,
        silver: 0,
        bronze: 0,
        categoryResults: {}
      };
    });

    // Points from individual match wins (Bonus)
    matches.forEach((m) => {
      if (m.status === 'encerrada' && m.winnerId && teamStats[m.winnerId]) {
        teamStats[m.winnerId].matchWins += 1;
        teamStats[m.winnerId].totalPoints += Number(scoringRules.bonusPerMatchWin || 0);
      }
    });

    const isThirdPlaceMatch = (phase = '') => {
      const low = phase.toLowerCase();
      return low.includes('3º') || low.includes('3o') || low.includes('terceiro') || low.includes('3°') || low.includes('bronze');
    };

    // Category placements
    categories.forEach((cat) => {
      const catMatches = matches.filter((m) => m.categoryId === cat.id);
      if (catMatches.length === 0) return;

      const finalMatch = catMatches.find(
        (m) => m.phase.toLowerCase().includes('final') && !m.phase.toLowerCase().includes('semi') && !isThirdPlaceMatch(m.phase)
      );

      if (finalMatch && finalMatch.status === 'encerrada' && finalMatch.winnerId) {
        const winnerId = finalMatch.winnerId;
        const runnerUpId =
          winnerId === finalMatch.team1Id ? finalMatch.team2Id : finalMatch.team1Id;

        // Champion
        if (teamStats[winnerId]) {
          teamStats[winnerId].gold += 1;
          teamStats[winnerId].totalPoints += Number(scoringRules.firstPlace || 0);
          teamStats[winnerId].categoryResults[cat.id] = {
            position: '1º Lugar (Campeão)',
            points: Number(scoringRules.firstPlace || 0)
          };
        }

        // Runner up
        if (runnerUpId && teamStats[runnerUpId]) {
          teamStats[runnerUpId].silver += 1;
          teamStats[runnerUpId].totalPoints += Number(scoringRules.secondPlace || 0);
          teamStats[runnerUpId].categoryResults[cat.id] = {
            position: '2º Lugar (Vice)',
            points: Number(scoringRules.secondPlace || 0)
          };
        }
      }

      // Check 3º e 4º Lugar match
      const thirdPlaceMatch = catMatches.find((m) => isThirdPlaceMatch(m.phase));

      if (thirdPlaceMatch && thirdPlaceMatch.status === 'encerrada' && thirdPlaceMatch.winnerId) {
        const bronzeWinnerId = thirdPlaceMatch.winnerId;
        const fourthPlaceId =
          bronzeWinnerId === thirdPlaceMatch.team1Id ? thirdPlaceMatch.team2Id : thirdPlaceMatch.team1Id;

        if (bronzeWinnerId && teamStats[bronzeWinnerId]) {
          teamStats[bronzeWinnerId].bronze += 1;
          teamStats[bronzeWinnerId].totalPoints += Number(scoringRules.thirdPlace || 0);
          teamStats[bronzeWinnerId].categoryResults[cat.id] = {
            position: '3º Lugar (Bronze)',
            points: Number(scoringRules.thirdPlace || 0)
          };
        }

        if (fourthPlaceId && teamStats[fourthPlaceId]) {
          teamStats[fourthPlaceId].totalPoints += Number(scoringRules.fourthPlace || 0);
          teamStats[fourthPlaceId].categoryResults[cat.id] = {
            position: '4º Lugar',
            points: Number(scoringRules.fourthPlace || 0)
          };
        }
      } else {
        // Fallback to Semifinals losers if 3rd place match is not yet finished
        const semiMatches = catMatches.filter((m) =>
          m.phase.toLowerCase().includes('semi')
        );
        semiMatches.forEach((semi) => {
          if (semi.status === 'encerrada' && semi.winnerId) {
            const loserId =
              semi.winnerId === semi.team1Id ? semi.team2Id : semi.team1Id;
            if (loserId && teamStats[loserId] && !teamStats[loserId].categoryResults[cat.id]) {
              teamStats[loserId].bronze += 1;
              teamStats[loserId].totalPoints += Number(scoringRules.thirdPlace || 0);
              teamStats[loserId].categoryResults[cat.id] = {
                position: 'Semifinalista (3º/4º)',
                points: Number(scoringRules.thirdPlace || 0)
              };
            }
          }
        });
      }
    });

    return Object.values(teamStats).sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.gold !== a.gold) return b.gold - a.gold;
      if (b.silver !== a.silver) return b.silver - a.silver;
      return b.matchWins - a.matchWins;
    });
  };

  // Classificação Consolidada Por Categoria
  const getCategoryStandings = (catId) => {
    const catMatches = matches.filter((m) => m.categoryId === catId);
    const catAthletes = athletes.filter((a) => a.categoryId === catId);
    const catTeamIds = [...new Set(catAthletes.map((a) => a.teamId))];
    
    // Include teams from matches
    catMatches.forEach((m) => {
      if (m.team1Id) catTeamIds.push(m.team1Id);
      if (m.team2Id) catTeamIds.push(m.team2Id);
    });
    const uniqueTeamIds = [...new Set(catTeamIds.filter(Boolean))];

    const categoryStats = {};
    uniqueTeamIds.forEach((tId) => {
      const teamObj = teams.find((t) => t.id === tId);
      if (!teamObj) return;
      const teamAthletes = catAthletes.filter((a) => a.teamId === tId);
      categoryStats[tId] = {
        team: teamObj,
        athletes: teamAthletes.map((a) => a.name).join(' & ') || 'Atletas inscritos',
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        gamesWon: 0,
        gamesLost: 0,
        gameDiff: 0,
        placement: 'Fase de Grupos',
        points: 0,
        badge: '',
        gold: 0,
        silver: 0,
        bronze: 0
      };
    });

    // Compute stats from finished matches in this category
    catMatches.forEach((m) => {
      if (m.status === 'encerrada' && m.winnerId) {
        const t1 = categoryStats[m.team1Id];
        const t2 = categoryStats[m.team2Id];
        const g1 = Number(m.score?.gamesT1 ?? m.score?.set1?.[0] ?? 0);
        const g2 = Number(m.score?.gamesT2 ?? m.score?.set1?.[1] ?? 0);

        if (t1) {
          t1.matchesPlayed += 1;
          t1.gamesWon += g1;
          t1.gamesLost += g2;
          if (m.winnerId === m.team1Id) {
            t1.wins += 1;
            t1.points += Number(scoringRules.bonusPerMatchWin || 5);
          } else {
            t1.losses += 1;
          }
        }

        if (t2) {
          t2.matchesPlayed += 1;
          t2.gamesWon += g2;
          t2.gamesLost += g1;
          if (m.winnerId === m.team2Id) {
            t2.wins += 1;
            t2.points += Number(scoringRules.bonusPerMatchWin || 5);
          } else {
            t2.losses += 1;
          }
        }
      }
    });

    const isThirdPlaceMatch = (phase = '') => {
      const low = phase.toLowerCase();
      return low.includes('3º') || low.includes('3o') || low.includes('terceiro') || low.includes('3°') || low.includes('bronze');
    };

    // Check final placements
    const finalMatch = catMatches.find(
      (m) => m.stage === 'mata_mata' && m.phase.toLowerCase().includes('final') && !m.phase.toLowerCase().includes('semi') && !isThirdPlaceMatch(m.phase)
    );
    const thirdMatch = catMatches.find(
      (m) => m.stage === 'mata_mata' && isThirdPlaceMatch(m.phase)
    );

    if (finalMatch && finalMatch.status === 'encerrada' && finalMatch.winnerId) {
      const champId = finalMatch.winnerId;
      const viceId = champId === finalMatch.team1Id ? finalMatch.team2Id : finalMatch.team1Id;
      if (categoryStats[champId]) {
        categoryStats[champId].placement = 'Campeão (1º Lugar)';
        categoryStats[champId].badge = '🥇';
        categoryStats[champId].gold = 1;
        categoryStats[champId].points += Number(scoringRules.firstPlace || 100);
      }
      if (viceId && categoryStats[viceId]) {
        categoryStats[viceId].placement = 'Vice-Campeão (2º Lugar)';
        categoryStats[viceId].badge = '🥈';
        categoryStats[viceId].silver = 1;
        categoryStats[viceId].points += Number(scoringRules.secondPlace || 70);
      }
    }

    if (thirdMatch && thirdMatch.status === 'encerrada' && thirdMatch.winnerId) {
      const thirdId = thirdMatch.winnerId;
      const fourthId = thirdId === thirdMatch.team1Id ? thirdMatch.team2Id : thirdMatch.team1Id;
      if (categoryStats[thirdId]) {
        categoryStats[thirdId].placement = '3º Lugar (Bronze)';
        categoryStats[thirdId].badge = '🥉';
        categoryStats[thirdId].bronze = 1;
        categoryStats[thirdId].points += Number(scoringRules.thirdPlace || 50);
      }
      if (fourthId && categoryStats[fourthId]) {
        categoryStats[fourthId].placement = '4º Lugar';
        categoryStats[fourthId].badge = '4º';
        categoryStats[fourthId].points += Number(scoringRules.fourthPlace || 35);
      }
    }

    Object.values(categoryStats).forEach((item) => {
      item.gameDiff = item.gamesWon - item.gamesLost;
    });

    return Object.values(categoryStats).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gold !== a.gold) return b.gold - a.gold;
      if (b.silver !== a.silver) return b.silver - a.silver;
      if (b.bronze !== a.bronze) return b.bronze - a.bronze;
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.gameDiff !== a.gameDiff) return b.gameDiff - a.gameDiff;
      return b.gamesWon - a.gamesWon;
    });
  };

  const generalStandings = calculateStandings();

  // Reset to Mock Tournament
  const resetToDefault = () => {
    if (window.confirm('Deseja carregar o Torneio Demonstração padrão?')) {
      setTeams(initialTeams);
      setCategories(initialCategories);
      setAthletes(initialAthletes);
      setCourts(initialCourts);
      setMatches(initialMatches);
      setScoringRules(initialScoringRules);
    }
  };

  // Reset a specific category: Cancel generated bracket, zero results and re-enable bracket generation
  const resetCategory = (catId) => {
    const catMatches = matches.filter((m) => m.categoryId === catId);
    const catMatchIds = catMatches.map((m) => m.id);

    // Cancel bracket by removing all matches for this category
    const updatedMatches = matches.filter((m) => m.categoryId !== catId);

    // Free any court assigned to a match of this category
    const updatedCourts = courts.map((c) => {
      if (c.currentMatchId && catMatchIds.includes(c.currentMatchId)) {
        return { ...c, status: 'livre', currentMatchId: null, startTime: null };
      }
      return c;
    });

    setMatches(updatedMatches);
    setCourts(updatedCourts);

    try {
      localStorage.setItem(`${STORAGE_KEY}_matches`, JSON.stringify(updatedMatches));
      localStorage.setItem(`${STORAGE_KEY}_courts`, JSON.stringify(updatedCourts));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  };

  // Reset entire event: Cancel all brackets, erase all results and re-enable bracket generation for all categories
  const resetEvent = () => {
    const updatedMatches = [];

    const updatedCourts = courts.map((c) => ({
      ...c,
      status: 'livre',
      currentMatchId: null,
      startTime: null
    }));

    setMatches(updatedMatches);
    setCourts(updatedCourts);

    try {
      localStorage.setItem(`${STORAGE_KEY}_matches`, JSON.stringify(updatedMatches));
      localStorage.setItem(`${STORAGE_KEY}_courts`, JSON.stringify(updatedCourts));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  };

  // Clear all tournament data
  const clearAllData = () => {
    if (window.confirm('Atenção: deseja zerar todos os dados do torneio?')) {
      setTeams([]);
      setCategories([]);
      setAthletes([]);
      setCourts([
        { id: 'court-1', name: 'Quadra 1', surface: 'Areia', status: 'livre', currentMatchId: null },
        { id: 'court-2', name: 'Quadra 2', surface: 'Areia', status: 'livre', currentMatchId: null }
      ]);
      setMatches([]);
    }
  };

  // Export JSON
  const exportData = () => {
    const data = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      teams,
      categories,
      athletes,
      courts,
      matches,
      scoringRules
    };
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `torneio-equipes-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const importData = (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.teams) setTeams(parsed.teams);
      if (parsed.categories) setCategories(parsed.categories);
      if (parsed.athletes) setAthletes(parsed.athletes);
      if (parsed.courts) setCourts(parsed.courts);
      if (parsed.matches) setMatches(parsed.matches);
      if (parsed.scoringRules) setScoringRules(parsed.scoringRules);
      alert('Dados importados com sucesso!');
    } catch (err) {
      alert('Erro ao importar JSON. Verifique o formato do arquivo.');
    }
  };

  return (
    <TournamentContext.Provider
      value={{
        teams,
        addTeam,
        updateTeam,
        deleteTeam,

        categories,
        addCategory,
        updateCategory,
        deleteCategory,

        athletes,
        addAthlete,
        updateAthlete,
        deleteAthlete,

        courts,
        addCourt,
        updateCourt,
        deleteCourt,

        matches,
        assignMatchToCourt,
        scheduleMatchTime,
        autoScheduleAllMatches,
        clearAllSchedule,
        applyCourtCount,
        generateScheduleFromConfig,
        moveMatch,
        unassignCourt,
        unassignMatchFromCourt,
        updateMatchScore,
        finishMatch,
        generateBracketForCategory,
        generateAllBrackets,
        getGroupStandings,
        advanceGroupQualifiersToKnockout,
        getCategoryStandings,

        scheduleConfig,
        setScheduleConfig,

        scoringRules,
        setScoringRules,

        generalStandings,

        activeTab,
        setActiveTab,

        selectedCategoryId,
        setSelectedCategoryId,

        scoreModalMatch,
        setScoreModalMatch,

        assignCourtData,
        setAssignCourtData,

        teamManageCategoryModal,
        setTeamManageCategoryModal,

        coachLineupMatch,
        setCoachLineupMatch,
        saveMatchLineup,
        updateSeriesGameScore,

        resetToDefault,
        resetCategory,
        resetEvent,
        clearAllData,
        exportData,
        importData
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
