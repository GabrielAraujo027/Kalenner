import { api } from "./api";
import type { ProfessionalResponse } from "./models/professionals";

export const professionalsApi = {
  /**
   * Recupera a lista de profissionais
   */
  getProfessionals: (): Promise<ProfessionalResponse[]> => {
    return api.get<ProfessionalResponse[]>("/Professionals");
  },
};
