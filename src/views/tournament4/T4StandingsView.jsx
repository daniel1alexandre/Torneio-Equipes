import React from 'react';
import { useTournament4 } from '../../context/Tournament4Context';
import { Award, Trophy, Medal, HelpCircle, Shield, TrendingUp, Info } from 'lucide-react';

export const T4StandingsView = () => {
  const { standings, teams, ties } = useTournament4();

  const getRankBadge = (index) => {
    if (index === 0) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fbbf24, #d97706)',
            color: '#000',
            fontWeight: 800,
            fontSize: '0.85rem',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
          }}
        >
          1º
        </span>
      );
    }
    if (index === 1) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #94a3b8, #64748b)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '0.85rem'
          }}
        >
          2º
        </span>
      );
    }
    if (index === 2) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #b45309, #78350f)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '0.85rem'
          }}
        >
          3º
        </span>
      );
    }
    return (
      <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.9rem', width: '28px', textAlign: 'center', display: 'inline-block' }}>
        {index + 1}º
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
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
                background: 'rgba(245, 158, 11, 0.2)',
                color: 'var(--accent-amber)',
                padding: '4px 10px',
                borderRadius: '6px',
                letterSpacing: '0.05em'
              }}
            >
              Classificação Oficial • Torneio 4 Atletas
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Tabela Geral de Equipes (4 Atletas)
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Classificação calculada automaticamente por Confrontos Vencidos, Saldo de Disputas e Saldo de Games.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total de Equipes</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{teams.length}</div>
          </div>
          <div style={{ width: '1px', height: '36px', background: 'var(--border-color)' }}></div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confrontos Totais</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{ties.length}</div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderBottom: '1px solid var(--border-color)',
                  color: 'var(--text-muted)',
                  fontSize: '0.76rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                <th style={{ padding: '14px 16px', textAlign: 'center', width: '60px' }}>Pos</th>
                <th style={{ padding: '14px 16px' }}>Equipe & Capitão</th>
                <th style={{ padding: '14px 12px', textAlign: 'center', width: '65px' }} title="Confrontos Jogados">CJ</th>
                <th style={{ padding: '14px 12px', textAlign: 'center', width: '65px', color: 'var(--primary)' }} title="Vitórias em Confrontos">V</th>
                <th style={{ padding: '14px 12px', textAlign: 'center', width: '65px', color: 'var(--accent-rose)' }} title="Derrotas em Confrontos">D</th>
                <th style={{ padding: '14px 12px', textAlign: 'center', width: '65px' }} title="Disputas Ganhas (Jogos)">DG</th>
                <th style={{ padding: '14px 12px', textAlign: 'center', width: '65px' }} title="Disputas Perdidas (Jogos)">DP</th>
                <th style={{ padding: '14px 12px', textAlign: 'center', width: '75px', fontWeight: 700 }} title="Saldo de Disputas (DG - DP)">SD</th>
                <th style={{ padding: '14px 12px', textAlign: 'center', width: '65px' }} title="Games Pró">GP</th>
                <th style={{ padding: '14px 12px', textAlign: 'center', width: '65px' }} title="Games Contra">GC</th>
                <th style={{ padding: '14px 12px', textAlign: 'center', width: '75px' }} title="Saldo de Games (GP - GC)">SG</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', width: '85px', color: 'var(--accent-amber)', fontWeight: 800 }} title="Pontos">PTS</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row, index) => {
                const team = row.team;
                const isLeader = index === 0;

                return (
                  <tr
                    key={team.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      background: isLeader ? 'rgba(245, 158, 11, 0.04)' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                  >
                    {/* Pos */}
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      {getRankBadge(index)}
                    </td>

                    {/* Team */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: team.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            color: '#fff',
                            boxShadow: `0 3px 10px ${team.color}44`
                          }}
                        >
                          {team.logoText || '⚡'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                            {team.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Capitão: {team.captain} • {team.city}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* CJ */}
                    <td style={{ padding: '14px 12px', textAlign: 'center', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {row.tiesPlayed}
                    </td>

                    {/* V */}
                    <td style={{ padding: '14px 12px', textAlign: 'center', fontWeight: 800, color: 'var(--primary)' }}>
                      {row.tiesWon}
                    </td>

                    {/* D */}
                    <td style={{ padding: '14px 12px', textAlign: 'center', fontWeight: 700, color: 'var(--accent-rose)' }}>
                      {row.tiesLost}
                    </td>

                    {/* DG */}
                    <td style={{ padding: '14px 12px', textAlign: 'center', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {row.disputesWon}
                    </td>

                    {/* DP */}
                    <td style={{ padding: '14px 12px', textAlign: 'center', fontWeight: 500, color: 'var(--text-muted)' }}>
                      {row.disputesLost}
                    </td>

                    {/* SD */}
                    <td
                      style={{
                        padding: '14px 12px',
                        textAlign: 'center',
                        fontWeight: 800,
                        color: row.disputesDiff > 0 ? 'var(--primary)' : row.disputesDiff < 0 ? 'var(--accent-rose)' : 'var(--text-muted)'
                      }}
                    >
                      {row.disputesDiff > 0 ? `+${row.disputesDiff}` : row.disputesDiff}
                    </td>

                    {/* GP */}
                    <td style={{ padding: '14px 12px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      {row.gamesFor}
                    </td>

                    {/* GC */}
                    <td style={{ padding: '14px 12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      {row.gamesAgainst}
                    </td>

                    {/* SG */}
                    <td
                      style={{
                        padding: '14px 12px',
                        textAlign: 'center',
                        fontWeight: 700,
                        color: row.gamesDiff > 0 ? 'var(--accent-cyan)' : row.gamesDiff < 0 ? 'var(--accent-rose)' : 'var(--text-muted)'
                      }}
                    >
                      {row.gamesDiff > 0 ? `+${row.gamesDiff}` : row.gamesDiff}
                    </td>

                    {/* PTS */}
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <span
                        style={{
                          background: isLeader ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                          color: isLeader ? 'var(--accent-amber)' : 'var(--text-primary)',
                          fontWeight: 900,
                          fontSize: '1rem',
                          padding: '4px 12px',
                          borderRadius: '10px',
                          border: isLeader ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-color)'
                        }}
                      >
                        {row.points}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanatory Criteria Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            <Award size={18} color="var(--accent-amber)" />
            Critérios Oficiais de Desempate (4 Atletas)
          </div>
          <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <li><strong>1º Maior número de Vitórias em Confrontos (V)</strong></li>
            <li><strong>2º Maior Saldo de Disputas (SD = DG - DP)</strong></li>
            <li><strong>3º Maior número de Disputas Ganhas (DG)</strong></li>
            <li><strong>4º Maior Saldo de Games (SG = GP - GC)</strong></li>
            <li><strong>5º Maior número de Games Pró (GP)</strong></li>
            <li><strong>6º Confronto Direto entre as equipes empatadas</strong></li>
          </ol>
        </div>

        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            <Info size={18} color="var(--accent-cyan)" />
            Legenda da Tabela
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div><strong>CJ:</strong> Confrontos Jogados</div>
            <div><strong>V / D:</strong> Vitórias / Derrotas</div>
            <div><strong>DG:</strong> Disputas Ganhas</div>
            <div><strong>DP:</strong> Disputas Perdidas</div>
            <div><strong>SD:</strong> Saldo de Disputas</div>
            <div><strong>GP / GC:</strong> Games Pró / Contra</div>
            <div><strong>SG:</strong> Saldo de Games</div>
            <div><strong>PTS:</strong> 3 pts por confronto vencido</div>
          </div>
        </div>
      </div>
    </div>
  );
};
