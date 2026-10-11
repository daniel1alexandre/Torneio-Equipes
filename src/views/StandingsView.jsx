import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  Award,
  Trophy,
  Medal,
  Layers,
  Users,
  Shield,
  CheckCircle,
  Clock,
  Check
} from 'lucide-react';

export const StandingsView = () => {
  const {
    generalStandings,
    categories,
    matches,
    teams,
    athletes,
    scoringRules,
    getCategoryStandings,
    getGroupStandings,
    courts
  } = useTournament();

  const [standingsMode, setStandingsMode] = useState('geral'); // 'geral' | 'categorias'
  const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || '');

  const top3 = generalStandings.slice(0, 3);
  const first = top3[0];
  const second = top3[1];
  const third = top3[2];

  // Specific category standings calculation
  const currentCategory = categories.find((c) => c.id === selectedCatId) || categories[0];
  const catMatches = matches.filter((m) => m.categoryId === currentCategory?.id);
  const catStandings = currentCategory && getCategoryStandings ? getCategoryStandings(currentCategory.id) : [];

  const catTop3 = catStandings.slice(0, 3);
  const catFirst = catTop3[0];
  const catSecond = catTop3[1];
  const catThird = catTop3[2];

  // Group names in this category (if any)
  const groupNames = [
    ...new Set(
      catMatches.filter((m) => m.stage === 'grupo' && m.groupName).map((m) => m.groupName)
    )
  ];

  return (
    <div className="view-container">
      <div className="page-header">
        <div className="page-header-info">
          <h2>
            <Award size={28} color="#f59e0b" />
            <span>Classificação do Torneio</span>
          </h2>
          <p>
            Acompanhe o ranking geral dos clubes/equipes somando todas as categorias e a classificação detalhada dentro de cada categoria.
          </p>
        </div>

        <div className="page-header-actions">
          <div style={{ background: 'rgba(21, 31, 50, 0.8)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', gap: '4px' }}>
            <button
              className={`btn btn-sm ${standingsMode === 'geral' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStandingsMode('geral')}
            >
              <Trophy size={14} />
              <span>Geral de Equipes</span>
            </button>
            <button
              className={`btn btn-sm ${standingsMode === 'categorias' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStandingsMode('categorias')}
            >
              <Medal size={14} />
              <span>Por Categorias</span>
            </button>
          </div>
        </div>
      </div>

      {standingsMode === 'geral' ? (
        <>
          {/* Pódio dos 3 Primeiros Colocados Geral */}
          {generalStandings.length >= 2 && (
            <div className="podium-container">
              {/* 2º Lugar */}
              {second && (
                <div className="podium-step podium-2">
                  <div
                    className="podium-avatar"
                    style={{ background: second.team.color || '#94a3b8' }}
                  >
                    {second.team.logoText || '2'}
                  </div>
                  <div className="podium-name">{second.team.name}</div>
                  <div className="podium-points">{second.totalPoints} PTS</div>
                  <div className="podium-block">2</div>
                </div>
              )}

              {/* 1º Lugar */}
              {first && (
                <div className="podium-step podium-1">
                  <div
                    className="podium-avatar"
                    style={{ background: first.team.color || '#eab308' }}
                  >
                    <span className="podium-crown">👑</span>
                    {first.team.logoText || '1'}
                  </div>
                  <div className="podium-name">{first.team.name}</div>
                  <div className="podium-points" style={{ color: '#facc15', fontSize: '1.05rem' }}>
                    {first.totalPoints} PTS
                  </div>
                  <div className="podium-block">1</div>
                </div>
              )}

              {/* 3º Lugar */}
              {third && (
                <div className="podium-step podium-3">
                  <div
                    className="podium-avatar"
                    style={{ background: third.team.color || '#b45309' }}
                  >
                    {third.team.logoText || '3'}
                  </div>
                  <div className="podium-name">{third.team.name}</div>
                  <div className="podium-points">{third.totalPoints} PTS</div>
                  <div className="podium-block">3</div>
                </div>
              )}
            </div>
          )}

          {/* Tabela de Classificação Geral */}
          <div className="standings-table-wrap">
            <table className="standings-table">
              <thead>
                <tr>
                  <th style={{ width: '60px', textAlign: 'center' }}>Pos</th>
                  <th>Equipe</th>
                  <th style={{ textAlign: 'center' }}>🥇 Campeão</th>
                  <th style={{ textAlign: 'center' }}>🥈 Vice</th>
                  <th style={{ textAlign: 'center' }}>🥉 3º Lugar</th>
                  <th style={{ textAlign: 'center' }}>Vitórias (Jogos)</th>
                  <th style={{ textAlign: 'right' }}>Total de Pontos</th>
                </tr>
              </thead>
              <tbody>
                {generalStandings.map((row, index) => {
                  const rank = index + 1;
                  const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : '';

                  return (
                    <tr key={row.team.id}>
                      <td style={{ textAlign: 'center' }}>
                        {rankClass ? (
                          <span className={`rank-badge ${rankClass}`}>{rank}</span>
                        ) : (
                          <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{rank}º</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: 'var(--radius-sm)',
                              background: row.team.color || '#3b82f6',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1rem',
                              color: '#fff',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                            }}
                          >
                            {row.team.logoText || '🛡️'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>
                              {row.team.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              Capitão: {row.team.captain || 'Não informado'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#facc15' }}>
                        {row.gold > 0 ? `${row.gold}x 🏆` : '-'}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#cbd5e1' }}>
                        {row.silver > 0 ? `${row.silver}x 🥈` : '-'}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#f97316' }}>
                        {row.bronze > 0 ? `${row.bronze}x 🥉` : '-'}
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 600 }}>
                        {row.matchWins} vitórias
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="total-pts-highlight">{row.totalPoints} pts</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Dica do cálculo */}
          <div style={{ marginTop: '1.25rem', padding: '0.85rem 1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span>
              ℹ️ A pontuação geral soma a colocação final em cada categoria ({scoringRules.firstPlace} pts para campeão, {scoringRules.secondPlace} pts para vice, {scoringRules.thirdPlace} pts para 3º, etc.) + {scoringRules.bonusPerMatchWin} pts bônus por partida vencida.
            </span>
          </div>
        </>
      ) : (
        /* =========================================================================
           CLASSIFICAÇÃO POR CATEGORIA (IDÊNTICA À GERAL, DENTRO DA CATEGORIA)
           ========================================================================= */
        <div>
          {/* Seletor de Categoria em Pills */}
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat) => {
              const isSelected = selectedCatId === cat.id;
              const count = matches.filter((m) => m.categoryId === cat.id).length;
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
                  onClick={() => setSelectedCatId(cat.id)}
                >
                  <strong>{cat.name}</strong>
                  <span style={{ opacity: 0.75, fontSize: '0.72rem', marginLeft: '6px' }}>
                    ({count} jogos)
                  </span>
                </button>
              );
            })}
          </div>

          {currentCategory ? (
            <>
              {/* Informações da Categoria */}
              <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ color: '#fff', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Medal size={22} color="#06b6d4" />
                    <span>Classificação Oficial: {currentCategory.name}</span>
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {currentCategory.level} • {currentCategory.matchFormat}
                  </p>
                </div>
              </div>

              {/* Pódio da Categoria (se houver pontuações/jogos disputados) */}
              {catStandings.some((s) => s.matchesPlayed > 0 || s.points > 0) && catTop3.length >= 2 && (
                <div className="podium-container">
                  {/* 2º Lugar da Categoria */}
                  {catSecond && (
                    <div className="podium-step podium-2">
                      <div
                        className="podium-avatar"
                        style={{ background: catSecond.team.color || '#94a3b8' }}
                      >
                        {catSecond.team.logoText || '2'}
                      </div>
                      <div className="podium-name">{catSecond.team.name}</div>
                      <div className="podium-points">{catSecond.points} PTS</div>
                      <div className="podium-block">2</div>
                    </div>
                  )}

                  {/* 1º Lugar da Categoria */}
                  {catFirst && (
                    <div className="podium-step podium-1">
                      <div
                        className="podium-avatar"
                        style={{ background: catFirst.team.color || '#eab308' }}
                      >
                        <span className="podium-crown">👑</span>
                        {catFirst.team.logoText || '1'}
                      </div>
                      <div className="podium-name">{catFirst.team.name}</div>
                      <div className="podium-points" style={{ color: '#facc15', fontSize: '1.05rem' }}>
                        {catFirst.points} PTS
                      </div>
                      <div className="podium-block">1</div>
                    </div>
                  )}

                  {/* 3º Lugar da Categoria */}
                  {catThird && (
                    <div className="podium-step podium-3">
                      <div
                        className="podium-avatar"
                        style={{ background: catThird.team.color || '#b45309' }}
                      >
                        {catThird.team.logoText || '3'}
                      </div>
                      <div className="podium-name">{catThird.team.name}</div>
                      <div className="podium-points">{catThird.points} PTS</div>
                      <div className="podium-block">3</div>
                    </div>
                  )}
                </div>
              )}

              {/* Tabela de Classificação da Categoria (Formato idêntico ao Geral) */}
              <div className="standings-table-wrap" style={{ marginBottom: '2rem' }}>
                <table className="standings-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px', textAlign: 'center' }}>Pos</th>
                      <th>Equipe & Atletas ({currentCategory.name})</th>
                      <th style={{ textAlign: 'center' }}>Colocação / Status</th>
                      <th style={{ textAlign: 'center' }} title="Jogos Disputados">J</th>
                      <th style={{ textAlign: 'center' }} title="Vitórias">V</th>
                      <th style={{ textAlign: 'center' }} title="Derrotas">D</th>
                      <th style={{ textAlign: 'center' }} title="Games Pró">GP</th>
                      <th style={{ textAlign: 'center' }} title="Games Contra">GC</th>
                      <th style={{ textAlign: 'center' }} title="Saldo de Games">SG</th>
                      <th style={{ textAlign: 'right' }}>Total de Pontos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catStandings.length === 0 ? (
                      <tr>
                        <td colSpan="10" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                          Nenhuma equipe ou partida registrada nesta categoria.
                        </td>
                      </tr>
                    ) : (
                      catStandings.map((row, index) => {
                        const rank = index + 1;
                        const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : '';

                        return (
                          <tr key={row.team.id}>
                            <td style={{ textAlign: 'center' }}>
                              {rankClass ? (
                                <span className={`rank-badge ${rankClass}`}>{rank}</span>
                              ) : (
                                <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{rank}º</span>
                              )}
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                <div
                                  style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: row.team.color || '#3b82f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1rem',
                                    color: '#fff',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                                  }}
                                >
                                  {row.team.logoText || '🛡️'}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>
                                    {row.team.name}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                                    {row.athletes}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span
                                style={{
                                  fontWeight: 700,
                                  fontSize: '0.82rem',
                                  color: row.gold ? '#facc15' : row.silver ? '#cbd5e1' : row.bronze ? '#fb923c' : 'var(--text-secondary)'
                                }}
                              >
                                {row.badge} {row.placement}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center', fontWeight: 600 }}>{row.matchesPlayed}</td>
                            <td style={{ textAlign: 'center', fontWeight: 700, color: '#34d399' }}>{row.wins}</td>
                            <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{row.losses}</td>
                            <td style={{ textAlign: 'center' }}>{row.gamesWon}</td>
                            <td style={{ textAlign: 'center' }}>{row.gamesLost}</td>
                            <td style={{ textAlign: 'center', fontWeight: 700, color: row.gameDiff > 0 ? '#34d399' : row.gameDiff < 0 ? '#ef4444' : 'var(--text-secondary)' }}>
                              {row.gameDiff > 0 ? `+${row.gameDiff}` : row.gameDiff}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <span className="total-pts-highlight">{row.points} pts</span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Detalhamento de Todas as Fases */}
              <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <Layers size={22} color="#06b6d4" />
                  <span>Detalhamento de Todas as Fases ({currentCategory.name})</span>
                </h3>

                {/* 1. FASE ELIMINATÓRIA (MATA-MATA) - RESULTADOS OFICIAIS */}
                {(() => {
                  const isThirdPlaceMatch = (m) => {
                    const p = (m.phase || m.roundName || '').toLowerCase();
                    return Boolean(
                      m.isThirdPlaceMatch ||
                      p.includes('3º') ||
                      p.includes('3o') ||
                      p.includes('3°') ||
                      p.includes('terceiro') ||
                      p.includes('bronze')
                    );
                  };

                  const isSemiMatch = (m) => {
                    const p = (m.phase || m.roundName || '').toLowerCase();
                    return p.includes('semi');
                  };

                  const isFinalMatch = (m) => {
                    const p = (m.phase || m.roundName || '').toLowerCase();
                    return !isSemiMatch(m) && !isThirdPlaceMatch(m) && p.includes('final');
                  };

                  const knockoutMatches = catMatches.filter(
                    (m) => m.stage === 'mata_mata' || isSemiMatch(m) || isThirdPlaceMatch(m) || isFinalMatch(m)
                  );
                  const semiMatches = knockoutMatches.filter(isSemiMatch).sort((a, b) => (a.matchNumber || 0) - (b.matchNumber || 0));
                  const thirdPlaceMatch = knockoutMatches.find(isThirdPlaceMatch);
                  const finalMatch = knockoutMatches.find(isFinalMatch);

                  const renderMatchCard = (m, accentColor = '#06b6d4', titlePrefix = '') => {
                    const team1 = teams.find((t) => t.id === m.team1Id);
                    const team2 = teams.find((t) => t.id === m.team2Id);

                    const t1Name = team1 ? team1.name : (m.team1Label || m.team1Placeholder || 'Aguardando definição');
                    const t2Name = team2 ? team2.name : (m.team2Label || m.team2Placeholder || 'Aguardando definição');

                    const t1Athletes = m.team1Players || (team1 ? athletes.filter((a) => a.categoryId === currentCategory.id && a.teamId === team1.id).map((a) => a.name).join(' & ') : '');
                    const t2Athletes = m.team2Players || (team2 ? athletes.filter((a) => a.categoryId === currentCategory.id && a.teamId === team2.id).map((a) => a.name).join(' & ') : '');

                    const court = courts?.find((c) => c.id === m.courtId);
                    const isFinished = m.status === 'encerrada' || m.status === 'finalizada';
                    const isLive = m.status === 'em_andamento';
                    const isScheduled = m.status === 'agendada';
                    const isPending = !isFinished && !isLive && !isScheduled;

                    const t1Won = isFinished && m.winnerId && m.winnerId === m.team1Id;
                    const t2Won = isFinished && m.winnerId && m.winnerId === m.team2Id;

                    const g1 = Number(m.score?.gamesT1 ?? m.score?.set1?.[0] ?? m.score?.team1Score ?? 0);
                    const g2 = Number(m.score?.gamesT2 ?? m.score?.set1?.[1] ?? m.score?.team2Score ?? 0);
                    const tb1 = Number(m.score?.tiebreakT1 ?? m.score?.team1Tiebreak ?? 0);
                    const tb2 = Number(m.score?.tiebreakT2 ?? m.score?.team2Tiebreak ?? 0);
                    const hasTiebreak = tb1 > 0 || tb2 > 0 || (g1 === 7 && g2 === 6) || (g1 === 6 && g2 === 7);

                    const isThird = isThirdPlaceMatch(m);
                    const isFinal = isFinalMatch(m);
                    const isSemi = isSemiMatch(m);
                    const phaseLabel = m.phase || m.roundName || (isFinal ? 'Grande Final' : isThird ? 'Decisão de 3º e 4º Lugar' : 'Semifinal');

                    return (
                      <div
                        key={m.id}
                        className="glass-card"
                        style={{
                          padding: '1.25rem',
                          borderLeft: `4px solid ${accentColor}`,
                          background: 'rgba(21, 31, 50, 0.75)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.85rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 800, color: accentColor, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {titlePrefix} {phaseLabel}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {court && (
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                {court.name}
                              </span>
                            )}
                            {m.startTime && (
                              <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>
                                ⏰ {m.startTime}
                              </span>
                            )}
                            <span
                              className={`badge ${
                                isFinished ? 'badge-finalizada' : isLive ? 'badge-andamento' : isScheduled ? 'badge-agendada' : 'badge-pendente'
                              }`}
                              style={{ fontSize: '0.7rem' }}
                            >
                              {isFinished ? 'Encerrada' : isLive ? 'Em Andamento' : isScheduled ? 'Agendada' : 'Aguardando'}
                            </span>
                          </div>
                        </div>

                        {/* Equipe 1 */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.65rem 0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            background: t1Won ? 'rgba(52, 211, 153, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                            border: t1Won ? '1px solid rgba(52, 211, 153, 0.35)' : '1px solid transparent'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                            <div
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '6px',
                                background: team1?.color || '#3b82f6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.95rem',
                                color: '#fff',
                                flexShrink: 0
                              }}
                            >
                              {team1?.logoText || '🛡️'}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: t1Won ? 800 : 600, color: t1Won ? '#34d399' : '#fff', fontSize: '0.92rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                                <span>{t1Name}</span>
                                {t1Won && (
                                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34d399', background: 'rgba(52, 211, 153, 0.15)', padding: '1px 6px', borderRadius: '4px' }}>
                                    {isFinal ? '🏆 CAMPEÃO' : isThird ? '🥉 3º LUGAR' : '✓ FINALISTA'}
                                  </span>
                                )}
                                {isFinished && !t1Won && t2Won && (
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                    {isFinal ? '🥈 Vice-Campeão' : isThird ? '4º Lugar' : 'Disputa 3º'}
                                  </span>
                                )}
                              </div>
                              {t1Athletes && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>
                                  {t1Athletes}
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: t1Won ? '#34d399' : '#fff', minWidth: '40px', textAlign: 'right' }}>
                            {isFinished || isLive ? (
                              <span>
                                {g1}
                                {hasTiebreak && (
                                  <sup style={{ fontSize: '0.7rem', color: '#facc15', marginLeft: '2px' }}>
                                    ({tb1})
                                  </sup>
                                )}
                              </span>
                            ) : '-'}
                          </div>
                        </div>

                        {/* Equipe 2 */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.65rem 0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            background: t2Won ? 'rgba(52, 211, 153, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                            border: t2Won ? '1px solid rgba(52, 211, 153, 0.35)' : '1px solid transparent'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                            <div
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '6px',
                                background: team2?.color || '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.95rem',
                                color: '#fff',
                                flexShrink: 0
                              }}
                            >
                              {team2?.logoText || '🛡️'}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: t2Won ? 800 : 600, color: t2Won ? '#34d399' : '#fff', fontSize: '0.92rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                                <span>{t2Name}</span>
                                {t2Won && (
                                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34d399', background: 'rgba(52, 211, 153, 0.15)', padding: '1px 6px', borderRadius: '4px' }}>
                                    {isFinal ? '🏆 CAMPEÃO' : isThird ? '🥉 3º LUGAR' : '✓ FINALISTA'}
                                  </span>
                                )}
                                {isFinished && !t2Won && t1Won && (
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                    {isFinal ? '🥈 Vice-Campeão' : isThird ? '4º Lugar' : 'Disputa 3º'}
                                  </span>
                                )}
                              </div>
                              {t2Athletes && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>
                                  {t2Athletes}
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: t2Won ? '#34d399' : '#fff', minWidth: '40px', textAlign: 'right' }}>
                            {isFinished || isLive ? (
                              <span>
                                {g2}
                                {hasTiebreak && (
                                  <sup style={{ fontSize: '0.7rem', color: '#facc15', marginLeft: '2px' }}>
                                    ({tb2})
                                  </sup>
                                )}
                              </span>
                            ) : '-'}
                          </div>
                        </div>

                        {/* Status / Próximo Passo */}
                        {isFinished && (
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', paddingTop: '0.3rem', borderTop: '1px dashed rgba(255,255,255,0.08)' }}>
                            {isThird ? (
                              <span>🥉 <strong>{t1Won ? t1Name : t2Name}</strong> venceu por {g1 > g2 ? `${g1} x ${g2}` : `${g2} x ${g1}`} e conquistou o 3º Lugar (+50 pts).</span>
                            ) : isFinal ? (
                              <span>🏆 <strong>{t1Won ? t1Name : t2Name}</strong> venceu por {g1 > g2 ? `${g1} x ${g2}` : `${g2} x ${g1}`} e é o Campeão da Categoria (+100 pts).</span>
                            ) : (
                              <span>✓ <strong>{t1Won ? t1Name : t2Name}</strong> venceu por {g1 > g2 ? `${g1} x ${g2}` : `${g2} x ${g1}`} e avançou para a Grande Final.</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  };

                  if (knockoutMatches.length === 0) {
                    return (
                      <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', marginBottom: '2.5rem' }}>
                        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                          Chaveamento eliminatório ainda não gerado para esta categoria. Gere os grupos na aba <strong>Chaveamento</strong> para visualizar os confrontos de mata-mata.
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div style={{ marginBottom: '2.5rem' }}>
                      <h4 style={{ color: '#facc15', fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Trophy size={20} />
                        <span>Fase Final Eliminatória (Mata-Mata) - Resultados</span>
                      </h4>

                      {/* Finais: Grande Final e Decisão de 3º e 4º Lugar */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
                        {/* Grande Final */}
                        {finalMatch && (
                          <div>
                            <h5 style={{ color: '#facc15', fontSize: '0.95rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>🏆 Grande Final (Disputa de 1º e 2º Lugar)</span>
                            </h5>
                            {renderMatchCard(finalMatch, '#facc15', '🏆')}
                          </div>
                        )}

                        {/* 3º e 4º Lugar */}
                        {thirdPlaceMatch && (
                          <div>
                            <h5 style={{ color: '#fb923c', fontSize: '0.95rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>🥉 Decisão de 3º e 4º Lugar (Medalha de Bronze)</span>
                            </h5>
                            {renderMatchCard(thirdPlaceMatch, '#fb923c', '🥉')}
                          </div>
                        )}
                      </div>

                      {/* Semifinais */}
                      {semiMatches.length > 0 && (
                        <div>
                          <h5 style={{ color: '#38bdf8', fontSize: '0.95rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>⚔️ Semifinais</span>
                          </h5>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
                            {semiMatches.map((sm) => renderMatchCard(sm, '#38bdf8', '⚔️'))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 2. FASE DE GRUPOS */}
                {groupNames.length > 0 && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h4 style={{ color: '#38bdf8', fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Layers size={18} />
                      <span>Fase de Grupos (Classificam os 2 melhores de cada grupo)</span>
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                      {groupNames.map((gName) => {
                        const gStandings = getGroupStandings ? getGroupStandings(currentCategory.id, gName) : [];
                        const gMatches = catMatches.filter((m) => m.stage === 'grupo' && m.groupName === gName);

                        return (
                          <div key={gName} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                              <strong style={{ color: '#fff', fontSize: '1rem' }}>{gName}</strong>
                              <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700, background: 'rgba(52, 211, 153, 0.12)', padding: '2px 8px', borderRadius: '12px' }}>
                                2 classificados
                              </span>
                            </div>

                            {/* Tabela do Grupo */}
                            <table className="standings-table" style={{ fontSize: '0.78rem' }}>
                              <thead>
                                <tr>
                                  <th style={{ width: '30px' }}>#</th>
                                  <th>Equipe</th>
                                  <th style={{ textAlign: 'center' }}>J</th>
                                  <th style={{ textAlign: 'center' }}>V</th>
                                  <th style={{ textAlign: 'center' }}>SG</th>
                                  <th style={{ textAlign: 'right' }}>Pts</th>
                                </tr>
                              </thead>
                              <tbody>
                                {gStandings.map((row, idx) => (
                                  <tr key={row.team.id}>
                                    <td style={{ textAlign: 'center', fontWeight: 700, color: idx < 2 ? '#34d399' : 'var(--text-muted)' }}>
                                      {idx + 1}º
                                    </td>
                                    <td>
                                      <strong style={{ color: '#fff' }}>{row.team.name}</strong>
                                      <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>
                                        {athletes.filter(a => a.categoryId === currentCategory.id && a.teamId === row.team.id).map(a => a.name).join(' & ')}
                                      </div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>{row.matchesPlayed}</td>
                                    <td style={{ textAlign: 'center', color: '#34d399' }}>{row.wins}</td>
                                    <td style={{ textAlign: 'center' }}>{row.gameDiff > 0 ? `+${row.gameDiff}` : row.gameDiff}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 800, color: '#facc15' }}>{row.points}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            {/* Jogos do Grupo */}
                            {gMatches.length > 0 && (
                              <div style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.75rem' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                  Confrontos do {gName}:
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                  {gMatches.map((gm) => {
                                    const t1 = teams.find((t) => t.id === gm.team1Id);
                                    const t2 = teams.find((t) => t.id === gm.team2Id);
                                    const isFin = gm.status === 'encerrada' || gm.status === 'finalizada';
                                    const isLive = gm.status === 'em_andamento';

                                    const g1 = Number(gm.score?.gamesT1 ?? gm.score?.set1?.[0] ?? gm.score?.team1Score ?? 0);
                                    const g2 = Number(gm.score?.gamesT2 ?? gm.score?.set1?.[1] ?? gm.score?.team2Score ?? 0);
                                    const tb1 = Number(gm.score?.tiebreakT1 ?? gm.score?.team1Tiebreak ?? 0);
                                    const tb2 = Number(gm.score?.tiebreakT2 ?? gm.score?.team2Tiebreak ?? 0);

                                    return (
                                      <div
                                        key={gm.id}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          padding: '0.4rem 0.6rem',
                                          borderRadius: 'var(--radius-sm)',
                                          background: 'rgba(255, 255, 255, 0.03)',
                                          fontSize: '0.78rem'
                                        }}
                                      >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                                          <span style={{ fontWeight: gm.winnerId === gm.team1Id ? 700 : 500, color: gm.winnerId === gm.team1Id ? '#34d399' : '#fff' }}>
                                            {t1?.name || gm.team1Label || gm.team1Placeholder || 'Equipe 1'}
                                          </span>
                                          <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>vs</span>
                                          <span style={{ fontWeight: gm.winnerId === gm.team2Id ? 700 : 500, color: gm.winnerId === gm.team2Id ? '#34d399' : '#fff' }}>
                                            {t2?.name || gm.team2Label || gm.team2Placeholder || 'Equipe 2'}
                                          </span>
                                        </div>
                                        <div>
                                          {isFin ? (
                                            <span style={{ fontWeight: 800, color: '#facc15' }}>
                                              {g1} x {g2}
                                              {(tb1 > 0 || tb2 > 0) && (
                                                <sup style={{ fontSize: '0.65rem', color: '#38bdf8', marginLeft: '2px' }}>
                                                  ({tb1}-{tb2})
                                                </sup>
                                              )}
                                            </span>
                                          ) : isLive ? (
                                            <span className="badge badge-andamento" style={{ fontSize: '0.65rem' }}>Em Jogo</span>
                                          ) : (
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Agendado</span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>Selecione uma categoria acima.</p>
          )}
        </div>
      )}
    </div>
  );
};

