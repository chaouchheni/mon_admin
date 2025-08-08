// src/services/authService.ts
import { Auth } from 'aws-amplify';
import { User, AuthResult, SignInCredentials, SignUpCredentials } from '../types';

class AuthService {
  // Connexion de l'utilisateur
  async signIn(username: string, password: string): Promise<AuthResult> {
    try {
      const cognitoUser = await Auth.signIn(username, password);
      const user: User = {
        username: cognitoUser.getUsername(),
        attributes: cognitoUser.attributes
      };
      return { success: true, user };
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // Déconnexion
  async signOut(): Promise<AuthResult> {
    try {
      await Auth.signOut();
      return { success: true };
    } catch (error: any) {
      console.error('Erreur de déconnexion:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // Obtenir l'utilisateur actuel
  async getCurrentUser(): Promise<AuthResult> {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const user: User = {
        username: cognitoUser.getUsername(),
        attributes: cognitoUser.attributes
      };
      return { success: true, user };
    } catch (error: any) {
      console.warn('Utilisateur non authentifié');
      return { success: false, error: 'Utilisateur non authentifié' };
    }
  }

  // Obtenir le token JWT
  async getJwtToken(): Promise<string> {
    try {
      const session = await Auth.currentSession();
      return session.getIdToken().getJwtToken();
    } catch (error: any) {
      console.error('Erreur lors de la récupération du token:', error);
      throw new Error('Impossible de récupérer le token JWT');
    }
  }

  // Vérifier si l'utilisateur est connecté
  async isAuthenticated(): Promise<boolean> {
    try {
      await Auth.currentAuthenticatedUser();
      return true;
    } catch {
      return false;
    }
  }

  // Inscription d'un nouvel utilisateur
  async signUp(credentials: SignUpCredentials): Promise<AuthResult> {
    try {
      const { username, password, email } = credentials;
      const result = await Auth.signUp({
        username,
        password,
        attributes: { email }
      });

      const user: User = {
        username: result.user.getUsername()
      };

      return { success: true, user };
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // Confirmer l'inscription
  async confirmSignUp(username: string, code: string): Promise<AuthResult> {
    try {
      await Auth.confirmSignUp(username, code);
      return { success: true };
    } catch (error: any) {
      console.error('Erreur de confirmation:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // Réinitialisation du mot de passe (envoi du code)
  async forgotPassword(username: string): Promise<AuthResult> {
    try {
      await Auth.forgotPassword(username);
      return { success: true };
    } catch (error: any) {
      console.error('Erreur de réinitialisation:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // Confirmation du nouveau mot de passe avec code
  async forgotPasswordSubmit(username: string, code: string, newPassword: string): Promise<AuthResult> {
    try {
      await Auth.forgotPasswordSubmit(username, code, newPassword);
      return { success: true };
    } catch (error: any) {
      console.error('Erreur de confirmation du nouveau mot de passe:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // Méthode utilitaire pour extraire les messages d'erreur
  private getErrorMessage(error: any): string {
    if (error?.message) return error.message;
    if (typeof error === 'string') return error;
    return 'Une erreur inconnue est survenue';
  }
}

export default new AuthService();
