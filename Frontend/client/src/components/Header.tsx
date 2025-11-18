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

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {onLogout && (
              <>
                <Link href={slug ? `/${slug}/dashboard` : "/dashboard"}>
                  <span className={`hover:text-primary-foreground/80 cursor-pointer ${location === "/dashboard" ? "font-bold" : ""}`}>
                    Dashboard
                  </span>
                </Link>
                <Link href={slug ? `/${slug}/compromissos` : "/compromissos"}>
                  <span className={`hover:text-primary-foreground/80 cursor-pointer ${location === "/compromissos" ? "font-bold" : ""}`}>
                    Compromissos
                  </span>
                </Link>
                <Link href={slug ? `/${slug}/colaboradores` : "/colaboradores"}>
                  <span className={`hover:text-primary-foreground/80 cursor-pointer ${location === "/colaboradores" ? "font-bold" : ""}`}>
                    Colaboradores
                  </span>
                </Link>
                <Link href={slug ? `/${slug}/configuracoes` : "/configuracoes"}>
                  <span className={`hover:text-primary-foreground/80 cursor-pointer ${location === "/configuracoes" ? "font-bold" : ""}`}>
                    Configurações
                  </span>
                </Link>
              </>
            )}
          </nav>

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
                <Link href={slug ? `/${slug}/signup` : "/signup"}>
                  <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                    Cadastrar
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
                  <Link href={slug ? `/${slug}/dashboard` : "/dashboard"}>
                    <span className="block py-2 px-4 hover:bg-primary-foreground/10 rounded cursor-pointer">
                      Dashboard
                    </span>
                  </Link>
                  <Link href={slug ? `/${slug}/compromissos` : "/compromissos"}>
                    <span className="block py-2 px-4 hover:bg-primary-foreground/10 rounded cursor-pointer">
                      Compromissos
                    </span>
                  </Link>
                  <Link href={slug ? `/${slug}/colaboradores` : "/colaboradores"}>
                    <span className="block py-2 px-4 hover:bg-primary-foreground/10 rounded cursor-pointer">
                      Colaboradores
                    </span>
                  </Link>
                  <Link href={slug ? `/${slug}/configuracoes` : "/configuracoes"}>
                    <span className="block py-2 px-4 hover:bg-primary-foreground/10 rounded cursor-pointer">
                      Configurações
                    </span>
                  </Link>
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
