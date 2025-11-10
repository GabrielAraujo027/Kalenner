import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-header text-header-foreground sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">B</span>
            </div>
          </div>

          <button className="text-sm hover:text-primary transition-colors font-medium">
            Entrar / Inscrever-se
          </button>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar serviços ou empresas" 
              className="pl-10 bg-background border-border"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="gap-2">
              <MapPin className="w-4 h-4" />
              Cidade
            </Button>
            <Button variant="secondary" size="sm">
              Semana/dia
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
