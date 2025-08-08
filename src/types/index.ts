// src/types/index.ts

// Types pour l'authentification
export interface User {
  username: string;
  attributes?: {
    email: string;
    email_verified: boolean;
    sub: string;
  };
  signInUserSession?: {
    idToken: {
      jwtToken: string;
    };
  };
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface SignInCredentials {
  username: string;
  password: string;
}

export interface SignUpCredentials {
  username: string;
  password: string;
  email: string;
}

// Types pour les articles
export interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
}

export interface CreateArticleRequest {
  title: string;
  content: string;
  author: string;
}

export interface UpdateArticleRequest extends CreateArticleRequest {}

export interface ArticleFormData {
  title: string;
  content: string;
  author: string;
}

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ArticlesResponse {
  success: boolean;
  data: Article[];
  count: number;
}

export interface ArticleResponse {
  success: boolean;
  data: Article;
  message?: string;
}

// Types pour le contexte d'authentification
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  checkAuthState: () => Promise<void>;
}

// Types pour les erreurs
export interface ApiError {
  message: string;
  code?: string;
  details?: string;
}

// Types pour les événements de formulaire
export interface FormEvent<T = Element> extends React.FormEvent<T> {}
export interface ChangeEvent<T = Element> extends React.ChangeEvent<T> {}

// Types pour AWS Amplify
export interface AwsConfig {
  Auth: {
    region: string;
    userPoolId: string;
    userPoolWebClientId: string;
    mandatorySignIn: boolean;
    authenticationFlowType: string;
  };
  API: {
    endpoints: Array<{
      name: string;
      endpoint: string;
      region: string;
    }>;
  };
}

// Types pour les variables d'environnement
export interface EnvironmentVariables {
  REACT_APP_AWS_REGION: string;
  REACT_APP_USER_POOL_ID: string;
  REACT_APP_USER_POOL_CLIENT_ID: string;
  REACT_APP_API_GATEWAY_URL: string;
  REACT_APP_NODE_ENV?: string;
}