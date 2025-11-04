import { Home, Users, Settings, Palette, Briefcase, ChevronLeft } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import logo from "@/assets/kalenner-logo-new.png";

const items = [
  { title: "PAINEL PRINCIPAL", url: "/", icon: Home },
  { title: "CADASTRO", url: "/cadastro", icon: Users },
  { title: "CONFIGURAÇÕES", url: "/configuracoes", icon: Settings },
  { title: "PERSONALIZAÇÃO", url: "/personalizacao", icon: Palette },
  { title: "COLABORADORES", url: "/colaboradores", icon: Briefcase },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className="border-r-0">
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border bg-sidebar px-4">
        {open && <img src={logo} alt="Kalenner" className="h-12 w-auto" />}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50"
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {open && <span className="text-sm font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="border-t border-sidebar-border p-4">
        <SidebarTrigger className="w-full">
          <ChevronLeft className="h-4 w-4" />
          {open && <span className="ml-2 text-sm">Recolher</span>}
        </SidebarTrigger>
      </div>
    </Sidebar>
  );
}
