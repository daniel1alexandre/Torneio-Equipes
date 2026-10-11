import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  Shield,
  Plus,
  Users,
  Phone,
  MapPin,
  Trash2,
  Award,
  Layers,
  UserPlus,
  X,
  CheckCircle,
  FolderPlus,
  Edit2
} from 'lucide-react';

export const TeamsView = () => {
  const {
    teams,
    athletes,
    categories,
    addTeam,
    updateTeam,
    deleteTeam,
    addAthlete,
    deleteAthlete,
    generalStandings
  } = useTournament();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [color, setColor] = useState('#06b6d4');
  const [captain, setCaptain] = useState('');
  const [contact, setContact] = useState('');
  const [city, setCity] = useState('');
  const [logoText, setLogoText] = useState('⚡');
  const [selectedInitialCatIds, setSelectedInitialCatIds] = useState([]);

  // Modal para gerenciar categorias e atletas de uma equipe específica
  const [managedTeam, setManagedTeam] = useState(null);
  const [selectedCatInModal, setSelectedCatInModal] = useState('');
  const [newAthName, setNewAthName] = useState('');
  const [newAthPhone, setNewAthPhone] = useState('');

  // Modal para editar dados cadastrais de uma equipe
  const [editingTeam, setEditingTeam] = useState(null);
  const [editName, setEditName] = useState('');
  const [editShortName, setEditShortName] = useState('');
  const [editColor, setEditColor] = useState('#06b6d4');
  const [editCaptain, setEditCaptain] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editLogoText, setEditLogoText] = useState('⚡');

  const handleOpenEditModal = (team) => {
    setEditingTeam(team);
    setEditName(team.name || '');
    setEditShortName(team.shortName || '');
    setEditColor(team.color || '#06b6d4');
    setEditCaptain(team.captain || '');
    setEditContact(team.contact || '');
    setEditCity(team.city || '');
    setEditLogoText(team.logoText || '🛡️');
  };

  const handleSaveEditedTeam = (e) => {
    e.preventDefault();
    if (!editingTeam || !editName.trim()) return;

    updateTeam(editingTeam.id, {
      name: editName.trim(),
      shortName: editShortName.trim().toUpperCase() || editName.substring(0, 3).toUpperCase(),
      color: editColor,
      captain: editCaptain.trim(),
      contact: editContact.trim(),
      city: editCity.trim(),
      logoText: editLogoText || '🛡️'
    });

    setEditingTeam(null);
  };

  const handleToggleInitialCategory = (catId) => {
    setSelectedInitialCatIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newTeam = addTeam({
      name: name.trim(),
      shortName: shortName.trim().toUpperCase() || name.substring(0, 3).toUpperCase(),
      color,
      captain: captain.trim(),
      contact: contact.trim(),
      city: city.trim(),
      logoText: logoText || '🛡️'
    });

    // Reset form
    setName('');
    setShortName('');
    setCaptain('');
    setContact('');
    setCity('');
    setSelectedInitialCatIds([]);
    setShowModal(false);

    // Open management modal for this newly created team immediately
    setManagedTeam(newTeam);
    if (categories.length > 0) {
      setSelectedCatInModal(categories[0].id);
    }
  };

  const handleAddAthleteToTeamCategory = (e) => {
    e.preventDefault();
    if (!newAthName.trim() || !managedTeam || !selectedCatInModal) return;

    addAthlete({
      name: newAthName.trim(),
      teamId: managedTeam.id,
      categoryId: selectedCatInModal,
      phone: newAthPhone.trim()
    });

    setNewAthName('');
    setNewAthPhone('');
  };

  return (
    <div className="view-container">
      <div className="page-header">
        <div className="page-header-info">
          <h2>
            <Shield size={28} color="#06b6d4" />
            <span>Gestão de Equipes & Categorias</span>
          </h2>
          <p>
            Cadastre as equipes, vincule as categorias em que vão disputar e inscreva os atletas diretamente dentro de cada categoria.
          </p>
        </div>

        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            <span>Nova Equipe</span>
          </button>
        </div>
      </div>

      {/* Grid de Equipes */}
      {teams.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Shield size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3>Nenhuma equipe cadastrada</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 1.5rem' }}>
            Clique no botão acima para adicionar a primeira equipe do torneio.
          </p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            Cadastrar Equipe
          </button>
        </div>
      ) : (
        <div className="teams-grid">
          {teams.map((team) => {
            const teamAthletes = athletes.filter((a) => a.teamId === team.id);
            // Unique categories this team has athletes in
            const teamCatIds = [...new Set(teamAthletes.map((a) => a.categoryId))];
            const teamCategories = categories.filter((c) => teamCatIds.includes(c.id));
            const standingsData = generalStandings.find((s) => s.team.id === team.id);

            return (
              <div key={team.id} className="team-card">
                <div
                  className="team-card-banner"
                  style={{ background: team.color || '#3b82f6' }}
                />

                <div className="team-card-header">
                  <div
                    className="team-avatar-lg"
                    style={{ background: team.color || '#3b82f6' }}
                  >
                    {team.logoText || '🛡️'}
                  </div>

                  <div className="team-details" style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h3 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {team.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 7px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '3px' }}
                          onClick={() => handleOpenEditModal(team)}
                          title="Editar dados cadastrais da equipe"
                        >
                          <Edit2 size={12} />
                          <span style={{ fontSize: '0.72rem' }}>Editar</span>
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 6px', color: '#f87171' }}
                          onClick={() => {
                            if (window.confirm(`Tem certeza que deseja excluir a equipe "${team.name}"?`)) {
                              deleteTeam(team.id);
                            }
                          }}
                          title="Excluir equipe"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="team-captain-badge">
                      Capitão: <strong>{team.captain || 'Não informado'}</strong>
                    </div>

                    {team.city && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <MapPin size={11} /> {team.city}
                      </div>
                    )}
                  </div>
                </div>

                {/* Categorias Inscritas desta Equipe */}
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    Categorias Disputadas ({teamCategories.length})
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {teamCategories.length === 0 ? (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        Nenhuma categoria associada
                      </span>
                    ) : (
                      teamCategories.map((c) => (
                        <span
                          key={c.id}
                          style={{
                            background: 'rgba(6, 182, 212, 0.15)',
                            color: '#22d3ee',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            border: '1px solid rgba(6, 182, 212, 0.3)'
                          }}
                        >
                          {c.name}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Botão de Destaque: Categorias & Atletas da Equipe */}
                <button
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', marginTop: '0.25rem', gap: '6px' }}
                  onClick={() => {
                    setManagedTeam(team);
                    setSelectedCatInModal(categories[0]?.id || '');
                  }}
                >
                  <Layers size={14} />
                  <span>Cadastrar Categorias & Atletas</span>
                </button>

                {/* Elenco Rápido de Atletas */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.4rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <span>ELENCO DE ATLETAS ({teamAthletes.length})</span>
                  </div>

                  <div className="team-athletes-list">
                    {teamAthletes.length === 0 ? (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.3rem 0' }}>
                        Nenhum atleta inscrito. Clique no botão acima para adicionar.
                      </p>
                    ) : (
                      teamAthletes.map((ath) => {
                        const cat = categories.find((c) => c.id === ath.categoryId);
                        return (
                          <div key={ath.id} className="athlete-pill">
                            <div>
                              <span>{ath.name}</span>
                            </div>
                            <span className="athlete-cat-tag">
                              {cat?.name || 'Geral'}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Nova Equipe */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <Shield size={20} color="#06b6d4" />
                <span>Cadastrar Nova Equipe</span>
              </h3>
            </div>
            <form onSubmit={handleCreateTeam}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nome Oficial da Equipe</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Ex: Titãs do Beach Tennis"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Sigla (3 letras)</label>
                    <input
                      type="text"
                      maxLength={4}
                      className="form-control"
                      placeholder="Ex: TBT"
                      value={shortName}
                      onChange={(e) => setShortName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Ícone / Emoji do Escudo</label>
                    <select
                      className="form-control"
                      value={logoText}
                      onChange={(e) => setLogoText(e.target.value)}
                    >
                      <option value="⚡">⚡ Raio</option>
                      <option value="🦈">🦈 Tubarão</option>
                      <option value="🦁">🦁 Leão</option>
                      <option value="🔥">🔥 Fogo</option>
                      <option value="🦅">🦅 Águia</option>
                      <option value="🛡️">🛡️ Escudo</option>
                      <option value="👑">👑 Coroa</option>
                      <option value="⭐">⭐ Estrela</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Cor Oficial da Equipe</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        style={{
                          width: '44px',
                          height: '38px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          background: 'transparent'
                        }}
                      />
                      <span style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>{color}</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Cidade / Localidade</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ex: Santos - SP"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Capitão / Responsável</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ex: Carlos Silva"
                      value={captain}
                      onChange={(e) => setCaptain(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Telefone / WhatsApp</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ex: (11) 98888-7777"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar e Cadastrar Categorias/Atletas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Específico: Categorias & Atletas da Equipe */}
      {managedTeam && (
        <div className="modal-overlay" onClick={() => setManagedTeam(null)}>
          <div className="modal-content" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '8px',
                    background: managedTeam.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    color: '#fff'
                  }}
                >
                  {managedTeam.logoText || '🛡️'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>
                    Categorias & Atletas: {managedTeam.name}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Inscreva atletas e duplas desta equipe nas categorias do torneio
                  </span>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setManagedTeam(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Selecionar Categoria para Cadastrar Atleta */}
              <div className="form-group">
                <label>1. Selecione a Categoria do Torneio</label>
                <select
                  className="form-control"
                  value={selectedCatInModal}
                  onChange={(e) => setSelectedCatInModal(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.level} • {c.matchFormat})
                    </option>
                  ))}
                </select>
              </div>

              {/* Form de Cadastro do Atleta/Dupla */}
              <form onSubmit={handleAddAthleteToTeamCategory} style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                  2. Cadastrar Atleta em {categories.find((c) => c.id === selectedCatInModal)?.name}
                </div>

                <div className="form-grid-2" style={{ marginBottom: '0.75rem' }}>
                  <div className="form-group">
                    <label>Nome do Atleta</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="Ex: Lucas Mendes"
                      value={newAthName}
                      onChange={(e) => setNewAthName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Telefone / WhatsApp</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ex: (11) 99999-8888"
                      value={newAthPhone}
                      onChange={(e) => setNewAthPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" style={{ height: '38px' }}>
                    <UserPlus size={15} />
                    <span>Adicionar Atleta</span>
                  </button>
                </div>
              </form>

              {/* Atletas Já Inscritos nesta Equipe na Categoria Selecionada */}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  Atletas desta equipe inscritos em {categories.find((c) => c.id === selectedCatInModal)?.name}:
                </div>

                {athletes.filter((a) => a.teamId === managedTeam.id && a.categoryId === selectedCatInModal).length === 0 ? (
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Nenhum atleta inscrito nesta categoria ainda. Preencha os dados acima para cadastrar.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto' }}>
                    {athletes
                      .filter((a) => a.teamId === managedTeam.id && a.categoryId === selectedCatInModal)
                      .map((ath) => (
                        <div
                          key={ath.id}
                          style={{
                            background: 'rgba(0,0,0,0.3)',
                            padding: '0.5rem 0.75rem',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.85rem'
                          }}
                        >
                          <div>
                            <strong style={{ color: '#fff' }}>{ath.name}</strong>
                          </div>
                          <button
                            type="button"
                            style={{ background: 'transparent', color: '#f87171', padding: '2px' }}
                            onClick={() => deleteAthlete(ath.id)}
                            title="Remover atleta"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setManagedTeam(null)}>
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Equipe */}
      {editingTeam && (
        <div className="modal-overlay" onClick={() => setEditingTeam(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '4px',
                    background: editColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    color: '#fff'
                  }}
                >
                  {editLogoText || '🛡️'}
                </div>
                <h3>Editar Equipe: {editingTeam.name}</h3>
              </div>
              <button
                className="btn-icon"
                onClick={() => setEditingTeam(null)}
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditedTeam}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label>Nome Oficial da Equipe *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Sigla (ex: SPT)</label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength={4}
                      value={editShortName}
                      onChange={(e) => setEditShortName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Ícone / Escudo Emoji</label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength={2}
                      value={editLogoText}
                      onChange={(e) => setEditLogoText(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Cor de Destaque do Time</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="color"
                      style={{ width: '45px', height: '38px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: 'transparent' }}
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map((c) => (
                        <div
                          key={c}
                          onClick={() => setEditColor(c)}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: c,
                            cursor: 'pointer',
                            border: editColor === c ? '2px solid #fff' : '2px solid transparent',
                            transform: editColor === c ? 'scale(1.15)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Nome do Capitão</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editCaptain}
                      onChange={(e) => setEditCaptain(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Telefone / WhatsApp</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editContact}
                      onChange={(e) => setEditContact(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Cidade / Clube Sede</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingTeam(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
