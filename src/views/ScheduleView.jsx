import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  Calendar,
  Clock,
  MapPin,
  Play,
  CheckCircle,
  Plus,
  Trash2,
  Tv,
  ArrowRight,
  Printer,
  Sparkles,
  Layers,
  Settings,
  ListOrdered,
  LayoutGrid,
  Move,
  ArrowUp,
  ArrowDown,
  Check,
  AlertCircle,
  RotateCcw,
  UserCheck
} from 'lucide-react';

export const ScheduleView = () => {
  const {
    courts,
    matches,
    teams,
    categories,
    scheduleConfig,
    setScheduleConfig,
    applyCourtCount,
    generateScheduleFromConfig,
    moveMatch,
    scheduleMatchTime,
    assignMatchToCourt,
    unassignMatchFromCourt,
    clearAllSchedule,
    setScoreModalMatch,
    setCoachLineupMatch
  } = useTournament();

  // 3 Sub-abas da Programação: 'config' | 'lista_categoria' | 'cards_confrontos'
  const [subTab, setSubTab] = useState('cards_confrontos');

  // Estado local para a sub-aba de Configuração
  const [formCourts, setFormCourts] = useState(scheduleConfig?.courtCount || courts.length || 4);
  const [formDuration, setFormDuration] = useState(scheduleConfig?.matchDuration || 45);
  const [formStartTime, setFormStartTime] = useState(scheduleConfig?.startTime || '08:00');
  const [formEndTime, setFormEndTime] = useState(scheduleConfig?.endTime || '20:00');
  const [configSuccessMsg, setConfigSuccessMsg] = useState(false);

  // Filtro para a sub-aba Lista por Categoria
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  // Filtros para a sub-aba Cards de Confrontos
  const [cardsCatFilter, setCardsCatFilter] = useState('all');
  const [pendingCatFilter, setPendingCatFilter] = useState('all');

  // Drag and Drop state
  const [draggedMatchId, setDraggedMatchId] = useState(null);

  // Modal para alocação manual de horário e quadra
  const [editingScheduleMatch, setEditingScheduleMatch] = useState(null);
  const [editCourtId, setEditCourtId] = useState(courts[0]?.id || '');
  const [editTime, setEditTime] = useState('09:00');

  // Cálculos matemáticos de capacidade para a sub-aba Configuração
  const [startH, startM] = formStartTime.split(':').map(Number);
  const [endH, endM] = formEndTime.split(':').map(Number);
  const totalAvailableMinutes = Math.max(0, (endH * 60 + endM) - (startH * 60 + startM));
  const gamesPerCourt = formDuration > 0 ? Math.floor(totalAvailableMinutes / formDuration) : 0;
  const totalTournamentCapacity = gamesPerCourt * formCourts;
  const totalMatchesCount = matches.length;

  const handleSaveConfig = (e) => {
    e.preventDefault();
    const newConfig = {
      courtCount: Number(formCourts),
      matchDuration: Number(formDuration),
      startTime: formStartTime,
      endTime: formEndTime
    };
    setScheduleConfig(newConfig);
    generateScheduleFromConfig(newConfig);
    setConfigSuccessMsg(true);
    setTimeout(() => setConfigSuccessMsg(false), 3500);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, matchId) => {
    e.dataTransfer.setData('text/plain', matchId);
    setDraggedMatchId(matchId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnCourt = (e, targetCourtId) => {
    e.preventDefault();
    const matchId = e.dataTransfer.getData('text/plain') || draggedMatchId;
    if (!matchId || !targetCourtId) return;

    // Determine appropriate time based on target court's existing matches
    const courtMatches = matches.filter((m) => m.courtId === targetCourtId && m.status !== 'encerrada');
    let targetTime = formStartTime || '08:00';
    if (courtMatches.length > 0) {
      const lastMatch = courtMatches[courtMatches.length - 1];
      if (lastMatch.startTime) {
        const [h, m] = lastMatch.startTime.split(':').map(Number);
        const nextMin = h * 60 + m + Number(formDuration || 45);
        const nh = String(Math.floor(nextMin / 60)).padStart(2, '0');
        const nm = String(nextMin % 60).padStart(2, '0');
        targetTime = `${nh}:${nm}`;
      }
    }

    moveMatch(matchId, targetCourtId, targetTime);
    setDraggedMatchId(null);
  };

  // Quick adjust time helper
  const adjustMatchTime = (matchId, deltaMinutes) => {
    const match = matches.find((m) => m.id === matchId);
    if (!match || !match.startTime) return;

    const [h, m] = match.startTime.split(':').map(Number);
    const totalMin = Math.max(0, h * 60 + m + deltaMinutes);
    const nh = String(Math.floor(totalMin / 60)).padStart(2, '0');
    const nm = String(totalMin % 60).padStart(2, '0');
    moveMatch(matchId, match.courtId, `${nh}:${nm}`);
  };

  const handleConfirmEditSchedule = (e) => {
    e.preventDefault();
    if (!editingScheduleMatch) return;
    moveMatch(editingScheduleMatch.id, editCourtId, editTime);
    setEditingScheduleMatch(null);
  };

  // Filter unscheduled matches
  const unscheduledMatches = matches.filter((m) => !m.courtId && m.status !== 'encerrada');
  const filteredUnscheduledMatches = unscheduledMatches.filter(
    (m) => pendingCatFilter === 'all' || m.categoryId === pendingCatFilter
  );

  return (
    <div className="view-container">
      {/* Header com Identidade DB Eventos */}
      <div className="page-header">
        <div className="page-header-info">
          <h2>
            <Calendar size={28} color="#06b6d4" />
            <span>Programação Oficial do Torneio</span>
          </h2>
          <p>
            Configure as quadras e horários da arena, consulte a lista de confrontos por categoria e organize os cards das partidas.
          </p>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={16} />
            <span>Imprimir Ordem dos Jogos</span>
          </button>
        </div>
      </div>

      {/* Sub-Abas de Navegação da Programação */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem', flexWrap: 'wrap' }}>
        <button
          className={`btn ${subTab === 'config' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSubTab('config')}
        >
          <Settings size={16} />
          <span>1. Configuração (Quadras, Horários & Duração)</span>
        </button>

        <button
          className={`btn ${subTab === 'cards_confrontos' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSubTab('cards_confrontos')}
        >
          <LayoutGrid size={16} />
          <span>2. Cards de Confrontos (Mover & Reordenar)</span>
        </button>

        <button
          className={`btn ${subTab === 'lista_categoria' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSubTab('lista_categoria')}
        >
          <ListOrdered size={16} />
          <span>3. Programação em Lista por Categoria</span>
        </button>
      </div>

      {/* =========================================================================
          SUB-ABA 1: CONFIGURAÇÃO
          ========================================================================= */}
      {subTab === 'config' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '1.5rem', alignItems: 'flex-start' }}>
          {/* Formulário de Configuração */}
          <div className="glass-card">
            <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={20} color="#06b6d4" />
              <span>Parâmetros de Programação da Arena</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Informe os dados da arena para gerar a grade automática e distribuir todos os confrontos por quadra e horário.
            </p>

            <form onSubmit={handleSaveConfig}>
              <div className="form-grid-2" style={{ marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label>Quantidade de Quadras Disponíveis</label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    required
                    className="form-control"
                    value={formCourts}
                    onChange={(e) => setFormCourts(e.target.value)}
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    Quadras ativas para o torneio (ex: 4 quadras)
                  </small>
                </div>

                <div className="form-group">
                  <label>Tempo Estimado de Jogo (minutos)</label>
                  <select
                    className="form-control"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                  >
                    <option value="30">30 minutos</option>
                    <option value="40">40 minutos</option>
                    <option value="45">45 minutos (Padrão)</option>
                    <option value="50">50 minutos</option>
                    <option value="60">60 minutos (1 hora)</option>
                    <option value="75">75 minutos</option>
                  </select>
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    Intervalo entre os inícios de cada jogo
                  </small>
                </div>
              </div>

              <div className="form-grid-2" style={{ marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label>Horário de Início do Torneio</label>
                  <input
                    type="time"
                    required
                    className="form-control"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    Primeira chamada de jogos do dia
                  </small>
                </div>

                <div className="form-group">
                  <label>Horário Previsto de Término</label>
                  <input
                    type="time"
                    required
                    className="form-control"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    Previsão de encerramento das quadras
                  </small>
                </div>
              </div>

              {configSuccessMsg && (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', color: '#34d399', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}>
                  <Check size={16} />
                  <span>Configurações salvas e horários distribuídos com sucesso!</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button type="submit" className="btn btn-primary">
                  <Sparkles size={16} />
                  <span>Salvar & Gerar Grade de Horários</span>
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => applyCourtCount(formCourts)}
                >
                  <span>Apenas Atualizar Quadras ({formCourts})</span>
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ color: '#f87171' }}
                  onClick={clearAllSchedule}
                >
                  <Trash2 size={15} />
                  <span>Limpar Horários</span>
                </button>
              </div>
            </form>
          </div>

          {/* Painel de Cálculo & Diagnóstico */}
          <div className="glass-card" style={{ background: 'rgba(21, 31, 50, 0.9)' }}>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} color="#f59e0b" />
              <span>Diagnóstico de Capacidade da Arena</span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Janela Total de Horário:</span>
                <strong style={{ color: '#fff' }}>{Math.floor(totalAvailableMinutes / 60)}h {totalAvailableMinutes % 60}min</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Jogos por Quadra no Período:</span>
                <strong style={{ color: '#34d399' }}>{gamesPerCourt} partidas</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Capacidade Máxima Total:</span>
                <strong style={{ color: '#22d3ee', fontSize: '1.05rem' }}>{totalTournamentCapacity} partidas</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Partidas Cadastradas no Torneio:</span>
                <strong style={{ color: '#facc15' }}>{totalMatchesCount} confrontos</strong>
              </div>

              <div style={{ marginTop: '0.5rem', padding: '0.85rem', borderRadius: 'var(--radius-sm)', background: totalTournamentCapacity >= totalMatchesCount ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${totalTournamentCapacity >= totalMatchesCount ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}>
                {totalTournamentCapacity >= totalMatchesCount ? (
                  <span style={{ color: '#34d399', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={16} /> A arena comporta todos os jogos no horário estipulado com folga.
                  </span>
                ) : (
                  <span style={{ color: '#f87171', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={16} /> Atenção: O torneio necessita de mais tempo ou mais quadras para comportar todos os jogos.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-ABA 2: LISTA POR CATEGORIA
          ========================================================================= */}
      {subTab === 'lista_categoria' && (
        <div>
          {/* Filtro de Categoria */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Filtrar Categoria:</span>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                className={`btn btn-sm ${selectedCatFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedCatFilter('all')}
              >
                Todas as Categorias ({matches.length})
              </button>
              {categories.map((c) => {
                const count = matches.filter((m) => m.categoryId === c.id).length;
                return (
                  <button
                    key={c.id}
                    className={`btn btn-sm ${selectedCatFilter === c.id ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setSelectedCatFilter(c.id)}
                  >
                    {c.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Listagem Agrupada por Categoria */}
          {categories
            .filter((cat) => selectedCatFilter === 'all' || cat.id === selectedCatFilter)
            .map((cat) => {
              const catMatches = matches
                .filter((m) => m.categoryId === cat.id)
                .sort((a, b) => (a.startTime || '99:99').localeCompare(b.startTime || '99:99'));

              return (
                <div key={cat.id} className="glass-card" style={{ marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ color: '#fff', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Layers size={18} color="#06b6d4" />
                        <span>{cat.name}</span>
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {cat.level} • {cat.matchFormat}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                      {catMatches.length} partidas programadas
                    </span>
                  </div>

                  {catMatches.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '1rem 0' }}>
                      Nenhuma partida cadastrada nesta categoria.
                    </p>
                  ) : (
                    <div className="standings-table-wrap">
                      <table className="standings-table">
                        <thead>
                          <tr>
                            <th style={{ width: '90px' }}>Horário</th>
                            <th style={{ width: '130px' }}>Quadra</th>
                            <th>Fase / Grupo</th>
                            <th>Confronto (Equipe 1 x Equipe 2)</th>
                            <th style={{ textAlign: 'center' }}>Placar / Status</th>
                            <th style={{ textAlign: 'right' }}>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {catMatches.map((m) => {
                            const court = courts.find((c) => c.id === m.courtId);
                            const isLive = m.status === 'em_andamento';
                            const isFinished = m.status === 'encerrada';
                            const g1 = m.score?.gamesT1 ?? m.score?.set1?.[0] ?? 0;
                            const g2 = m.score?.gamesT2 ?? m.score?.set1?.[1] ?? 0;

                            return (
                              <tr key={m.id} style={{ background: isLive ? 'rgba(239, 68, 68, 0.05)' : undefined }}>
                                <td>
                                  <strong style={{ color: m.startTime ? '#34d399' : 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    {m.startTime ? `⏰ ${m.startTime}` : 'A definir'}
                                  </strong>
                                </td>
                                <td>
                                  {court ? (
                                    <span style={{ color: '#fff', fontWeight: 600 }}>{court.name}</span>
                                  ) : (
                                    <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Sem quadra</span>
                                  )}
                                </td>
                                <td>
                                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                                    {m.groupName ? `${m.groupName} • ` : ''}{m.phase}
                                  </span>
                                </td>
                                <td>
                                  <strong style={{ color: isFinished && m.winnerId === m.team1Id ? '#34d399' : '#fff' }}>
                                    {m.team1Label}
                                  </strong>
                                  <span style={{ color: 'var(--text-muted)', margin: '0 6px' }}>vs</span>
                                  <strong style={{ color: isFinished && m.winnerId === m.team2Id ? '#34d399' : '#fff' }}>
                                    {m.team2Label}
                                  </strong>
                                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                                    {m.team1Players} x {m.team2Players}
                                  </div>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                  {isFinished ? (
                                    <div>
                                      <span style={{ color: '#10b981', fontWeight: 800 }}>
                                        {m.seriesScore ? `${m.seriesScore.winsT1} x ${m.seriesScore.winsT2} (Fim MD3)` : `${g1} x ${g2} (Fim)`}
                                      </span>
                                    </div>
                                  ) : isLive ? (
                                    <div>
                                      <span className="court-status-pill status-pill-live" style={{ fontSize: '0.65rem' }}>
                                        {m.seriesScore ? `AO VIVO (${m.seriesScore.winsT1} x ${m.seriesScore.winsT2})` : `AO VIVO (${g1} x ${g2})`}
                                      </span>
                                    </div>
                                  ) : (
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                      Agendada
                                    </span>
                                  )}
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                                    <button
                                      className="btn btn-secondary btn-sm"
                                      style={{
                                        padding: '3px 8px',
                                        fontSize: '0.72rem',
                                        background: m.lineupTeam1Confirmed && m.lineupTeam2Confirmed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                                        color: m.lineupTeam1Confirmed && m.lineupTeam2Confirmed ? 'var(--primary)' : 'var(--accent-cyan)',
                                        borderColor: m.lineupTeam1Confirmed && m.lineupTeam2Confirmed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(6, 182, 212, 0.4)'
                                      }}
                                      onClick={() => setCoachLineupMatch(m)}
                                      title="Escalação das duplas pelo técnico antes do jogo"
                                    >
                                      <UserCheck size={12} /> Escalar
                                    </button>
                                    <button
                                      className="btn btn-secondary btn-sm"
                                      style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                                      onClick={() => {
                                        setEditingScheduleMatch(m);
                                        setEditCourtId(m.courtId || courts[0]?.id || '');
                                        setEditTime(m.startTime || '09:00');
                                      }}
                                    >
                                      Mover
                                    </button>
                                    <button
                                      className="btn btn-primary btn-sm"
                                      style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                                      onClick={() => setScoreModalMatch(m)}
                                    >
                                      <Tv size={12} /> Placar
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* =========================================================================
          SUB-ABA 3: CARDS DE CONFRONTOS (MOVER & REORDENAR)
          ========================================================================= */}
      {subTab === 'cards_confrontos' && (
        <div>
          {/* Instruções Visuais */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#22d3ee' }}>
              <Move size={16} />
              <span>
                <strong>Organização Interativa:</strong> Arraste e solte (Drag & Drop) qualquer card entre as quadras ou use os botões de <strong>▲ Adiantar</strong> e <strong>▼ Postergar</strong> nos cards para ajustar horários.
              </span>
            </div>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => generateScheduleFromConfig()}
            >
              <Sparkles size={14} color="#34d399" />
              <span>Auto-Distribuir Cards</span>
            </button>
          </div>

          {/* Barra de Filtro de Categoria nos Cards */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap', background: 'rgba(0,0,0,0.25)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Filtrar Quadras por Categoria:</span>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn btn-sm ${cardsCatFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '3px 10px' }}
                onClick={() => setCardsCatFilter('all')}
              >
                Todas as Categorias
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`btn btn-sm ${cardsCatFilter === c.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '3px 10px' }}
                  onClick={() => setCardsCatFilter(c.id)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '1.5rem', alignItems: 'flex-start' }}>
            
            {/* Colunas de Quadras com seus Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`, gap: '1.25rem' }}>
              {courts.map((court) => {
                const courtMatches = matches
                  .filter((m) => m.courtId === court.id && (cardsCatFilter === 'all' || m.categoryId === cardsCatFilter))
                  .sort((a, b) => (a.startTime || '99:99').localeCompare(b.startTime || '99:99'));

                return (
                  <div
                    key={court.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnCourt(e, court.id)}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: '380px',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {/* Header da Quadra */}
                    <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{court.name}</strong>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{court.surface}</div>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 700, background: 'rgba(6, 182, 212, 0.15)', padding: '2px 8px', borderRadius: '10px' }}>
                        {courtMatches.length} jogos
                      </span>
                    </div>

                    {/* Área de Cards Arrastáveis */}
                    <div style={{ padding: '0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {courtMatches.length === 0 ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', gap: '10px' }}>
                          <LayoutGrid size={22} style={{ opacity: 0.5, color: 'var(--accent-cyan)' }} />
                          <span>Quadra livre para jogos</span>
                          {filteredUnscheduledMatches.length > 0 && (
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              style={{
                                fontSize: '0.75rem',
                                padding: '5px 12px',
                                color: 'var(--accent-cyan)',
                                borderColor: 'rgba(6, 182, 212, 0.4)',
                                background: 'rgba(6, 182, 212, 0.1)',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                              onClick={() => assignMatchToCourt(filteredUnscheduledMatches[0].id, court.id, '09:00')}
                            >
                              <Plus size={13} />
                              <span>Alocar Próximo Jogo</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        courtMatches.map((m) => {
                          const cat = categories.find((c) => c.id === m.categoryId);
                          const isLive = m.status === 'em_andamento';
                          const isFinished = m.status === 'encerrada';
                          const g1 = m.score?.gamesT1 ?? m.score?.set1?.[0] ?? 0;
                          const g2 = m.score?.gamesT2 ?? m.score?.set1?.[1] ?? 0;
                          const isLineupConfirmed = m.lineupTeam1Confirmed && m.lineupTeam2Confirmed;

                          return (
                            <div
                              key={m.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, m.id)}
                              style={{
                                background: isLive ? 'rgba(239, 68, 68, 0.12)' : 'rgba(0,0,0,0.35)',
                                border: isLive ? '1px solid #ef4444' : '1px solid var(--border-color)',
                                borderRadius: '12px',
                                padding: '0.85rem',
                                cursor: 'grab',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.45rem',
                                transition: 'all 0.15s',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                              }}
                            >
                              {/* Header do Card */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                                <span style={{ fontWeight: 800, color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 7px', borderRadius: '5px' }}>
                                  ⏰ {m.startTime || '--:--'}
                                </span>
                                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.75rem' }}>
                                  {cat?.name}
                                </span>
                              </div>

                              {/* Confronto */}
                              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', marginTop: '1px' }}>
                                {m.team1Label} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>vs</span> {m.team2Label}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                                {m.team1Players} x {m.team2Players}
                              </div>

                              {/* Placar se houver */}
                              {(isLive || isFinished) && (
                                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#facc15', background: 'rgba(0,0,0,0.25)', padding: '3px 8px', borderRadius: '6px' }}>
                                  {m.seriesScore
                                    ? `Série: ${m.seriesScore.winsT1} x ${m.seriesScore.winsT2} (MD3) ${isFinished ? '• Finalizado' : '• Ao Vivo'}`
                                    : `Placar: ${g1} x ${g2} ${isFinished ? '(Finalizado)' : '(Ao Vivo)'}`}
                                </div>
                              )}

                              {/* AÇÕES DENTRO DO CARD DA QUADRA */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '0.35rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.55rem' }}>
                                
                                {/* Linha 1: Escalar Dupla e Lançar Placar */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                                  <button
                                    type="button"
                                    className="btn btn-sm"
                                    style={{
                                      padding: '6px 8px',
                                      fontSize: '0.75rem',
                                      fontWeight: 700,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '5px',
                                      borderRadius: '8px',
                                      background: isLineupConfirmed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                                      color: isLineupConfirmed ? 'var(--primary)' : 'var(--accent-cyan)',
                                      border: `1px solid ${isLineupConfirmed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(6, 182, 212, 0.4)'}`,
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => setCoachLineupMatch(m)}
                                    title="Técnico: Escalar duplas antes do confronto"
                                  >
                                    <UserCheck size={13} />
                                    <span>{isLineupConfirmed ? 'Escalado' : 'Escalar'}</span>
                                  </button>

                                  <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    style={{
                                      padding: '6px 8px',
                                      fontSize: '0.75rem',
                                      fontWeight: 700,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '5px',
                                      borderRadius: '8px',
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => setScoreModalMatch(m)}
                                    title="Lançar ou atualizar placar do confronto"
                                  >
                                    <Tv size={13} />
                                    <span>Placar</span>
                                  </button>
                                </div>

                                {/* Linha 2: Ajuste de Horário (-15m / +15m), Mover e Liberar Quadra */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                                  <div style={{ display: 'flex', gap: '4px' }}>
                                    <button
                                      type="button"
                                      className="btn btn-secondary btn-sm"
                                      style={{ padding: '4px 7px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '2px', borderRadius: '6px' }}
                                      onClick={() => adjustMatchTime(m.id, -15)}
                                      title="Adiantar horário em 15 minutos"
                                    >
                                      <ArrowUp size={11} />
                                      <span>-15m</span>
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-secondary btn-sm"
                                      style={{ padding: '4px 7px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '2px', borderRadius: '6px' }}
                                      onClick={() => adjustMatchTime(m.id, 15)}
                                      title="Postergar horário em 15 minutos"
                                    >
                                      <ArrowDown size={11} />
                                      <span>+15m</span>
                                    </button>
                                  </div>

                                  <div style={{ display: 'flex', gap: '4px' }}>
                                    <button
                                      type="button"
                                      className="btn btn-secondary btn-sm"
                                      style={{ padding: '4px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '6px' }}
                                      onClick={() => {
                                        setEditingScheduleMatch(m);
                                        setEditCourtId(m.courtId || courts[0]?.id || '');
                                        setEditTime(m.startTime || '09:00');
                                      }}
                                      title="Mudar quadra ou horário"
                                    >
                                      <Move size={11} />
                                      <span>Mover</span>
                                    </button>

                                    <button
                                      type="button"
                                      className="btn btn-secondary btn-sm"
                                      style={{
                                        padding: '4px 8px',
                                        fontSize: '0.72rem',
                                        color: '#f87171',
                                        borderColor: 'rgba(239, 68, 68, 0.3)',
                                        background: 'rgba(239, 68, 68, 0.08)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        borderRadius: '6px'
                                      }}
                                      onClick={() => unassignMatchFromCourt(m.id)}
                                      title="Retornar jogo para os pendentes"
                                    >
                                      <RotateCcw size={11} />
                                      <span>Liberar</span>
                                    </button>
                                  </div>
                                </div>

                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Painel Lateral: Cards Sem Quadra */}
            <div className="glass-card" style={{ padding: '1rem' }}>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="#f59e0b" />
                <span>Confrontos Pendentes ({filteredUnscheduledMatches.length})</span>
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.65rem' }}>
                Arraste para as quadras ou clique em mover
              </p>

              {/* Seletor de Categoria dos Pendentes */}
              <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${pendingCatFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.68rem', padding: '2px 6px' }}
                  onClick={() => setPendingCatFilter('all')}
                >
                  Todas ({unscheduledMatches.length})
                </button>
                {categories.map((c) => {
                  const catCount = unscheduledMatches.filter((m) => m.categoryId === c.id).length;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`btn btn-sm ${pendingCatFilter === c.id ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.68rem', padding: '2px 6px' }}
                      onClick={() => setPendingCatFilter(c.id)}
                    >
                      {c.name} ({catCount})
                    </button>
                  );
                })}
              </div>

              {filteredUnscheduledMatches.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  <CheckCircle size={22} style={{ color: '#10b981', margin: '0 auto 0.4rem' }} />
                  {unscheduledMatches.length === 0
                    ? 'Todos os confrontos foram alocados em quadras!'
                    : 'Nenhum confronto pendente nesta categoria.'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '560px', overflowY: 'auto' }}>
                  {filteredUnscheduledMatches.map((m) => {
                    const cat = categories.find((c) => c.id === m.categoryId);
                    return (
                      <div
                        key={m.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, m.id)}
                        style={{
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.65rem',
                          cursor: 'grab'
                        }}
                      >
                        <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                          {cat?.name} • {m.phase}
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                          {m.team1Label} vs {m.team2Label}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                          {m.team1Players} x {m.team2Players}
                        </div>
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{
                              flex: 1,
                              fontSize: '0.72rem',
                              padding: '3px',
                              background: m.lineupTeam1Confirmed && m.lineupTeam2Confirmed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                              color: m.lineupTeam1Confirmed && m.lineupTeam2Confirmed ? 'var(--primary)' : 'var(--accent-cyan)'
                            }}
                            onClick={() => setCoachLineupMatch(m)}
                            title="Técnico: Escalar duplas antes do jogo"
                          >
                            <UserCheck size={11} /> Escalar
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ flex: 1.4, fontSize: '0.72rem', padding: '3px' }}
                            onClick={() => {
                              setEditingScheduleMatch(m);
                              setEditCourtId(courts[0]?.id || '');
                              setEditTime('09:00');
                            }}
                          >
                            <span>Mover...</span>
                            <ArrowRight size={11} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para Mover / Editar Quadra e Horário do Jogo */}
      {editingScheduleMatch && (
        <div className="modal-overlay" onClick={() => setEditingScheduleMatch(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <Calendar size={18} color="#06b6d4" />
                <span>Mover Confronto na Programação</span>
              </h3>
            </div>
            <form onSubmit={handleConfirmEditSchedule}>
              <div className="modal-body">
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    {categories.find((c) => c.id === editingScheduleMatch.categoryId)?.name} • {editingScheduleMatch.phase}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                    {editingScheduleMatch.team1Label} vs {editingScheduleMatch.team2Label}
                  </div>
                </div>

                <div className="form-group">
                  <label>Quadra de Destino</label>
                  <select
                    className="form-control"
                    value={editCourtId}
                    onChange={(e) => setEditCourtId(e.target.value)}
                  >
                    {courts.map((court) => (
                      <option key={court.id} value={court.id}>
                        {court.name} ({court.surface})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Horário do Confronto</label>
                  <input
                    type="time"
                    className="form-control"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingScheduleMatch(null)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirmar Mudança
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
