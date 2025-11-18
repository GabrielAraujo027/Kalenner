/**
 * Serviço de API para comunicação com o backend
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

  // --- Domain specific helpers ---
  async getCompanyBySlug(slug: string): Promise<CompanyFullResponse> {
    return this.get<CompanyFullResponse>(`/Companies/${slug}`);
  }

  async login(data: AuthRequest): Promise<LoginResponse> {
    return this.post<LoginResponse>(`/Auth/login`, data);
  }

  async register(data: AuthRequest): Promise<RegisterResponse> {
    return this.post<RegisterResponse>(`/Auth/register`, data);
  }

  async getServices(companyId: number): Promise<ServiceResponse[]> {
    return this.get<ServiceResponse[]>(`/Services?companyId=${companyId}`);
  }

  async getProfessionals(companyId: number): Promise<ProfessionalResponse[]> {
    return this.get<ProfessionalResponse[]>(`/Professionals?companyId=${companyId}`);
  }

  async createAppointment(data: CreateAppointmentRequest): Promise<AppointmentResponse> {
    return this.post<AppointmentResponse>(`/Appointments`, data);
  }
}

export const api = new ApiService();

/**
 * Tipos de resposta da API
 */
// Request usado para login e cadastro
export interface AuthRequest {
  email: string;
  password: string;
  companyId: number; // conforme retorno de Companies/{slug}
}

export interface LoginResponse {
  token: string; // retorno simplificado informado pelo usuário
}

export interface RegisterResponse {
  message?: string;
}

export interface CreateAppointmentRequest {
  serviceId: number;
  professionalId: number;
  start: string; // ISO 8601 date-time string
  end: string; // ISO 8601 date-time string
  notes?: string;
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

export interface CompanyFullResponse {
  id: number;
  name: string;
  slug: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  timeZone: string;
  address: string;
  city: string;
  state: string;
  corporateName: string;
  cnpj: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
