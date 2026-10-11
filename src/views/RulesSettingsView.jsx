import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  Sliders,
  Award,
  Save,
  FileText,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  Check,
  Sparkles
} from 'lucide-react';

export const RulesSettingsView = () => {
  const {
    scoringRules,
    setScoringRules,
    resetEvent,
    clearAllData,
    exportData
  } = useTournament();

  const [firstPlace, setFirstPlace] = useState(scoringRules.firstPlace || 100);
  const [secondPlace, setSecondPlace] = useState(scoringRules.secondPlace || 70);
  const [thirdPlace, setThirdPlace] = useState(scoringRules.thirdPlace || 50);
  const [fourthPlace, setFourthPlace] = useState(scoringRules.fourthPlace || 35);
  const [quarterFinalist, setQuarterFinalist] = useState(scoringRules.quarterFinalist || 20);
  const [bonusPerMatchWin, setBonusPerMatchWin] = useState(scoringRules.bonusPerMatchWin || 5);
  const [rulesText, setRulesText] = useState(scoringRules.rulesText || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetEvent = () => {
    resetEvent();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3500);
  };

  const handleSaveRules = (e) => {
    e.preventDefault();
    setScoringRules({
      firstPlace: Number(firstPlace),
      secondPlace: Number(secondPlace),
      thirdPlace: Number(thirdPlace),
      fourthPlace: Number(fourthPlace),
      quarterFinalist: Number(quarterFinalist),
      bonusPerMatchWin: Number(bonusPerMatchWin),
      rulesText: rulesText
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="view-container">
      <div className="page-header">
        <div className="page-header-info">
          <h2>
            <Sliders size={28} color="#10b981" />
            <span>Regras & Pontuação por Posição</span>
          </h2>
          <p>
            Defina o peso e a pontuação concedida a cada colocação no torneio para a classificação geral de equipes.
          </p>
        </div>

        <div className="page-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {resetSuccess && (
            <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.85rem' }}>
              ✓ Resultados zerados com sucesso!
            </span>
          )}
          <button
            type="button"
            className="btn btn-secondary"
            style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
            onClick={handleResetEvent}
            title="Apaga todos os resultados e confrontos, mantendo as equipes, categorias e atletas cadastrados"
          >
            <RotateCcw size={15} />
            <span>Reiniciar Evento</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveRules}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Card: Tabela de Pontos por Colocação */}
          <div className="glass-card">
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} color="#facc15" />
              <span>Pontos por Posição Final na Categoria</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Pontos creditados à equipe de acordo com o resultado obtido em cada uma das categorias disputadas.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>🥇 1º Lugar (Equipe Campeã)</span>
                  <span style={{ color: '#facc15', fontWeight: 800 }}>{firstPlace} pts</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  className="form-control"
                  value={firstPlace}
                  onChange={(e) => setFirstPlace(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>🥈 2º Lugar (Vice-Campeã)</span>
                  <span style={{ color: '#cbd5e1', fontWeight: 800 }}>{secondPlace} pts</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  className="form-control"
                  value={secondPlace}
                  onChange={(e) => setSecondPlace(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>🥉 3º Lugar (Semifinalista)</span>
                  <span style={{ color: '#f97316', fontWeight: 800 }}>{thirdPlace} pts</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  className="form-control"
                  value={thirdPlace}
                  onChange={(e) => setThirdPlace(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>4º Lugar</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 800 }}>{fourthPlace} pts</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  className="form-control"
                  value={fourthPlace}
                  onChange={(e) => setFourthPlace(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Quartas de Final / Participação</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 800 }}>{quarterFinalist} pts</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  className="form-control"
                  value={quarterFinalist}
                  onChange={(e) => setQuarterFinalist(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>⚡ Bônus por Partida Vencida (Individual)</span>
                  <span style={{ color: '#10b981', fontWeight: 800 }}>+{bonusPerMatchWin} pts</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-control"
                  value={bonusPerMatchWin}
                  onChange={(e) => setBonusPerMatchWin(e.target.value)}
                />
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
                  Soma extra acumulada para a equipe a cada vitória em quadra em qualquer fase.
                </small>
              </div>
            </div>
          </div>

          {/* Card: Regulamento & Regras Gerais */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} color="#06b6d4" />
              <span>Regulamento & Critérios do Torneio</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Texto oficial contendo as diretrizes, tempo de tolerância, critérios de desempate e normas da arena.
            </p>

            <div className="form-group" style={{ flex: 1 }}>
              <textarea
                className="form-control"
                style={{ height: '310px', resize: 'vertical', lineHeight: '1.6', fontFamily: 'monospace', fontSize: '0.85rem' }}
                value={rulesText}
                onChange={(e) => setRulesText(e.target.value)}
                placeholder="Insira o regulamento oficial aqui..."
              />
            </div>
          </div>
        </div>

        {/* Barra de Salvar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-card)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div>
            {savedSuccess && (
              <span style={{ color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                <Check size={18} /> Pontuações e regras salvas com sucesso! Classificação recalculada.
              </span>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            <Save size={16} />
            <span>Salvar Regras & Recalcular Pontuações</span>
          </button>
        </div>
      </form>

      {/* Zona de Gerenciamento Geral */}
      <div style={{ marginTop: '2.5rem' }} className="glass-card">
        <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>Manutenção e Backup do Torneio</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          Exporte um arquivo de segurança para compartilhar ou transportar para outro computador, ou zere para iniciar uma nova copa.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-danger" onClick={clearAllData}>
            <Trash2 size={15} />
            <span>Zerar Todos os Dados</span>
          </button>
        </div>
      </div>
    </div>
  );
};
