import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import kalennerLogo from "@/assets/kalenner-logo.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary py-12 flex items-center justify-center">
        <img src={kalennerLogo} alt="Kalenner" className="h-32 w-auto" />
      </header>
      <main className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="text-center">
          <h1 className="mb-8 text-5xl font-bold text-foreground">
            Bem-vindo ao KALENNER
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Sua plataforma de gestão e organização
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate("/login")}
              className="h-14 px-12 bg-accent hover:bg-accent/90 text-accent-foreground text-lg font-bold rounded-xl uppercase"
            >
              Entrar
            </Button>
            <Button
              onClick={() => navigate("/signup")}
              variant="outline"
              className="h-14 px-12 text-lg font-bold rounded-xl uppercase"
            >
              Cadastrar
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
