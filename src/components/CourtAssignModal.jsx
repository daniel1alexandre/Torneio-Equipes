import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { X, Calendar, MapPin, Check } from 'lucide-react';

const CourtAssignModalContent = () => {
  const {
    assignCourtData,
    setAssignCourtData,
    courts,
    matches,
    categories,
    assignMatchToCourt
  } = useTournament();

  const preselectedCourtId = assignCourtData?.courtId || null;
  const preselectedMatchId = assignCourtData?.matchId || null;

  const [selectedCourtId, setSelectedCourtId] = useState(
    preselectedCourtId || courts[0]?.id || ''
  );
  const [selectedMatchId, setSelectedMatchId] = useState(
    preselectedMatchId || ''
  );

  const initialCatFilter = preselectedMatchId
    ? matches.find((m) => m.id === preselectedMatchId)?.categoryId || 'all'
    : 'all';

  const [selectedCatFilter, setSelectedCatFilter] = useState(initialCatFilter);

  // Available pending or scheduled matches that are not already finished
  const allEligibleMatches = matches.filter(
    (m) => m.status !== 'encerrada' && (m.team1Id || m.team2Id)
  );

  const eligibleMatches = allEligibleMatches.filter(
    (m) => selectedCatFilter === 'all' || m.categoryId === selectedCatFilter
  );

  const handleConfirm = () => {
    if (!selectedCourtId) {
      alert('Selecione uma quadra.');
      return;
    }
    if (!selectedMatchId) {
      alert('Selecione uma partida para colocar em quadra.');
      return;
    }

    assignMatchToCourt(selectedMatchId, selectedCourtId);
    setAssignCourtData(null);
  };

  return (
    <div className="modal-overlay" onClick={() => setAssignCourtData(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <MapPin size={20} color="#10b981" />
            <span>Escalar Jogo para Quadra</span>
          </h3>
          <button className="modal-close-btn" onClick={() => setAssignCourtData(null)}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Selecionar Quadra */}
          <div className="form-group">
            <label>Selecione a Quadra de Destino</label>
            <select
              className="form-control"
              value={selectedCourtId}
              onChange={(e) => setSelectedCourtId(e.target.value)}
            >
              {courts.map((court) => (
                <option key={court.id} value={court.id}>
                  {court.name} ({court.status === 'em_andamento' ? '⚠️ Ocupada' : '✅ Livre'} - {court.surface})
                </option>
              ))}
            </select>
          </div>

          {/* Seletor de Categoria */}
          <div className="form-group">
            <label>Filtrar Partidas por Categoria</label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn btn-sm ${selectedCatFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                onClick={() => setSelectedCatFilter('all')}
              >
                Todas ({allEligibleMatches.length})
              </button>
              {categories.map((cat) => {
                const count = allEligibleMatches.filter((m) => m.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`btn btn-sm ${selectedCatFilter === cat.id ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                    onClick={() => setSelectedCatFilter(cat.id)}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selecionar Partida */}
          <div className="form-group">
            <label>Escolha a Partida do Torneio ({eligibleMatches.length} disponíveis)</label>
            {eligibleMatches.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Não há partidas pendentes disponíveis para esta categoria.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
                {eligibleMatches.map((m) => {
                  const cat = categories.find((c) => c.id === m.categoryId);
                  const isSelected = selectedMatchId === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMatchId(m.id)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0,0,0,0.3)',
                        border: isSelected ? '1px solid #10b981' : '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                        <span>{cat?.name || 'Categoria'} • {m.phase}</span>
                        {m.courtId && <span style={{ color: 'var(--accent-amber)' }}>Atualmente na {courts.find(c => c.id === m.courtId)?.name}</span>}
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '4px', color: '#fff' }}>
                        {m.team1Label} <span style={{ color: 'var(--text-muted)' }}>x</span> {m.team2Label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {m.team1Players} vs {m.team2Players}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setAssignCourtData(null)}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={!selectedMatchId || !selectedCourtId}
          >
            <Check size={16} />
            Confirmar e Enviar para Quadra
          </button>
        </div>
      </div>
    </div>
  );
};

export const CourtAssignModal = () => {
  const { assignCourtData } = useTournament();
  if (!assignCourtData) return null;
  return <CourtAssignModalContent />;
};
