import { createContext, ReactNode, useState, useCallback, useRef } from "react";
import { companiesApi, type CompanyFullResponse } from "@/services";

export interface CompanyData {
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

interface CompanyContextType {
  company: CompanyData | null;
  setCompany: (company: CompanyData) => void;
  loading: boolean;
  error: string | null;
  fetchCompany: (companySlug: string) => Promise<void>;
}

export const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

interface CompanyProviderProps {
  children: ReactNode;
}

export function CompanyProvider({ children }: CompanyProviderProps) {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Mantém registro de slugs já tentados (sucesso ou erro) para evitar loops
  const attemptedSlugsRef = useRef<Set<string>>(new Set());

  const fetchCompany = useCallback(async (companySlug: string) => {
    if (!companySlug) return;
    // Se já tentamos esse slug, não refaz
    if (attemptedSlugsRef.current.has(companySlug)) return;
    // Evita refetch se mesma empresa carregada
    if (company && company.slug === companySlug) return;
    setLoading(true);
    setError(null);
    try {
      const data = await companiesApi.getCompanyBySlug(companySlug);
      setCompany(data);
      attemptedSlugsRef.current.add(companySlug);
      if (data.primaryColor) {
        const root = document.documentElement;
        root.style.setProperty("--primary-color", data.primaryColor);
        root.style.setProperty("--secondary-color", data.secondaryColor || "#ffffff");
      }
    } catch (e: any) {
      setError(e.message || "Falha ao carregar empresa");
      setCompany(null);
      attemptedSlugsRef.current.add(companySlug); // marca como tentado mesmo com erro
    } finally {
      setLoading(false);
    }
  }, [company]);

  return (
    <CompanyContext.Provider value={{ company, setCompany, loading, error, fetchCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}
