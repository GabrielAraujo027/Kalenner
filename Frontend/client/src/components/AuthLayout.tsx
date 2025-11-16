import { APP_LOGO, APP_TITLE } from "@/const";
import { ReactNode } from "react";
import { CompanyData } from "@/contexts/CompanyContext";

interface AuthLayoutProps {
  children: ReactNode;
  company?: CompanyData | null;
}

export default function AuthLayout({ children, company }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex-col justify-center items-center p-12" style={company ? { backgroundImage: `linear-gradient(135deg, ${company.primaryColor}, ${company.accentColor})` } : {}}>
        <div className="max-w-md text-center space-y-6">
          <img src={company?.logo || APP_LOGO} alt={company?.name || APP_TITLE} className="h-32 w-32 mx-auto object-contain" />
          <h1 className="text-5xl font-bold">{company?.name || APP_TITLE}</h1>
          <p className="text-xl text-primary-foreground/90">
            Complete scheduling system for your business
          </p>
          <div className="space-y-4 text-left mt-8">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-foreground rounded-full mt-2"></div>
              <p className="text-primary-foreground/90">Manage appointments efficiently</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-foreground rounded-full mt-2"></div>
              <p className="text-primary-foreground/90">Full control over staff and services</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary-foreground rounded-full mt-2"></div>
              <p className="text-primary-foreground/90">Intuitive and modern interface</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Logo Mobile */}
          <div className="lg:hidden text-center mb-8">
            <img src={company?.logo || APP_LOGO} alt={company?.name || APP_TITLE} className="h-20 w-20 mx-auto object-contain mb-4" />
            <h2 className="text-2xl font-bold text-foreground">{company?.name || APP_TITLE}</h2>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
