export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export interface AppointmentResponse {
  id: number;
  serviceId: number;
  serviceName: string;
  professionalId: number;
  professionalName: string;
  clientId: string;
  start: string;
  end: string;
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  serviceId: number;
  professionalId: number;
  clientId: string;
  start: string;
  end: string;
  notes?: string;
}

export interface UpdateAppointmentStatusRequest {
  status: AppointmentStatus;
}
