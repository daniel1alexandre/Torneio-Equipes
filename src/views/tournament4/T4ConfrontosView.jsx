import React, { useState } from 'react';
import { useTournament4 } from '../../context/Tournament4Context';
import {
  Calendar,
  Clock,
  Shield,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
  RotateCcw,
  PlusCircle,
  Flame,
  LayoutGrid
} from 'lucide-react';

export const T4ConfrontosView = () => {
  const {
    ties,
    teams,
    courts,
    setLineupModalTie,
    setScoreModalData,
    generateAllTies,
    resetToDefaultT4
  } = useTournament4();

  const [expandedTieIds, setExpandedTieIds] = useState(() => {
    // Expand the first tie by default
    return ties[0] ? [ties[0].id] : [];
  });
  const [filterStatus, setFilterStatus] = useState('todos');

  const toggleExpand = (tieId) => {
    setExpandedTieIds((prev) =>
      prev.includes(tieId) ? prev.filter((id) => id !== tieId) : [...prev, tieId]
    );
  };

  const getTeam = (teamId) => teams.find((t) => t.id === teamId);
  const getCourt = (courtId) => courts.find((c) => c.id === courtId);

  const filteredTies = ties.filter((tie) => {
    if (filterStatus === 'todos') return true;
    if (filterStatus === 'em_andamento') return tie.status === 'em_andamento';
    if (filterStatus === 'finalizado') return tie.status === 'finalizado';
    if (filterStatus === 'pendente') return tie.status === 'pendente_escalacao';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* View Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
          border: '1px solid var(--border-highlight)',
          borderRadius: '20px',
          padding: '1.5rem 1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                background: 'rgba(6, 182, 212, 0.2)',
                color: 'var(--accent-cyan)',
                padding: '4px 10px',
                borderRadius: '6px',
                letterSpacing: '0.05em'
              }}
            >
              Torneio 4 Atletas • 5 Disputas por Confronto
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              2 Homens & 2 Mulheres por equipe
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Tabela de Confrontos & Súmulas
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Acompanhe o placar geral (melhor de 5 disputas), escale os atletas antes do jogo e registre o resultado de cada partida.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              if (window.confirm('Deseja gerar a tabela de confrontos entre todas as equipes cadastradas?')) {
                generateAllTies();
              }
            }}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.06)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Zap size={16} color="var(--accent-cyan)" />
            Gerar Tabela Todos x Todos
          </button>

          <button
            onClick={() => {
              if (window.confirm('Deseja restaurar os dados de demonstração do torneio 4 atletas?')) {
                resetToDefaultT4();
              }
            }}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.04)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={15} />
            Resetar Demo
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setFilterStatus('todos')}
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: filterStatus === 'todos' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
              color: filterStatus === 'todos' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Todos os Confrontos ({ties.length})
          </button>
          <button
            onClick={() => setFilterStatus('em_andamento')}
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: filterStatus === 'em_andamento' ? 'var(--status-live)' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Em Andamento ({ties.filter((t) => t.status === 'em_andamento').length})
          </button>
          <button
            onClick={() => setFilterStatus('pendente')}
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: filterStatus === 'pendente' ? 'var(--accent-amber)' : 'rgba(255,255,255,0.05)',
              color: filterStatus === 'pendente' ? '#000' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Pendente Escalação ({ties.filter((t) => t.status === 'pendente_escalacao').length})
          </button>
          <button
            onClick={() => setFilterStatus('finalizado')}
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: filterStatus === 'finalizado' ? 'var(--accent-indigo)' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Finalizados ({ties.filter((t) => t.status === 'finalizado').length})
          </button>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Mostrando {filteredTies.length} de {ties.length} confrontos
        </div>
      </div>

      {/* List of Confrontos / Ties */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredTies.map((tie) => {
          const t1 = getTeam(tie.team1Id);
          const t2 = getTeam(tie.team2Id);
          const court = getCourt(tie.courtId);
          const isExpanded = expandedTieIds.includes(tie.id);

          const l1Ok = tie.lineupTeam1.confirmed;
          const l2Ok = tie.lineupTeam2.confirmed;
          const bothLineupOk = l1Ok && l2Ok;

          const disputesWonT1 = tie.score.disputesWonT1;
          const disputesWonT2 = tie.score.disputesWonT2;

          let statusBadgeText = 'Pendente Escalação';
          let statusBadgeBg = 'rgba(245, 158, 11, 0.15)';
          let statusBadgeColor = 'var(--accent-amber)';

          if (tie.status === 'em_andamento') {
            statusBadgeText = 'AO VIVO / EM ANDAMENTO';
            statusBadgeBg = 'rgba(239, 68, 68, 0.2)';
            statusBadgeColor = 'var(--status-live)';
          } else if (tie.status === 'finalizado') {
            statusBadgeText = 'CONFRONTO ENCERRADO';
            statusBadgeBg = 'rgba(99, 102, 241, 0.2)';
            statusBadgeColor = 'var(--accent-indigo)';
          } else if (bothLineupOk) {
            statusBadgeText = 'ESCALAÇÃO CONFIRMADA (PRONTO)';
            statusBadgeBg = 'rgba(16, 185, 129, 0.15)';
            statusBadgeColor = 'var(--primary)';
          }

          return (
            <div
              key={tie.id}
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${tie.status === 'em_andamento' ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-color)'}`,
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: tie.status === 'em_andamento' ? '0 8px 30px rgba(239, 68, 68, 0.15)' : 'var(--shadow-md)',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Tie Header Bar */}
              <div
                style={{
                  padding: '1rem 1.25rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {tie.round} • {tie.group}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <Clock size={13} />
                    {tie.startTime}
                  </div>
                  {court ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>
                      <LayoutGrid size={13} />
                      {court.name}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quadra a definir</span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: statusBadgeBg,
                      color: statusBadgeColor,
                      letterSpacing: '0.04em'
                    }}
                  >
                    {statusBadgeText}
                  </span>

                  <button
                    onClick={() => setLineupModalTie(tie)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: bothLineupOk ? 'rgba(16, 185, 129, 0.15)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: bothLineupOk ? 'var(--primary)' : '#000',
                      border: bothLineupOk ? '1px solid var(--primary)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Shield size={14} />
                    {bothLineupOk ? 'Editar Escalação' : 'Definir Escalação (Obrigatório)'}
                  </button>

                  <button
                    onClick={() => toggleExpand(tie.id)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.78rem'
                    }}
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Main Scoreboard Banner */}
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  alignItems: 'center',
                  gap: '1.5rem',
                  background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.02) 0%, transparent 70%)'
                }}
              >
                {/* Team 1 Card */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: t1?.color || 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      color: '#fff',
                      boxShadow: `0 4px 16px ${t1?.color || '#10b981'}44`
                    }}
                  >
                    {t1?.logoText || '⚡'}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-primary)', fontWeight: 800 }}>
                      {t1?.name}
                    </h2>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span>Capitão: {t1?.captain}</span>
                      <span>•</span>
                      <span style={{ color: l1Ok ? 'var(--primary)' : 'var(--accent-amber)', fontWeight: 600 }}>
                        {l1Ok ? '✓ Escalação OK' : '⚠ Sem escalação'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score in disputes (ex: 2 x 1) */}
                <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'rgba(0, 0, 0, 0.4)',
                      padding: '8px 20px',
                      borderRadius: '16px',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '2.2rem',
                        fontWeight: 900,
                        color: disputesWonT1 > disputesWonT2 ? 'var(--primary)' : '#fff'
                      }}
                    >
                      {disputesWonT1}
                    </span>
                    <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 700 }}>:</span>
                    <span
                      style={{
                        fontSize: '2.2rem',
                        fontWeight: 900,
                        color: disputesWonT2 > disputesWonT1 ? 'var(--primary)' : '#fff'
                      }}
                    >
                      {disputesWonT2}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.05em' }}>
                    Disputas Vencidas (Melhor de 5)
                  </span>
                </div>

                {/* Team 2 Card */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '14px', textAlign: 'right' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-primary)', fontWeight: 800 }}>
                      {t2?.name}
                    </h2>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '2px' }}>
                      <span style={{ color: l2Ok ? 'var(--primary)' : 'var(--accent-amber)', fontWeight: 600 }}>
                        {l2Ok ? '✓ Escalação OK' : '⚠ Sem escalação'}
                      </span>
                      <span>•</span>
                      <span>Capitão: {t2?.captain}</span>
                    </div>
                  </div>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: t2?.color || 'var(--accent-rose)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      color: '#fff',
                      boxShadow: `0 4px 16px ${t2?.color || '#f43f5e'}44`
                    }}
                  >
                    {t2?.logoText || '🦁'}
                  </div>
                </div>
              </div>

              {/* Detailed 5 Disputes Table (Expandable) */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--border-color)', padding: '1.25rem', background: 'rgba(0, 0, 0, 0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Detalhamento das 5 Disputas Oficiais
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      1 Set até 6 games • Vitória em 3 disputas decide o confronto
                    </div>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                          <th style={{ padding: '8px 12px', width: '50px' }}>Jogo</th>
                          <th style={{ padding: '8px 12px' }}>Modalidade</th>
                          <th style={{ padding: '8px 12px', width: '28%' }}>Atletas ({t1?.shortName})</th>
                          <th style={{ padding: '8px 12px', textAlign: 'center', width: '120px' }}>Placar (Games)</th>
                          <th style={{ padding: '8px 12px', width: '28%' }}>Atletas ({t2?.shortName})</th>
                          <th style={{ padding: '8px 12px', textAlign: 'center' }}>Status / Ação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tie.disputes.map((disp) => {
                          const isFinished = disp.status === 'finalizada';
                          const isLive = disp.status === 'em_andamento';
                          const t1Winner = disp.winnerTeamId === tie.team1Id;
                          const t2Winner = disp.winnerTeamId === tie.team2Id;

                          return (
                            <tr
                              key={disp.id}
                              style={{
                                borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                                background: isLive ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
                                transition: 'background 0.2s'
                              }}
                            >
                              {/* Order */}
                              <td style={{ padding: '10px 12px', fontWeight: 800, color: 'var(--text-muted)' }}>
                                #{disp.order}
                              </td>

                              {/* Type / Label */}
                              <td style={{ padding: '10px 12px' }}>
                                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{disp.label}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                  {disp.type.includes('mista') ? '1 Homem + 1 Mulher' : disp.type.includes('simples') ? 'Individual' : 'Duplas'}
                                </div>
                              </td>

                              {/* Team 1 Players */}
                              <td style={{ padding: '10px 12px' }}>
                                <span style={{ fontWeight: t1Winner ? 800 : 500, color: t1Winner ? 'var(--primary)' : 'var(--text-primary)' }}>
                                  {disp.team1Players}
                                </span>
                                {t1Winner && (
                                  <span style={{ marginLeft: '6px', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>
                                    ✓ Venceu
                                  </span>
                                )}
                              </td>

                              {/* Score Games */}
                              <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                <div
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: '#090d16',
                                    padding: '4px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    fontWeight: 800,
                                    fontSize: '0.95rem'
                                  }}
                                >
                                  <span style={{ color: t1Winner ? 'var(--primary)' : '#fff' }}>{disp.gamesT1}</span>
                                  <span style={{ color: 'var(--text-muted)' }}>-</span>
                                  <span style={{ color: t2Winner ? 'var(--primary)' : '#fff' }}>{disp.gamesT2}</span>
                                  {disp.tiebreakT1 !== null && disp.tiebreakT2 !== null && (
                                    <span style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', marginLeft: '2px' }}>
                                      ({disp.tiebreakT1}-{disp.tiebreakT2})
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Team 2 Players */}
                              <td style={{ padding: '10px 12px' }}>
                                <span style={{ fontWeight: t2Winner ? 800 : 500, color: t2Winner ? 'var(--primary)' : 'var(--text-primary)' }}>
                                  {disp.team2Players}
                                </span>
                                {t2Winner && (
                                  <span style={{ marginLeft: '6px', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>
                                    ✓ Venceu
                                  </span>
                                )}
                              </td>

                              {/* Action */}
                              <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                <button
                                  onClick={() => setScoreModalData({ tieId: tie.id, disputeId: disp.id })}
                                  style={{
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    background: isFinished
                                      ? 'rgba(255, 255, 255, 0.06)'
                                      : isLive
                                      ? 'rgba(239, 68, 68, 0.2)'
                                      : 'rgba(6, 182, 212, 0.15)',
                                    color: isFinished
                                      ? 'var(--text-secondary)'
                                      : isLive
                                      ? 'var(--status-live)'
                                      : 'var(--accent-cyan)',
                                    border: '1px solid var(--border-color)',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {isFinished ? 'Editar Súmula' : isLive ? 'Ao Vivo (Lançar)' : 'Lançar Placar'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
