import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  GitFork,
  Tv,
  Play,
  RotateCw,
  Trophy,
  CheckCircle,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  Users,
  Check,
  RotateCcw,
  Shuffle,
  UserCheck
} from 'lucide-react';

export const BracketsView = () => {
  const {
    categories,
    matches,
    teams,
    courts,
    selectedCategoryId,
    setSelectedCategoryId,
    generateBracketForCategory,
    generateAllBrackets,
    getGroupStandings,
    resetCategory,
    setScoreModalMatch,
    setAssignCourtData,
    setCoachLineupMatch
  } = useTournament();

  const [activeStageView, setActiveStageView] = useState('grupos'); // 'grupos' | 'mata_mata'
  const [resetCatSuccess, setResetCatSuccess] = useState(false);
  const [allRandomSuccess, setAllRandomSuccess] = useState(false);
  const [catRandomSuccess, setCatRandomSuccess] = useState(false);

  const currentCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];

  const handleResetCategory = () => {
    if (!currentCategory) return;
    resetCategory(currentCategory.id);
    setResetCatSuccess(true);
    setTimeout(() => setResetCatSuccess(false), 3000);
  };

  const handleGenerateAll = () => {
    generateAllBrackets();
    setAllRandomSuccess(true);
    setTimeout(() => setAllRandomSuccess(false), 3000);
  };

  const handleGenerateCategory = (catId) => {
    generateBracketForCategory(catId);
    setCatRandomSuccess(true);
    setTimeout(() => setCatRandomSuccess(false), 2500);
  };

  // Matches for selected category
  const categoryMatches = matches.filter((m) => m.categoryId === currentCategory?.id);
  const groupMatches = categoryMatches.filter((m) => m.stage === 'grupo');
  const knockoutMatches = categoryMatches.filter((m) => m.stage === 'mata_mata' || !m.stage);

  // Group names in this category
  const groupNames = [...new Set(groupMatches.map((m) => m.groupName || 'Grupo Único'))];

  // Group knockout matches by round
  const knockoutRounds = {};
  knockoutMatches.forEach((m) => {
    const r = m.round || 1;
    if (!knockoutRounds[r]) knockoutRounds[r] = [];
    knockoutRounds[r].push(m);
  });
  const sortedRoundKeys = Object.keys(knockoutRounds).sort((a, b) => Number(a) - Number(b));

  return (
    <div className="view-container">
      <div className="page-header">
        <div className="page-header-info">
          <h2>
            <GitFork size={28} color="#06b6d4" />
            <span>Chaveamento: Grupos & Mata-Mata</span>
          </h2>
          <p>
            Grupos de 3 ou 4 equipes (Round-Robin) com 2 classificados por grupo para a fase eliminatória. Todos os jogos em 1 Set até 6 games.
          </p>
        </div>

        <div className="page-header-actions" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {allRandomSuccess && (
            <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.82rem' }}>
              ✓ Grupos gerados aleatoriamente em todas as categorias!
            </span>
          )}
          {catRandomSuccess && (
            <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.82rem' }}>
              ✓ Grupos sorteados!
            </span>
          )}

          <button
            className="btn btn-primary"
            onClick={handleGenerateAll}
            title="Gera e sorteia os grupos de forma aleatória em todas as categorias a cada clique"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '7px'
            }}
          >
            <Shuffle size={16} />
            <span>Gerar Grupos</span>
          </button>

          {currentCategory && (
            <button
              className="btn btn-secondary"
              onClick={() => handleGenerateCategory(currentCategory.id)}
              title={`Gera e sorteia os grupos de forma aleatória para a categoria ${currentCategory.name}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <RotateCw size={15} />
              <span>Gerar Grupos ({currentCategory.name})</span>
            </button>
          )}

          {currentCategory && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {resetCatSuccess && (
                <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.8rem' }}>
                  ✓ Zerado!
                </span>
              )}
              <button
                className="btn btn-secondary"
                disabled={categoryMatches.length === 0}
                onClick={handleResetCategory}
                style={categoryMatches.length === 0 ? { opacity: 0.4, cursor: 'not-allowed' } : { borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
                title="Zera todos os resultados digitados e cancela o chaveamento desta categoria"
              >
                <RotateCcw size={15} />
                <span>Reiniciar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map((cat) => {
          const isSelected = cat.id === currentCategory?.id;
          const catMatchesCount = matches.filter((m) => m.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              className="btn btn-sm"
              style={{
                background: isSelected ? 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)' : 'rgba(255, 255, 255, 0.06)',
                color: isSelected ? '#fff' : 'var(--text-secondary)',
                border: isSelected ? 'none' : '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '0.45rem 1.1rem'
              }}
              onClick={() => setSelectedCategoryId(cat.id)}
            >
              <strong>{cat.name}</strong>
              <span style={{ opacity: 0.75, fontSize: '0.72rem', marginLeft: '6px' }}>
                ({catMatchesCount} jogos)
              </span>
            </button>
          );
        })}
      </div>

      {/* Alternador de Fases: Fase de Grupos vs Mata-Mata */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ background: 'rgba(21, 31, 50, 0.8)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', gap: '4px' }}>
          <button
            className={`btn btn-sm ${activeStageView === 'grupos' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveStageView('grupos')}
          >
            <Layers size={14} />
            <span>Fase de Grupos (Classificam 2)</span>
          </button>
          <button
            className={`btn btn-sm ${activeStageView === 'mata_mata' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveStageView('mata_mata')}
          >
            <Trophy size={14} />
            <span>Fase Final (Mata-Mata)</span>
          </button>
        </div>
      </div>

      {/* CONTEÚDO DA FASE DE GRUPOS */}
      {activeStageView === 'grupos' && (
        <div>
          {groupNames.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Layers size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
              <h3>Nenhum grupo gerado para esta categoria</h3>
              <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 1.5rem' }}>
                Certifique-se de ter equipes e atletas inscritos nesta categoria e clique no botão abaixo.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => generateBracketForCategory(currentCategory.id)}
              >
                <RotateCw size={16} />
                Gerar Grupos Automaticamente
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {groupNames.map((gName) => {
                const standings = getGroupStandings(currentCategory.id, gName);
                const gMatches = groupMatches.filter((m) => (m.groupName || 'Grupo Único') === gName);
                const isGroupFinished = gMatches.length > 0 && gMatches.every((m) => m.status === 'encerrada');

                return (
                  <div key={gName} className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                      <h3 style={{ color: '#fff', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
                        <span>{gName}</span>
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        🟢 Classificam os 2 Primeiros
                      </span>
                    </div>

                    {/* Tabela de Classificação do Grupo */}
                    <div className="standings-table-wrap" style={{ marginBottom: '1.5rem' }}>
                      <table className="standings-table">
                        <thead>
                          <tr>
                            <th style={{ width: '50px', textAlign: 'center' }}>Pos</th>
                            <th>Equipe</th>
                            <th style={{ textAlign: 'center' }} title="Jogos Disputados">J</th>
                            <th style={{ textAlign: 'center' }} title="Vitórias">V</th>
                            <th style={{ textAlign: 'center' }} title="Derrotas">D</th>
                            <th style={{ textAlign: 'center' }} title="Games Pró">GP</th>
                            <th style={{ textAlign: 'center' }} title="Games Contra">GC</th>
                            <th style={{ textAlign: 'center' }} title="Saldo de Games (GP - GC)">SG</th>
                            <th style={{ textAlign: 'right' }}>Pts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {standings.map((row, idx) => {
                            const isQualified = idx < 2;
                            return (
                              <tr
                                key={row.team.id}
                                style={{
                                  background: isQualified ? 'rgba(16, 185, 129, 0.05)' : undefined
                                }}
                              >
                                <td style={{ textAlign: 'center' }}>
                                  {isQualified ? (
                                    <span style={{ background: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '50%', fontSize: '0.75rem', fontWeight: 800 }}>
                                      {idx + 1}º
                                    </span>
                                  ) : (
                                    <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>
                                      {idx + 1}º
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span
                                      style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        background: row.team.color || '#3b82f6'
                                      }}
                                    />
                                    <strong style={{ color: '#fff' }}>{row.team.name}</strong>
                                    {isGroupFinished && isQualified && (
                                      <span style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 700 }}>
                                        (CLASSIFICADO)
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td style={{ textAlign: 'center' }}>{row.matchesPlayed}</td>
                                <td style={{ textAlign: 'center', fontWeight: 700, color: '#34d399' }}>{row.wins}</td>
                                <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{row.losses}</td>
                                <td style={{ textAlign: 'center' }}>{row.gamesWon}</td>
                                <td style={{ textAlign: 'center' }}>{row.gamesLost}</td>
                                <td style={{ textAlign: 'center', fontWeight: 700, color: row.gameDiff > 0 ? '#34d399' : row.gameDiff < 0 ? '#ef4444' : 'var(--text-secondary)' }}>
                                  {row.gameDiff > 0 ? `+${row.gameDiff}` : row.gameDiff}
                                </td>
                                <td style={{ textAlign: 'right', fontWeight: 800, color: '#facc15' }}>
                                  {row.points}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Lista de Confrontos do Grupo */}
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 700 }}>
                      Confrontos do {gName} (1 Set até 6 Games)
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.85rem' }}>
                      {gMatches.map((m) => {
                        const t1 = teams.find((t) => t.id === m.team1Id);
                        const t2 = teams.find((t) => t.id === m.team2Id);
                        const court = courts.find((c) => c.id === m.courtId);
                        const isLive = m.status === 'em_andamento';
                        const isFinished = m.status === 'encerrada';
                        const g1 = m.score?.gamesT1 ?? m.score?.set1?.[0] ?? 0;
                        const g2 = m.score?.gamesT2 ?? m.score?.set1?.[1] ?? 0;

                        return (
                          <div
                            key={m.id}
                            style={{
                              background: 'rgba(0,0,0,0.3)',
                              border: isLive ? '1px solid #ef4444' : '1px solid var(--border-color)',
                              borderRadius: 'var(--radius-md)',
                              padding: '0.85rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.5rem'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              <span>{m.phase}</span>
                              {isLive && (
                                <span style={{ color: '#ef4444', fontWeight: 800 }}>
                                  ● AO VIVO {court ? `(${court.name})` : ''}
                                </span>
                              )}
                              {isFinished && (
                                <span style={{ color: '#10b981', fontWeight: 700 }}>
                                  ✓ Finalizado
                                </span>
                              )}
                              {!isLive && !isFinished && court && (
                                <span style={{ color: 'var(--accent-cyan)' }}>
                                  Quadra: {court.name}
                                </span>
                              )}
                            </div>

                            {/* Equipe 1 */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: t1?.color || '#3b82f6' }} />
                                <strong style={{ color: isFinished && m.winnerId === m.team1Id ? '#34d399' : '#fff' }}>
                                  {t1?.name || m.team1Label}
                                </strong>
                              </div>
                              <span style={{ fontWeight: 800, fontSize: '1rem', color: isFinished && m.winnerId === m.team1Id ? '#34d399' : '#fff' }}>
                                {g1}
                              </span>
                            </div>

                            {/* Equipe 2 */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: t2?.color || '#ef4444' }} />
                                <strong style={{ color: isFinished && m.winnerId === m.team2Id ? '#34d399' : '#fff' }}>
                                  {t2?.name || m.team2Label}
                                </strong>
                              </div>
                              <span style={{ fontWeight: 800, fontSize: '1rem', color: isFinished && m.winnerId === m.team2Id ? '#34d399' : '#fff' }}>
                                {g2}
                              </span>
                            </div>

                            {/* Ações */}
                            <div style={{ display: 'flex', gap: '6px', marginTop: '0.25rem' }}>
                              {!isFinished && (
                                <button
                                  className="btn btn-secondary btn-sm"
                                  style={{ flex: 1, padding: '3px', fontSize: '0.7rem' }}
                                  onClick={() => setAssignCourtData({ matchId: m.id })}
                                >
                                  <Play size={11} />
                                  <span>{court ? 'Trocar Quadra' : 'Enviar à Quadra'}</span>
                                </button>
                              )}
                              <button
                                className="btn btn-primary btn-sm"
                                style={{ flex: 1, padding: '3px', fontSize: '0.7rem' }}
                                onClick={() => setScoreModalMatch(m)}
                              >
                                <Tv size={11} />
                                <span>{isFinished ? 'Ver Placar' : 'Placar ao Vivo'}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CONTEÚDO DO MATA-MATA */}
      {activeStageView === 'mata_mata' && (
        <div>
          {knockoutMatches.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Trophy size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
              <h3>Nenhum jogo eliminatório configurado</h3>
              <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 1.5rem' }}>
                Conclua a fase de grupos ou gere o chaveamento para habilitar as fases eliminatórias.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => generateBracketForCategory(currentCategory.id)}
              >
                <RotateCw size={16} />
                Gerar Chaveamento
              </button>
            </div>
          ) : (
            <div className="bracket-wrapper">
              <div className="bracket-container">
                {sortedRoundKeys.map((roundKey) => {
                  const matchesInRound = knockoutRounds[roundKey];
                  const hasThird = matchesInRound.some(m => m.phase?.toLowerCase().includes('3'));
                  const roundTitle = roundKey === '2' && hasThird
                    ? 'Fase Final (Decisão de 1º a 4º)'
                    : matchesInRound[0]?.phase || `Fase ${roundKey}`;

                  return (
                    <div key={roundKey} className="bracket-round-col">
                      <div className="round-header">
                        <span>{roundTitle}</span>
                        <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                          {matchesInRound.length} {matchesInRound.length > 1 ? 'jogos' : 'jogo'}
                        </span>
                      </div>

                      <div className="round-matches-list">
                        {matchesInRound.map((m) => {
                          const t1 = teams.find((t) => t.id === m.team1Id);
                          const t2 = teams.find((t) => t.id === m.team2Id);
                          const court = courts.find((c) => c.id === m.courtId);
                          const isLive = m.status === 'em_andamento';
                          const isFinished = m.status === 'encerrada';
                          const isThird = m.phase?.toLowerCase().includes('3');
                          const isFinal = m.phase?.toLowerCase().includes('final') && !isThird && !m.phase?.toLowerCase().includes('semi');
                          const g1 = m.score?.gamesT1 ?? m.score?.set1?.[0] ?? 0;
                          const g2 = m.score?.gamesT2 ?? m.score?.set1?.[1] ?? 0;

                          return (
                            <div
                              key={m.id}
                              className={`bracket-card ${isLive ? 'match-live' : ''} ${isFinished ? 'match-finished' : ''}`}
                              style={{
                                borderColor: isFinal ? 'rgba(250, 204, 21, 0.4)' : isThird ? 'rgba(249, 115, 22, 0.4)' : undefined
                              }}
                            >
                              <div className="bracket-match-meta">
                                <span style={{ fontWeight: 700, color: isFinal ? '#facc15' : isThird ? '#fb923c' : 'var(--accent-cyan)' }}>
                                  {isFinal ? '🏆 ' : isThird ? '🥉 ' : ''}{m.phase}
                                </span>
                                {isLive && (
                                  <span style={{ color: '#ef4444', fontWeight: 800 }}>
                                    ● {court?.name || 'AO VIVO'}
                                  </span>
                                )}
                                {isFinished && (
                                  <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <CheckCircle size={12} /> Encerrado
                                  </span>
                                )}
                              </div>

                              {/* Slot Equipe 1 */}
                              <div
                                className={`bracket-team-slot ${
                                  isFinished && m.winnerId === m.team1Id ? 'winner' : ''
                                }`}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                  <span
                                    style={{
                                      width: 10,
                                      height: 10,
                                      borderRadius: '50%',
                                      background: t1?.color || '#64748b'
                                    }}
                                  />
                                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    <div>{t1?.name || m.team1Label}</div>
                                    <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                                      {m.team1Players}
                                    </div>
                                  </div>
                                </div>
                                <span style={{ fontWeight: 800, fontSize: '1rem' }}>{g1}</span>
                              </div>

                              {/* Slot Equipe 2 */}
                              <div
                                className={`bracket-team-slot ${
                                  isFinished && m.winnerId === m.team2Id ? 'winner' : ''
                                }`}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                  <span
                                    style={{
                                      width: 10,
                                      height: 10,
                                      borderRadius: '50%',
                                      background: t2?.color || '#64748b'
                                    }}
                                  />
                                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    <div>{t2?.name || m.team2Label}</div>
                                    <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                                      {m.team2Players}
                                    </div>
                                  </div>
                                </div>
                                <span style={{ fontWeight: 800, fontSize: '1rem' }}>{g2}</span>
                              </div>

                              {/* Ações */}
                              <div className="bracket-actions-row">
                                <button
                                  className="btn btn-secondary btn-sm"
                                  style={{
                                    flex: 1,
                                    padding: '4px',
                                    fontSize: '0.72rem',
                                    background: m.lineupTeam1Confirmed && m.lineupTeam2Confirmed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                                    color: m.lineupTeam1Confirmed && m.lineupTeam2Confirmed ? 'var(--primary)' : 'var(--accent-cyan)'
                                  }}
                                  onClick={() => setCoachLineupMatch(m)}
                                  disabled={!m.team1Id || !m.team2Id}
                                  title="Técnico: Escalar duplas antes do jogo"
                                >
                                  <UserCheck size={11} />
                                  <span>Escalar</span>
                                </button>
                                {!isFinished && (
                                  <button
                                    className="btn btn-secondary btn-sm"
                                    style={{ flex: 1, padding: '4px', fontSize: '0.72rem' }}
                                    onClick={() => setAssignCourtData({ matchId: m.id })}
                                    disabled={!m.team1Id || !m.team2Id}
                                  >
                                    <Play size={11} />
                                    <span>{court ? 'Trocar Quadra' : 'Enviar à Quadra'}</span>
                                  </button>
                                )}
                                <button
                                  className="btn btn-primary btn-sm"
                                  style={{ flex: 1, padding: '4px', fontSize: '0.72rem' }}
                                  onClick={() => setScoreModalMatch(m)}
                                  disabled={!m.team1Id || !m.team2Id}
                                >
                                  <Tv size={11} />
                                  <span>{isFinished ? 'Ver Placar' : 'Placar ao Vivo'}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
