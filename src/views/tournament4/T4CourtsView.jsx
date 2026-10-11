import React from 'react';
import { useTournament4 } from '../../context/Tournament4Context';
import { LayoutGrid, Clock, Shield, CheckCircle, AlertCircle, PlayCircle } from 'lucide-react';

export const T4CourtsView = () => {
  const { courts, ties, teams, assignCourtToTie, unassignCourt, setScoreModalData } = useTournament4();

  const getTeam = (teamId) => teams.find((t) => t.id === teamId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header */}
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
              Ao Vivo nas Quadras • Torneio 4 Atletas
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Mapa das Quadras & Jogos Ao Vivo
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Acompanhe quais confrontos estão em andamento em cada quadra e gerencie a ocupação.
          </p>
        </div>
      </div>

      {/* Courts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {courts.map((court) => {
          const currentTie = ties.find((t) => t.courtId === court.id);
          const isOccupied = !!currentTie;
          const t1 = currentTie ? getTeam(currentTie.team1Id) : null;
          const t2 = currentTie ? getTeam(currentTie.team2Id) : null;

          return (
            <div
              key={court.id}
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${isOccupied ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-color)'}`,
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: isOccupied ? '0 8px 30px rgba(239, 68, 68, 0.15)' : 'var(--shadow-md)',
                position: 'relative'
              }}
            >
              {/* Court Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LayoutGrid size={18} color="var(--accent-cyan)" />
                  <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--text-primary)' }}>{court.name}</h3>
                </div>

                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: isOccupied ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.15)',
                    color: isOccupied ? 'var(--status-live)' : 'var(--primary)',
                    letterSpacing: '0.04em'
                  }}
                >
                  {isOccupied ? 'EM ANDAMENTO' : 'LIVRE'}
                </span>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Piso: <strong style={{ color: 'var(--text-secondary)' }}>{court.surface}</strong>
              </div>

              {/* Match info if occupied */}
              {isOccupied && currentTie ? (
                <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '1.25rem', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{currentTie.round} • {currentTie.group}</span>
                    <span>Início: {currentTie.startTime}</span>
                  </div>

                  {/* Team vs Team with score */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: t1?.color || 'var(--text-primary)' }}>
                        {t1?.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cap: {t1?.captain}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#090d16', padding: '6px 14px', borderRadius: '10px', border: '1px solid var(--border-color)', fontWeight: 900, fontSize: '1.2rem' }}>
                      <span style={{ color: currentTie.score.disputesWonT1 > currentTie.score.disputesWonT2 ? 'var(--primary)' : '#fff' }}>
                        {currentTie.score.disputesWonT1}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>:</span>
                      <span style={{ color: currentTie.score.disputesWonT2 > currentTie.score.disputesWonT1 ? 'var(--primary)' : '#fff' }}>
                        {currentTie.score.disputesWonT2}
                      </span>
                    </div>

                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: t2?.color || 'var(--text-primary)' }}>
                        {t2?.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cap: {t2?.captain}</div>
                    </div>
                  </div>

                  {/* Progress of 5 disputes */}
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '8px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Disputas:</div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {currentTie.disputes.map((d) => (
                        <div
                          key={d.id}
                          style={{
                            flex: 1,
                            height: '6px',
                            borderRadius: '3px',
                            background: d.status === 'finalizada' ? 'var(--primary)' : d.status === 'em_andamento' ? 'var(--status-live)' : 'rgba(255, 255, 255, 0.1)'
                          }}
                          title={`${d.label}: ${d.status}`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => unassignCourt(court.id)}
                    style={{
                      marginTop: '4px',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    Liberar Quadra
                  </button>
                </div>
              ) : (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', background: 'rgba(0, 0, 0, 0.15)', borderRadius: '14px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '0.85rem' }}>Quadra disponível para jogo</div>
                  <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--primary)' }}>
                    Atribua um confronto na tela de Confrontos
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
