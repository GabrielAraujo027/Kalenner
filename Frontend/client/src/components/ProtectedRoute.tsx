import { ReactNode } from "react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
}: ProtectedRouteProps) => {
  const [, navigate] = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("authUser");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    if (requiredRole) {
      try {
        const userData = JSON.parse(user);
        if (!userData.roles || !userData.roles.includes(requiredRole)) {
          navigate("/");
          return;
        }
      } catch {
        navigate("/login");
        return;
      }
    }

    setIsAuthorized(true);
  }, [navigate, requiredRole]);

  if (isAuthorized === null) {
    return <div>Carregando...</div>;
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};
