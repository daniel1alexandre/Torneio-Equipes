import React, { useState, useEffect } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  X,
  Trophy,
  CheckCircle2,
  Flame,
  AlertCircle,
  Layers,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  RotateCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ScoreModalContent = () => {
  const {
    scoreModalMatch,
    setScoreModalMatch,
    teams,
    categories,
    updateMatchScore,
    updateSeriesGameScore,
    finishMatch
  } = useTournament();

  const match = scoreModalMatch;
  const team1 = teams.find((t) => t.id === match?.team1Id);
  const team2 = teams.find((t) => t.id === match?.team2Id);
  const category = categories.find((c) => c.id === match?.categoryId);

  // Confronto MD3 (6 Atletas)
  const isBestOf3 = Array.isArray(match?.games) && match.games.length === 3;
  const games = match?.games || [];

  // Wins calculation
  const winsT1 = match?.seriesScore?.winsT1 ?? 0;
  const winsT2 = match?.seriesScore?.winsT2 ?? 0;

  // Active game tab for MD3 (1, 2, or 3)
  const defaultTab = () => {
    if (!isBestOf3) return 1;
    if (games[0]?.status !== 'encerrada') return 1;
    if (games[1]?.status !== 'encerrada') return 2;
    if (winsT1 === 1 && winsT2 === 1 && games[2]?.status !== 'encerrada') return 3;
    return 1;
  };

  const [activeGameOrder, setActiveGameOrder] = useState(defaultTab());

  // Active game details
  const activeGame = isBestOf3 ? games.find((g) => g.order === activeGameOrder) : null;

  // Local state for current active game scoring
  const initialG1 = isBestOf3
    ? activeGame?.score?.gamesT1 ?? 0
    : match?.score?.gamesT1 ?? match?.score?.set1?.[0] ?? 0;
  const initialG2 = isBestOf3
    ? activeGame?.score?.gamesT2 ?? 0
    : match?.score?.gamesT2 ?? match?.score?.set1?.[1] ?? 0;
  const initialTB1 = isBestOf3 ? activeGame?.score?.tiebreakT1 ?? 0 : match?.score?.tiebreakT1 ?? 0;
  const initialTB2 = isBestOf3 ? activeGame?.score?.tiebreakT2 ?? 0 : match?.score?.tiebreakT2 ?? 0;

  const [gamesT1, setGamesT1] = useState(initialG1);
  const [gamesT2, setGamesT2] = useState(initialG2);
  const [tiebreakT1, setTiebreakT1] = useState(initialTB1);
  const [tiebreakT2, setTiebreakT2] = useState(initialTB2);
  const [selectedWinnerId, setSelectedWinnerId] = useState(
    isBestOf3 ? activeGame?.winnerTeamId || '' : match?.winnerId || ''
  );

  // Sync inputs whenever switching tabs in MD3
  useEffect(() => {
    if (isBestOf3) {
      const g = games.find((item) => item.order === activeGameOrder);
      if (g) {
        setGamesT1(g.score?.gamesT1 ?? 0);
        setGamesT2(g.score?.gamesT2 ?? 0);
        setTiebreakT1(g.score?.tiebreakT1 ?? 0);
        setTiebreakT2(g.score?.tiebreakT2 ?? 0);
        setSelectedWinnerId(g.winnerTeamId || '');
      }
    }
  }, [activeGameOrder, match?.games]);

  // Check if tiebreak is active (6x6 or 7x6 / 6x7)
  const isTiebreakActive =
    (Number(gamesT1) === 6 && Number(gamesT2) === 6) ||
    (Number(gamesT1) === 7 && Number(gamesT2) === 6) ||
    (Number(gamesT1) === 6 && Number(gamesT2) === 7);

  // Auto-detect winner based on tennis/beach tennis standard rules
  useEffect(() => {
    const g1 = Number(gamesT1);
    const g2 = Number(gamesT2);
    const tb1 = Number(tiebreakT1);
    const tb2 = Number(tiebreakT2);

    if (!match) return;

    if (g1 === 7 && g2 === 5) {
      setSelectedWinnerId(match.team1Id);
    } else if (g2 === 7 && g1 === 5) {
      setSelectedWinnerId(match.team2Id);
    } else if (g1 === 6 && g2 <= 4) {
      setSelectedWinnerId(match.team1Id);
    } else if (g2 === 6 && g1 <= 4) {
      setSelectedWinnerId(match.team2Id);
    } else if (g1 === 7 && g2 === 6 && tb1 >= 7 && tb1 - tb2 >= 2) {
      setSelectedWinnerId(match.team1Id);
    } else if (g2 === 7 && g1 === 6 && tb2 >= 7 && tb2 - tb1 >= 2) {
      setSelectedWinnerId(match.team2Id);
    }
  }, [gamesT1, gamesT2, tiebreakT1, tiebreakT2, match]);

  // Save score for active game in MD3
  const handleSaveActiveGame = (markAsFinished = false) => {
    if (!match) return;

    let gameWinner = selectedWinnerId;
    const g1 = Number(gamesT1);
    const g2 = Number(gamesT2);

    if (markAsFinished && !gameWinner) {
      if (g1 > g2) gameWinner = match.team1Id;
      else if (g2 > g1) gameWinner = match.team2Id;
      else {
        alert('Selecione a equipe vencedora do jogo ou informe um placar conclusivo (ex: 6x4, 6x3, 7x6).');
        return;
      }
    }

    if (isBestOf3) {
      updateSeriesGameScore(match.id, activeGameOrder, {
        gamesT1: g1,
        gamesT2: g2,
        tiebreakT1: Number(tiebreakT1),
        tiebreakT2: Number(tiebreakT2),
        winnerTeamId: markAsFinished ? gameWinner : (selectedWinnerId || null)
      });

      // Se jogo 1 encerrou e jogo 2 não começou, avançar aba
      if (markAsFinished && activeGameOrder === 1) {
        setActiveGameOrder(2);
      } else if (markAsFinished && activeGameOrder === 2 && winsT1 + (gameWinner === match.team1Id ? 1 : 0) === 1 && winsT2 + (gameWinner === match.team2Id ? 1 : 0) === 1) {
        setActiveGameOrder(3);
      }
    } else {
      // Regular single set fallback
      updateMatchScore(
        match.id,
        {
          gamesT1: g1,
          gamesT2: g2,
          tiebreakT1: Number(tiebreakT1),
          tiebreakT2: Number(tiebreakT2),
          set1: [g1, g2]
        },
        `${g1}x${g2}`
      );
      if (markAsFinished) {
        finishMatch(match.id, gameWinner);
        setScoreModalMatch(null);
      }
    }
  };

  const handleFinishFullConfrontation = (winnerId) => {
    const finalWinner = winnerId || selectedWinnerId;
    if (!finalWinner) {
      alert('Selecione a equipe vencedora do confronto.');
      return;
    }
    finishMatch(match.id, finalWinner);
    if (match.phase?.toLowerCase().includes('final') && !match.phase?.toLowerCase().includes('semi')) {
      confetti({ particleCount: 130, spread: 85, origin: { y: 0.6 } });
    }
    setScoreModalMatch(null);
  };

  // Jogadores do jogo ativo
  const getActiveGamePlayers = () => {
    if (!isBestOf3) {
      return { t1: match.team1Players, t2: match.team2Players };
    }
    if (activeGameOrder === 1) {
      return {
        t1: match.lineupGame1?.t1Players || 'Dupla 1 (A definir)',
        t2: match.lineupGame1?.t2Players || 'Dupla 1 (A definir)'
      };
    }
    if (activeGameOrder === 2) {
      return {
        t1: match.lineupGame2?.t1Players || 'Dupla 2 (Revezamento)',
        t2: match.lineupGame2?.t2Players || 'Dupla 2 (Revezamento)'
      };
    }
    return {
      t1: match.lineupGame3?.t1Players || 'Dupla 3 (Desempate 1x1)',
      t2: match.lineupGame3?.t2Players || 'Dupla 3 (Desempate 1x1)'
    };
  };

  const currentPairNames = getActiveGamePlayers();
  const isSeriesOver = winsT1 >= 2 || winsT2 >= 2 || match.status === 'encerrada';
  const isGame3Dispensed = winsT1 === 2 || winsT2 === 2;

  return (
    <div className="modal-overlay" onClick={() => setScoreModalMatch(null)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '680px', width: '100%', borderRadius: '20px' }}
      >
        {/* Header */}
        <div className="modal-header" style={{ paddingBottom: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={20} color="#ef4444" />
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                {isBestOf3 ? 'Série Melhor de 3 Jogos (Duplas)' : 'Placar Oficial da Partida'}
              </h3>
              {isBestOf3 && (
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: 'var(--accent-amber)'
                  }}
                >
                  MD3 • 6 Atletas
                </span>
              )}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {category?.name} • {match.phase} {match.groupName ? `(${match.groupName})` : ''}
            </span>
          </div>
          <button className="modal-close-btn" onClick={() => setScoreModalMatch(null)}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Confrontation Leaderboard Card */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              gap: '1rem',
              background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))',
              padding: '1.1rem',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
            }}
          >
            {/* Team 1 */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: team1?.color || '#3b82f6',
                  margin: '0 auto 0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  fontWeight: 900,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                }}
              >
                {team1?.logoText || '1'}
              </div>
              <strong style={{ fontSize: '1rem', display: 'block', color: 'var(--text-primary)' }}>
                {team1?.name || match.team1Label}
              </strong>
              {isBestOf3 && (
                <div style={{ marginTop: '4px' }}>
                  <span
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      color: winsT1 > winsT2 ? 'var(--primary)' : 'var(--text-primary)'
                    }}
                  >
                    {winsT1}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                    {winsT1 === 1 ? 'vitória' : 'vitórias'}
                  </span>
                </div>
              )}
            </div>

            {/* VS or Series status */}
            <div style={{ textAlign: 'center', padding: '0 0.5rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-cyan)', letterSpacing: '1px', marginBottom: '4px' }}>
                {isBestOf3 ? 'Placar da Série' : 'Confronto'}
              </div>
              <div
                style={{
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: isSeriesOver ? 'var(--primary)' : 'var(--text-primary)',
                  letterSpacing: '2px'
                }}
              >
                {isBestOf3 ? `${winsT1} - ${winsT2}` : 'VS'}
              </div>
              {isBestOf3 && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '8px',
                    background: isSeriesOver ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.08)',
                    color: isSeriesOver ? 'var(--primary)' : 'var(--text-secondary)'
                  }}
                >
                  {isSeriesOver ? 'Confronto Finalizado' : winsT1 === 1 && winsT2 === 1 ? 'Empate 1x1 (Vai ao 3º Jogo!)' : 'Em Disputa'}
                </span>
              )}
            </div>

            {/* Team 2 */}
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: team2?.color || '#ef4444',
                  margin: '0 auto 0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  fontWeight: 900,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                }}
              >
                {team2?.logoText || '2'}
              </div>
              <strong style={{ fontSize: '1rem', display: 'block', color: 'var(--text-primary)' }}>
                {team2?.name || match.team2Label}
              </strong>
              {isBestOf3 && (
                <div style={{ marginTop: '4px' }}>
                  <span
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 900,
                      color: winsT2 > winsT1 ? 'var(--primary)' : 'var(--text-primary)'
                    }}
                  >
                    {winsT2}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                    {winsT2 === 1 ? 'vitória' : 'vitórias'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Abas dos 3 Jogos para MD3 */}
          {isBestOf3 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                background: 'rgba(0,0,0,0.25)',
                padding: '6px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)'
              }}
            >
              {[1, 2, 3].map((order) => {
                const g = games.find((item) => item.order === order);
                const isTabActive = activeGameOrder === order;
                const isFinished = g?.status === 'encerrada';
                const isDispensed = order === 3 && isGame3Dispensed && !isFinished;
                const scoreText = g?.score
                  ? `${g.score.gamesT1}x${g.score.gamesT2}${g.score.tiebreakT1 || g.score.tiebreakT2 ? ` (${g.score.tiebreakT1}-${g.score.tiebreakT2})` : ''}`
                  : '-';

                return (
                  <button
                    key={order}
                    type="button"
                    onClick={() => setActiveGameOrder(order)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: isTabActive ? '1px solid var(--primary)' : '1px solid transparent',
                      background: isTabActive ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255,255,255,0.03)',
                      color: isTabActive ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                        {order}º Jogo {order === 3 ? '(Se 1x1)' : ''}
                      </span>
                      {isFinished && (
                        <CheckCircle2 size={12} color="var(--primary)" />
                      )}
                      {isDispensed && (
                        <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Dispensado</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 900, color: isFinished ? 'var(--primary)' : 'var(--text-primary)' }}>
                      {isDispensed ? '2x0 (Fim)' : scoreText}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Duplas Escaladas para o Jogo Ativo */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.35)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.7rem', color: team1?.color || '#3b82f6', fontWeight: 800, textTransform: 'uppercase' }}>
                {team1?.name}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentPairNames.t1}
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)' }}>VS</div>

            <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: team2?.color || '#ef4444', fontWeight: 800, textTransform: 'uppercase' }}>
                {team2?.name}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentPairNames.t2}
              </div>
            </div>
          </div>

          {/* Se Jogo 3 e a série já foi 2x0 ou 0x2 */}
          {activeGameOrder === 3 && isGame3Dispensed && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center'
              }}
            >
              <ShieldCheck size={26} color="var(--primary)" style={{ margin: '0 auto 6px' }} />
              <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--primary)' }}>
                3º Jogo Dispensado (Série Vencida por 2x0)
              </strong>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Uma das equipes já alcançou 2 vitórias nos dois primeiros confrontos. O 3º jogo de desempate não precisa ser disputado.
              </p>
            </div>
          )}

          {/* Placar em Games (Set Único até 6 Games) */}
          {!(activeGameOrder === 3 && isGame3Dispensed) && (
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span>
                  Placar do {isBestOf3 ? `${activeGameOrder}º Jogo` : 'Jogo'} (Games até 6)
                </span>
                <span style={{ color: 'var(--accent-cyan)', fontSize: '0.75rem' }}>
                  5x5 vai a 7 • 6x6 Tiebreak até 7 pts
                </span>
              </label>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  alignItems: 'center',
                  gap: '1rem',
                  background: 'rgba(0,0,0,0.25)',
                  padding: '1rem',
                  borderRadius: '14px',
                  border: '1px solid var(--border-color)'
                }}
              >
                {/* Games Equipe 1 */}
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: team1?.color || '#06b6d4' }}>
                    {team1?.shortName || team1?.name || 'EQUIPE 1'}
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="7"
                    className="form-control"
                    style={{
                      fontSize: '2.2rem',
                      fontWeight: 900,
                      textAlign: 'center',
                      marginTop: '4px',
                      height: '64px',
                      borderRadius: '12px'
                    }}
                    value={gamesT1}
                    onChange={(e) => setGamesT1(e.target.value)}
                  />
                </div>

                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-muted)' }}>:</div>

                {/* Games Equipe 2 */}
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: team2?.color || '#f59e0b' }}>
                    {team2?.shortName || team2?.name || 'EQUIPE 2'}
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="7"
                    className="form-control"
                    style={{
                      fontSize: '2.2rem',
                      fontWeight: 900,
                      textAlign: 'center',
                      marginTop: '4px',
                      height: '64px',
                      borderRadius: '12px'
                    }}
                    value={gamesT2}
                    onChange={(e) => setGamesT2(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tiebreak (Se 6x6 ou 7x6 ou pontos preenchidos) */}
          {!(activeGameOrder === 3 && isGame3Dispensed) &&
            (isTiebreakActive || Number(tiebreakT1) > 0 || Number(tiebreakT2) > 0) && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '12px',
                  padding: '0.85rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                  <AlertCircle size={15} />
                  <span>TIE-BREAK ATÉ 7 PONTOS (Vantagem de 2 pontos)</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>TB {team1?.name}</label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      className="form-control"
                      style={{ textAlign: 'center', fontWeight: 800, fontSize: '1.2rem' }}
                      value={tiebreakT1}
                      onChange={(e) => setTiebreakT1(e.target.value)}
                    />
                  </div>
                  <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>x</span>
                  <div style={{ textAlign: 'center' }}>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>TB {team2?.name}</label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      className="form-control"
                      style={{ textAlign: 'center', fontWeight: 800, fontSize: '1.2rem' }}
                      value={tiebreakT2}
                      onChange={(e) => setTiebreakT2(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

          {/* Seleção do Vencedor deste Jogo */}
          {!(activeGameOrder === 3 && isGame3Dispensed) && (
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ color: 'var(--accent-amber)', fontSize: '0.82rem', marginBottom: '6px', display: 'block' }}>
                Vencedor do {isBestOf3 ? `${activeGameOrder}º Jogo` : 'Confronto'}:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  className={`btn ${selectedWinnerId === match.team1Id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', padding: '0.65rem 0.85rem' }}
                  onClick={() => setSelectedWinnerId(match.team1Id)}
                  disabled={!match.team1Id}
                >
                  <Trophy size={16} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {team1?.name || match.team1Label}
                  </span>
                </button>

                <button
                  type="button"
                  className={`btn ${selectedWinnerId === match.team2Id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', padding: '0.65rem 0.85rem' }}
                  onClick={() => setSelectedWinnerId(match.team2Id)}
                  disabled={!match.team2Id}
                >
                  <Trophy size={16} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {team2?.name || match.team2Label}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer com Botões de Ação */}
        <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => setScoreModalMatch(null)}>
            Fechar
          </button>

          {isBestOf3 ? (
            <>
              {!(activeGameOrder === 3 && isGame3Dispensed) && (
                <button className="btn btn-secondary" onClick={() => handleSaveActiveGame(false)}>
                  Salvar Parcial
                </button>
              )}

              {!(activeGameOrder === 3 && isGame3Dispensed) && (
                <button className="btn btn-primary" onClick={() => handleSaveActiveGame(true)}>
                  <CheckCircle2 size={16} />
                  Concluir {activeGameOrder}º Jogo
                </button>
              )}

              {isSeriesOver && (
                <button
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                  onClick={() => handleFinishFullConfrontation(winsT1 >= 2 ? match.team1Id : match.team2Id)}
                >
                  <Trophy size={16} />
                  Confirmar Fim do Confronto ({winsT1}x{winsT2})
                </button>
              )}
            </>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={() => handleSaveActiveGame(false)}>
                Atualizar Placar
              </button>
              <button className="btn btn-primary" onClick={() => handleSaveActiveGame(true)}>
                <CheckCircle2 size={16} />
                Finalizar Partida
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const ScoreModal = () => {
  const { scoreModalMatch } = useTournament();
  if (!scoreModalMatch) return null;
  return <ScoreModalContent />;
};
