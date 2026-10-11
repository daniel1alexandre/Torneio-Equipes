import React, { useState, useEffect } from 'react';
import { useTournament4 } from '../../context/Tournament4Context';
import { X, CheckCircle, Shield, AlertCircle, HeartHandshake, User, Users } from 'lucide-react';

const T4LineupModalContent = ({ tie }) => {
  const { setLineupModalTie, teams, saveTieLineup } = useTournament4();

  const team1 = teams.find((t) => t.id === tie.team1Id);
  const team2 = teams.find((t) => t.id === tie.team2Id);

  // Local state for Team 1 lineup
  const [l1MixedMan, setL1MixedMan] = useState(tie.lineupTeam1?.mixedManId || team1?.athletes.men[0]?.id || '');
  const [l1MixedWoman, setL1MixedWoman] = useState(tie.lineupTeam1?.mixedWomanId || team1?.athletes.women[0]?.id || '');
  const [l1SinglesMan, setL1SinglesMan] = useState(tie.lineupTeam1?.singlesManId || team1?.athletes.men[1]?.id || '');
  const [l1SinglesWoman, setL1SinglesWoman] = useState(tie.lineupTeam1?.singlesWomanId || team1?.athletes.women[1]?.id || '');
  const [l1Confirmed, setL1Confirmed] = useState(tie.lineupTeam1?.confirmed || false);

  // Local state for Team 2 lineup
  const [l2MixedMan, setL2MixedMan] = useState(tie.lineupTeam2?.mixedManId || team2?.athletes.men[0]?.id || '');
  const [l2MixedWoman, setL2MixedWoman] = useState(tie.lineupTeam2?.mixedWomanId || team2?.athletes.women[0]?.id || '');
  const [l2SinglesMan, setL2SinglesMan] = useState(tie.lineupTeam2?.singlesManId || team2?.athletes.men[1]?.id || '');
  const [l2SinglesWoman, setL2SinglesWoman] = useState(tie.lineupTeam2?.singlesWomanId || team2?.athletes.women[1]?.id || '');
  const [l2Confirmed, setL2Confirmed] = useState(tie.lineupTeam2?.confirmed || false);

  const handleSave = () => {
    saveTieLineup(tie.id, {
      lineupTeam1: {
        confirmed: l1Confirmed,
        mixedManId: l1MixedMan,
        mixedWomanId: l1MixedWoman,
        singlesManId: l1SinglesMan,
        singlesWomanId: l1SinglesWoman
      },
      lineupTeam2: {
        confirmed: l2Confirmed,
        mixedManId: l2MixedMan,
        mixedWomanId: l2MixedWoman,
        singlesManId: l2SinglesMan,
        singlesWomanId: l2SinglesWoman
      }
    });
    setLineupModalTie(null);
  };

  const renderTeamLineupCard = (team, isTeam1) => {
    if (!team) return null;

    const mixedMan = isTeam1 ? l1MixedMan : l2MixedMan;
    const setMixedMan = isTeam1 ? setL1MixedMan : setL2MixedMan;

    const mixedWoman = isTeam1 ? l1MixedWoman : l2MixedWoman;
    const setMixedWoman = isTeam1 ? setL1MixedWoman : setL2MixedWoman;

    const singlesMan = isTeam1 ? l1SinglesMan : l2SinglesMan;
    const setSinglesMan = isTeam1 ? setL1SinglesMan : setL2SinglesMan;

    const singlesWoman = isTeam1 ? l1SinglesWoman : l2SinglesWoman;
    const setSinglesWoman = isTeam1 ? setL1SinglesWoman : setL2SinglesWoman;

    const confirmed = isTeam1 ? l1Confirmed : l2Confirmed;
    const setConfirmed = isTeam1 ? setL1Confirmed : setL2Confirmed;

    const men = team.athletes?.men || [];
    const women = team.athletes?.women || [];

    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: `1px solid ${confirmed ? 'var(--primary)' : 'var(--border-color)'}`,
          borderRadius: '16px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          position: 'relative'
        }}
      >
        {/* Team Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: team.color,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.2rem',
                boxShadow: `0 4px 12px ${team.color}55`
              }}
            >
              {team.logoText || '🎾'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)' }}>{team.name}</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Capitão: {team.captain}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setConfirmed(!confirmed)}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: confirmed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: confirmed ? 'var(--primary)' : 'var(--accent-rose)',
              border: `1px solid ${confirmed ? 'var(--primary)' : 'rgba(239, 68, 68, 0.3)'}`,
              cursor: 'pointer'
            }}
          >
            <CheckCircle size={14} />
            {confirmed ? 'Escalação Confirmada' : 'Confirmar Escalação'}
          </button>
        </div>

        {/* Info fixed games */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: '8px' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Dupla Masculina (Obrigatória)</div>
            <strong style={{ color: 'var(--accent-cyan)' }}>{men[0]?.name || 'H1'} & {men[1]?.name || 'H2'}</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Dupla Feminina (Obrigatória)</div>
            <strong style={{ color: 'var(--accent-rose)' }}>{women[0]?.name || 'M1'} & {women[1]?.name || 'M2'}</strong>
          </div>
        </div>

        {/* Lineup Pickers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HeartHandshake size={16} color="var(--accent-amber)" />
            Escalação da Dupla Mista
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Homem na Mista:
              </label>
              <select
                className="input-select"
                value={mixedMan}
                onChange={(e) => setMixedMan(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', fontSize: '0.85rem', background: '#0f172a', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              >
                {men.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.nickname ? `(${m.nickname})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Mulher na Mista:
              </label>
              <select
                className="input-select"
                value={mixedWoman}
                onChange={(e) => setMixedWoman(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', fontSize: '0.85rem', background: '#0f172a', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              >
                {women.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} {w.nickname ? `(${w.nickname})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '4px' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <User size={15} color="var(--accent-cyan)" />
                Simples Masculina
              </div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Atleta Escalado:
              </label>
              <select
                className="input-select"
                value={singlesMan}
                onChange={(e) => setSinglesMan(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', fontSize: '0.85rem', background: '#0f172a', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              >
                {men.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.nickname ? `(${m.nickname})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <User size={15} color="var(--accent-rose)" />
                Simples Feminina
              </div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Atleta Escalada:
              </label>
              <select
                className="input-select"
                value={singlesWoman}
                onChange={(e) => setSinglesWoman(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', fontSize: '0.85rem', background: '#0f172a', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}
              >
                {women.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} {w.nickname ? `(${w.nickname})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
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
          maxWidth: '850px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
          padding: '1.75rem'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--primary)', padding: '3px 8px', borderRadius: '6px' }}>
                {tie.round} • {tie.group}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Horário: {tie.startTime}</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', margin: '4px 0 0 0', color: 'var(--text-primary)' }}>
              Definição de Escalação Prévia
            </h2>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Cada equipe deve registrar quem disputará a Dupla Mista, Simples Masc e Simples Fem antes do confronto.
            </p>
          </div>

          <button
            onClick={() => setLineupModalTie(null)}
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

        {/* Warning Alert */}
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '12px', padding: '10px 14px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: 'var(--accent-amber)' }}>
          <AlertCircle size={18} />
          <span>Regra Oficial: Todos os 4 atletas jogam. As duplas masculina e feminina utilizam ambos os atletas de cada gênero. A escalação define a dupla mista e os atletas de simples.</span>
        </div>

        {/* Teams Side-by-Side Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {renderTeamLineupCard(team1, true)}
          {renderTeamLineupCard(team2, false)}
        </div>

        {/* Modal Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <button
            onClick={() => setLineupModalTie(null)}
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
            Salvar e Confirmar Escalação
          </button>
        </div>
      </div>
    </div>
  );
};

export const T4LineupModal = () => {
  const { lineupModalTie } = useTournament4();
  if (!lineupModalTie) return null;
  return <T4LineupModalContent tie={lineupModalTie} />;
};
