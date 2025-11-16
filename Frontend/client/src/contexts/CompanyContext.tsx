import { createContext, ReactNode, useState } from "react";

export interface CompanyData {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  email: string;
  phone: string;
  address: string;
}

interface CompanyContextType {
  company: CompanyData | null;
  setCompany: (company: CompanyData) => void;
  loading: boolean;
  fetchCompany: (companySlug: string) => Promise<void>;
}

export const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

interface CompanyProviderProps {
  children: ReactNode;
}

export function CompanyProvider({ children }: CompanyProviderProps) {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCompany = async (companySlug: string) => {
    setLoading(true);
    try {
      // Simulação de chamada à API
      // Em produção: const response = await fetch(`/api/companies/${companySlug}`);
      // const data = await response.json();
      
      const mockCompanyData: CompanyData = {
        id: companySlug,
        name: companySlug.charAt(0).toUpperCase() + companySlug.slice(1),
        logo: "/kalenner-logo.png",
        primaryColor: "oklch(0.45 0.15 250)",
        secondaryColor: "oklch(0.98 0.001 286.375)",
        accentColor: "oklch(0.55 0.18 250)",
        email: `contact@${companySlug}.com`,
        phone: "(11) 98765-4321",
        address: "123 Business Street, City, State"
      };

      setCompany(mockCompanyData);
    } catch (error) {
      console.error("Error fetching company:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CompanyContext.Provider
      value={{
        company,
        setCompany,
        loading,
        fetchCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}
