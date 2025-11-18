import { Home, Users, Briefcase } from "lucide-react";
import { useLocation } from "wouter";

interface SidebarProps {
  userRole?: "Empresa" | "Cliente";
}

export default function Sidebar({ userRole }: SidebarProps) {
  const [location] = useLocation();

  const baseClass = "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors";
  const activeClass = "bg-primary text-primary-foreground";
  const inactiveClass = "hover:bg-muted/50 text-foreground";

  const menuItems = [
    { href: "/painel-principal", icon: Home, label: "Painel Principal / Home" },
    { href: "/servicos", icon: Briefcase, label: "Serviços" },
    { href: "/colaboradores", icon: Users, label: "Colaboradores" },
  ];

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground min-h-screen p-6 flex flex-col border-r border-border">
      <div className="mb-8">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-2">
          <span className="text-primary-foreground text-2xl font-bold">K</span>
        </div>
        <h1 className="text-xl font-bold text-foreground">KALENNER</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={`${baseClass} ${location === item.href ? activeClass : inactiveClass}`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
