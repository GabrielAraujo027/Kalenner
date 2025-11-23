import { api } from "./api";
import type { CompanyFullResponse } from "./models/companies";

export const companiesApi = {
  /**
   * Recupera os dados de uma empresa pelo slug
   */
  getCompanyBySlug: (slug: string): Promise<CompanyFullResponse> => {
    return api.get<CompanyFullResponse>(`/Companies/${slug}`);
  },
};
