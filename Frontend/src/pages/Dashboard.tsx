import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/login");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

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
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
