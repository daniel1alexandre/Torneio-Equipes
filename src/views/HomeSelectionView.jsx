import React from 'react';
import {
  Users,
  Shield,
  Trophy,
  Calendar,
  Award,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  UserCheck,
  CheckCircle2,
  Zap,
  LayoutGrid
} from 'lucide-react';

export const HomeSelectionView = ({ onSelectMode }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        minHeight: '80vh'
      }}
    >
      {/* Hero Badge & Title */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem', maxWidth: '800px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '6px 16px',
            borderRadius: '30px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--primary)',
            marginBottom: '1rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase'
          }}
        >
          <Sparkles size={16} />
          <span>DB Eventos • Plataforma Oficial de Competições</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #ffffff 40%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Selecione a Modalidade do Torneio
        </h1>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            margin: '0 auto'
          }}
        >
          Escolha entre o formato clássico de <strong>6 Atletas por equipe</strong> ou o novo formato especial de{' '}
          <strong>4 Atletas (2 Homens + 2 Mulheres) com 5 disputas</strong> e escalação prévia obrigatória.
        </p>
      </div>

      {/* Cards Selection Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2rem',
          width: '100%',
          marginBottom: '3rem'
        }}
      >
        {/* CARD 1: TORNEIO 6 ATLETAS */}
        <div
          onClick={() => onSelectMode('tournament6')}
          style={{
            background: 'linear-gradient(180deg, rgba(21, 31, 50, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: 'var(--shadow-lg)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
        >
          {/* Top Tag */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--primary)',
                padding: '4px 12px',
                borderRadius: '20px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
            >
              Formato Clássico
            </span>

            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Users size={22} />
            </div>
          </div>

          {/* Body */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Torneio Equipes • 6 Atletas
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              O formato tradicional inter-equipes com 3 duplas por time distribuídas entre as categorias Masculino Open, Feminino A e Mista B.
            </p>

            {/* Feature bullets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <CheckCircle2 size={16} color="var(--primary)" />
                <span><strong>6 Atletas por equipe</strong> (3 duplas titulares)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <CheckCircle2 size={16} color="var(--primary)" />
                <span>Programação completa por horários e quadras</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <CheckCircle2 size={16} color="var(--primary)" />
                <span>Chaveamento mata-mata & grupos classificatórios</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <CheckCircle2 size={16} color="var(--primary)" />
                <span>Classificação geral por categoria e pontuação de clube</span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <button
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              fontSize: '1rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--primary), #059669)',
              color: '#fff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px var(--primary-glow)'
            }}
          >
            <span>Acessar Torneio 6 Atletas</span>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* CARD 2: TORNEIO 4 ATLETAS */}
        <div
          onClick={() => onSelectMode('tournament4')}
          style={{
            background: 'linear-gradient(180deg, rgba(21, 31, 50, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '2px solid rgba(6, 182, 212, 0.4)',
            borderRadius: '24px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 12px 36px rgba(6, 182, 212, 0.15)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-6px)';
            e.currentTarget.style.borderColor = 'var(--accent-cyan)';
            e.currentTarget.style.boxShadow = '0 20px 45px rgba(6, 182, 212, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)';
            e.currentTarget.style.boxShadow = '0 12px 36px rgba(6, 182, 212, 0.15)';
          }}
        >
          {/* Top Tag */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                background: 'rgba(6, 182, 212, 0.2)',
                color: 'var(--accent-cyan)',
                padding: '4px 12px',
                borderRadius: '20px',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Zap size={13} />
              NOVO • ELIMINATÓRIA SIMPLES • 5 DISPUTAS
            </span>

            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <HeartHandshake size={22} />
            </div>
          </div>

          {/* Body */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Torneio Equipes • 4 Atletas
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Formação de <strong>2 Homens e 2 Mulheres</strong> por equipe em <strong>Eliminatória Simples (Mata-Mata)</strong>, menu de <strong>Programação</strong>, chaveamento e <strong>5 disputas por confronto</strong> com escalação prévia.
            </p>

            {/* Feature bullets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <CheckCircle2 size={16} color="var(--accent-cyan)" />
                <span><strong>Eliminatória Simples:</strong> Chaveamento mata-mata automático conforme o nº de equipes</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <CheckCircle2 size={16} color="var(--accent-cyan)" />
                <span><strong>Menu Programação:</strong> Ordem cronológica dos jogos e distribuição por quadra</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <CheckCircle2 size={16} color="var(--accent-cyan)" />
                <span><strong>5 Disputas:</strong> Dupla Masc, Dupla Fem, Mista, Simples Masc, Simples Fem</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <CheckCircle2 size={16} color="var(--accent-cyan)" />
                <span><strong>Escalação Prévia:</strong> O técnico/capitão escala quem joga antes dos jogos</span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <button
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              fontSize: '1rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--accent-cyan), #0284c7)',
              color: '#fff',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(6, 182, 212, 0.4)'
            }}
          >
            <span>Acessar Torneio 4 Atletas</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Footer Banner */}
      <div
        style={{
          width: '100%',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-color)',
          borderRadius: '18px',
          padding: '1.25rem 1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src="/db-logo.jpg"
            alt="DB Eventos"
            style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              DB Eventos • Gestão Esportiva Profissional
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Alterne entre as modalidades a qualquer instante utilizando a barra superior.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span>✓ Súmulas Digitais</span>
          <span>✓ Ao Vivo nas Quadras</span>
          <span>✓ Atualização Instantânea</span>
        </div>
      </div>
    </div>
  );
};
