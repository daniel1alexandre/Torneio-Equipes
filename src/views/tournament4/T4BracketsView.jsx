import React from 'react';
import { useTournament4 } from '../../context/Tournament4Context';
import {
  GitFork,
  Trophy,
  Shield,
  Clock,
  LayoutGrid,
  CheckCircle,
  Play,
  RotateCcw,
  UserCheck,
  Award,
  Sparkles
} from 'lucide-react';

export const T4BracketsView = () => {
  const {
    ties,
    teams,
    courts,
    setLineupModalTie,
    setScoreModalData,
    generateSingleEliminationBracket,
    resetToDefaultT4
  } = useTournament4();

  const getTeam = (teamId) => teams.find((t) => t.id === teamId);
  const getCourt = (courtId) => courts.find((c) => c.id === courtId);

  // Agrupar confrontos por rodadas do mata-mata
  const rounds = {};
  ties.forEach((tie) => {
    const r = tie.round || 1;
    if (!rounds[r]) rounds[r] = [];
    rounds[r].push(tie);
  });
  const roundKeys = Object.keys(rounds).sort((a, b) => Number(a) - Number(b));

  const getRoundTitle = (roundNum, roundTies) => {
    if (roundTies.some((t) => t.phase.toLowerCase().includes('final') && !t.phase.toLowerCase().includes('semi'))) {
      return 'Finais & Pódio';
    }
    if (roundTies.some((t) => t.phase.toLowerCase().includes('semi'))) {
      return 'Semifinais';
    }
    if (roundTies.some((t) => t.phase.toLowerCase().includes('quarta'))) {
      return 'Quartas de Final';
    }
    return `Fase Eliminatória ${roundNum}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
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
              Mata-Mata Direto • Eliminatória Simples
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {teams.length} Equipes Inscritas
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Chaveamento Oficial (Eliminatória Simples)
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Formato oficial mata-mata: o vencedor do confronto (3 de 5 disputas) avança automaticamente para a próxima fase.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              if (window.confirm('Deseja sortear e regenerar o chaveamento em eliminatória simples com todas as equipes?')) {
                generateSingleEliminationBracket();
              }
            }}
            style={{
              padding: '9px 16px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--accent-cyan), #0284c7)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
            }}
          >
            <GitFork size={16} />
            Regenerar Chaveamento ({teams.length} Equipes)
          </button>
        </div>
      </div>

      {/* Visual Bracket Grid (Colunas de Fases) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${roundKeys.length}, minmax(320px, 1fr))`,
          gap: '1.5rem',
          overflowX: 'auto',
          paddingBottom: '1rem'
        }}
      >
        {roundKeys.map((roundKey) => {
          const roundTies = rounds[roundKey];
          const roundTitle = getRoundTitle(roundKey, roundTies);

          return (
            <div
              key={roundKey}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                minWidth: '320px'
              }}
            >
              {/* Round Header */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  {roundTitle}
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: 'rgba(6, 182, 212, 0.15)',
                    color: 'var(--accent-cyan)',
                    padding: '2px 8px',
                    borderRadius: '10px'
                  }}
                >
                  {roundTies.length} {roundTies.length === 1 ? 'confronto' : 'confrontos'}
                </span>
              </div>

              {/* Ties in this round */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {roundTies.map((tie) => {
                  const t1 = getTeam(tie.team1Id);
                  const t2 = getTeam(tie.team2Id);
                  const court = getCourt(tie.courtId);
                  const isFinished = tie.status === 'finalizado';
                  const isLive = tie.status === 'em_andamento';

                  const t1Winner = isFinished && tie.score.winnerId === tie.team1Id;
                  const t2Winner = isFinished && tie.score.winnerId === tie.team2Id;

                  return (
                    <div
                      key={tie.id}
                      style={{
                        background: 'var(--bg-card)',
                        border: `1px solid ${isLive ? 'var(--status-live)' : isFinished ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)'}`,
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: isLive ? '0 6px 20px rgba(239, 68, 68, 0.2)' : 'var(--shadow-sm)'
                      }}
                    >
                      {/* Card Header */}
                      <div
                        style={{
                          padding: '8px 12px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          borderBottom: '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.75rem'
                        }}
                      >
                        <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{tie.phase}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                          <Clock size={12} />
                          <span>{tie.startTime || 'A definir'}</span>
                          {court && <span style={{ color: 'var(--primary)' }}>• {court.name}</span>}
                        </div>
                      </div>

                      {/* Team 1 Slot */}
                      <div
                        style={{
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          background: t1Winner ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                          borderLeft: `4px solid ${t1?.color || '#06b6d4'}`
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1rem' }}>{t1?.logoText || '⚡'}</span>
                          <div>
                            <div style={{ fontWeight: t1Winner ? 800 : 600, color: t1Winner ? 'var(--primary)' : 'var(--text-primary)', fontSize: '0.9rem' }}>
                              {t1?.name || tie.team1Label}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                              Cap: {t1?.captain || 'A definir'}
                            </div>
                          </div>
                        </div>

                        <span style={{ fontWeight: 900, fontSize: '1.25rem', color: t1Winner ? 'var(--primary)' : '#fff' }}>
                          {tie.score.disputesWonT1}
                        </span>
                      </div>

                      {/* Team 2 Slot */}
                      <div
                        style={{
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: t2Winner ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                          borderLeft: `4px solid ${t2?.color || '#f59e0b'}`
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1rem' }}>{t2?.logoText || '🦁'}</span>
                          <div>
                            <div style={{ fontWeight: t2Winner ? 800 : 600, color: t2Winner ? 'var(--primary)' : 'var(--text-primary)', fontSize: '0.9rem' }}>
                              {t2?.name || tie.team2Label}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                              Cap: {t2?.captain || 'A definir'}
                            </div>
                          </div>
                        </div>

                        <span style={{ fontWeight: 900, fontSize: '1.25rem', color: t2Winner ? 'var(--primary)' : '#fff' }}>
                          {tie.score.disputesWonT2}
                        </span>
                      </div>

                      {/* Bottom Quick Actions */}
                      <div
                        style={{
                          padding: '8px 12px',
                          background: 'rgba(0, 0, 0, 0.25)',
                          borderTop: '1px solid var(--border-color)',
                          display: 'flex',
                          gap: '6px'
                        }}
                      >
                        <button
                          onClick={() => setLineupModalTie(tie)}
                          disabled={!tie.team1Id || !tie.team2Id}
                          style={{
                            flex: 1,
                            padding: '5px',
                            fontSize: '0.72rem',
                            borderRadius: '6px',
                            fontWeight: 700,
                            background: tie.lineupTeam1.confirmed && tie.lineupTeam2.confirmed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                            color: tie.lineupTeam1.confirmed && tie.lineupTeam2.confirmed ? 'var(--primary)' : 'var(--accent-cyan)',
                            border: 'none',
                            cursor: (!tie.team1Id || !tie.team2Id) ? 'not-allowed' : 'pointer',
                            opacity: (!tie.team1Id || !tie.team2Id) ? 0.5 : 1
                          }}
                        >
                          {tie.lineupTeam1.confirmed && tie.lineupTeam2.confirmed ? 'Escalação OK' : 'Escalar Duplas/Simples'}
                        </button>

                        <button
                          onClick={() => setScoreModalData({ tieId: tie.id, disputeId: tie.disputes[0]?.id })}
                          disabled={!tie.team1Id || !tie.team2Id}
                          style={{
                            padding: '5px 12px',
                            fontSize: '0.72rem',
                            borderRadius: '6px',
                            fontWeight: 700,
                            background: 'var(--primary)',
                            color: '#fff',
                            border: 'none',
                            cursor: (!tie.team1Id || !tie.team2Id) ? 'not-allowed' : 'pointer',
                            opacity: (!tie.team1Id || !tie.team2Id) ? 0.5 : 1
                          }}
                        >
                          Súmula / Placar
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
  );
};
