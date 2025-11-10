import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface User {
  email?: string;
}

interface Session {
  user?: User;
}

const Dashboard = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const token = localStorage.getItem("kalenner_token");
    const email = localStorage.getItem("kalenner_email");

    if (!token) {
      navigate("/login");
      return;
    }

    // Simular carregamento de sessão
    setSession({ user: { email: email || undefined } });
    setUser({ email: email || undefined });
    setLoading(false);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Limpar dados de autenticação
      localStorage.removeItem("kalenner_token");
      localStorage.removeItem("kalenner_token_expires");
      localStorage.removeItem("kalenner_email");
      localStorage.removeItem("kalenner_roles");

      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary py-6 px-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary-foreground">
          KALENNER Dashboard
        </h1>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
        >
          Sair
        </Button>
      </header>
      
      <main className="container mx-auto p-8">
        <div className="bg-card rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-4">Bem-vindo!</h2>
          <p className="text-muted-foreground mb-2">
            E-mail: {user?.email}
          </p>
          <p className="text-muted-foreground">
            Você está logado no sistema KALENNER
          </p>
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-semibold">Acesso rápido:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => navigate("/dashboard-main")}
                className="w-full"
              >
                Dashboard Principal
              </Button>
              <Button
                onClick={() => navigate("/colaboradores")}
                className="w-full"
              >
                Colaboradores
              </Button>
              <Button
                onClick={() => navigate("/configuracoes")}
                className="w-full"
              >
                Configurações
              </Button>
              <Button
                onClick={() => navigate("/personalizacao")}
                className="w-full"
              >
                Personalização
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
