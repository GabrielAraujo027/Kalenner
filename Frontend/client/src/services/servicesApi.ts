import { api } from "./api";
import type { ServiceResponse } from "./models/services";

export const servicesApi = {
  /**
   * Recupera a lista de serviços
   */
  getServices: (): Promise<ServiceResponse[]> => {
    return api.get<ServiceResponse[]>("/Services");
  },
};
