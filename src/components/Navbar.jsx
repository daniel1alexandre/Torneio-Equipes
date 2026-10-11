import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { useTournament4 } from '../context/Tournament4Context';
import {
  LayoutGrid,
  Calendar,
  GitFork,
  Shield,
  Users,
  Award,
  Sliders,
  Home,
  ArrowLeftRight,
  Flame,
  Swords,
  HeartHandshake
} from 'lucide-react';

export const Navbar = ({ tournamentMode, setTournamentMode }) => {
  // Context 6 Atletas
  const {
    activeTab: activeTab6,
    setActiveTab: setActiveTab6,
    matches: matches6
  } = useTournament();

  // Context 4 Atletas
  const {
    activeTab4,
    setActiveTab4,
    ties: ties4
  } = useTournament4();

  // Count live matches in 6-athletes
  const liveCount6 = matches6.filter((m) => m.status === 'em_andamento').length;

  // Count live ties in 4-athletes
  const liveCount4 = ties4.filter((t) => t.status === 'em_andamento').length;

  return (
    <header className="navbar" style={{ gap: '1rem', flexWrap: 'wrap' }}>
      {/* Brand & Mode Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div
          className="brand-section"
          onClick={() => setTournamentMode('home')}
          style={{ cursor: 'pointer' }}
          title="Voltar para a tela inicial"
        >
          <img
            src="/db-logo.jpg"
            alt="DB Eventos Logo"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              objectFit: 'cover',
              border: '2px solid rgba(255, 255, 255, 0.18)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
            }}
          />
          <div>
            <div className="brand-title" style={{ fontSize: '1.2rem', lineHeight: '1.15' }}>
              DB Eventos
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Gerenciamento de Eventos
            </div>
          </div>
        </div>

        {/* Home / Mode Indicator Badge */}
        {tournamentMode !== 'home' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setTournamentMode('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer'
              }}
              title="Voltar à Seleção de Torneio"
            >
              <Home size={14} />
              <span>Início</span>
            </button>

            <button
              onClick={() => setTournamentMode(tournamentMode === 'tournament6' ? 'tournament4' : 'tournament6')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '10px',
                fontSize: '0.78rem',
                fontWeight: 800,
                background:
                  tournamentMode === 'tournament4'
                    ? 'rgba(6, 182, 212, 0.18)'
                    : 'rgba(16, 185, 129, 0.18)',
                color:
                  tournamentMode === 'tournament4'
                    ? 'var(--accent-cyan)'
                    : 'var(--primary)',
                border:
                  tournamentMode === 'tournament4'
                    ? '1px solid rgba(6, 182, 212, 0.4)'
                    : '1px solid rgba(16, 185, 129, 0.4)',
                cursor: 'pointer'
              }}
              title="Alternar entre Torneio 6 Atletas e 4 Atletas"
            >
              <ArrowLeftRight size={13} />
              <span>{tournamentMode === 'tournament4' ? 'Torneio: 4 Atletas (2H+2M)' : 'Torneio: 6 Atletas'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs depending on active tournament */}
      {tournamentMode === 'tournament6' && (
        <nav className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab6 === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab6('schedule')}
          >
            <Calendar size={16} />
            <span>Programação</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab6 === 'courts' ? 'active' : ''}`}
            onClick={() => setActiveTab6('courts')}
          >
            <LayoutGrid size={16} />
            <span>Mapa das Quadras</span>
            {liveCount6 > 0 && <span className="nav-badge-live">{liveCount6} AO VIVO</span>}
          </button>

          <button
            className={`nav-tab-btn ${activeTab6 === 'brackets' ? 'active' : ''}`}
            onClick={() => setActiveTab6('brackets')}
          >
            <GitFork size={16} />
            <span>Chaveamento</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab6 === 'standings' ? 'active' : ''}`}
            onClick={() => setActiveTab6('standings')}
          >
            <Award size={16} />
            <span>Classificação</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab6 === 'teams' ? 'active' : ''}`}
            onClick={() => setActiveTab6('teams')}
          >
            <Shield size={16} />
            <span>Equipes</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab6 === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab6('categories')}
          >
            <Users size={16} />
            <span>Categorias & Atletas</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab6 === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab6('rules')}
          >
            <Sliders size={16} />
            <span>Regras & Pontuação</span>
          </button>
        </nav>
      )}

      {tournamentMode === 'tournament4' && (
        <nav className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab4 === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab4('schedule')}
          >
            <Calendar size={16} />
            <span>Programação</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab4 === 'brackets' ? 'active' : ''}`}
            onClick={() => setActiveTab4('brackets')}
          >
            <GitFork size={16} />
            <span>Chaveamento</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab4 === 'confrontos' ? 'active' : ''}`}
            onClick={() => setActiveTab4('confrontos')}
          >
            <Swords size={16} />
            <span>Confrontos & Súmulas</span>
            {liveCount4 > 0 && <span className="nav-badge-live">{liveCount4} AO VIVO</span>}
          </button>

          <button
            className={`nav-tab-btn ${activeTab4 === 'standings' ? 'active' : ''}`}
            onClick={() => setActiveTab4('standings')}
          >
            <Award size={16} />
            <span>Classificação Geral</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab4 === 'teams' ? 'active' : ''}`}
            onClick={() => setActiveTab4('teams')}
          >
            <Shield size={16} />
            <span>Equipes (2H + 2M)</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab4 === 'courts' ? 'active' : ''}`}
            onClick={() => setActiveTab4('courts')}
          >
            <LayoutGrid size={16} />
            <span>Quadras Ao Vivo</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab4 === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab4('rules')}
          >
            <Sliders size={16} />
            <span>Regras Eliminatória</span>
          </button>
        </nav>
      )}

      {tournamentMode === 'home' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setTournamentMode('tournament6')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--primary)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              cursor: 'pointer'
            }}
          >
            Torneio 6 Atletas
          </button>

          <button
            onClick={() => setTournamentMode('tournament4')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              cursor: 'pointer'
            }}
          >
            Torneio 4 Atletas (NOVO)
          </button>
        </div>
      )}
    </header>
  );
};
