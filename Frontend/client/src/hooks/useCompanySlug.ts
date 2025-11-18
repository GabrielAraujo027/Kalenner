import { useMemo } from "react";
import { useLocation } from "wouter";

// Slug = primeiro segmento do path, atualiza conforme a navegação do wouter
export function useCompanySlug() {
  const [location] = useLocation();
  return useMemo(() => {
    const segments = location.split("/").filter(Boolean);
    return segments.length > 0 ? segments[0] : "";
  }, [location]);
}
