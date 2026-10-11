import React, { useState, useEffect } from 'react';
import { TournamentProvider, useTournament } from './context/TournamentContext';
import { Tournament4Provider, useTournament4 } from './context/Tournament4Context';
import { Navbar } from './components/Navbar';

// Views - Torneio 6 Atletas (Existentes)
import { CourtsView } from './views/CourtsView';
import { ScheduleView } from './views/ScheduleView';
import { BracketsView } from './views/BracketsView';
import { StandingsView } from './views/StandingsView';
import { TeamsView } from './views/TeamsView';
import { CategoriesView } from './views/CategoriesView';
import { RulesSettingsView } from './views/RulesSettingsView';
import { ScoreModal } from './components/ScoreModal';
import { CourtAssignModal } from './components/CourtAssignModal';
import { CoachLineupModal6 } from './components/CoachLineupModal6';

// Views - Torneio 4 Atletas (Novas)
import { HomeSelectionView } from './views/HomeSelectionView';
import { T4ScheduleView } from './views/tournament4/T4ScheduleView';
import { T4BracketsView } from './views/tournament4/T4BracketsView';
import { T4ConfrontosView } from './views/tournament4/T4ConfrontosView';
import { T4StandingsView } from './views/tournament4/T4StandingsView';
import { T4TeamsView } from './views/tournament4/T4TeamsView';
import { T4CourtsView } from './views/tournament4/T4CourtsView';
import { T4RulesView } from './views/tournament4/T4RulesView';
import { T4LineupModal } from './views/tournament4/T4LineupModal';
import { T4ScoreModal } from './views/tournament4/T4ScoreModal';

const TournamentAppContent = () => {
  // Controle de modo do torneio: 'home' | 'tournament6' | 'tournament4'
  const [tournamentMode, setTournamentMode] = useState(() => {
    return localStorage.getItem('arenamaster_tournament_mode') || 'home';
  });

  useEffect(() => {
    localStorage.setItem('arenamaster_tournament_mode', tournamentMode);
  }, [tournamentMode]);

  // Contexto 6 Atletas
  const { activeTab: activeTab6 } = useTournament();

  // Contexto 4 Atletas
  const { activeTab4 } = useTournament4();

  // Renderizador das telas do Torneio 6 Atletas
  const renderTournament6View = () => {
    switch (activeTab6) {
      case 'courts':
        return <CourtsView />;
      case 'schedule':
        return <ScheduleView />;
      case 'brackets':
        return <BracketsView />;
      case 'standings':
        return <StandingsView />;
      case 'teams':
        return <TeamsView />;
      case 'categories':
        return <CategoriesView />;
      case 'rules':
        return <RulesSettingsView />;
      default:
        return <ScheduleView />;
    }
  };

  // Renderizador das telas do Torneio 4 Atletas
  const renderTournament4View = () => {
    switch (activeTab4) {
      case 'schedule':
        return <T4ScheduleView />;
      case 'brackets':
        return <T4BracketsView />;
      case 'confrontos':
        return <T4ConfrontosView />;
      case 'standings':
        return <T4StandingsView />;
      case 'teams':
        return <T4TeamsView />;
      case 'courts':
        return <T4CourtsView />;
      case 'rules':
        return <T4RulesView />;
      default:
        return <T4ScheduleView />;
    }
  };

  return (
    <div className="app-container">
      {/* Barra de Navegação Unificada */}
      <Navbar tournamentMode={tournamentMode} setTournamentMode={setTournamentMode} />

      <main className="main-content">
        {tournamentMode === 'home' && (
          <HomeSelectionView onSelectMode={(mode) => setTournamentMode(mode)} />
        )}

        {tournamentMode === 'tournament6' && renderTournament6View()}

        {tournamentMode === 'tournament4' && renderTournament4View()}
      </main>

      {/* Modais Globais - Torneio 6 Atletas */}
      {tournamentMode === 'tournament6' && (
        <>
          <ScoreModal />
          <CourtAssignModal />
          <CoachLineupModal6 />
        </>
      )}

      {/* Modais Globais - Torneio 4 Atletas */}
      {tournamentMode === 'tournament4' && (
        <>
          <T4LineupModal />
          <T4ScoreModal />
        </>
      )}

      {/* Rodapé Oficial */}
      <footer
        style={{
          textAlign: 'center',
          padding: '1.5rem',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
          borderTop: '1px solid var(--border-color)',
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <img
          src="/db-logo.jpg"
          alt="DB Eventos"
          style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'cover' }}
        />
        <span>DB Eventos - Gerenciamento de Torneios de Beach Tennis & Padel • Todos os direitos reservados</span>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <TournamentProvider>
      <Tournament4Provider>
        <TournamentAppContent />
      </Tournament4Provider>
    </TournamentProvider>
  );
}

export default App;
