import { LayoutDashboard, User, Settings, Calendar } from "lucide-react";

interface SidebarProps {
  userType: "company" | "client";
}

const Sidebar = ({ userType }: SidebarProps) => {
  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <div className="w-16 h-16 bg-sidebar-foreground rounded-full flex items-center justify-center mb-2">
          <span className="text-sidebar text-2xl font-bold">K</span>
        </div>
        <h1 className="text-xl font-bold">KALENNER</h1>
      </div>

      <nav className="flex-1 space-y-2">
        <a
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Painel Principal</span>
        </a>

        {userType === "company" && (
          <>
            <a
              href="/cadastro"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors"
            >
              <User className="w-5 h-5" />
              <span>Cadastro</span>
            </a>

            <a
              href="/configuracoes"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Configurações</span>
            </a>
          </>
        )}

        <a
          href="/compromisso"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          <Calendar className="w-5 h-5" />
          <span>Agendamentos</span>
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
