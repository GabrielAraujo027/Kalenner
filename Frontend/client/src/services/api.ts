/**
 * Serviço de API base para comunicação com o backend
 * Configurar a URL base do backend nas variáveis de ambiente
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5111/api";

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Obter o token JWT do localStorage
   */
  private getToken(): string | null {
    // Unificar armazenamento (kalenner_token é usado em AuthContext)
    return localStorage.getItem("kalenner_token") || localStorage.getItem("authToken");
  }

  /**
   * Fazer uma requisição HTTP
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Adicionar token JWT se disponível
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    console.log('PATCH data:', data, 'stringified:', JSON.stringify(data));
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  /**
   * Salvar token no localStorage
   */
  setToken(token: string): void {
    localStorage.setItem("kalenner_token", token);
  }

  /**
   * Remover token do localStorage
   */
  clearToken(): void {
    localStorage.removeItem("kalenner_token");
    localStorage.removeItem("authToken");
  }
}

export const api = new ApiService();
