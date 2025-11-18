import { Calendar, Home, Settings, Users, Briefcase, User, LayoutDashboard } from "lucide-react";
import { useLocation } from "wouter";
import { useCompany } from "@/hooks/useCompany";
import { useCompanySlug } from "@/hooks/useCompanySlug";

interface SidebarProps {
  userRole?: "Empresa" | "Cliente";
}

export default function Sidebar({ userRole }: SidebarProps) {
  const [location] = useLocation();
  const { company } = useCompany();
  const slug = useCompanySlug();

  const menuItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard", roles: ["Empresa", "Cliente"] },
    { href: "/compromissos", icon: Calendar, label: "Compromissos", roles: ["Empresa", "Cliente"] },
    { href: "/colaboradores", icon: Users, label: "Colaboradores", roles: ["Empresa"] },
    { href: "/servicos", icon: Briefcase, label: "Serviços", roles: ["Empresa"] },
    { href: "/perfil", icon: User, label: "Perfil", roles: ["Empresa", "Cliente"] },
    { href: "/configuracoes", icon: Settings, label: "Configurações", roles: ["Empresa"] },
  ];

  const filteredItems = menuItems.filter(item => 
    !userRole || item.roles.includes(userRole)
  );

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2 overflow-hidden bg-white">
          {company?.logoUrl ? (
            <img src={company.logoUrl} alt={company.name} className="w-full h-full object-contain" />
          ) : (
            <span className="text-sidebar text-2xl font-bold">K</span>
          )}
        </div>
        <h1 className="text-xl font-bold truncate">{company?.name || "KALENNER"}</h1>
      </div>

      <nav className="flex-1 space-y-2">
        <a
          href={slug ? `/${slug}/dashboard` : "/"}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Painel Principal</span>
        </a>

  {userRole === "Empresa" && (
          <>
            <a
              href={slug ? `/${slug}/colaboradores` : "/colaboradores"}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors"
            >
              <User className="w-5 h-5" />
              <span>Cadastro</span>
            </a>

            <a
              href={slug ? `/${slug}/configuracoes` : "/configuracoes"}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Configurações</span>
            </a>
          </>
        )}

        <a
          href={slug ? `/${slug}/compromisso` : "/compromisso"}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          <Calendar className="w-5 h-5" />
          <span>Agendamentos</span>
        </a>
      </nav>
    </aside>
  );
}
