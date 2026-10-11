import React, { useState } from 'react';
import { useTournament4 } from '../../context/Tournament4Context';
import {
  Calendar,
  Clock,
  Printer,
  LayoutGrid,
  ListOrdered,
  RotateCcw,
  UserCheck,
  Shield,
  ArrowRight,
  Tv,
  AlertCircle,
  Trophy,
  GitFork,
  ArrowUp,
  ArrowDown,
  Move,
  Plus
} from 'lucide-react';

export const T4ScheduleView = () => {
  const {
    ties,
    teams,
    courts,
    moveTie,
    unassignCourt,
    unassignTie,
    adjustTieTime,
    assignCourtToTie,
    setLineupModalTie,
    setScoreModalData,
    generateSingleEliminationBracket
  } = useTournament4();

  const [subTab, setSubTab] = useState('cards_confrontos'); // 'cards_confrontos' | 'lista_ordem'
  const [editingTie, setEditingTie] = useState(null);
  const [editCourtId, setEditCourtId] = useState(courts[0]?.id || '');
  const [editTime, setEditTime] = useState('09:00');

  const getTeam = (teamId) => teams.find((t) => t.id === teamId);
  const getCourt = (courtId) => courts.find((c) => c.id === courtId);

  const handleConfirmMove = (e) => {
    e.preventDefault();
    if (!editingTie) return;
    moveTie(editingTie.id, editCourtId, editTime);
    setEditingTie(null);
  };

  // Confrontos com quadra atribuída
  const scheduledTies = ties.filter((t) => t.courtId);
  // Confrontos pendentes de quadra
  const unscheduledTies = ties.filter((t) => !t.courtId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(16, 185, 129, 0.08) 100%)',
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
                background: 'rgba(6, 182, 212, 0.2)',
                color: 'var(--accent-cyan)',
                padding: '4px 10px',
                borderRadius: '6px',
                letterSpacing: '0.05em'
              }}
            >
              Torneio 4 Atletas • Eliminatória Simples
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Programação Oficial dos Confrontos
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Organize a ordem dos jogos, aloque as quadras e acompanhe os horários de cada fase do mata-mata.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              if (window.confirm('Deseja recriar o chaveamento em eliminatória simples com base nas equipes cadastradas?')) {
                generateSingleEliminationBracket();
              }
            }}
            style={{
              padding: '9px 15px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(6, 182, 212, 0.35)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <GitFork size={15} />
            Gerar Chave Eliminatória
          </button>

          <button
            onClick={() => window.print()}
            style={{
              padding: '9px 15px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Printer size={15} />
            Imprimir Programação
          </button>
        </div>
      </div>

      {/* Sub-Abas de Navegação */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <button
          onClick={() => setSubTab('cards_confrontos')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 700,
            background: subTab === 'cards_confrontos' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
            color: subTab === 'cards_confrontos' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <LayoutGrid size={15} />
          <span>Cards por Quadra</span>
        </button>

        <button
          onClick={() => setSubTab('lista_ordem')}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 700,
            background: subTab === 'lista_ordem' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
            color: subTab === 'lista_ordem' ? '#fff' : 'var(--text-secondary)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ListOrdered size={15} />
          <span>Ordem Cronológica dos Jogos</span>
        </button>
      </div>

      {/* SUB-ABA 1: CARDS POR QUADRA */}
      {subTab === 'cards_confrontos' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '1.5rem', alignItems: 'flex-start' }}>
          {/* Quadras e seus confrontos programados */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LayoutGrid size={18} color="var(--accent-cyan)" />
              <span>Programação Ativa nas Quadras ({scheduledTies.length} confrontos)</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {courts.map((court) => {
                const courtTies = ties.filter((t) => t.courtId === court.id);

                return (
                  <div
                    key={court.id}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '16px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{court.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{court.surface}</span>
                    </div>

                    {courtTies.length === 0 ? (
                      <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', border: '2px dashed var(--border-color)', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <LayoutGrid size={22} style={{ opacity: 0.5, color: 'var(--accent-cyan)' }} />
                        <span>Quadra livre para jogos</span>
                        {unscheduledTies.length > 0 && (
                          <button
                            type="button"
                            onClick={() => assignCourtToTie(unscheduledTies[0].id, court.id, '09:00')}
                            style={{
                              padding: '5px 12px',
                              fontSize: '0.75rem',
                              borderRadius: '8px',
                              background: 'rgba(6, 182, 212, 0.15)',
                              color: 'var(--accent-cyan)',
                              border: '1px solid rgba(6, 182, 212, 0.35)',
                              cursor: 'pointer',
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <Plus size={13} />
                            <span>Alocar Próximo Confronto</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      courtTies.map((tie) => {
                        const t1 = getTeam(tie.team1Id);
                        const t2 = getTeam(tie.team2Id);
                        const isLive = tie.status === 'em_andamento';
                        const isFinished = tie.status === 'finalizado';
                        const isLineupConfirmed = tie.lineupTeam1.confirmed && tie.lineupTeam2.confirmed;
                        const activeDispute = tie.disputes.find((d) => d.status !== 'finalizada') || tie.disputes[0];

                        return (
                          <div
                            key={tie.id}
                            style={{
                              background: isLive ? 'rgba(239, 68, 68, 0.12)' : 'rgba(0,0,0,0.3)',
                              border: `1px solid ${isLive ? 'var(--status-live)' : 'var(--border-color)'}`,
                              borderRadius: '12px',
                              padding: '0.85rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.5rem',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                              <span style={{ fontWeight: 800, color: 'var(--primary)', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 7px', borderRadius: '5px' }}>
                                ⏰ {tie.startTime}
                              </span>
                              <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.75rem' }}>
                                {tie.phase}
                              </span>
                            </div>

                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', marginTop: '1px' }}>
                              {t1?.name || tie.team1Label} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>vs</span> {t2?.name || tie.team2Label}
                            </div>

                            {/* Placar em disputas */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', background: 'rgba(0,0,0,0.2)', padding: '3px 8px', borderRadius: '6px' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Melhor de 5 disputas:</span>
                              <strong style={{ color: isLive ? 'var(--status-live)' : isFinished ? 'var(--primary)' : 'var(--text-primary)', fontSize: '0.92rem' }}>
                                {tie.score.disputesWonT1} x {tie.score.disputesWonT2} {isFinished ? '(Fim)' : isLive ? '(Ao Vivo)' : ''}
                              </strong>
                            </div>

                            {/* AÇÕES DENTRO DO CARD DA QUADRA */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.55rem', marginTop: '2px' }}>
                              
                              {/* Linha 1: Escalar Atletas e Lançar Placar */}
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                                <button
                                  type="button"
                                  onClick={() => setLineupModalTie(tie)}
                                  style={{
                                    padding: '6px 8px',
                                    fontSize: '0.75rem',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    background: isLineupConfirmed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                                    color: isLineupConfirmed ? 'var(--primary)' : 'var(--accent-cyan)',
                                    border: `1px solid ${isLineupConfirmed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(6, 182, 212, 0.4)'}`,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '5px'
                                  }}
                                  title="Definir escalação dos atletas para as 5 disputas"
                                >
                                  <UserCheck size={13} />
                                  <span>{isLineupConfirmed ? 'Escalado' : 'Escalar'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setScoreModalData({ tieId: tie.id, disputeId: activeDispute?.id })}
                                  style={{
                                    padding: '6px 8px',
                                    fontSize: '0.75rem',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, var(--primary), #059669)',
                                    color: '#fff',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '5px'
                                  }}
                                  title="Lançar ou atualizar placar das disputas"
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
                                    onClick={() => adjustTieTime(tie.id, -15)}
                                    style={{
                                      padding: '4px 7px',
                                      fontSize: '0.7rem',
                                      borderRadius: '6px',
                                      background: 'rgba(255, 255, 255, 0.05)',
                                      color: 'var(--text-secondary)',
                                      border: '1px solid var(--border-color)',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '2px'
                                    }}
                                    title="Adiantar 15 minutos"
                                  >
                                    <ArrowUp size={11} />
                                    <span>-15m</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => adjustTieTime(tie.id, 15)}
                                    style={{
                                      padding: '4px 7px',
                                      fontSize: '0.7rem',
                                      borderRadius: '6px',
                                      background: 'rgba(255, 255, 255, 0.05)',
                                      color: 'var(--text-secondary)',
                                      border: '1px solid var(--border-color)',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '2px'
                                    }}
                                    title="Postergar 15 minutos"
                                  >
                                    <ArrowDown size={11} />
                                    <span>+15m</span>
                                  </button>
                                </div>

                                <div style={{ display: 'flex', gap: '4px' }}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingTie(tie);
                                      setEditCourtId(court.id);
                                      setEditTime(tie.startTime || '09:00');
                                    }}
                                    style={{
                                      padding: '4px 8px',
                                      fontSize: '0.72rem',
                                      borderRadius: '6px',
                                      background: 'rgba(255, 255, 255, 0.05)',
                                      color: 'var(--text-secondary)',
                                      border: '1px solid var(--border-color)',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                    title="Mudar quadra ou alterar horário"
                                  >
                                    <Move size={11} />
                                    <span>Mover</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => unassignTie(tie.id)}
                                    style={{
                                      padding: '4px 8px',
                                      fontSize: '0.72rem',
                                      borderRadius: '6px',
                                      background: 'rgba(239, 68, 68, 0.08)',
                                      color: '#f87171',
                                      border: '1px solid rgba(239, 68, 68, 0.3)',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                    title="Retornar confronto para a lista de aguardando quadra"
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
                );
              })}
            </div>
          </div>

          {/* Painel de Confrontos Sem Quadra */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--accent-amber)" />
                <span>Aguardando Quadra ({unscheduledTies.length})</span>
              </h3>
            </div>

            {unscheduledTies.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Todos os confrontos da chave estão alocados em quadras!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {unscheduledTies.map((tie) => {
                  const t1 = getTeam(tie.team1Id);
                  const t2 = getTeam(tie.team2Id);

                  return (
                    <div
                      key={tie.id}
                      style={{
                        background: 'rgba(0,0,0,0.25)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '0.85rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem'
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                        {tie.phase} • {tie.group}
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>
                        {t1?.name || tie.team1Label} vs {t2?.name || tie.team2Label}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '6px', marginTop: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setLineupModalTie(tie)}
                          style={{
                            padding: '5px 8px',
                            fontSize: '0.75rem',
                            borderRadius: '8px',
                            fontWeight: 700,
                            background: tie.lineupTeam1.confirmed && tie.lineupTeam2.confirmed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                            color: tie.lineupTeam1.confirmed && tie.lineupTeam2.confirmed ? 'var(--primary)' : 'var(--accent-cyan)',
                            border: `1px solid ${tie.lineupTeam1.confirmed && tie.lineupTeam2.confirmed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(6, 182, 212, 0.4)'}`,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                        >
                          <UserCheck size={12} />
                          <span>{tie.lineupTeam1.confirmed && tie.lineupTeam2.confirmed ? 'Escalado' : 'Escalar'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingTie(tie);
                            setEditCourtId(courts[0]?.id || '');
                            setEditTime(tie.startTime || '09:00');
                          }}
                          style={{
                            padding: '5px 8px',
                            fontSize: '0.75rem',
                            borderRadius: '8px',
                            fontWeight: 600,
                            background: 'rgba(255, 255, 255, 0.06)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px'
                          }}
                        >
                          <span>Alocar Quadra</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-ABA 2: ORDEM CRONOLÓGICA / LISTA GERAL */}
      {subTab === 'lista_ordem' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Horário</th>
                  <th style={{ padding: '12px 16px' }}>Quadra</th>
                  <th style={{ padding: '12px 16px' }}>Fase Eliminatória</th>
                  <th style={{ padding: '12px 16px' }}>Confronto</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Placar Geral (5 Jogos)</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {ties.map((tie) => {
                  const t1 = getTeam(tie.team1Id);
                  const t2 = getTeam(tie.team2Id);
                  const court = getCourt(tie.courtId);
                  const isFinished = tie.status === 'finalizado';
                  const isLive = tie.status === 'em_andamento';

                  return (
                    <tr key={tie.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: isLive ? 'rgba(239, 68, 68, 0.05)' : undefined }}>
                      <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--primary)' }}>
                        ⏰ {tie.startTime || 'A definir'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {court ? (
                          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{court.name}</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Sem quadra</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontWeight: 700, color: '#fff' }}>{tie.phase}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <strong style={{ color: isFinished && tie.score.winnerId === tie.team1Id ? 'var(--primary)' : '#fff' }}>
                          {t1?.name || tie.team1Label}
                        </strong>
                        <span style={{ color: 'var(--text-muted)', margin: '0 6px' }}>vs</span>
                        <strong style={{ color: isFinished && tie.score.winnerId === tie.team2Id ? 'var(--primary)' : '#fff' }}>
                          {t2?.name || tie.team2Label}
                        </strong>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{ fontWeight: 800, color: isFinished ? 'var(--primary)' : isLive ? 'var(--status-live)' : 'var(--text-muted)' }}>
                          {tie.score.disputesWonT1} x {tie.score.disputesWonT2}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => setLineupModalTie(tie)}
                            style={{
                              padding: '4px 8px',
                              fontSize: '0.72rem',
                              borderRadius: '6px',
                              background: 'rgba(6, 182, 212, 0.15)',
                              color: 'var(--accent-cyan)',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            Escalação
                          </button>
                          <button
                            onClick={() => {
                              setEditingTie(tie);
                              setEditCourtId(tie.courtId || courts[0]?.id || '');
                              setEditTime(tie.startTime || '09:00');
                            }}
                            style={{
                              padding: '4px 8px',
                              fontSize: '0.72rem',
                              borderRadius: '6px',
                              background: 'rgba(255, 255, 255, 0.05)',
                              color: 'var(--text-secondary)',
                              border: '1px solid var(--border-color)',
                              cursor: 'pointer'
                            }}
                          >
                            Mover
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Mover Confronto */}
      {editingTie && (
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
              borderRadius: '20px',
              padding: '1.5rem',
              width: '100%',
              maxWidth: '440px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.7)'
            }}
          >
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
              Mover Confronto na Programação
            </h3>
            <form onSubmit={handleConfirmMove} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Quadra de Destino:
                </label>
                <select
                  value={editCourtId}
                  onChange={(e) => setEditCourtId(e.target.value)}
                  style={{ width: '100%', padding: '10px', fontSize: '0.85rem', background: '#0f172a', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                >
                  {courts.map((court) => (
                    <option key={court.id} value={court.id}>
                      {court.name} ({court.surface})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Horário de Início:
                </label>
                <input
                  type="time"
                  required
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  style={{ width: '100%', padding: '10px', fontSize: '0.85rem', background: '#0f172a', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingTie(null)}
                  style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: 700, background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer' }}
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
