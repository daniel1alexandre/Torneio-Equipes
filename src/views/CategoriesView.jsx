import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import {
  Users,
  Plus,
  Trash2,
  UserPlus,
  Shield,
  Layers,
  Search,
  Check,
  ArrowRight
} from 'lucide-react';

export const CategoriesView = () => {
  const {
    categories,
    teams,
    athletes,
    addCategory,
    deleteCategory,
    addAthlete,
    deleteAthlete
  } = useTournament();

  const [activeCatId, setActiveCatId] = useState(categories[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  // Modais
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [showAddAthModal, setShowAddAthModal] = useState(false);

  // Form Categoria
  const [catName, setCatName] = useState('');
  const [catGender, setCatGender] = useState('M');
  const [catLevel, setCatLevel] = useState('Intermediário');
  const [catFormat, setCatFormat] = useState('1 Set até 6 games (5x5 vai a 7, 6x6 tiebreak de 7)');
  const [catDesc, setCatDesc] = useState('');

  // Form Atleta Guiado (1º Equipe -> 2º Atleta da Equipe)
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || '');
  const [customAthleteName, setCustomAthleteName] = useState('');
  const [athPhone, setAthPhone] = useState('');

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const newCat = addCategory({
      name: catName.trim(),
      gender: catGender,
      level: catLevel,
      matchFormat: catFormat,
      description: catDesc.trim()
    });

    setActiveCatId(newCat.id);
    setCatName('');
    setCatDesc('');
    setShowAddCatModal(false);
  };

  const handleCreateAthleteGuided = (e) => {
    e.preventDefault();
    if (!selectedTeamId || !activeCatId) {
      alert('Selecione uma equipe e uma categoria.');
      return;
    }

    const finalAthName = customAthleteName.trim();

    if (!finalAthName) {
      alert('Informe o nome do atleta.');
      return;
    }

    addAthlete({
      name: finalAthName,
      teamId: selectedTeamId,
      categoryId: activeCatId,
      phone: athPhone.trim()
    });

    // Reset
    setCustomAthleteName('');
    setAthPhone('');
    setShowAddAthModal(false);
  };

  const selectedCategory = categories.find((c) => c.id === activeCatId) || categories[0];

  const filteredAthletes = athletes.filter((a) => {
    const matchesCat = activeCatId ? a.categoryId === activeCatId : true;
    const matchesSearch = searchTerm
      ? a.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCat && matchesSearch;
  });


  return (
    <div className="view-container">
      <div className="page-header">
        <div className="page-header-info">
          <h2>
            <Users size={28} color="#8b5cf6" />
            <span>Categorias & Atletas (Inscrição por Equipe)</span>
          </h2>
          <p>
            Defina as categorias do torneio e inscreva os atletas selecionando primeiro a equipe correspondente.
          </p>
        </div>

        <div className="page-header-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setShowAddCatModal(true)}
          >
            <Plus size={16} />
            <span>Nova Categoria</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={() => {
              setSelectedTeamId(teams[0]?.id || '');
              setShowAddAthModal(true);
            }}
            disabled={teams.length === 0 || categories.length === 0}
          >
            <UserPlus size={16} />
            <span>Inscrever Atleta</span>
          </button>
        </div>
      </div>

      {/* Grid de Categorias */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {categories.map((cat) => {
          const isSelected = cat.id === activeCatId;
          const count = athletes.filter((a) => a.categoryId === cat.id).length;
          return (
            <div
              key={cat.id}
              onClick={() => setActiveCatId(cat.id)}
              style={{
                background: isSelected ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-card)',
                border: isSelected ? '1px solid #8b5cf6' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <div>
                <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '0.25rem' }}>{cat.name}</h4>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {cat.level} • {cat.matchFormat}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 700, marginTop: '0.5rem' }}>
                  {count} {count === 1 ? 'atleta inscrito' : 'atletas inscritos'}
                </div>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px', color: '#f87171' }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Excluir a categoria "${cat.name}"? As partidas e inscrições associadas serão removidas.`)) {
                    deleteCategory(cat.id);
                  }
                }}
                title="Excluir Categoria"
              >
                <Trash2 size={13} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Lista de Atletas da Categoria Selecionada */}
      {selectedCategory && (
        <div className="glass-card">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={20} color="#a78bfa" />
                <span>Atletas em {selectedCategory.name}</span>
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {selectedCategory.description || 'Lista de atletas vinculados por equipe nesta categoria'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Buscar atleta ou parceiro..."
                  className="form-control"
                  style={{ paddingLeft: '32px', fontSize: '0.85rem', width: '220px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {filteredAthletes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-secondary)' }}>
              <p>Nenhum atleta encontrado nesta categoria com os filtros atuais.</p>
              <button
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '0.75rem' }}
                onClick={() => {
                  setSelectedTeamId(teams[0]?.id || '');
                  setShowAddAthModal(true);
                }}
              >
                <UserPlus size={14} />
                Inscrever Atleta Agora
              </button>
            </div>
          ) : (
            <div className="standings-table-wrap">
              <table className="standings-table">
                <thead>
                  <tr>
                    <th>Atleta</th>
                    <th>Equipe Vinculada</th>
                    <th>Contato</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAthletes.map((ath) => {
                    const team = teams.find((t) => t.id === ath.teamId);
                    return (
                      <tr key={ath.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: '#fff' }}>{ath.name}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: team?.color || '#3b82f6'
                              }}
                            />
                            <span>{team?.name || 'Sem Equipe'}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                          {ath.phone || '-'}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', color: '#f87171' }}
                            onClick={() => {
                              if (window.confirm(`Remover o atleta "${ath.name}"?`)) {
                                deleteAthlete(ath.id);
                              }
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Nova Categoria */}
      {showAddCatModal && (
        <div className="modal-overlay" onClick={() => setShowAddCatModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <Plus size={20} color="#8b5cf6" />
                <span>Nova Categoria</span>
              </h3>
            </div>
            <form onSubmit={handleCreateCategory}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Nome da Categoria</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Ex: Masculino Open, Feminino B, Mista A"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Gênero</label>
                    <select
                      className="form-control"
                      value={catGender}
                      onChange={(e) => setCatGender(e.target.value)}
                    >
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                      <option value="X">Mista</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Nível</label>
                    <select
                      className="form-control"
                      value={catLevel}
                      onChange={(e) => setCatLevel(e.target.value)}
                    >
                      <option value="Iniciante">Iniciante</option>
                      <option value="Intermediário">Intermediário</option>
                      <option value="Avançado / Open">Avançado / Open</option>
                      <option value="Master (+40)">Master (+40)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Formato dos Jogos (Regulamentar)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={catFormat}
                    onChange={(e) => setCatFormat(e.target.value)}
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '2px' }}>
                    Padrão: 1 Set até 6 games (5x5 vai a 7, 6x6 tiebreak de 7)
                  </small>
                </div>

                <div className="form-group">
                  <label>Descrição Opcional</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: Fase de grupos com 2 classificados por grupo"
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddCatModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Criar Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Guiado: 1º Selecionar Equipe -> 2º Selecionar/Cadastrar Atleta */}
      {showAddAthModal && (
        <div className="modal-overlay" onClick={() => setShowAddAthModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <UserPlus size={20} color="#8b5cf6" />
                <span>Inscrever Atleta (Fluxo Guiado por Equipe)</span>
              </h3>
            </div>
            <form onSubmit={handleCreateAthleteGuided}>
              <div className="modal-body">
                {/* PASSO 1: Selecionar a Equipe */}
                <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22d3ee', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#06b6d4', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>1</span>
                    <span>Selecione Primeiro a Equipe</span>
                  </div>
                  <select
                    className="form-control"
                    style={{ fontWeight: 700 }}
                    value={selectedTeamId}
                    onChange={(e) => {
                      setSelectedTeamId(e.target.value);
                      setSelectedExistingAthleteId('');
                    }}
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.city || 'Arena'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* PASSO 2: Dados do Atleta */}
                <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a78bfa', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#8b5cf6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>2</span>
                    <span>Dados do Atleta</span>
                  </div>

                  <div className="form-group">
                    <label>Nome do Atleta</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="Ex: Rafael Fontes"
                      value={customAthleteName}
                      onChange={(e) => setCustomAthleteName(e.target.value)}
                    />
                  </div>


                  <div className="form-group">
                    <label>Categoria de Inscrição</label>
                    <select
                      className="form-control"
                      value={activeCatId}
                      onChange={(e) => setActiveCatId(e.target.value)}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Telefone / WhatsApp</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ex: (11) 98888-0000"
                      value={athPhone}
                      onChange={(e) => setAthPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddAthModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Concluir Inscrição
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
