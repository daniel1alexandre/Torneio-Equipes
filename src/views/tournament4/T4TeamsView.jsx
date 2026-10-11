import React, { useState } from 'react';
import { useTournament4 } from '../../context/Tournament4Context';
import { Shield, Plus, Edit2, Trash2, Users, User, Phone, MapPin, X, CheckCircle } from 'lucide-react';

export const T4TeamsView = () => {
  const { teams, addTeam, updateTeam, deleteTeam } = useTournament4();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [color, setColor] = useState('#06b6d4');
  const [captain, setCaptain] = useState('');
  const [contact, setContact] = useState('');
  const [city, setCity] = useState('');
  const [logoText, setLogoText] = useState('🎾');

  // 4 Athletes state
  const [m1Name, setM1Name] = useState('');
  const [m1Nick, setM1Nick] = useState('');
  const [m2Name, setM2Name] = useState('');
  const [m2Nick, setM2Nick] = useState('');

  const [w1Name, setW1Name] = useState('');
  const [w1Nick, setW1Nick] = useState('');
  const [w2Name, setW2Name] = useState('');
  const [w2Nick, setW2Nick] = useState('');

  const handleOpenNew = () => {
    setEditingTeam(null);
    setName('');
    setShortName('');
    setColor('#06b6d4');
    setCaptain('');
    setContact('');
    setCity('');
    setLogoText('🎾');
    setM1Name('');
    setM1Nick('');
    setM2Name('');
    setM2Nick('');
    setW1Name('');
    setW1Nick('');
    setW2Name('');
    setW2Nick('');
    setModalOpen(true);
  };

  const handleOpenEdit = (team) => {
    setEditingTeam(team);
    setName(team.name);
    setShortName(team.shortName);
    setColor(team.color || '#06b6d4');
    setCaptain(team.captain);
    setContact(team.contact || '');
    setCity(team.city || '');
    setLogoText(team.logoText || '🎾');

    const m = team.athletes.men || [];
    const w = team.athletes.women || [];

    setM1Name(m[0]?.name || '');
    setM1Nick(m[0]?.nickname || '');
    setM2Name(m[1]?.name || '');
    setM2Nick(m[1]?.nickname || '');

    setW1Name(w[0]?.name || '');
    setW1Nick(w[0]?.nickname || '');
    setW2Name(w[1]?.name || '');
    setW2Nick(w[1]?.nickname || '');

    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const athleteData = {
      men: [
        { id: editingTeam?.athletes.men[0]?.id || `ath-m1-${Date.now()}`, name: m1Name || 'Homem 1', nickname: m1Nick, phone: contact },
        { id: editingTeam?.athletes.men[1]?.id || `ath-m2-${Date.now()}`, name: m2Name || 'Homem 2', nickname: m2Nick, phone: contact }
      ],
      women: [
        { id: editingTeam?.athletes.women[0]?.id || `ath-w1-${Date.now()}`, name: w1Name || 'Mulher 1', nickname: w1Nick, phone: contact },
        { id: editingTeam?.athletes.women[1]?.id || `ath-w2-${Date.now()}`, name: w2Name || 'Mulher 2', nickname: w2Nick, phone: contact }
      ]
    };

    if (editingTeam) {
      updateTeam(editingTeam.id, {
        name,
        shortName: shortName || name.slice(0, 3).toUpperCase(),
        color,
        captain: captain || m1Name || 'Capitão',
        contact,
        city,
        logoText,
        athletes: athleteData
      });
    } else {
      addTeam({
        name,
        shortName: shortName || name.slice(0, 3).toUpperCase(),
        color,
        captain: captain || m1Name || 'Capitão',
        contact,
        city,
        logoText,
        athletes: athleteData
      });
    }

    setModalOpen(false);
  };

  const handleDelete = (teamId, teamName) => {
    if (window.confirm(`Tem certeza que deseja remover a equipe "${teamName}"?`)) {
      deleteTeam(teamId);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
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
                background: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--primary)',
                padding: '4px 10px',
                borderRadius: '6px',
                letterSpacing: '0.05em'
              }}
            >
              Composição Oficial • 4 Atletas por Equipe
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Equipes & Elencos (2 Homens + 2 Mulheres)
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Cada equipe deve ter exatamente 2 homens e 2 mulheres registrados para disputar as 5 categorias de jogos.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          style={{
            padding: '11px 20px',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, var(--primary), #059669)',
            color: '#fff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 16px var(--primary-glow)'
          }}
        >
          <Plus size={18} />
          Cadastrar Nova Equipe (4 Atletas)
        </button>
      </div>

      {/* Teams Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {teams.map((team) => {
          const men = team.athletes?.men || [];
          const women = team.athletes?.women || [];

          return (
            <div
              key={team.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                boxShadow: 'var(--shadow-md)',
                position: 'relative'
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: team.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      color: '#fff',
                      boxShadow: `0 4px 14px ${team.color}55`
                    }}
                  >
                    {team.logoText || '⚡'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)', fontWeight: 800 }}>
                      {team.name}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{team.shortName}</span>
                      {team.city && (
                        <>
                          <span>•</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <MapPin size={11} /> {team.city}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => handleOpenEdit(team)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: 'none',
                      borderRadius: '8px',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                    title="Editar Equipe"
                  >
                    <Edit2 size={15} />
                  </button>

                  <button
                    onClick={() => handleDelete(team.id, team.name)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: 'none',
                      borderRadius: '8px',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-rose)',
                      cursor: 'pointer'
                    }}
                    title="Excluir Equipe"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Captain / Contact */}
              <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 12px', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  Capitão: <strong style={{ color: 'var(--text-primary)' }}>{team.captain}</strong>
                </div>
                {team.contact && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                    <Phone size={12} /> {team.contact}
                  </div>
                )}
              </div>

              {/* Athletes List: 2 Men & 2 Women */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} /> 2 Atletas Masculinos
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {men.map((m, idx) => (
                    <div key={m.id || idx} style={{ background: 'rgba(6, 182, 212, 0.06)', border: '1px solid rgba(6, 182, 212, 0.15)', borderRadius: '8px', padding: '8px 10px' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Homem {idx + 1}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{m.name}</div>
                      {m.nickname && <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>"{m.nickname}"</div>}
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                  <User size={14} /> 2 Atletas Femininas
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {women.map((w, idx) => (
                    <div key={w.id || idx} style={{ background: 'rgba(236, 72, 153, 0.06)', border: '1px solid rgba(236, 72, 153, 0.15)', borderRadius: '8px', padding: '8px 10px' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Mulher {idx + 1}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{w.name}</div>
                      {w.nickname && <div style={{ fontSize: '0.72rem', color: 'var(--accent-rose)' }}>"{w.nickname}"</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Team Modal */}
      {modalOpen && (
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
              borderRadius: '24px',
              width: '100%',
              maxWidth: '650px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
              padding: '1.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.3rem', margin: 0, color: 'var(--text-primary)' }}>
                {editingTeam ? 'Editar Equipe (4 Atletas)' : 'Cadastrar Nova Equipe (4 Atletas)'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
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

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Basic Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Nome da Equipe:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Predadores da Areia"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '10px', fontSize: '0.9rem', background: '#0f172a', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Sigla (3 letras):
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="PRED"
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value.toUpperCase())}
                    style={{ width: '100%', padding: '10px', fontSize: '0.9rem', background: '#0f172a', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Capitão:
                  </label>
                  <input
                    type="text"
                    placeholder="Nome do Capitão"
                    value={captain}
                    onChange={(e) => setCaptain(e.target.value)}
                    style={{ width: '100%', padding: '10px', fontSize: '0.85rem', background: '#0f172a', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Cidade / Arena:
                  </label>
                  <input
                    type="text"
                    placeholder="Cidade"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{ width: '100%', padding: '10px', fontSize: '0.85rem', background: '#0f172a', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Cor / Emoji:
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      style={{ width: '42px', height: '42px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      maxLength={2}
                      value={logoText}
                      onChange={(e) => setLogoText(e.target.value)}
                      style={{ width: '42px', textAlign: 'center', fontSize: '1.2rem', background: '#0f172a', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Athletes Section */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-cyan)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={16} /> 2 Atletas Masculinos (Obrigatórios)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Homem 1 (Nome):</label>
                    <input
                      type="text"
                      required
                      placeholder="Nome do Atleta 1"
                      value={m1Name}
                      onChange={(e) => setM1Name(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', fontSize: '0.85rem', background: '#0f172a', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Homem 2 (Nome):</label>
                    <input
                      type="text"
                      required
                      placeholder="Nome do Atleta 2"
                      value={m2Name}
                      onChange={(e) => setM2Name(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', fontSize: '0.85rem', background: '#0f172a', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-rose)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={16} /> 2 Atletas Femininas (Obrigatórias)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Mulher 1 (Nome):</label>
                    <input
                      type="text"
                      required
                      placeholder="Nome da Atleta 1"
                      value={w1Name}
                      onChange={(e) => setW1Name(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', fontSize: '0.85rem', background: '#0f172a', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Mulher 2 (Nome):</label>
                    <input
                      type="text"
                      required
                      placeholder="Nome da Atleta 2"
                      value={w2Name}
                      onChange={(e) => setW2Name(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', fontSize: '0.85rem', background: '#0f172a', color: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
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
                    padding: '10px 22px',
                    borderRadius: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, var(--primary), #059669)',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px var(--primary-glow)'
                  }}
                >
                  Salvar Equipe (4 Atletas)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
