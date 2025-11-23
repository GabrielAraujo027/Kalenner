import { api } from "./api";
import type {
  AppointmentResponse,
  CreateAppointmentRequest,
  AppointmentStatus,
} from "./models/appointments";

export const appointmentsApi = {
  /**
   * Recupera a lista de agendamentos
   */
  getAppointments: (): Promise<AppointmentResponse[]> => {
    return api.get<AppointmentResponse[]>("/Appointments");
  },

  /**
   * Cria um novo agendamento
   */
  createAppointment: (data: CreateAppointmentRequest): Promise<AppointmentResponse> => {
    return api.post<AppointmentResponse>("/Appointments", data);
  },

  /**
   * Atualiza o status de um agendamento
   */
  updateAppointmentStatus: (id: number, status: AppointmentStatus): Promise<AppointmentResponse> => {
    return api.patch<AppointmentResponse>(`/Appointments/${id}/status`, { status });
  },
};
