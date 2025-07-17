import { apiRequest } from "./queryClient";
import type { LoginRequest } from "@shared/schema";

export interface AuthUser {
  id: number;
  email: string;
}

class AuthManager {
  private user: AuthUser | null = null;
  private listeners: ((user: AuthUser | null) => void)[] = [];

  constructor() {
    // Check for stored user on initialization
    const storedUser = localStorage.getItem('auth-user');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch {
        localStorage.removeItem('auth-user');
      }
    }
  }

  getUser(): AuthUser | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }

  async login(credentials: LoginRequest): Promise<AuthUser> {
    const response = await apiRequest('POST', '/api/auth/login', credentials);
    const data = await response.json();
    
    this.user = data.user;
    localStorage.setItem('auth-user', JSON.stringify(this.user));
    this.notifyListeners();
    
    return this.user!;
  }

  logout(): void {
    this.user = null;
    localStorage.removeItem('auth-user');
    this.notifyListeners();
  }

  subscribe(listener: (user: AuthUser | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.user));
  }
}

export const auth = new AuthManager();
