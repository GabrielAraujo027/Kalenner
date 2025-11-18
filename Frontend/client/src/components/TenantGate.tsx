import { ReactNode, useEffect } from "react";
import { useCompany } from "@/hooks/useCompany";
import { useCompanySlug } from "@/hooks/useCompanySlug";

interface TenantGateProps {
  children: ReactNode;
}

export function TenantGate({ children }: TenantGateProps) {
  const slug = useCompanySlug();
  const { company, loading, error, fetchCompany } = useCompany();

  useEffect(() => {
    if (slug) {
      fetchCompany(slug);
    }
  }, [slug, fetchCompany]);

  if (slug && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados da empresa...</p>
        </div>
      </div>
    );
  }

  if (slug && error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-destructive font-medium">{error}</p>
          <p className="text-sm text-muted-foreground">Ops... Verifique o link da empresa e tente novamente.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
