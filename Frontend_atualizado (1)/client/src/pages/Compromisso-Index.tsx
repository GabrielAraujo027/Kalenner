import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Building2, User } from "lucide-react";

const CompromissoIndex = () => {
  const [, navigate] = useLocation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center max-w-2xl px-6">
        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-primary-foreground text-4xl font-bold">K</span>
        </div>
        <h1 className="mb-4 text-5xl font-bold">KALERINER</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Sistema de Agendamentos de Barbearia
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card p-8 rounded-xl border-2 hover:border-accent transition-colors">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-accent" />
            <h2 className="text-2xl font-bold mb-3">Área da Empresa</h2>
            <p className="text-muted-foreground mb-6">
              Gerencie todos os agendamentos, clientes e configurações da barbearia.
            </p>
            <Button
              onClick={() => navigate("/empresa")}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              Acessar Painel da Empresa
            </Button>
          </div>

          <div className="bg-card p-8 rounded-xl border-2 hover:border-highlight transition-colors">
            <User className="w-16 h-16 mx-auto mb-4 text-highlight" />
            <h2 className="text-2xl font-bold mb-3">Área do Cliente</h2>
            <p className="text-muted-foreground mb-6">
              Visualize e gerencie seus agendamentos pessoais na barbearia.
            </p>
            <Button
              onClick={() => navigate("/cliente")}
              className="w-full bg-highlight text-highlight-foreground hover:bg-highlight/90"
              size="lg"
            >
              Acessar Meus Agendamentos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompromissoIndex;
