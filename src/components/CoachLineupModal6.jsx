import React, { useState, useEffect } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  X,
  CheckCircle,
  Shield,
  Users,
  User,
  HeartHandshake,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Plus,
  Flame,
  Award,
  Sparkles,
  Info
} from 'lucide-react';
import {
  isSameFormation,
  getAthleteParticipation,
  getGame3Eligibility,
  getAutoLineupGame3,
  validateTeamLineup
} from '../utils/lineupRules6';

export const CoachLineupModal6 = () => {
  const { coachLineupMatch } = useTournament();

  if (!coachLineupMatch) return null;

  return <CoachLineupModal6Content match={coachLineupMatch} />;
};

const CoachLineupModal6Content = ({ match }) => {
  const {
    setCoachLineupMatch,
    saveMatchLineup,
    teams,
    athletes,
    categories
  } = useTournament();

  const category = categories.find((c) => c.id === match.categoryId);
  const team1 = teams.find((t) => t.id === match.team1Id);
  const team2 = teams.find((t) => t.id === match.team2Id);

  // Atletas cadastrados especificamente nesta equipe e nesta categoria específica
  const t1CatAthletes = athletes.filter(
    (a) => a.teamId === match.team1Id && a.categoryId === match.categoryId
  );
  const t2CatAthletes = athletes.filter(
    (a) => a.teamId === match.team2Id && a.categoryId === match.categoryId
  );

  // Extrair jogadores existentes de cada jogo
  const g1FromMatch = match.games?.[0] || {};
  const g2FromMatch = match.games?.[1] || {};
  const g3FromMatch = match.games?.[2] || {};

  const parsePair = (str) => {
    if (!str || str.includes('A definir')) return ['', ''];
    const parts = str.split('&').map((s) => s.trim());
    return [parts[0] || '', parts[1] || ''];
  };

  const initialT1G1 = parsePair(match.lineupGame1?.t1Players || g1FromMatch.team1Players);
  const initialT2G1 = parsePair(match.lineupGame1?.t2Players || g1FromMatch.team2Players);

  const initialT1G2 = parsePair(match.lineupGame2?.t1Players || g2FromMatch.team1Players);
  const initialT2G2 = parsePair(match.lineupGame2?.t2Players || g2FromMatch.team2Players);

  const initialT1G3 = parsePair(match.lineupGame3?.t1Players || g3FromMatch.team1Players);
  const initialT2G3 = parsePair(match.lineupGame3?.t2Players || g3FromMatch.team2Players);

  // Estados dos Jogos para Equipe 1
  const [t1G1P1, setT1G1P1] = useState(initialT1G1[0] || t1CatAthletes[0]?.name || '');
  const [t1G1P2, setT1G1P2] = useState(initialT1G1[1] || t1CatAthletes[1]?.name || '');

  const [t1G2P1, setT1G2P1] = useState(initialT1G2[0] || t1CatAthletes[2]?.name || '');
  const [t1G2P2, setT1G2P2] = useState(initialT1G2[1] || t1CatAthletes[3]?.name || '');

  const [t1G3P1, setT1G3P1] = useState(initialT1G3[0] || t1CatAthletes[4]?.name || '');
  const [t1G3P2, setT1G3P2] = useState(initialT1G3[1] || t1CatAthletes[5]?.name || '');

  // Estados dos Jogos para Equipe 2
  const [t2G1P1, setT2G1P1] = useState(initialT2G1[0] || t2CatAthletes[0]?.name || '');
  const [t2G1P2, setT2G1P2] = useState(initialT2G1[1] || t2CatAthletes[1]?.name || '');

  const [t2G2P1, setT2G2P1] = useState(initialT2G2[0] || t2CatAthletes[2]?.name || '');
  const [t2G2P2, setT2G2P2] = useState(initialT2G2[1] || t2CatAthletes[3]?.name || '');

  const [t2G3P1, setT2G3P1] = useState(initialT2G3[0] || t2CatAthletes[4]?.name || '');
  const [t2G3P2, setT2G3P2] = useState(initialT2G3[1] || t2CatAthletes[5]?.name || '');

  // Auto-selecionar os atletas do 3º Jogo de desempate:
  // Os dois atletas que não jogarem dois jogos já estão selecionados automaticamente para o 3º jogo
  useEffect(() => {
    const autoG3 = getAutoLineupGame3(
      t1CatAthletes,
      { p1: t1G1P1, p2: t1G1P2 },
      { p1: t1G2P1, p2: t1G2P2 }
    );
    if (autoG3.p1) setT1G3P1(autoG3.p1);
    if (autoG3.p2) setT1G3P2(autoG3.p2);
  }, [t1G1P1, t1G1P2, t1G2P1, t1G2P2, t1CatAthletes]);

  useEffect(() => {
    const autoG3 = getAutoLineupGame3(
      t2CatAthletes,
      { p1: t2G1P1, p2: t2G1P2 },
      { p1: t2G2P1, p2: t2G2P2 }
    );
    if (autoG3.p1) setT2G3P1(autoG3.p1);
    if (autoG3.p2) setT2G3P2(autoG3.p2);
  }, [t2G1P1, t2G1P2, t2G2P1, t2G2P2, t2CatAthletes]);

  // Confirmação das Equipes
  const [t1Confirmed, setT1Confirmed] = useState(!!match.lineupTeam1Confirmed);
  const [t2Confirmed, setT2Confirmed] = useState(!!match.lineupTeam2Confirmed);

  // Aba ativa: 'g1' | 'g2' | 'g3'
  const [activeGameTab, setActiveGameTab] = useState('g1');

  // Validação das regras da série para Equipe 1 e Equipe 2
  const isG3Required = match.seriesScore?.winsT1 === 1 && match.seriesScore?.winsT2 === 1;

  const t1Validation = validateTeamLineup({
    allTeamAthletes: t1CatAthletes,
    g1: { p1: t1G1P1, p2: t1G1P2 },
    g2: { p1: t1G2P1, p2: t1G2P2 },
    g3: { p1: t1G3P1, p2: t1G3P2 },
    isGame3Active: isG3Required || !!(t1G3P1 && t1G3P2)
  });

  const t2Validation = validateTeamLineup({
    allTeamAthletes: t2CatAthletes,
    g1: { p1: t2G1P1, p2: t2G1P2 },
    g2: { p1: t2G2P1, p2: t2G2P2 },
    g3: { p1: t2G3P1, p2: t2G3P2 },
    isGame3Active: isG3Required || !!(t2G3P1 && t2G3P2)
  });

  const handleSave = (e) => {
    e.preventDefault();

    // Regra estrita: Os dois primeiros jogos devem ser definidos antes do primeiro jogo
    if (!t1G1P1 || !t1G1P2 || !t2G1P1 || !t2G1P2) {
      alert('Atenção: A escalação do 1º Jogo deve ser preenchida para ambas as equipes.');
      return;
    }

    if (!t1G2P1 || !t1G2P2 || !t2G2P1 || !t2G2P2) {
      alert('Regra Oficial: Os dois primeiros jogos devem ser definidos antes do primeiro jogo. Complete a escalação do 2º Jogo para ambas as equipes.');
      return;
    }

    if (!t1Validation.isValid) {
      alert(`Equipe 1 (${team1?.name}): ${t1Validation.errors[0]}`);
      return;
    }

    if (!t2Validation.isValid) {
      alert(`Equipe 2 (${team2?.name}): ${t2Validation.errors[0]}`);
      return;
    }

    const t1G1Str = `${t1G1P1} & ${t1G1P2}`;
    const t2G1Str = `${t2G1P1} & ${t2G1P2}`;

    const t1G2Str = `${t1G2P1} & ${t1G2P2}`;
    const t2G2Str = `${t2G2P1} & ${t2G2P2}`;

    const t1G3Str = t1G3P1 && t1G3P2 ? `${t1G3P1} & ${t1G3P2}` : 'A definir se 1x1';
    const t2G3Str = t2G3P1 && t2G3P2 ? `${t2G3P1} & ${t2G3P2}` : 'A definir se 1x1';

    saveMatchLineup(match.id, {
      lineupGame1: { t1Players: t1G1Str, t2Players: t2G1Str },
      lineupGame2: { t1Players: t1G2Str, t2Players: t2G2Str },
      lineupGame3: { t1Players: t1G3Str, t2Players: t2G3Str },
      lineupTeam1Confirmed: t1Confirmed,
      lineupTeam2Confirmed: t2Confirmed
    });

    setCoachLineupMatch(null);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.88)',
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
          maxWidth: '980px',
          maxHeight: '94vh',
          overflowY: 'auto',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8)',
          padding: '1.75rem'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '0.85rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--primary)',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}
              >
                Torneio 6 Atletas • {category?.name || 'Categoria'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {match.groupName ? `${match.groupName} • ` : ''}{match.phase}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-amber)', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                Confronto em Melhor de 3 Jogos
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', margin: '4px 0 0 0', color: 'var(--text-primary)' }}>
              Escalação Oficial do Técnico / Capitão
            </h2>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {team1?.name} vs {team2?.name} • Revezamento obrigatório sem repetição de dupla.
            </p>
          </div>

          <button
            onClick={() => setCoachLineupMatch(null)}
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

        {/* Banner de Regras Oficiais do Torneio de 6 Atletas */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '14px',
            padding: '10px 14px',
            marginBottom: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            fontSize: '0.8rem',
            color: 'var(--text-primary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            <Info size={16} />
            <span>Regulamento Oficial da Série (Melhor de 3 Jogos):</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '6px', marginTop: '2px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <div>• <strong>Definição Prévia:</strong> Os 2 primeiros jogos devem ser definidos antes do 1º jogo.</div>
            <div>• <strong>Revezamento:</strong> Proibido repetir a mesma formação de dupla no confronto.</div>
            <div>• <strong>3º Jogo (Desempate se 1x1):</strong> Atletas que jogaram apenas um jogo devem fazer o 3º jogo.</div>
          </div>
        </div>

        {/* Seletor de Abas de Jogos: 1º Jogo, 2º Jogo e 3º Jogo */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveGameTab('g1')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeGameTab === 'g1' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
              color: activeGameTab === 'g1' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span>1º Jogo (Duplas)</span>
            {t1G1P1 && t1G1P2 && t2G1P1 && t2G1P2 ? (
              <span style={{ fontSize: '0.7rem', background: 'rgba(0,0,0,0.3)', padding: '1px 6px', borderRadius: '4px', color: '#fff' }}>✓ Definido</span>
            ) : (
              <span style={{ fontSize: '0.7rem', background: 'rgba(239,68,68,0.2)', padding: '1px 6px', borderRadius: '4px', color: 'var(--accent-rose)' }}>Pendente</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveGameTab('g2')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeGameTab === 'g2' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
              color: activeGameTab === 'g2' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span>2º Jogo (Revezamento)</span>
            {t1G2P1 && t1G2P2 && t2G2P1 && t2G2P2 ? (
              <span style={{ fontSize: '0.7rem', background: 'rgba(0,0,0,0.3)', padding: '1px 6px', borderRadius: '4px', color: '#fff' }}>✓ Definido</span>
            ) : (
              <span style={{ fontSize: '0.7rem', background: 'rgba(239,68,68,0.2)', padding: '1px 6px', borderRadius: '4px', color: 'var(--accent-rose)' }}>Pendente</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveGameTab('g3')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: activeGameTab === 'g3' ? 'var(--accent-amber)' : 'rgba(255, 255, 255, 0.05)',
              color: activeGameTab === 'g3' ? '#000' : 'var(--text-secondary)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <span>3º Jogo Desempate (Se 1x1)</span>
            {isG3Required ? (
              <span style={{ fontSize: '0.7rem', background: 'rgba(239,68,68,0.2)', color: 'var(--accent-rose)', padding: '1px 6px', borderRadius: '4px' }}>OBRIGATÓRIO</span>
            ) : (
              <span style={{ fontSize: '0.7rem', background: 'rgba(0,0,0,0.2)', color: 'var(--text-muted)', padding: '1px 6px', borderRadius: '4px' }}>Se 1x1</span>
            )}
          </button>
        </div>

        {/* Formulário com as duas equipes lado a lado */}
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {/* Coluna Equipe 1 */}
            <TeamGameLineupColumn
              team={team1}
              teamLabel={match.team1Label}
              category={category}
              catAthletes={t1CatAthletes}
              activeGameTab={activeGameTab}
              g1={{ p1: t1G1P1, setP1: setT1G1P1, p2: t1G1P2, setP2: setT1G1P2 }}
              g2={{ p1: t1G2P1, setP1: setT1G2P1, p2: t1G2P2, setP2: setT1G2P2 }}
              g3={{ p1: t1G3P1, setP1: setT1G3P1, p2: t1G3P2, setP2: setT1G3P2 }}
              validation={t1Validation}
              confirmed={t1Confirmed}
              setConfirmed={setT1Confirmed}
              categories={categories}
              defaultColor="#06b6d4"
            />

            {/* Coluna Equipe 2 */}
            <TeamGameLineupColumn
              team={team2}
              teamLabel={match.team2Label}
              category={category}
              catAthletes={t2CatAthletes}
              activeGameTab={activeGameTab}
              g1={{ p1: t2G1P1, setP1: setT2G1P1, p2: t2G1P2, setP2: setT2G1P2 }}
              g2={{ p1: t2G2P1, setP1: setT2G2P1, p2: t2G2P2, setP2: setT2G2P2 }}
              g3={{ p1: t2G3P1, setP1: setT2G3P1, p2: t2G3P2, setP2: setT2G3P2 }}
              validation={t2Validation}
              confirmed={t2Confirmed}
              setConfirmed={setT2Confirmed}
              categories={categories}
              defaultColor="#f59e0b"
            />
          </div>

          {/* Resumo Consolidado das 3 Formações */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              marginBottom: '1.25rem'
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Resumo da Série Melhor de 3 Jogos:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.82rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '10px' }}>
                <strong style={{ color: team1?.color || '#06b6d4' }}>{team1?.name}:</strong>
                <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span><strong>1º Jogo:</strong> {t1G1P1 && t1G1P2 ? `${t1G1P1} & ${t1G1P2}` : <span style={{ color: 'var(--accent-rose)' }}>Pendente</span>}</span>
                  <span><strong>2º Jogo:</strong> {t1G2P1 && t1G2P2 ? `${t1G2P1} & ${t1G2P2}` : <span style={{ color: 'var(--accent-rose)' }}>Pendente</span>}</span>
                  <span><strong>3º Jogo:</strong> {t1G3P1 && t1G3P2 ? `${t1G3P1} & ${t1G3P2}` : <span style={{ color: 'var(--text-muted)' }}>A definir se 1x1</span>}</span>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '10px' }}>
                <strong style={{ color: team2?.color || '#f59e0b' }}>{team2?.name}:</strong>
                <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span><strong>1º Jogo:</strong> {t2G1P1 && t2G1P2 ? `${t2G1P1} & ${t2G1P2}` : <span style={{ color: 'var(--accent-rose)' }}>Pendente</span>}</span>
                  <span><strong>2º Jogo:</strong> {t2G2P1 && t2G2P2 ? `${t2G2P1} & ${t2G2P2}` : <span style={{ color: 'var(--accent-rose)' }}>Pendente</span>}</span>
                  <span><strong>3º Jogo:</strong> {t2G3P1 && t2G3P2 ? `${t2G3P1} & ${t2G3P2}` : <span style={{ color: 'var(--text-muted)' }}>A definir se 1x1</span>}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <button
              type="button"
              onClick={() => setCoachLineupMatch(null)}
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
              type="submit"
              style={{
                padding: '10px 24px',
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
              Salvar Escalação Oficial dos Jogos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente para a coluna de cada equipe com seleção interativa de atletas por jogo
const TeamGameLineupColumn = ({
  team,
  teamLabel,
  category,
  catAthletes,
  activeGameTab,
  g1,
  g2,
  g3,
  validation,
  confirmed,
  setConfirmed,
  categories,
  defaultColor
}) => {
  const allTeamAthletes = catAthletes;

  // Identifica qual jogo está ativo na aba
  let activeP1 = g1.p1;
  let setActiveP1 = g1.setP1;
  let activeP2 = g1.p2;
  let setActiveP2 = g1.setP2;
  let gameTitle = '1º Jogo (Duplas)';

  if (activeGameTab === 'g2') {
    activeP1 = g2.p1;
    setActiveP1 = g2.setP1;
    activeP2 = g2.p2;
    setActiveP2 = g2.setP2;
    gameTitle = '2º Jogo (Revezamento)';
  } else if (activeGameTab === 'g3') {
    activeP1 = g3.p1;
    setActiveP1 = g3.setP1;
    activeP2 = g3.p2;
    setActiveP2 = g3.setP2;
    gameTitle = '3º Jogo (Desempate se 1x1)';
  }

  // Estatísticas de participação dos atletas nos Jogos 1 e 2
  const participation = getAthleteParticipation(allTeamAthletes, { p1: g1.p1, p2: g1.p2 }, { p1: g2.p1, p2: g2.p2 });
  const { eligible, ineligible } = getGame3Eligibility(allTeamAthletes, { p1: g1.p1, p2: g1.p2 }, { p1: g2.p1, p2: g2.p2 });

  // Validação específica da aba ativa
  const isDuplicateFormationInG2 =
    activeGameTab === 'g2' &&
    g1.p1 &&
    g1.p2 &&
    activeP1 &&
    activeP2 &&
    isSameFormation(g1.p1, g1.p2, activeP1, activeP2);

  const isDuplicateFormationInG3 =
    activeGameTab === 'g3' &&
    activeP1 &&
    activeP2 &&
    (isSameFormation(g1.p1, g1.p2, activeP1, activeP2) || isSameFormation(g2.p1, g2.p2, activeP1, activeP2));

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: `1px solid ${confirmed ? 'var(--primary)' : 'var(--border-color)'}`,
        borderRadius: '18px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}
    >
      {/* Header da Equipe */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: team?.color || defaultColor,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.05rem'
            }}
          >
            {team?.logoText || 'EQ'}
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-primary)' }}>{team?.name || teamLabel}</h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Capitão: {team?.captain || 'A definir'}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setConfirmed(!confirmed)}
          style={{
            padding: '4px 10px',
            borderRadius: '16px',
            fontSize: '0.72rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: confirmed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: confirmed ? 'var(--primary)' : 'var(--accent-rose)',
            border: `1px solid ${confirmed ? 'var(--primary)' : 'rgba(239, 68, 68, 0.3)'}`,
            cursor: 'pointer'
          }}
        >
          <CheckCircle size={13} />
          {confirmed ? 'Confirmada' : 'Confirmar'}
        </button>
      </div>

      {/* Identificação do Jogo Ativo na Aba */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.25)', padding: '6px 12px', borderRadius: '10px' }}>
        <span style={{ fontSize: '0.76rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
          Escalação para o {gameTitle}
        </span>
        <strong style={{ fontSize: '0.85rem', color: activeP1 && activeP2 ? '#fff' : 'var(--accent-amber)' }}>
          {activeP1 && activeP2 ? `${activeP1} & ${activeP2}` : 'Dupla incompleta'}
        </strong>
      </div>

      {/* Alertas de Validação de Formação */}
      {isDuplicateFormationInG2 && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '10px', padding: '8px 10px', fontSize: '0.75rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertCircle size={15} />
          <span>Atenção: Mesma formação do 1º Jogo! Revezamento obrigatório sem repetir a dupla.</span>
        </div>
      )}

      {isDuplicateFormationInG3 && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '10px', padding: '8px 10px', fontSize: '0.75rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertCircle size={15} />
          <span>Formação repetida! O 3º Jogo não pode repetir a formação do 1º nem do 2º Jogo.</span>
        </div>
      )}

      {/* Aviso específico para o 3º Jogo (Desempate) */}
      {activeGameTab === 'g3' && (
        <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '10px', padding: '8px 12px', fontSize: '0.75rem', color: 'var(--primary)' }}>
          🔒 <strong>Seleção Automática do 3º Jogo:</strong> Os dois atletas que não jogarem dois jogos já estão selecionados automaticamente para o 3º jogo de desempate ({activeP1 && activeP2 ? `${activeP1} & ${activeP2}` : 'definidos com base nos Jogos 1 e 2'}).
        </div>
      )}

      {/* LISTA ABERTA DE ATLETAS CADASTRADOS NA CATEGORIA ESPECÍFICA */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          borderRadius: '12px',
          padding: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={14} color="var(--accent-cyan)" />
            <strong style={{ fontSize: '0.8rem', color: '#fff' }}>
              Atletas da Categoria ({catAthletes.length})
            </strong>
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            {activeGameTab === 'g3' ? 'Definidos automaticamente por regra' : `Clique para escalar no ${activeGameTab === 'g1' ? '1º Jogo' : '2º Jogo'}`}
          </span>
        </div>

        {catAthletes.length === 0 ? (
          <div style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', fontStyle: 'italic' }}>
            Nenhum atleta cadastrado diretamente nesta categoria.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {catAthletes.map((ath) => {
              const playedCount = participation[ath.name] || 0;
              const isP1 = activeP1 === ath.name;
              const isP2 = activeP2 === ath.name;
              const isSelectedInActiveGame = isP1 || isP2;

              // No Jogo 3: atletas que jogaram 2 jogos não podem
              const isBlockedForGame3 = activeGameTab === 'g3' && playedCount >= 2;
              const isAutoSelectedG3 = activeGameTab === 'g3' && isSelectedInActiveGame;

              return (
                <div
                  key={ath.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    background: isSelectedInActiveGame
                      ? 'rgba(6, 182, 212, 0.14)'
                      : isBlockedForGame3
                      ? 'rgba(239, 68, 68, 0.05)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isSelectedInActiveGame ? 'var(--accent-cyan)' : isBlockedForGame3 ? 'rgba(239, 68, 68, 0.2)' : 'var(--border-color)'}`,
                    opacity: isBlockedForGame3 ? 0.6 : 1
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isSelectedInActiveGame ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.08)',
                        color: isSelectedInActiveGame ? '#000' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 800
                      }}
                    >
                      {ath.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ fontSize: '0.8rem', color: isSelectedInActiveGame ? '#fff' : 'var(--text-primary)' }}>
                          {ath.name}
                        </strong>
                        {isAutoSelectedG3 && (
                          <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--primary)', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                            ✓ Auto Selecionado (3º Jogo)
                          </span>
                        )}
                        {activeGameTab === 'g3' && isBlockedForGame3 && (
                          <span style={{ fontSize: '0.65rem', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-rose)', padding: '1px 5px', borderRadius: '4px' }}>
                            Bloqueado (2 jogos)
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        Participação nos Jogos 1 e 2: {playedCount} jogo(s)
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      disabled={activeGameTab === 'g3' || isBlockedForGame3}
                      onClick={() => setActiveP1(ath.name)}
                      style={{
                        padding: '3px 8px',
                        fontSize: '0.68rem',
                        borderRadius: '6px',
                        fontWeight: 700,
                        background: isP1 ? 'var(--primary)' : 'rgba(255, 255, 255, 0.06)',
                        color: isP1 ? '#fff' : 'var(--text-secondary)',
                        border: isP1 ? 'none' : '1px solid var(--border-color)',
                        cursor: activeGameTab === 'g3' || isBlockedForGame3 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isP1 ? (activeGameTab === 'g3' ? '✓ Titular Auto' : '✓ Titular 1') : 'Como 1º'}
                    </button>

                    <button
                      type="button"
                      disabled={activeGameTab === 'g3' || isBlockedForGame3}
                      onClick={() => setActiveP2(ath.name)}
                      style={{
                        padding: '3px 8px',
                        fontSize: '0.68rem',
                        borderRadius: '6px',
                        fontWeight: 700,
                        background: isP2 ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.06)',
                        color: isP2 ? '#000' : 'var(--text-secondary)',
                        border: isP2 ? 'none' : '1px solid var(--border-color)',
                        cursor: activeGameTab === 'g3' || isBlockedForGame3 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isP2 ? (activeGameTab === 'g3' ? '✓ Parceiro Auto' : '✓ Titular 2') : 'Como 2º'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Seletores Dropdown de Atleta 1 e Atleta 2 para o Jogo Ativo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
            Atleta 1 {activeGameTab === 'g3' ? '(Automático)' : ''}:
          </label>
          <select
            value={activeP1}
            onChange={(e) => setActiveP1(e.target.value)}
            disabled={activeGameTab === 'g3'}
            style={{
              width: '100%',
              padding: '7px 10px',
              fontSize: '0.8rem',
              background: '#0f172a',
              color: '#fff',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              cursor: activeGameTab === 'g3' ? 'default' : 'pointer',
              opacity: activeGameTab === 'g3' ? 0.85 : 1
            }}
          >
            <option value="">-- Selecione Atleta 1 --</option>
            {catAthletes.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name} ({participation[a.name] || 0} jogos)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
            Atleta 2 {activeGameTab === 'g3' ? '(Automático)' : ''}:
          </label>
          <select
            value={activeP2}
            onChange={(e) => setActiveP2(e.target.value)}
            disabled={activeGameTab === 'g3'}
            style={{
              width: '100%',
              padding: '7px 10px',
              fontSize: '0.8rem',
              background: '#0f172a',
              color: '#fff',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              cursor: activeGameTab === 'g3' ? 'default' : 'pointer',
              opacity: activeGameTab === 'g3' ? 0.85 : 1
            }}
          >
            <option value="">-- Selecione Atleta 2 --</option>
            {catAthletes.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name} ({participation[a.name] || 0} jogos)
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
