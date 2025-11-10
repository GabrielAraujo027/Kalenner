/**
 * Serviço de API para comunicação com o backend
 * Configurar a URL base do backend nas variáveis de ambiente
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
    return localStorage.getItem("authToken");
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
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  /**
   * Salvar token no localStorage
   */
  setToken(token: string): void {
    localStorage.setItem("authToken", token);
  }

  /**
   * Remover token do localStorage
   */
  clearToken(): void {
    localStorage.removeItem("authToken");
  }
}

export const api = new ApiService();

/**
 * Tipos de resposta da API
 */
export interface LoginResponse {
  token: string;
  expiresAt: string;
  email: string;
  roles: string[];
  companyId: string;
}

export interface RegisterResponse {
  message: string;
}

export interface AppointmentResponse {
  id: number;
  serviceId: number;
  serviceName: string;
  professionalId: number;
  professionalName: string;
  clientId: string;
  start: string;
  end: string;
  status: "scheduled" | "completed" | "cancelled";
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceResponse {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export interface ProfessionalResponse {
  id: number;
  name: string;
  description: string;
  companyId: string;
}

export interface CompanyResponse {
  id: string;
  name: string;
  description: string;
  email: string;
}
