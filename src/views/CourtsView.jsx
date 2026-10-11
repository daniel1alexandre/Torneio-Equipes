import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  LayoutGrid,
  Calendar,
  Play,
  Plus,
  Clock,
  CheckCircle,
  Activity,
  AlertCircle,
  Tv,
  Edit2,
  Trash2,
  Maximize2
} from 'lucide-react';

export const CourtsView = () => {
  const {
    courts,
    matches,
    teams,
    categories,
    addCourt,
    deleteCourt,
    unassignCourt,
    setScoreModalMatch,
    setAssignCourtData,
    setActiveTab
  } = useTournament();

  const [showAddCourtModal, setShowAddCourtModal] = useState(false);
  const [newCourtName, setNewCourtName] = useState('');
  const [newCourtSurface, setNewCourtSurface] = useState('Areia (Beach Tennis)');

  // Summary counts
  const totalCourts = courts.length;
  const busyCourts = courts.filter((c) => c.status === 'em_andamento').length;
  const freeCourts = totalCourts - busyCourts;
  const finishedMatchesCount = matches.filter((m) => m.status === 'encerrada').length;

  const handleCreateCourt = (e) => {
    e.preventDefault();
    if (!newCourtName.trim()) return;
    addCourt({
      name: newCourtName.trim(),
      surface: newCourtSurface
    });
    setNewCourtName('');
    setShowAddCourtModal(false);
  };

  return (
    <div className="view-container">
      <div className="page-header">
        <div className="page-header-info">
          <h2>
            <LayoutGrid size={28} color="#10b981" />
            <span>Mapa das Quadras & Programação Integrada</span>
          </h2>
          <p>
            Acompanhe as quadras da arena em tempo real, atualize os placares ao vivo e escale partidas diretamente do chaveamento.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            className="btn btn-accent"
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar size={16} />
            <span>Painel Programação (Mini-Quadras)</span>
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => setShowAddCourtModal(true)}
          >
            <Plus size={16} />
            <span>Adicionar Quadra</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={() => setAssignCourtData({})}
          >
            <Play size={16} />
            <span>Escalar Jogo para Quadra</span>
          </button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="stats-ribbon">
        <div className="stat-box">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <LayoutGrid size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{totalCourts}</div>
            <div className="stat-lbl">Quadras Totais</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{busyCourts}</div>
            <div className="stat-lbl">Partidas Ao Vivo</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{freeCourts}</div>
            <div className="stat-lbl">Quadras Livres</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-val">{finishedMatchesCount}</div>
            <div className="stat-lbl">Partidas Encerradas</div>
          </div>
        </div>
      </div>

      {/* Courts Grid */}
      <div className="courts-grid">
        {courts.map((court) => {
          const currentMatch = matches.find((m) => m.id === court.currentMatchId);
          const isBusy = court.status === 'em_andamento' && currentMatch;
          const team1 = teams.find((t) => t.id === currentMatch?.team1Id);
          const team2 = teams.find((t) => t.id === currentMatch?.team2Id);
          const category = categories.find((c) => c.id === currentMatch?.categoryId);

          return (
            <div
              key={court.id}
              className={`court-card ${isBusy ? 'court-live' : ''}`}
            >
              {/* Header da Quadra */}
              <div className="court-header">
                <div className="court-title-wrap">
                  <span className="court-name">{court.name}</span>
                  <span className="court-surface-badge">{court.surface}</span>
                </div>

                {isBusy ? (
                  <div className="court-status-pill status-pill-live">
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#ef4444',
                        animation: 'pulse 1s infinite'
                      }}
                    />
                    <span>AO VIVO</span>
                  </div>
                ) : (
                  <div className="court-status-pill status-pill-free">
                    <span>LIVRE</span>
                  </div>
                )}
              </div>

              {/* Representação visual da Quadra */}
              <div className="court-field-representation">
                <div className="court-lines">
                  <div className="court-net" />
                </div>
                {isBusy && currentMatch?.startTime && (
                  <div className="court-timer">
                    <Clock size={12} />
                    <span>Início: {currentMatch.startTime}</span>
                  </div>
                )}
              </div>

              {/* Corpo da Quadra */}
              <div className="court-body">
                {isBusy ? (
                  <>
                    <div className="court-match-category">
                      <span>{category?.name || 'Categoria'}</span>
                      <span>{currentMatch.phase}</span>
                    </div>

                    {/* Placar das Equipes */}
                    <div className="court-teams-scoreboard">
                      {/* Equipe 1 */}
                      <div
                        className="court-team-row"
                        style={{ borderLeftColor: team1?.color || '#06b6d4' }}
                      >
                        <div className="court-team-info">
                          <div
                            className="team-badge-circle"
                            style={{ background: team1?.color || '#06b6d4' }}
                          >
                            {team1?.logoText || '1'}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div className="team-name-line">
                              {team1?.name || currentMatch.team1Label}
                            </div>
                            <div className="team-players-line">
                              {currentMatch.team1Players}
                            </div>
                          </div>
                        </div>

                        <div className="court-scores-cluster">
                          <div className="set-score-box active-set" style={{ width: '38px', height: '38px', fontSize: '1.2rem', fontWeight: 900 }}>
                            {currentMatch.score?.gamesT1 ?? currentMatch.score?.set1?.[0] ?? 0}
                          </div>
                          {(currentMatch.score?.tiebreakT1 > 0 || currentMatch.score?.tiebreakT2 > 0) && (
                            <div className="set-score-box" style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                              ({currentMatch.score?.tiebreakT1 || 0})
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Equipe 2 */}
                      <div
                        className="court-team-row"
                        style={{ borderLeftColor: team2?.color || '#f59e0b' }}
                      >
                        <div className="court-team-info">
                          <div
                            className="team-badge-circle"
                            style={{ background: team2?.color || '#f59e0b' }}
                          >
                            {team2?.logoText || '2'}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div className="team-name-line">
                              {team2?.name || currentMatch.team2Label}
                            </div>
                            <div className="team-players-line">
                              {currentMatch.team2Players}
                            </div>
                          </div>
                        </div>

                        <div className="court-scores-cluster">
                          <div className="set-score-box active-set" style={{ width: '38px', height: '38px', fontSize: '1.2rem', fontWeight: 900 }}>
                            {currentMatch.score?.gamesT2 ?? currentMatch.score?.set1?.[1] ?? 0}
                          </div>
                          {(currentMatch.score?.tiebreakT1 > 0 || currentMatch.score?.tiebreakT2 > 0) && (
                            <div className="set-score-box" style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                              ({currentMatch.score?.tiebreakT2 || 0})
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pontuação no Game */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(0,0,0,0.3)',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '1rem'
                      }}
                    >
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        Game Atual / Parcial:
                      </span>
                      <span className="current-points-box">
                        {currentMatch.score?.currentPoints || '0-0'}
                      </span>
                    </div>

                    {/* Ações da Partida */}
                    <div className="court-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setScoreModalMatch(currentMatch)}
                      >
                        <Tv size={14} />
                        <span>Placar / Ao Vivo</span>
                      </button>

                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => unassignCourt(court.id)}
                        title="Liberar quadra e desalocar a partida"
                      >
                        <span>Liberar Quadra</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="court-empty-state">
                    <div className="court-empty-icon">
                      <Play size={22} />
                    </div>
                    <div>
                      <strong style={{ color: '#fff', fontSize: '0.95rem' }}>
                        Quadra Disponível
                      </strong>
                      <p style={{ fontSize: '0.8rem', marginTop: '2px' }}>
                        Nenhuma partida em andamento no momento.
                      </p>
                    </div>
                    <button
                      className="btn btn-accent btn-sm"
                      style={{ marginTop: '0.5rem' }}
                      onClick={() => setAssignCourtData({ courtId: court.id })}
                    >
                      <Play size={14} />
                      <span>Escalar Jogo Aqui</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Adicionar Quadra */}
      {showAddCourtModal && (
        <div className="modal-overlay" onClick={() => setShowAddCourtModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <Plus size={20} color="#10b981" />
                <span>Nova Quadra da Arena</span>
              </h3>
            </div>
            <form onSubmit={handleCreateCourt}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nome da Quadra</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Ex: Quadra 5 - Piscina"
                    value={newCourtName}
                    onChange={(e) => setNewCourtName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de Piso / Superfície</label>
                  <select
                    className="form-control"
                    value={newCourtSurface}
                    onChange={(e) => setNewCourtSurface(e.target.value)}
                  >
                    <option value="Areia (Beach Tennis / Futevôlei)">Areia (Beach Tennis / Futevôlei)</option>
                    <option value="Piso Rápido (Hard Court)">Piso Rápido (Hard Court)</option>
                    <option value="Saibro (Clay Court)">Saibro (Clay Court)</option>
                    <option value="Grama Sintética (Padel)">Grama Sintética (Padel)</option>
                    <option value="Poliesportiva Coberta">Poliesportiva Coberta</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddCourtModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Criar Quadra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
