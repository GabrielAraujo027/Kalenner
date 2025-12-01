export type AppointmentStatus = 1 | 2 | 3 | 4;

export interface AppointmentResponse {
  id: number;
  serviceId: number;
  serviceName: string;
  professionalId: number;
  professionalName: string;
  clientId: string;
  start: string;
  end: string;
  status: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  serviceId: number;
  professionalId?: number;
  start: string;
  notes?: string;
}

export interface UpdateAppointmentStatusRequest {
  status: AppointmentStatus;
}
