import React, { useState, useEffect } from 'react';
import { useTournament4 } from '../../context/Tournament4Context';
import { X, Trophy, CheckCircle, Flame, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const T4ScoreModalContent = ({ tie, dispute }) => {
  const {
    setScoreModalData,
    teams,
    updateDisputeScore
  } = useTournament4();

  const team1 = teams.find((t) => t.id === tie.team1Id);
  const team2 = teams.find((t) => t.id === tie.team2Id);

  const [gamesT1, setGamesT1] = useState(dispute.gamesT1 || 0);
  const [gamesT2, setGamesT2] = useState(dispute.gamesT2 || 0);
  const [tiebreakT1, setTiebreakT1] = useState(dispute.tiebreakT1 !== null ? dispute.tiebreakT1 : '');
  const [tiebreakT2, setTiebreakT2] = useState(dispute.tiebreakT2 !== null ? dispute.tiebreakT2 : '');
  const [selectedWinnerId, setSelectedWinnerId] = useState(dispute.winnerTeamId || '');
  const [status, setStatus] = useState(dispute.status || 'em_andamento');

  const isTiebreak =
    (Number(gamesT1) === 6 && Number(gamesT2) === 6) ||
    (Number(gamesT1) === 7 && Number(gamesT2) === 6) ||
    (Number(gamesT1) === 6 && Number(gamesT2) === 7);

  // Auto-detect winner based on tennis/beach tennis 1 set to 6 rule
  useEffect(() => {
    const g1 = Number(gamesT1);
    const g2 = Number(gamesT2);
    const tb1 = Number(tiebreakT1);
    const tb2 = Number(tiebreakT2);

    if (g1 === 7 && g2 === 5) {
      setSelectedWinnerId(tie.team1Id);
      setStatus('finalizada');
    } else if (g2 === 7 && g1 === 5) {
      setSelectedWinnerId(tie.team2Id);
      setStatus('finalizada');
    } else if (g1 === 6 && g2 <= 4) {
      setSelectedWinnerId(tie.team1Id);
      setStatus('finalizada');
    } else if (g2 === 6 && g1 <= 4) {
      setSelectedWinnerId(tie.team2Id);
      setStatus('finalizada');
    } else if (g1 === 7 && g2 === 6 && tb1 >= 7 && tb1 - tb2 >= 2) {
      setSelectedWinnerId(tie.team1Id);
      setStatus('finalizada');
    } else if (g2 === 7 && g1 === 6 && tb2 >= 7 && tb2 - tb1 >= 2) {
      setSelectedWinnerId(tie.team2Id);
      setStatus('finalizada');
    }
  }, [gamesT1, gamesT2, tiebreakT1, tiebreakT2, tie.team1Id, tie.team2Id]);

  const handleSave = () => {
    if (status === 'finalizada' && selectedWinnerId) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }

    updateDisputeScore(tie.id, dispute.id, {
      gamesT1: Number(gamesT1),
      gamesT2: Number(gamesT2),
      tiebreakT1: isTiebreak && tiebreakT1 !== '' ? Number(tiebreakT1) : null,
      tiebreakT2: isTiebreak && tiebreakT2 !== '' ? Number(tiebreakT2) : null,
      status,
      winnerTeamId: selectedWinnerId || null
    });

    setScoreModalData(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-highlight)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '620px',
          padding: '1.75rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '4px' }}>
                Disputa #{dispute.order}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tie.round} • {tie.group}</span>
            </div>
            <h2 style={{ fontSize: '1.3rem', margin: '4px 0 0 0', color: 'var(--text-primary)' }}>
              {dispute.label}
            </h2>
          </div>

          <button
            onClick={() => setScoreModalData(null)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Confronto Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', background: 'rgba(0, 0, 0, 0.25)', padding: '1.25rem', borderRadius: '16px' }}>
          {/* Team 1 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: team1?.color || 'var(--text-primary)' }}>
              {team1?.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {dispute.team1Players}
            </div>

            <div style={{ marginTop: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Games Vencidos
              </label>
              <input
                type="number"
                min="0"
                max="7"
                value={gamesT1}
                onChange={(e) => setGamesT1(Math.max(0, parseInt(e.target.value) || 0))}
                style={{
                  width: '70px',
                  height: '56px',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  textAlign: 'center',
                  background: '#090d16',
                  color: '#fff',
                  border: '2px solid var(--border-color)',
                  borderRadius: '12px'
                }}
              />
            </div>
          </div>

          {/* VS Divider */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>VS</span>
            <div style={{ width: '2px', height: '24px', background: 'var(--border-color)' }}></div>
          </div>

          {/* Team 2 */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: team2?.color || 'var(--text-primary)' }}>
              {team2?.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {dispute.team2Players}
            </div>

            <div style={{ marginTop: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Games Vencidos
              </label>
              <input
                type="number"
                min="0"
                max="7"
                value={gamesT2}
                onChange={(e) => setGamesT2(Math.max(0, parseInt(e.target.value) || 0))}
                style={{
                  width: '70px',
                  height: '56px',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  textAlign: 'center',
                  background: '#090d16',
                  color: '#fff',
                  border: '2px solid var(--border-color)',
                  borderRadius: '12px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Tiebreak inputs if active */}
        {isTiebreak && (
          <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={16} />
              Tiebreak Ativado (6x6) - Digite a pontuação do Tiebreak (mínimo 7 pontos com vantagem de 2):
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>{team1?.shortName}:</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={tiebreakT1}
                  onChange={(e) => setTiebreakT1(e.target.value)}
                  style={{ width: '60px', padding: '8px', fontSize: '1.2rem', fontWeight: 700, textAlign: 'center', background: '#090d16', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
              </div>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>x</span>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>{team2?.shortName}:</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={tiebreakT2}
                  onChange={(e) => setTiebreakT2(e.target.value)}
                  style={{ width: '60px', padding: '8px', fontSize: '1.2rem', fontWeight: 700, textAlign: 'center', background: '#090d16', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Status & Vencedor */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Status da Disputa:
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: '100%', padding: '10px', fontSize: '0.85rem', background: '#0f172a', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}
            >
              <option value="agendada">Agendada</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="finalizada">Finalizada (Encerrar)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Equipe Vencedora do Jogo:
            </label>
            <select
              value={selectedWinnerId}
              onChange={(e) => setSelectedWinnerId(e.target.value)}
              style={{ width: '100%', padding: '10px', fontSize: '0.85rem', background: '#0f172a', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}
            >
              <option value="">Ainda indefinido</option>
              <option value={team1?.id}>{team1?.name}</option>
              <option value={team2?.id}>{team2?.name}</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <button
            onClick={() => setScoreModalData(null)}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            style={{
              padding: '10px 22px',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--primary), #059669)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px var(--primary-glow)'
            }}
          >
            <CheckCircle size={18} />
            Salvar Placar da Disputa
          </button>
        </div>
      </div>
    </div>
  );
};

export const T4ScoreModal = () => {
  const { scoreModalData, ties } = useTournament4();
  if (!scoreModalData) return null;

  const tie = ties.find((t) => t.id === scoreModalData.tieId);
  if (!tie) return null;

  const dispute = tie.disputes.find((d) => d.id === scoreModalData.disputeId);
  if (!dispute) return null;

  return <T4ScoreModalContent tie={tie} dispute={dispute} />;
};
