// src/components/Dashboard.tsx
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import { Article, ArticleFormData } from '../types';

const Dashboard: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    content: '',
    author: ''
  });
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const { user, signOut } = useAuth();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const result = await apiService.getAllArticles();
      if (result.success && result.data) {
        setArticles(result.data);
      } else {
        setError(result.error || 'Erreur lors du chargement des articles');
      }
    } catch (error: any) {
      setError('Erreur de connexion à l\'API');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    setActionLoading(true);
    try {
      const result = await signOut();
      if (!result.success) {
        setError(result.error || 'Erreur lors de la déconnexion');
      }
    } catch {
      setError('Erreur lors de la déconnexion');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getUserDisplayName = (): string => {
    return user?.attributes?.email || user?.username || 'Utilisateur';
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div>
            <h1 className="dashboard-title">Panneau d'Administration</h1>
            <p className="dashboard-subtitle">Bienvenue, {getUserDisplayName()}</p>
          </div>
          <button
            className="btn btn-danger"
            onClick={handleLogout}
            disabled={actionLoading}
          >
            {actionLoading ? 'Déconnexion...' : 'Déconnexion'}
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {error && (
          <div className="alert alert-error">
            <div className="alert-icon">⚠️</div>
            <div>{error}</div>
            <button onClick={() => setError('')} className="alert-close">✖</button>
          </div>
        )}

        <div className="mb-6">
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
            disabled={actionLoading}
          >
            + Nouvel Article
          </button>
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Chargement des articles...</div>
          </div>
        ) : articles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📄</div>
            <h3 className="empty-state-title">Aucun article</h3>
            <p className="empty-state-description">Commencez par créer un nouvel article.</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>Créer un article</button>
          </div>
        ) : (
          <ul className="articles-list">
            {articles.map(article => (
              <li key={article.id} className="article-item">
                <div className="article-header">
                  <div className="article-content">
                    <h4 className="article-title">{article.title}</h4>
                    <div className="article-meta">
                      <span>{article.author}</span>
                      <span className="article-meta-separator"></span>
                      <span>{formatDate(article.created_at)}</span>
                      {article.updated_at !== article.created_at && (
                        <>
                          <span className="article-meta-separator"></span>
                          <span>Modifié le {formatDate(article.updated_at)}</span>
                        </>
                      )}
                    </div>
                    <p className="article-excerpt">
                      {article.content.length > 200
                        ? `${article.content.slice(0, 200)}...`
                        : article.content}
                    </p>
                  </div>
                  <div className="article-actions">
                    <button
                      className="action-btn action-btn-edit"
                      onClick={() => {
                        setEditingArticle(article);
                        setFormData({
                          title: article.title,
                          content: article.content,
                          author: article.author,
                        });
                        setShowForm(true);
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn action-btn-delete"
                      onClick={async () => {
                        if (window.confirm('Supprimer cet article ?')) {
                          setActionLoading(true);
                          const result = await apiService.deleteArticle(article.id);
                          if (result.success) await loadArticles();
                          else setError(result.error || 'Erreur de suppression');
                          setActionLoading(false);
                        }
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Modal (simplified, to connect to your CSS `.modal` and `.modal-overlay`) */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingArticle ? 'Modifier l\'article' : 'Nouvel Article'}
              </h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>✖</button>
            </div>
            <form
              className="modal-body"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!formData.title || !formData.content || !formData.author) {
                  setError('Tous les champs sont obligatoires');
                  return;
                }
                setActionLoading(true);
                const result = editingArticle
                  ? await apiService.updateArticle(editingArticle.id, formData)
                  : await apiService.createArticle(formData);

                if (result.success) {
                  setShowForm(false);
                  setEditingArticle(null);
                  setFormData({ title: '', content: '', author: '' });
                  await loadArticles();
                } else {
                  setError(result.error || 'Erreur lors de la sauvegarde');
                }
                setActionLoading(false);
              }}
            >
              <div className="form-group">
                <label className="form-label">Titre</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                  required
                  maxLength={255}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Auteur</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  className="form-input"
                  required
                  maxLength={100}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contenu</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  className="form-textarea"
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                  {actionLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
