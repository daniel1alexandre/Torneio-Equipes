import React from 'react';
import { useTournament4 } from '../../context/Tournament4Context';
import { Sliders, Shield, Award, Users, AlertCircle, HeartHandshake, User, CheckCircle2 } from 'lucide-react';

export const T4RulesView = () => {
  const { rules } = useTournament4();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
          border: '1px solid var(--border-highlight)',
          borderRadius: '20px',
          padding: '1.5rem 1.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              background: 'rgba(139, 92, 246, 0.2)',
              color: 'var(--accent-purple)',
              padding: '4px 10px',
              borderRadius: '6px',
              letterSpacing: '0.05em'
            }}
          >
            Regulamento Técnico Oficial
          </span>
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
          {rules.title}
        </h1>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Normas de composição de equipe, obrigatoriedade de escalação prévia e pontuação das 5 disputas.
        </p>
      </div>

      {/* 5 Disputes Explanatory Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Disputa 1 */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontWeight: 800, fontSize: '0.95rem', marginBottom: '6px' }}>
            <Users size={18} />
            1. Dupla Masculina
          </div>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Participam obrigatoriamente os <strong>2 homens</strong> inscritos na equipe (H1 e H2). Set de 6 games.
          </p>
        </div>

        {/* Disputa 2 */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-rose)', fontWeight: 800, fontSize: '0.95rem', marginBottom: '6px' }}>
            <Users size={18} />
            2. Dupla Feminina
          </div>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Participam obrigatoriamente as <strong>2 mulheres</strong> inscritas na equipe (M1 e M2). Set de 6 games.
          </p>
        </div>

        {/* Disputa 3 */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontWeight: 800, fontSize: '0.95rem', marginBottom: '6px' }}>
            <HeartHandshake size={18} />
            3. Dupla Mista (Escalação)
          </div>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Cada equipe escolhe <strong>1 Homem e 1 Mulher</strong> dos seus 4 atletas. O capitão define antes do confronto.
          </p>
        </div>

        {/* Disputa 4 */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontWeight: 800, fontSize: '0.95rem', marginBottom: '6px' }}>
            <User size={18} />
            4. Simples Masculina (Escalação)
          </div>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Disputa individual. Cada equipe escolhe <strong>1 dos 2 homens</strong> para o duelo de simples.
          </p>
        </div>

        {/* Disputa 5 */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-rose)', fontWeight: 800, fontSize: '0.95rem', marginBottom: '6px' }}>
            <User size={18} />
            5. Simples Feminina (Escalação)
          </div>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Disputa individual. Cada equipe escolhe <strong>1 das 2 mulheres</strong> para o duelo de simples.
          </p>
        </div>
      </div>

      {/* Rules Full Text Card */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1.75rem', boxShadow: 'var(--shadow-md)' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={20} color="var(--primary)" />
          Texto Completo do Regulamento
        </h3>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
          }}
        >
          {rules.rulesText}
        </pre>
      </div>
    </div>
  );
};
