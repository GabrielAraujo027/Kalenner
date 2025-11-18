import { useMemo } from "react";

// Simple slug detector from URL first segment
export function useCompanySlug() {
  return useMemo(() => {
    const segments = window.location.pathname.split("/").filter(Boolean);
    return segments.length > 0 ? segments[0] : "";
  }, [window.location.pathname]);
}
