import { Calendar, Home, Settings, Users, Briefcase, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface SidebarProps {
  userRole?: "Empresa" | "Cliente";
}

export default function Sidebar({ userRole }: SidebarProps) {
  const [location] = useLocation();

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
    <aside className="w-64 bg-card border-r border-border min-h-screen hidden md:block">
      <nav className="p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
