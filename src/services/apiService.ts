import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';

import authService from './authService';
import {
  Article,
  CreateArticleRequest,
  UpdateArticleRequest,
  ApiResponse,
  ArticlesResponse,
  ArticleResponse
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_GATEWAY_URL;

if (!API_BASE_URL) {
  console.error('❌ REACT_APP_API_GATEWAY_URL n\'est pas définie');
  throw new Error('URL de l\'API manquante');
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token: string = await authService.getJwtToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class ApiService {
  async getAllArticles(): Promise<ApiResponse<Article[]>> {
    try {
      const response = await apiClient.get<ArticlesResponse>('/articles');
      return {
        success: true,
        data: response.data.data || []
      };
    } catch (error: any) {
      console.error('Erreur lors de la récupération des articles:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Erreur inconnue'
      };
    }
  }

  async getArticle(id: number): Promise<ApiResponse<Article>> {
    try {
      const response = await apiClient.get<ArticleResponse>(`/articles/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Erreur lors de la récupération de l\'article:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Erreur inconnue'
      };
    }
  }

  async createArticle(article: CreateArticleRequest): Promise<ApiResponse<Article>> {
    try {
      this.validateArticleData(article);
      const response = await apiClient.post<ArticleResponse>('/articles', article);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'article:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Erreur inconnue'
      };
    }
  }

  async updateArticle(id: number, article: UpdateArticleRequest): Promise<ApiResponse<Article>> {
    try {
      this.validateArticleData(article);
      const response = await apiClient.put<ArticleResponse>(`/articles/${id}`, article);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Erreur inconnue'
      };
    }
  }

  async deleteArticle(id: number): Promise<ApiResponse<Article>> {
    try {
      const response = await apiClient.delete<ArticleResponse>(`/articles/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Erreur inconnue'
      };
    }
  }

  async testConnection(): Promise<ApiResponse<string>> {
    try {
      await apiClient.get('/articles');
      return {
        success: true,
        data: 'Connexion API réussie'
      };
    } catch (error: any) {
      return {
        success: false,
        error: 'Erreur de connexion API'
      };
    }
  }

  private validateArticleData(article: CreateArticleRequest | UpdateArticleRequest): void {
    if (!article.title?.trim()) throw new Error('Le titre est requis');
    if (!article.content?.trim()) throw new Error('Le contenu est requis');
    if (!article.author?.trim()) throw new Error('L\'auteur est requis');
    if (article.title.length > 255) throw new Error('Le titre ne peut pas dépasser 255 caractères');
    if (article.author.length > 100) throw new Error('Le nom de l\'auteur ne peut pas dépasser 100 caractères');
  }
}

const apiService = new ApiService();
export default apiService;
