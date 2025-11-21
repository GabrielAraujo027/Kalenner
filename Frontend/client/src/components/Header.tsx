import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Menu, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { useCompany } from "@/hooks/useCompany";
import { useCompanySlug } from "@/hooks/useCompanySlug";

interface HeaderProps {
  onLogout?: () => void;
  showMenu?: boolean;
  onMenuToggle?: () => void;
}

export default function Header({ onLogout, showMenu = false, onMenuToggle }: HeaderProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { company } = useCompany();
  const slug = useCompanySlug();

  const logoSrc = useMemo(() => {
    if (company?.logoUrl) {
      const requested = company.logoUrl.includes("github.com/")
        ? company.logoUrl.replace("github.com/", "raw.githubusercontent.com/").replace("/blob/", "/")
        : company.logoUrl;
      return requested;
    }
    return APP_LOGO;
  }, [company]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    onMenuToggle?.();
  };

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Título */}
          <Link href={slug ? `/${slug}/dashboard` : "/"}>
            <div className="flex items-center gap-3 cursor-pointer">
              <img src={logoSrc} alt={company?.name || APP_TITLE} className="h-10 w-10 object-contain" />
              <h1 className="text-xl font-bold hidden sm:block">{company?.name || APP_TITLE}</h1>
            </div>
          </Link>



          {/* Botões de Ação */}
          <div className="flex items-center gap-3">
            {onLogout ? (
              <Button
                onClick={onLogout}
                variant="outline"
                className="hidden md:flex border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Sair
              </Button>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link href={slug ? `/${slug}/login` : "/login"}>
                  <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                    Entrar
                  </Button>
                </Link>

              </div>
            )}

            {/* Menu Mobile Toggle */}
            {showMenu && (
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 hover:bg-primary-foreground/10 rounded-lg"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-primary-foreground/20">
            <div className="flex flex-col gap-3">
              {onLogout && (
                <>
                  <button
                    onClick={onLogout}
                    className="text-left py-2 px-4 hover:bg-primary-foreground/10 rounded"
                  >
                    Sair
                  </button>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
