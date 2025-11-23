// API Services
export { api } from "./api";
export { appointmentsApi } from "./appointmentsApi";
export { servicesApi } from "./servicesApi";
export { professionalsApi } from "./professionalsApi";
export { authApi } from "./authApi";
export { companiesApi } from "./companiesApi";

// Types - Appointments
export type {
  AppointmentResponse,
  CreateAppointmentRequest,
  AppointmentStatus,
} from "./models/appointments";

// Types - Services
export type { ServiceResponse } from "./models/services";

// Types - Professionals
export type { ProfessionalResponse } from "./models/professionals";

// Types - Auth
export type { AuthRequest, LoginResponse, RegisterResponse } from "./models/auth";

// Types - Companies
export type { CompanyFullResponse } from "./models/companies";
