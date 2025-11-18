import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  userRole?: "Empresa" | "Cliente";
  onLogout?: () => void;
}

export default function DashboardLayout({ children, userRole, onLogout }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header onLogout={onLogout} showMenu={true} />
      <div className="flex">
        <Sidebar userRole={userRole} />
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
